import { execFileSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import matter from "gray-matter";
import type {
  KnowledgeCategory,
  KnowledgeObject,
  Provenance,
  ReferenceDoc,
} from "./types";

function resolveHarnessPath(): string {
  const fromEnv = process.env.HARNESS_PATH?.trim();
  if (fromEnv) return path.resolve(fromEnv);

  // Local dev: reuse the developer's own clone if there's one on disk.
  const homeClone = path.join(os.homedir(), "harness-engineering");
  if (fs.existsSync(homeClone)) return homeClone;

  // CI/Vercel: fall back to the clone `scripts/fetch-harness.mjs` makes
  // during `npm run build` (see package.json "prebuild").
  return path.join(process.cwd(), ".harness-cache", "harness-engineering");
}

const HARNESS_PATH = path.resolve(
  /* turbopackIgnore: true */ resolveHarnessPath(),
);
const SKILLS_DIR = path.join(HARNESS_PATH, "skills");

let repoInfoCache: {
  repoName: string;
  remoteUrl: string | null;
  commit: string | null;
} | null = null;

function git(args: string[]): string | null {
  try {
    return execFileSync("git", args, {
      cwd: HARNESS_PATH,
      encoding: "utf8",
    }).trim();
  } catch {
    return null;
  }
}

function getRepoInfo() {
  if (repoInfoCache) return repoInfoCache;

  const remote = git(["remote", "get-url", "origin"]);
  const commit = git(["rev-parse", "--short", "HEAD"]);
  let repoName = path.basename(HARNESS_PATH);
  let remoteUrl: string | null = null;

  if (remote) {
    const match = remote.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
    if (match) {
      remoteUrl = `https://github.com/${match[1]}/${match[2]}`;
      repoName = match[2];
    }
  }

  repoInfoCache = { repoName, remoteUrl, commit };
  return repoInfoCache;
}

function getFileProvenance(absolutePath: string): Provenance {
  const relativePath = path.relative(HARNESS_PATH, absolutePath);
  const { repoName, remoteUrl, commit } = getRepoInfo();

  const log = git([
    "log",
    "-1",
    "--format=%ad|%an|%h",
    "--date=short",
    "--",
    relativePath,
  ]);
  const [lastValidatedAt, documentedBy, lastCommit] = log
    ? log.split("|")
    : [null, null, null];

  return {
    sourcePath: relativePath,
    sourceUrl:
      remoteUrl && commit
        ? `${remoteUrl}/blob/${commit}/${relativePath}`
        : null,
    repoName,
    lastCommit: lastCommit ?? null,
    lastValidatedAt: lastValidatedAt ?? null,
    documentedBy: documentedBy ?? null,
  };
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * A skill's category comes from its position in the tree: nested under
 * `frontend/`/`backend/` for atomic stack skills, a `project-*` prefix for
 * archetypes that compose those, a `workflow-*` prefix for process skills,
 * anything else is harness mechanics ("meta").
 */
function deriveCategory(slug: string): KnowledgeCategory {
  const [first] = slug.split("/");
  if (first === "frontend" || first === "backend") return first;
  if (slug.startsWith("project-")) return "project";
  if (slug.startsWith("workflow-")) return "workflow";
  return "meta";
}

/** Recursively finds every directory under `dir` that directly contains a SKILL.md. */
function findSkillDirs(dir: string, base: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const found: string[] = [];

  if (entries.some((entry) => entry.isFile() && entry.name === "SKILL.md")) {
    found.push(base);
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    found.push(
      ...findSkillDirs(
        path.join(dir, entry.name),
        path.posix.join(base, entry.name),
      ),
    );
  }

  return found;
}

function extractRelatedSkills(
  body: string,
  slugLookup: Map<string, string>,
  selfSlug: string,
): string[] {
  const sectionMatch = body.match(
    /##\s*Skills relacionadas([\s\S]*?)(\n##\s|$)/i,
  );
  const section = sectionMatch ? sectionMatch[1] : "";
  const found = new Set<string>();
  for (const match of section.matchAll(/`([a-zA-Z0-9/_-]+)`/g)) {
    const resolved = slugLookup.get(match[1]);
    if (resolved && resolved !== selfSlug) {
      found.add(resolved);
    }
  }
  return Array.from(found);
}

function loadReferences(skillDir: string, slug: string): ReferenceDoc[] {
  const referenceDir = path.join(skillDir, "reference");
  if (!fs.existsSync(referenceDir)) return [];

  return fs
    .readdirSync(referenceDir)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => {
      const absolutePath = path.join(referenceDir, file);
      const raw = fs.readFileSync(absolutePath, "utf8");
      const heading = raw.match(/^#\s+(.+)$/m);
      const provenance = getFileProvenance(absolutePath);
      const id = file.replace(/\.md$/, "");
      return {
        id,
        slug: `${slug}/${id}`,
        title: heading ? heading[1] : titleCase(id),
        path: provenance.sourcePath,
        sourceUrl: provenance.sourceUrl,
      };
    });
}

let cache: KnowledgeObject[] | null = null;

export function harnessAvailable(): boolean {
  return fs.existsSync(SKILLS_DIR);
}

export function getHarnessRepoInfo() {
  return getRepoInfo();
}

export function getHarnessPath(): string {
  return HARNESS_PATH;
}

export function getAllKnowledgeObjects(): KnowledgeObject[] {
  if (cache) return cache;
  if (!harnessAvailable()) return [];

  const slugs = findSkillDirs(SKILLS_DIR, "").sort();

  // "Skills relacionadas" sections reference skills either by full path
  // (`frontend/react`) or by leaf name alone (`eslint-prettier-husky`) —
  // resolve both to the canonical slug.
  const slugLookup = new Map<string, string>();
  for (const slug of slugs) {
    slugLookup.set(slug, slug);
    slugLookup.set(path.posix.basename(slug), slug);
  }

  const objects = slugs.map((slug): KnowledgeObject => {
    const skillDir = path.join(SKILLS_DIR, ...slug.split("/"));
    const skillFile = path.join(skillDir, "SKILL.md");
    const raw = fs.readFileSync(skillFile, "utf8");
    const { data, content } = matter(raw);

    const headingMatch = content.match(/^#\s+(.+)$/m);

    return {
      slug,
      type: "skill",
      category: deriveCategory(slug),
      title:
        (data.name ? titleCase(String(data.name)) : null) ??
        (headingMatch ? headingMatch[1] : titleCase(path.posix.basename(slug))),
      description: data.description ? String(data.description) : "",
      body: content.trim(),
      references: loadReferences(skillDir, slug),
      relatedSkills: extractRelatedSkills(content, slugLookup, slug),
      provenance: getFileProvenance(skillFile),
    };
  });

  cache = objects;
  return objects;
}

export function getKnowledgeObject(slug: string): KnowledgeObject | null {
  return (
    getAllKnowledgeObjects().find((object) => object.slug === slug) ?? null
  );
}
