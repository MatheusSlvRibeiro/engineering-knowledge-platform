import Link from "next/link";
import { KNOWLEDGE_CATEGORY_LABEL, type KnowledgeSummary } from "@/lib/types";

function formatDate(iso: string | null): string {
  if (!iso) return "data desconhecida";
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function KnowledgeListItem({
  item,
  rank,
}: {
  item: KnowledgeSummary;
  rank: number;
}) {
  return (
    <li className="contents">
      <span
        aria-hidden="true"
        className="text-fg-subtle ml-auto w-min pt-0.5 text-right font-medium select-none"
      >
        {rank}.
      </span>
      <article>
        <div className="text-[15px] leading-snug font-medium">
          <Link
            href={`/skills/${item.slug}`}
            className="text-title hover:text-accent"
          >
            {item.title}
          </Link>
        </div>
        <p className="text-fg-muted mt-0.5 line-clamp-2 text-[13px]">
          {item.description}
        </p>
        <div className="text-fg-muted mt-1 flex flex-wrap items-center gap-x-1 text-xs whitespace-nowrap">
          <span className="bg-badge-bg text-badge-fg rounded-full px-2 py-0.5 font-medium">
            {KNOWLEDGE_CATEGORY_LABEL[item.category]}
          </span>
          <span>·</span>
          <span>{item.referenceCount} documento(s) de referência</span>
          <span>·</span>
          <span>{item.documentedBy ?? "autor desconhecido"}</span>
          <span>·</span>
          <span>validado em {formatDate(item.lastValidatedAt)}</span>
        </div>
      </article>
    </li>
  );
}
