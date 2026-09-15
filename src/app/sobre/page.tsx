import { getHarnessRepoInfo } from "@/lib/harness";

export default function SobrePage() {
  const repo = getHarnessRepoInfo();

  return (
    <main className="mx-auto max-w-[1012px] px-4 py-6 sm:px-6">
      <h1 className="text-title text-lg font-semibold">Sobre</h1>
      <div className="knowledge-body mt-4 max-w-2xl">
        <p>
          A <strong>Engineering Knowledge Platform</strong> transforma um
          repositório de engenharia versionado — o{" "}
          {repo.remoteUrl ? (
            <a href={repo.remoteUrl} target="_blank" rel="noreferrer">
              {repo.repoName}
            </a>
          ) : (
            repo.repoName
          )}{" "}
          — em documentação técnica navegável, gerada durante o build.
        </p>
        <p>
          O Git continua sendo a fonte da verdade. Nada aqui é editado
          diretamente: cada página é derivada de um arquivo Markdown do harness,
          e cada recomendação mostra de onde veio — arquivo de origem, autor e
          data da última validação, extraídos do histórico do Git.
        </p>
        <p>
          Este é o MVP público do projeto: sem cadastro, sem autenticação, sem
          painel administrativo. O objetivo é demonstrar que é possível
          transformar conhecimento técnico estruturado em uma experiência visual
          e navegável, automaticamente.
        </p>
      </div>
    </main>
  );
}
