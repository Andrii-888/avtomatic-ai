# Changelog

Detailed log of work on Avtomatic.AI, grouped by working session.

---

## Session 2 — UI/UX polish, hardening & privacy

### Password gate (site-wide access protection)
- Added `src/proxy.ts` — Next 16's renamed `middleware` convention — that gates
  the whole site behind a shared password. Unauthenticated requests redirect to
  `/login`; the gate is disabled when `DEMO_PASSWORD` is unset.
- `/login` is a minimal Server Action form: a correct password sets a 30-day
  httpOnly `demo-auth` cookie and redirects home; wrong password shows an error.
- `DEMO_PASSWORD` added to `.env.local` and Vercel. Verified locally: gated
  routes redirect, correct password authenticates, wrong password is rejected.

### Internationalization (5 languages)
- Full UI translation into **English, Italian, German, French, Russian** with a
  polished language switcher in every nav; choice persisted in `localStorage`,
  browser language auto-detected, `<html lang>` kept in sync.
- `src/i18n/` holds one dictionary per locale. `en.ts` is the source of truth;
  every other locale is typed `Record<MessageKey, string>`, so a missing key
  fails `tsc` — guaranteeing all languages stay structurally in sync (verified:
  101 keys each). Translations are native-level.
- A client `I18nProvider` exposes `t(key)`; the landing, demo and document pages
  render entirely from translation keys.
- Also moved the "Auto Status Updates" card to the Live section now that the
  feature ships.

### Background processing & live status (Auto Status Updates)
- `POST /api/documents/[id]/process` now flips the document to `PROCESSING`
  and returns `202` immediately, running the pipeline after the response via
  Next.js `after()` (reliable on Vercel Fluid Compute) — no more blocking the
  request for the full extract+analyze.
- Demo list polls each analyzing document every 3s until `READY`/`ERROR`,
  shows a spinner on the card, resumes polling for in-flight docs after a
  reload, and clears all intervals on unmount (`useRef`-tracked).
- Document viewer polls while `PROCESSING` and shows a top progress banner;
  the AI analysis cards appear once it finishes.

### Landing page redesign
- Rebuilt `src/app/page.tsx` as a full marketing page: hero, **"What we solve"**
  feature grid (12 cards across **Live / In Development / Roadmap** states),
  **"How it works"** (3 steps), **"Who is it for"** (3 audiences), a dark
  **Privacy First** section, and a rich footer (CTA band + link columns + GitHub).
- Added the **Fraunces** display serif, a `--brand` color token, and CSS
  `reveal` / `scanline` / `bg-grid` animations (with `prefers-reduced-motion`).
- Centered the section headings; removed market-specific ("Swiss") copy.

### Branding & navigation
- Replaced the logo dot with a **flame icon** in the nav and footer.
- Extracted a shared **`<Logo>`** component (`src/components/logo.tsx`) used on
  every page — identical size, click navigates home and scrolls to the top.
- Unified nav horizontal padding so the logo no longer shifts between pages.
- Swapped the default `favicon.ico` for a flame **`icon.svg`**.

### Security & hardening (audit follow-up)
- `buildStorageKey()` (`src/lib/storage/key.ts`) — sanitizes filenames into
  path-safe storage keys; applied across supabase/local/r2 providers.
- Upload route: enforce a **15 MB limit** and `instanceof File` check.
- Demo upload: client-side size check, error feedback, and input reset (fixes
  re-selecting the same file not re-uploading).

### Signed URLs for private file access
- Added `StorageProvider.getSignedUrl(key, expiresIn)`.
- Supabase signs via `createSignedUrl`; client prefers `SUPABASE_SERVICE_ROLE_KEY`
  (server-only) so signing works on a **private** bucket.
- `extractText` reads via a 120s signed URL from `storageKey`; the document API
  returns a fresh 1-hour signed `fileUrl`; the viewer uses it (falls back to the
  legacy `blobUrl`).
- **Privacy now active**: the Supabase bucket is private and
  `SUPABASE_SERVICE_ROLE_KEY` is set (local + Vercel). Verified in production —
  the public object path is blocked ("Bucket not found") while signed URLs serve
  the file (200).

### Docs
- Rewrote `README.md` and `AGENTS.md`; added this changelog.

---

## Session 1 — PDF pipeline, AI layer & deploy

### PDF extraction
- Root cause of the repeated "DOMMatrix" build failures: the code used the
  **pdf-parse v1** call signature on an installed **v2**. Migrated to **`unpdf`**
  (serverless PDF.js build); removed `pdf-parse` and `pdfjs-dist`.
- `extractText` uses `unpdf` with `{ mergePages: true }` → single string.

### AI analysis layer (Sprint 3B)
- Provider abstraction `src/lib/ai/`: `types.ts` (`DocumentAnalysisSchema` via Zod
  + `AIProvider`), `ollama.ts` (`OllamaProvider`, `llama3.2`), `index.ts`
  (`getAIProvider()` factory).
- **`none` fallback** — `getAIProvider()` returns `null` when `AI_PROVIDER` is
  unset/`none` (Vercel default), so analysis is skipped gracefully and documents
  still reach `READY` instead of `ERROR`.
- Wired `analyzeWithAI()` into `DocumentService.process()`:
  `extract → analyze → persist`. Results saved to `Document.type/summary` and
  `Extraction.data` (`documentType`, `language`, `confidence`, `entities`).
- `GET /api/documents/[id]` returns related `extractions`; the document viewer
  renders the analysis as cards (type, language, confidence %, entities).

### Infrastructure & deploy
- Bumped to **Node 22** (`.nvmrc`, `engines: "22.x"`, fnm default).
- `npm audit`: **5 → 0** vulnerabilities via `overrides` (`postcss`,
  `@hono/node-server`) — no major downgrades.
- Fixed Vercel builds: Prisma client is generated into git-ignored
  `src/generated/prisma`, so `prisma generate` runs in `build` + `postinstall`.

### Fixes
- `await getStorageProvider()` in the document DELETE route (async factory; the
  missing await broke the build and silent-failed storage cleanup).
- Resolved `react-hooks/set-state-in-effect` in the demo page (async IIFE +
  cancellation flag).
- Corrected the self-referential `--font-sans` CSS variable (and stopped
  preloading the then-unused mono font) to clear console warnings.

---

> Production: https://avtomatic-ai.vercel.app · Sprints 1, 2, 3A, 3B complete.
