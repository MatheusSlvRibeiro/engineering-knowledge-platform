import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getAllKnowledgeObjects } from "@/lib/harness";
import {
  KNOWLEDGE_CATEGORY_DESCRIPTION,
  KNOWLEDGE_CATEGORY_LABEL,
  KNOWLEDGE_CATEGORY_ORDER,
  toKnowledgeSummary,
  type KnowledgeCategory,
} from "@/lib/types";
import { KnowledgeListItem } from "@/components/knowledge-list-item";

function isKnowledgeCategory(value: string): value is KnowledgeCategory {
  return (KNOWLEDGE_CATEGORY_ORDER as string[]).includes(value);
}

export function generateStaticParams() {
  return KNOWLEDGE_CATEGORY_ORDER.map((category) => ({ category }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isKnowledgeCategory(category)) notFound();

  const items = getAllKnowledgeObjects()
    .filter((item) => item.category === category)
    .map(toKnowledgeSummary);

  if (items.length === 0) notFound();

  return (
    <main className="mx-auto max-w-[1012px] px-4 py-6 sm:px-6">
      <Link
        href="/"
        className="text-fg-muted hover:text-accent inline-flex items-center gap-1 text-xs"
      >
        <ArrowLeft width={12} height={12} aria-hidden="true" />
        Skills
      </Link>

      <div className="mt-3">
        <h1 className="text-title text-2xl font-semibold">
          {KNOWLEDGE_CATEGORY_LABEL[category]}
        </h1>
        <p className="text-fg-muted mt-1 text-sm">
          {KNOWLEDGE_CATEGORY_DESCRIPTION[category]}
        </p>
      </div>

      <ol className="mt-6 grid grid-cols-[min-content_minmax(0,1fr)] gap-x-2 gap-y-4">
        {items.map((item, index) => (
          <KnowledgeListItem key={item.slug} item={item} rank={index + 1} />
        ))}
      </ol>
    </main>
  );
}
