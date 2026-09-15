import {
  getAllKnowledgeObjects,
  getHarnessRepoInfo,
  harnessAvailable,
} from "@/lib/harness";
import { toKnowledgeSummary } from "@/lib/types";
import { SkillSearch } from "@/components/skill-search";

export default function HomePage() {
  const available = harnessAvailable();
  const items = getAllKnowledgeObjects().map(toKnowledgeSummary);
  const repo = getHarnessRepoInfo();

  return (
    <main className="mx-auto max-w-[1012px] px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-baseline justify-between">
        <h1 className="text-title text-lg font-semibold">Skills</h1>
        <p className="text-fg-muted text-xs">
          {repo.repoName}
          {repo.commit ? ` @ ${repo.commit}` : ""}
        </p>
      </div>

      {!available ? (
        <div className="border-border bg-canvas-subtle text-fg-muted rounded-md border p-4 text-sm">
          Não foi possível encontrar o repositório{" "}
          <code>harness-engineering</code>. Configure a variável de ambiente{" "}
          <code>HARNESS_PATH</code> apontando para o clone local do repositório.
        </div>
      ) : (
        <SkillSearch items={items} />
      )}
    </main>
  );
}
