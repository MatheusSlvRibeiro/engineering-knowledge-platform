# CONTEXTO MESTRE — ENGINEERING KNOWLEDGE PLATFORM

Você está participando do desenvolvimento de um projeto chamado provisoriamente **Engineering Knowledge Platform**, uma plataforma para transformar conhecimento técnico estruturado em um repositório de engenharia em documentação visual, navegável e posteriormente consumível por desenvolvedores e agentes de IA.

Este documento deve ser tratado como o **contexto principal do projeto**. Antes de propor código, arquitetura ou mudanças, compreenda a visão completa, o MVP atual, os objetivos futuros e as restrições abaixo.

---

# 1. VISÃO DO PROJETO

O projeto nasceu de uma necessidade real:

Conhecimento técnico frequentemente fica concentrado na cabeça de determinados desenvolvedores.

Isso cria:

* dependência de pessoas específicas;
* dificuldade de onboarding;
* repetição das mesmas dúvidas;
* dificuldade para reproduzir procedimentos;
* decisões arquiteturais sem histórico;
* conhecimento desatualizado;
* dificuldade de saber por que determinada tecnologia ou padrão foi escolhido;
* dificuldade para agentes de IA consumirem conhecimento técnico confiável.

A proposta é criar uma plataforma capaz de transformar um repositório estruturado de engenharia em uma **base de conhecimento técnico viva, versionada e rastreável**.

A ideia central é:

> O repositório Git continua sendo a fonte da verdade. A plataforma transforma esse conhecimento em diferentes interfaces e representações.

No futuro, o mesmo conhecimento poderá alimentar:

* documentação visual;
* blog técnico;
* busca;
* CLI;
* ferramentas de desenvolvimento;
* MCPs;
* agentes de IA;
* documentação interna de empresas.

---

# 2. PRINCÍPIO FUNDAMENTAL

A plataforma NÃO deve inicialmente tratar o banco de dados ou o blog como fonte primária de conhecimento.

A fonte da verdade deve ser um repositório Git, inicialmente chamado:

`harness-engineering`

Esse repositório já contém dezenas de skills reutilizáveis relacionadas a desenvolvimento de software.

Exemplos:

* React;
* TypeScript;
* Django;
* Python;
* PostgreSQL;
* Docker;
* Git;
* commits semânticos;
* branches;
* Pull Requests;
* CI;
* CD;
* testes;
* qualidade;
* arquitetura;
* padrões de desenvolvimento;
* infraestrutura;
* etc.

O conteúdo existente no harness deve poder ser transformado em conhecimento técnico visual.

---

# 3. ARQUITETURA CONCEITUAL

A visão de longo prazo é:

```text
                    HARNESS ENGINEERING
                           │
                           │
                    Git Repository
                           │
                           ▼
                  Knowledge Processing
                           │
                 ┌─────────┴─────────┐
                 │                   │
                 ▼                   ▼
          Knowledge Objects      Metadata
                 │                   │
                 └─────────┬─────────┘
                           ▼
                  Knowledge Platform
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
       Website            CLI              API
          │                                 │
          │                                 ▼
          │                                MCP
          │                                 │
          │                        ┌────────┴────────┐
          │                        ▼                 ▼
          │                   Memory System      AI Agents
          │
          ▼
    Visual Documentation
```

A implementação deve evoluir gradualmente.

Não implementar toda essa arquitetura no MVP.

---

# 4. MVP PÚBLICO

O primeiro objetivo é criar uma versão pública e pessoal do projeto para portfólio.

O MVP deve ser deliberadamente simples.

## Objetivo

Demonstrar:

> "É possível transformar um repositório de conhecimento técnico estruturado em uma documentação visual e navegável automaticamente."

## Requisitos do MVP

* código público;
* sem usuários;
* sem autenticação;
* sem cadastro;
* sem painel administrativo;
* sem banco de dados obrigatório;
* Git como fonte de informação;
* deploy simples;
* hospedagem preferencialmente na Vercel;
* conteúdo gerado durante o build;
* foco em qualidade visual e arquitetura;
* baixo custo;
* fácil reprodução por terceiros.

A primeira versão pode funcionar essencialmente como:

```text
harness-engineering
        │
        ▼
     parser
        │
        ▼
Knowledge Objects
        │
        ▼
 Next.js / frontend
        │
        ▼
     Vercel
```

---

# 5. O QUE O MVP NÃO DEVE FAZER

Não implementar inicialmente:

* autenticação;
* usuários;
* RBAC;
* banco de dados complexo;
* sincronização automática de máquinas;
* IA autônoma;
* RAG;
* embeddings;
* MCP;
* MemPalace;
* OpenSpace;
* múltiplos repositórios;
* administração empresarial;
* sistema complexo de feedback.

Esses recursos pertencem ao roadmap futuro.

O MVP deve provar primeiro o conceito fundamental.

---

# 6. PRINCÍPIO DO BLOG

O produto não deve ser tratado como simplesmente um "blog de programação".

O conceito é:

> **Technical Knowledge Visualization**

ou:

> **Engineering Knowledge Platform**

O blog é uma das interfaces possíveis da plataforma.

O conteúdo deve apresentar conhecimento técnico de forma estruturada.

Em vez de simplesmente publicar:

> "Como usar Docker"

um conteúdo deve explicar:

* qual problema está sendo resolvido;
* qual abordagem é recomendada;
* qual tecnologia/padrão foi utilizado;
* por que essa decisão foi tomada;
* quais alternativas existiam;
* quais trade-offs existem;
* exemplo prático;
* versão da tecnologia;
* data da documentação;
* quem documentou;
* fonte original;
* skills relacionadas;
* decisões relacionadas;
* possíveis limitações;
* quando a recomendação deve ser revista.

---

# 7. MODELO CONCEITUAL DE UM POST

Um post/documento pode possuir uma estrutura semântica semelhante a:

```yaml
id: react-component-architecture

type: guide

title: Arquitetura de Componentes React

description: >
  Guia para organização e composição de componentes React.

stack:
  - React
  - TypeScript

versions:
  react: "19.x"
  typescript: "5.x"

status: active

created_at: 2026-09-14
updated_at: 2026-09-14

documented_by:
  name: Matheus Ribeiro

sources:
  - harness/skills/react/component-architecture.md

related_skills:
  - react
  - typescript
  - testing

related_decisions:
  - ADR-001

problem:
  ...

recommended_approach:
  ...

rationale:
  ...

alternatives:
  ...

tradeoffs:
  ...

example:
  ...

limitations:
  ...

last_validated_at:
  2026-09-14
```

Esse schema é conceitual.

Não assumir que YAML necessariamente será o formato definitivo.

---

# 8. TIPOS DE KNOWLEDGE OBJECTS

A plataforma deve eventualmente suportar diferentes tipos de conhecimento: Guide, Concept, Decision/ADR, Runbook, Incident, Pattern, Anti-pattern, Reference, Tutorial.

---

# 9. PROVENIÊNCIA DO CONHECIMENTO

Uma característica fundamental da plataforma é a rastreabilidade. Cada recomendação deve, quando possível, responder "De onde veio essa informação?" (fonte, versão, autor, última validação, relacionados). A plataforma deve evitar conhecimento sem origem conhecida.

---

# 10. VERSIONAMENTO

O conhecimento deve ser versionável em pelo menos três dimensões: versão do conhecimento (ex: Knowledge v1.4), versão da ferramenta/stack (ex: React 19.x), versão do harness (ex: harness-engineering v2.3.0).

---

# 11. HARNESS COMO FONTE NORMATIVA

O `harness-engineering` representa regras e práticas de engenharia — uma "Engineering Knowledge Source". O blog/site não deve alterar diretamente essas regras. Fluxo: Harness → Parser → Knowledge Object → Documentation. Alterações acontecem no Git via PR → CI → Validation → Merge → Build → Updated documentation.

---

# 12. FUTURO — HARNESS VERSIONADO

Evolução futura: harness-engineering como dependência versionada (semver), permitindo reprodutibilidade, rollback, compatibilidade, comparação entre versões.

---

# 13. FUTURO — SYNC PARA MÁQUINAS

Futuro mecanismo tipo `harness sync`/`harness update` para máquinas de desenvolvedores acompanharem a versão remota do harness. Não implementar no MVP.

---

# 14. FUTURO — EMPRESA

Depois do MVP público, uso empresarial com repositório privado (`company-harness-engineering`) ou harness compartilhado com regras específicas da organização, hospedado na infraestrutura já existente da empresa.

---

# 15. EMPRESA — OBJETIVO

A meta não é criar uma "wiki bonita", mas **reduzir a dependência operacional de indivíduos e transformar conhecimento tácito em conhecimento compartilhado.**

---

# 16. RUNBOOKS

Runbooks devem ter estrutura objetiva: sintomas, diagnóstico, soluções conhecidas, escalonamento — permitindo que outra pessoa resolva problemas sem precisar perguntar diretamente ao autor.

---

# 17. INCIDENTES

Incidentes devem registrar fatos, não culpa: ID, título, data, impacto, serviços afetados, sintomas, timeline, causa, resolução, causa raiz, ações corretivas/preventivas, responsável, documentação relacionada. Nunca usar para culpabilização — objetivo é aprendizado organizacional.

---

# 18. ADRs

Architecture Decision Records devem registrar: contexto, problema, alternativas, decisão, justificativa, consequências, data, autor, status, versões relacionadas.

---

# 19. MEMÓRIA E MCP

Futuro: MemPalace/OpenSpace como camadas de memória. Fluxo: Experience → Memory → Observation → Proposal → Human Review → PR → Harness → New Documentation. IA não altera diretamente o conhecimento normativo.

---

# 20. IA NÃO DEVE SER A FONTE DA VERDADE

A IA pode sugerir, resumir, gerar, detectar inconsistências e propor alterações no harness — mas alterações normativas sempre passam por: AI Proposal → Validation → Pull Request → Human Review → Merge. Nunca aplicar mudanças automaticamente em produção sem governança.

---

# 21. FUTURO — MCP

Futuro: API consultável por agentes de IA (`GET /knowledge/...`, `GET /search`), consumida por um MCP Server. Fluxo: AI Agent → MCP → Knowledge API → Knowledge Store → Harness/Documentation.

---

# 22. API

Não obrigatória no MVP. Primeira versão pode ser estática. Introduzir API apenas quando houver necessidade real (busca dinâmica, feedback, múltiplos repositórios, auth, usuários, permissões, memória, embeddings, MCP, propostas, métricas). Não adicionar API só porque "sistemas profissionais precisam de API".

---

# 23. INFRAESTRUTURA DO MVP

Preferência: Git repository → Vercel → Next.js. Scripts de build podem ler Markdown, validar frontmatter, transformar documentos, gerar índices/páginas/metadata, validar links. Custo próximo de zero. Railway pode ser considerado futuramente para serviços que precisem de execução persistente. Não adicionar infraestrutura desnecessária.

---

# 24. STACK DO MVP

**Frontend:** Next.js, React, TypeScript.
**Processamento:** Node.js / TypeScript.
**Conteúdo:** Markdown, YAML/frontmatter, JSON quando apropriado.
**Deploy:** Vercel.

Evolução futura possível: PostgreSQL, API, Python/Django, MCP, embeddings, workers, infraestrutura própria. Não assumir essas tecnologias antes de existir necessidade.

---

# 25. EXPERIÊNCIA VISUAL

A documentação deve ser visualmente excelente — não uma pasta de Markdown renderizada. Componentes possíveis: diagramas, cards, timeline, badges de versão, status, relacionamento entre documentos, árvore de conhecimento, exemplos de código, comparação de alternativas, callouts, histórico, "por que esta decisão", "quando usar"/"quando não usar", "última validação", "fonte".

## Design (definido em 2026-09-14)

* **Referência visual: [TabNews](https://www.tabnews.com.br/)** — replicar a linguagem visual do TabNews (densidade de conteúdo, tipografia utilitária, layout de listagem tipo fórum/feed técnico, simplicidade, foco em legibilidade).
* **Tema claro e escuro obrigatórios** desde o MVP, com alternância pelo usuário.
* **MVP não terá cadastro** (reforça a seção 4: sem autenticação, sem usuários).

---

# 26. PRINCÍPIOS DE DESENVOLVIMENTO

Sempre priorizar: simplicidade, versionamento, rastreabilidade, reprodutibilidade, baixo acoplamento, documentação como código, Git como fonte da verdade, validação automatizada, revisão humana para mudanças normativas, evolução incremental.

Evitar: overengineering, infraestrutura sem necessidade, banco de dados antes de existir necessidade, IA antes de o pipeline básico funcionar, autenticação no MVP, sistemas complexos de usuários, automações difíceis de manter.

---

# 27. RELAÇÃO COM O PORTFÓLIO

O MVP também é um projeto de portfólio, demonstrando arquitetura, TypeScript, React/Next.js, parsing, geração de conteúdo, documentação como código, CI/CD, Git, versionamento, design de sistemas, conhecimento de engenharia, e posteriormente IA/MCP.

Narrativa: "Desenvolvi uma plataforma que transforma práticas de engenharia versionadas em documentação técnica visual, mantendo o Git como fonte da verdade e preparando o conhecimento para consumo por humanos e agentes de IA." Não apresentar como "um blog feito com Next.js".

---

# 28. EVOLUÇÃO ESPERADA

* **Fase 1 — MVP:** Harness → Parser → Knowledge Objects → Next.js → Vercel.
* **Fase 2 — Knowledge Engine:** schema formal, validação, relações, versionamento, metadata, busca, tipos de documento.
* **Fase 3 — API:** Knowledge API, busca, feedback, acesso programático.
* **Fase 4 — Company Instance:** repositório privado, documentação interna, runbooks, incidentes, ADRs, controle de acesso.
* **Fase 5 — Harness Distribution:** versionamento do harness, releases, CLI, sync/update, compatibilidade.
* **Fase 6 — AI/MCP:** MCP, MemPalace, OpenSpace, memória, busca semântica, propostas de alteração, geração de documentação.
* **Fase 7 — Living Knowledge System:** Engineering Practice → Harness → Documentation → Developer Usage → Experience → Memory → AI Analysis → Improvement Proposal → Human Review → Harness Update → New Documentation.

---

# 29. REGRA PARA TODA DECISÃO FUTURA

Antes de implementar qualquer recurso, perguntar:

1. Qual problema isso resolve?
2. Esse problema existe no MVP?
3. Isso precisa estar no core?
4. Pode ser resolvido com Git/Markdown/build?
5. Precisa realmente de banco?
6. Precisa realmente de API?
7. Precisa realmente de IA?
8. Isso aumenta ou reduz complexidade?
9. Isso melhora rastreabilidade?
10. Isso mantém o Git como fonte da verdade?

Se a resposta for "não precisa agora", adiar.

---

# 30. REGRA PARA TODA DOCUMENTAÇÃO GERADA

Sempre que possível, preservar: WHAT, WHY, WHEN, WHEN NOT, HOW, EXAMPLE, RATIONALE, ALTERNATIVES, TRADE-OFFS, VERSION, SOURCE, AUTHOR, VALIDATION, RELATED.

---

# 31. ESTADO ATUAL

O primeiro objetivo é: **Construir somente o MVP público.**

Não implementar ainda: empresa, autenticação, API complexa, banco, MCP, memória, sync de máquinas, IA autônoma.

Primeiro construir uma versão pequena, bonita, funcional e demonstrável. O MVP deve pegar o `harness-engineering` e transformá-lo em uma experiência de documentação técnica visual. Depois de o MVP funcionar, revisar a arquitetura com base no que foi aprendido e iniciar a próxima fase.

---

# 32. COMO O ASSISTENTE DEVE TRABALHAR

Ao trabalhar neste projeto:

* não invente requisitos;
* não implemente funcionalidades futuras sem necessidade;
* não introduza infraestrutura prematuramente;
* mantenha o escopo do MVP pequeno;
* questione decisões que aumentem complexidade sem benefício claro;
* preserve Git como fonte da verdade;
* privilegie documentação versionada;
* mantenha separação entre conhecimento público e conhecimento privado empresarial;
* nunca coloque dados, segredos ou informações confidenciais da empresa no projeto público;
* trate IA como ferramenta de apoio, não como fonte normativa;
* proponha arquitetura incremental;
* explique trade-offs de decisões relevantes;
* mantenha a possibilidade de evolução para API, MCP e ambiente empresarial.

Quando uma nova decisão arquitetural for tomada, considere registrá-la como ADR.

Quando uma funcionalidade futura for discutida, não implemente automaticamente. Classifique-a como: MVP / FUTURE / EXPERIMENT / OUT OF SCOPE.

O objetivo é terminar o MVP antes de construir a plataforma completa.

---

# 33. OBJETIVO FINAL

Conhecimento técnico escrito como código, versionado como código, validado como código, publicado automaticamente e consumido tanto por humanos quanto por agentes de IA — para que uma organização deixe de depender de conhecimento concentrado em indivíduos.

```text
              ┌──────────────────────┐
              │ Engineering Practice │
              └──────────┬───────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Harness / Git   │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Knowledge Engine│
                └────────┬────────┘
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
          Website       CLI         API
             │                       │
             │                       ▼
             │                      MCP
             │                       │
             │                ┌──────┴──────┐
             │                ▼             ▼
             │             Memory          AI
             │                │             │
             │                └──────┬──────┘
             │                       ▼
             │                Improvement
             │                   Proposal
             │                       │
             │                       ▼
             │                      PR
             │                       │
             └───────────────────────┘
                         │
                         ▼
                    New Knowledge
```

Comece pelo menor ciclo possível: **Harness → Parse → Render → Vercel**. E somente evolua quando houver uma necessidade real que justifique a próxima camada.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
