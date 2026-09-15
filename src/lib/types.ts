export type ReferenceDoc = {
  /** File name without extension, unique within its skill — used for anchors. */
  id: string;
  /** Globally unique key: `${skillSlug}/${id}`. */
  slug: string;
  title: string;
  path: string;
  sourceUrl: string | null;
};

export type Provenance = {
  /** Path of the source file, relative to the harness repository root. */
  sourcePath: string;
  /** Permalink to the source file on the harness remote, if known. */
  sourceUrl: string | null;
  /** Name of the harness repository (e.g. "harness-engineering"). */
  repoName: string;
  /** Short commit hash the content was last changed in. */
  lastCommit: string | null;
  /** ISO date (YYYY-MM-DD) of the last change to the source file. */
  lastValidatedAt: string | null;
  /** Author of the last change, as recorded by git. */
  documentedBy: string | null;
};

/**
 * Derived from a skill's position in the harness `skills/` tree:
 * - `project`: archetypes that compose other skills (`project-multitenant`, `project-spa`, ...)
 * - `frontend` / `backend`: atomic, stack-specific conventions (`skills/frontend/*`, `skills/backend/*`)
 * - `workflow`: process skills (`workflow-*`)
 * - `meta`: everything else (harness mechanics, memory, feature tracking, ...)
 */
export type KnowledgeCategory =
  "project" | "frontend" | "backend" | "workflow" | "meta";

export type KnowledgeObject = {
  /** Path relative to `skills/`, e.g. "frontend/react" or "project-multitenant". */
  slug: string;
  type: "skill";
  category: KnowledgeCategory;
  title: string;
  description: string;
  body: string;
  references: ReferenceDoc[];
  relatedSkills: string[];
  provenance: Provenance;
};

/** Trimmed-down shape used by the list/search UI, without the full markdown body. */
export type KnowledgeSummary = {
  slug: string;
  type: KnowledgeObject["type"];
  category: KnowledgeCategory;
  title: string;
  description: string;
  referenceCount: number;
  documentedBy: string | null;
  lastValidatedAt: string | null;
};

export function toKnowledgeSummary(item: KnowledgeObject): KnowledgeSummary {
  return {
    slug: item.slug,
    type: item.type,
    category: item.category,
    title: item.title,
    description: item.description,
    referenceCount: item.references.length,
    documentedBy: item.provenance.documentedBy,
    lastValidatedAt: item.provenance.lastValidatedAt,
  };
}

export const KNOWLEDGE_CATEGORY_ORDER: KnowledgeCategory[] = [
  "project",
  "frontend",
  "backend",
  "workflow",
  "meta",
];

export const KNOWLEDGE_CATEGORY_LABEL: Record<KnowledgeCategory, string> = {
  project: "Arquitetura de projeto",
  frontend: "Frontend",
  backend: "Backend",
  workflow: "Workflow",
  meta: "Meta",
};
