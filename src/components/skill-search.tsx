"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  KNOWLEDGE_CATEGORY_LABEL,
  KNOWLEDGE_CATEGORY_ORDER,
  type KnowledgeSummary,
} from "@/lib/types";
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

  const groups = useMemo(() => {
    return KNOWLEDGE_CATEGORY_ORDER.map((category) => ({
      category,
      items: filtered.filter((item) => item.category === category),
    })).filter((group) => group.items.length > 0);
  }, [filtered]);

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

      {groups.length === 0 ? (
        <p className="text-fg-muted text-sm">
          Nenhuma skill encontrada para &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.category}>
              <h2 className="text-fg-subtle mb-3 text-xs font-semibold tracking-wide uppercase">
                {KNOWLEDGE_CATEGORY_LABEL[group.category]}
              </h2>
              <ol className="grid grid-cols-[min-content_minmax(0,1fr)] gap-x-2 gap-y-4">
                {group.items.map((item, index) => (
                  <KnowledgeListItem
                    key={item.slug}
                    item={item}
                    rank={index + 1}
                  />
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
