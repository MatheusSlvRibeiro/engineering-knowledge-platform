import Link from "next/link";
import {
  Blocks,
  GitBranch,
  LayoutTemplate,
  Server,
  Settings2,
} from "lucide-react";
import {
  KNOWLEDGE_CATEGORY_DESCRIPTION,
  KNOWLEDGE_CATEGORY_LABEL,
  type KnowledgeCategory,
} from "@/lib/types";

const CATEGORY_ICON: Record<KnowledgeCategory, typeof Blocks> = {
  project: Blocks,
  frontend: LayoutTemplate,
  backend: Server,
  workflow: GitBranch,
  meta: Settings2,
};

export function CategoryCard({
  category,
  count,
}: {
  category: KnowledgeCategory;
  count: number;
}) {
  const Icon = CATEGORY_ICON[category];

  return (
    <Link
      href={`/categorias/${category}`}
      className="border-border hover:border-accent hover:bg-canvas-subtle flex flex-col gap-3 rounded-lg border p-4 no-underline transition-colors"
    >
      <div className="flex items-center justify-between">
        <Icon
          width={20}
          height={20}
          className="text-accent"
          aria-hidden="true"
        />
        <span className="text-fg-subtle text-xs">
          {count} skill{count === 1 ? "" : "s"}
        </span>
      </div>
      <div>
        <h2 className="text-title text-[15px] font-semibold">
          {KNOWLEDGE_CATEGORY_LABEL[category]}
        </h2>
        <p className="text-fg-muted mt-1 text-[13px] leading-snug">
          {KNOWLEDGE_CATEGORY_DESCRIPTION[category]}
        </p>
      </div>
    </Link>
  );
}
