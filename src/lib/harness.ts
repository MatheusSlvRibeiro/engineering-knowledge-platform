import { execFileSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import matter from "gray-matter";
import type { KnowledgeObject, Provenance, ReferenceDoc } from "./types";

const HARNESS_PATH = path.resolve(
  /* turbopackIgnore: true */
  process.env.HARNESS_PATH?.trim() ||
    path.join(os.homedir(), "harness-engineering"),
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

function extractRelatedSkills(
  body: string,
  knownSlugs: Set<string>,
  selfSlug: string,
): string[] {
  const sectionMatch = body.match(
    /##\s*Skills relacionadas([\s\S]*?)(\n##\s|$)/i,
  );
  const section = sectionMatch ? sectionMatch[1] : "";
  const found = new Set<string>();
  for (const match of section.matchAll(/`([a-z0-9-]+)`/g)) {
    if (knownSlugs.has(match[1]) && match[1] !== selfSlug) {
      found.add(match[1]);
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
      return {
        slug: `${slug}/${file.replace(/\.md$/, "")}`,
        title: heading ? heading[1] : titleCase(file.replace(/\.md$/, "")),
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

  const slugs = fs
    .readdirSync(SKILLS_DIR)
    .filter((entry) => fs.statSync(path.join(SKILLS_DIR, entry)).isDirectory())
    .filter((entry) => fs.existsSync(path.join(SKILLS_DIR, entry, "SKILL.md")))
    .sort();
  const knownSlugs = new Set(slugs);

  const objects = slugs.map((slug): KnowledgeObject => {
    const skillDir = path.join(SKILLS_DIR, slug);
    const skillFile = path.join(skillDir, "SKILL.md");
    const raw = fs.readFileSync(skillFile, "utf8");
    const { data, content } = matter(raw);

    const headingMatch = content.match(/^#\s+(.+)$/m);

    return {
      slug,
      type: "skill",
      title:
        (data.name ? titleCase(String(data.name)) : null) ??
        (headingMatch ? headingMatch[1] : titleCase(slug)),
      description: data.description ? String(data.description) : "",
      body: content.trim(),
      references: loadReferences(skillDir, slug),
      relatedSkills: extractRelatedSkills(content, knownSlugs, slug),
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
