"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { KnowledgeSummary } from "@/lib/types";
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

  return (
    <div>
      <div className="relative mb-5">
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

      {filtered.length === 0 ? (
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
