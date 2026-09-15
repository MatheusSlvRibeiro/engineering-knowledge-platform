# Engineering Knowledge Platform

An MVP that transforms a versioned engineering knowledge repository into browsable, traceable
documentation. It is not a blog or a wiki with manual editing — every page is derived at build
time from Markdown files in a separate Git repository, and every piece of content links back to
its source: file path, author, last-validated date, and commit hash, all read from Git history.

## How it works

- Source of truth: [`harness-engineering`](https://github.com/MatheusSlvRibeiro/harness-engineering),
  a repo structured as `skills/<slug>/SKILL.md` plus `skills/<slug>/reference/*.md`.
- `src/lib/harness.ts` reads that repo at build/request time: it parses each `SKILL.md` with
  `gray-matter`, collects its reference docs, and pulls provenance (author, date, commit) via
  `git log` run against the harness repo.
- `src/lib/markdown.ts` renders the Markdown bodies to HTML (`remark` + `remark-gfm`).
- Next.js App Router pages (`src/app/page.tsx`, `src/app/skills/[slug]/page.tsx`) render each
  skill as a knowledge-object page, with the list view and detail view sourced entirely from the
  functions above — no database, no CMS.

Because content lives in Git, the platform never stores or mutates data on its own: rebuilding
after a `git pull` in the harness repo is how content updates.

## Running locally

```bash
npm install
npm run dev
```

The app expects a local clone of `harness-engineering` on disk. By default it looks for it at
`~/harness-engineering`. To point at a different location, set `HARNESS_PATH` (see
`.env.example`):

```bash
cp .env.example .env.local
# edit HARNESS_PATH to point at your clone
```

## Deploying (Vercel)

`HARNESS_PATH` only resolves on a machine that already has the harness repo cloned, which a
fresh Vercel build doesn't. `scripts/fetch-harness.mjs` runs automatically before `next build`
(wired as the `prebuild` npm script) and handles this: if `HARNESS_PATH` isn't set and there's no
`~/harness-engineering` on disk, it does a full clone of
[`harness-engineering`](https://github.com/MatheusSlvRibeiro/harness-engineering) into
`.harness-cache/` (gitignored) and `src/lib/harness.ts` falls back to that path automatically.
A full clone (not shallow) is required — provenance is read per-file via `git log`, which needs
real history to point at the commit that actually last touched each file.

No project-specific environment variables are required to deploy: just import the repo into
Vercel and build. Set `HARNESS_PATH` only if you want to pin a different harness repo/branch, or
`HARNESS_REPO_URL` to point the auto-clone at a fork.

## Design constraints (MVP)

- No authentication, no signup, no database. This is intentional, not a missing feature.
- Content is read-only and derived entirely from the harness repo at build/request time.
- Visual design mirrors TabNews: GitHub Primer color tokens, numbered list rows, dense type,
  light/dark theme via `next-themes`.
