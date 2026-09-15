import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getAllKnowledgeObjects, getKnowledgeObject } from "@/lib/harness";
import { getReferenceContent, markdownToHtml } from "@/lib/markdown";

export function generateStaticParams() {
  return getAllKnowledgeObjects().map((item) => ({ slug: item.slug }));
}

function formatDate(iso: string | null): string {
  if (!iso) return "desconhecida";
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getKnowledgeObject(slug);
  if (!item) notFound();

  const bodyHtml = await markdownToHtml(item.body);
  const references = await Promise.all(
    item.references.map(async (ref) => {
      const raw = await getReferenceContent(ref.path);
      return { ...ref, html: raw ? await markdownToHtml(raw) : null };
    }),
  );

  return (
    <main className="mx-auto max-w-[1012px] px-4 py-6 sm:px-6">
      <Link
        href="/"
        className="text-fg-muted hover:text-accent inline-flex items-center gap-1 text-xs"
      >
        <ArrowLeft width={12} height={12} aria-hidden="true" />
        Skills
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="bg-badge-bg text-badge-fg rounded-full px-2 py-0.5 text-xs font-medium">
          skill
        </span>
        <h1 className="text-title text-2xl font-semibold">{item.title}</h1>
      </div>
      {item.description && (
        <p className="text-fg-muted mt-2 max-w-2xl text-sm">
          {item.description}
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          <div
            className="knowledge-body"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          {references.length > 0 && (
            <section className="border-border-muted mt-10 border-t pt-8">
              <h2 className="mb-4 text-lg font-semibold">
                Documentos de referência
              </h2>
              <div className="space-y-8">
                {references.map((ref) => (
                  <div key={ref.slug} id={ref.slug.split("/")[1]}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h3 className="text-base font-semibold">{ref.title}</h3>
                      {ref.sourceUrl && (
                        <a
                          href={ref.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-fg-muted hover:text-accent text-xs whitespace-nowrap"
                        >
                          fonte ↗
                        </a>
                      )}
                    </div>
                    {ref.html ? (
                      <div
                        className="knowledge-body"
                        dangerouslySetInnerHTML={{ __html: ref.html }}
                      />
                    ) : (
                      <p className="text-fg-muted text-sm">
                        Conteúdo indisponível.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:border-border-muted space-y-6 text-sm lg:border-l lg:pl-6">
          <div>
            <h2 className="text-fg-subtle mb-2 text-xs font-semibold tracking-wide uppercase">
              Proveniência
            </h2>
            <dl className="space-y-2">
              <div>
                <dt className="text-fg-muted text-xs">Fonte</dt>
                <dd>
                  {item.provenance.sourceUrl ? (
                    <a
                      href={item.provenance.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.provenance.repoName}/{item.provenance.sourcePath}
                    </a>
                  ) : (
                    `${item.provenance.repoName}/${item.provenance.sourcePath}`
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-fg-muted text-xs">Documentado por</dt>
                <dd>{item.provenance.documentedBy ?? "desconhecido"}</dd>
              </div>
              <div>
                <dt className="text-fg-muted text-xs">Última validação</dt>
                <dd>{formatDate(item.provenance.lastValidatedAt)}</dd>
              </div>
              <div>
                <dt className="text-fg-muted text-xs">Commit</dt>
                <dd className="font-mono text-xs">
                  {item.provenance.lastCommit ?? "—"}
                </dd>
              </div>
            </dl>
          </div>

          {item.references.length > 0 && (
            <div>
              <h2 className="text-fg-subtle mb-2 text-xs font-semibold tracking-wide uppercase">
                Referências
              </h2>
              <ul className="space-y-1">
                {item.references.map((ref) => (
                  <li key={ref.slug}>
                    <a href={`#${ref.slug.split("/")[1]}`}>{ref.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.relatedSkills.length > 0 && (
            <div>
              <h2 className="text-fg-subtle mb-2 text-xs font-semibold tracking-wide uppercase">
                Skills relacionadas
              </h2>
              <ul className="space-y-1">
                {item.relatedSkills.map((related) => (
                  <li key={related}>
                    <Link href={`/skills/${related}`}>{related}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
