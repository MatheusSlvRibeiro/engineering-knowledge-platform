"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { KNOWLEDGE_CATEGORY_ORDER, type KnowledgeSummary } from "@/lib/types";
import { CategoryCard } from "./category-card";
import { KnowledgeListItem } from "./knowledge-list-item";

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function SkillSearch({ items }: { items: KnowledgeSummary[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle) return items;
    return items.filter((item) =>
      [item.title, item.description, item.slug]
        .map(normalize)
        .some((haystack) => haystack.includes(needle)),
    );
  }, [items, query]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    }
    return counts;
  }, [items]);

  const isSearching = query.trim().length > 0;

  return (
    <div>
      <div className="relative mb-6">
        <Search
          width={15}
          height={15}
          aria-hidden="true"
          className="text-fg-subtle pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar skills por nome ou descrição…"
          aria-label="Buscar skills"
          className="border-border bg-canvas text-fg placeholder:text-fg-subtle focus:border-accent w-full rounded-md border py-2 pr-3 pl-9 text-sm outline-none"
        />
      </div>

      {!isSearching ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {KNOWLEDGE_CATEGORY_ORDER.filter((category) =>
            categoryCounts.has(category),
          ).map((category) => (
            <CategoryCard
              key={category}
              category={category}
              count={categoryCounts.get(category) ?? 0}
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-fg-muted text-sm">
          Nenhuma skill encontrada para &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <ol className="grid grid-cols-[min-content_minmax(0,1fr)] gap-x-2 gap-y-4">
          {filtered.map((item, index) => (
            <KnowledgeListItem key={item.slug} item={item} rank={index + 1} />
          ))}
        </ol>
      )}
    </div>
  );
}
