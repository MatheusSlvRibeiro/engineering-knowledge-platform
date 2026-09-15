export type ReferenceDoc = {
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

export type KnowledgeObject = {
  slug: string;
  type: "skill";
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
    title: item.title,
    description: item.description,
    referenceCount: item.references.length,
    documentedBy: item.provenance.documentedBy,
    lastValidatedAt: item.provenance.lastValidatedAt,
  };
}
