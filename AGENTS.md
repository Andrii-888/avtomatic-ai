<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Avtomatic.AI — Agent Guide

AI document assistant: upload a PDF → extract text → analyze with a **local** LLM
→ persist structured results → show them in the UI. Core principle: **document
data never leaves the client's infrastructure** (AI runs locally via Ollama).

## Stack

- **Next.js 16** (App Router, Turbopack) · **TypeScript** · **Tailwind + shadcn/ui**
- **PostgreSQL (Neon)** via **Prisma 7** (`@prisma/adapter-neon`)
- **Supabase Storage** (pluggable: also local / Cloudflare R2)
- **unpdf** for PDF text extraction · **Ollama** (`llama3.2`) for analysis
- **Zod** for validation · **Node.js 22** · hosted on **Vercel**

## Environment & commands

- **Node 22 is required** (`.nvmrc` + `engines: "22.x"`). Run `fnm use` / `nvm use`
  before anything. The project is managed with **fnm** on this machine.
- `npm run dev` — dev server · `npm run build` — runs `prisma generate` then
  `next build` · `npm run lint` — ESLint.
- Always run `npx tsc --noEmit` and `npx eslint` before committing; both must be
  clean. `next build` does **not** fail on lint, so check lint separately.

## Hard rules (these have bitten us — don't repeat)

- **No `require()`** — `@typescript-eslint/no-require-imports` is enforced. Use
  static `import` or dynamic `await import()`. Never `const x = require(...)`.
- **`getStorageProvider()` is async** (`Promise<StorageProvider>`). Always
  `await` it before calling `.upload()` / `.delete()`.
- **`getAIProvider()` returns `AIProvider | null`.** It is `null` when
  `AI_PROVIDER` is unset or `none` (the Vercel default). Always null-check and
  skip analysis gracefully — never assume AI is available in the cloud.
- **Ollama is localhost-only.** `OLLAMA_BASE_URL` defaults to
  `http://localhost:11434`, which does not exist on Vercel. Code that calls it
  must be guarded by the provider check above.
- **Zod v4**: `z.record` needs two args — `z.record(z.string(), z.unknown())`.
- **unpdf**: `extractText(data, { mergePages: true })` returns `{ text: string }`.
  Without `mergePages` it returns `string[]`.
- **Prisma client is generated** into `src/generated/prisma` and is **git-ignored**.
  It only exists after `prisma generate` (wired into `build` + `postinstall`).
  ESLint ignores `src/generated/**` — don't lint or hand-edit it.
- **React effects**: `react-hooks/set-state-in-effect` is on. Don't call a
  state-setting function directly in `useEffect`; wrap fetches in an async IIFE
  with a cancellation flag (see `src/app/demo/page.tsx`).

## Layout

- `src/lib/services/document.service.ts` — the pipeline (`process` →
  `extractText` + `analyzeWithAI`).
- `src/lib/ai/` — provider abstraction: `types.ts` (Zod schema + `AIProvider`),
  `ollama.ts`, `index.ts` (factory). Add new providers (`ClaudeProvider`,
  `OpenAIProvider`) by implementing `AIProvider` and registering in the factory.
- `src/lib/storage/` — `StorageProvider` implementations, selected by
  `STORAGE_PROVIDER`.
- `src/app/api/documents/**` — REST routes (list / upload / get+delete / process).
- `prisma/schema.prisma` — `Document`, `Extraction` (AI result as `data Json`),
  `ChatMessage`.

## Env vars

`.env.local` (git-ignored): `DATABASE_URL`, `STORAGE_PROVIDER` + `SUPABASE_URL` /
`SUPABASE_ANON_KEY` / `SUPABASE_BUCKET`, and **local only**: `AI_PROVIDER=ollama`,
`OLLAMA_BASE_URL`, `OLLAMA_MODEL`. On Vercel leave `AI_PROVIDER` unset.

## Deploy

Pushing to `main` auto-deploys to production on Vercel; `npx vercel --prod` also
works. After deploying, smoke-check the relevant route.
