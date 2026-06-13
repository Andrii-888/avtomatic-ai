# Changelog

Detailed log of work on Avtomatic.AI, grouped by working session.

---

## Session 2 — UI/UX polish, hardening & privacy

### Mobile responsiveness
- Reworked the demo workspace for small screens: the desktop sidebar is hidden
  on mobile (`hidden lg:flex`), the document list renders as a single-column card
  grid, and an upload button moved into the toolbar (search + upload) so nothing
  overflows. Document viewer and landing verified clean at 390px.
- Content-overflow hardening: long entity values, JSON and chat messages wrap via
  `overflow-wrap: anywhere`; card titles/types truncate; page roots use
  `overflow-x-hidden`. Verified 0px horizontal overflow on all pages at 390px,
  even with worst-case unbroken strings. Card delete button is now tap-visible
  on touch (no hover dependency).

### Sample document generators & multilingual test
- Added `scripts/gen_samples.py` (invoice/contract/cv/certificate, EN) and
  `scripts/gen_samples_intl.py` (DE invoice, FR CV, IT contract, RU certificate
  via an embedded Unicode font) to produce fictional test PDFs.
- Pipeline test results (Ollama `llama3.2`): language detection is accurate on
  real non-English docs (de/fr/it/ru all correct); document-type is correct for
  invoice/contract/cv but `certificate` is mis-read as `cv`; and the small model
  does NOT honor the "summary in document language" instruction (summaries come
  back in English). Both gaps are model-quality limits — a larger model
  (`llama3.1:8b`) is expected to fix them with no code changes.

### Localized summaries & swappable model
- Analysis prompt now asks the model to write the `summary` in the document's
  own detected language instead of always English.
- Confirmed the Ollama model is read from `OLLAMA_MODEL` (env) in `ollama.ts`, so
  it can be swapped (e.g. `llama3.1:8b`) for more accurate language detection
  with no code changes — documented in `.env.local` and the README.
- Note: the small default `llama3.2` can mis-detect language on documents with
  strong foreign country/currency cues (e.g. a Swiss CHF invoice → "de"); a
  larger model fixes this.

### Login UX & responsive polish
- The login form became a client component (server action extracted) with a
  custom top-of-page popup when the password is empty and submit is pressed —
  replacing native browser validation; the form no longer submits.
- Fully localized the login page into all 5 languages.
- Hide the nav "Open Demo" button on mobile (`hidden sm:inline-flex`) to declutter
  the top bar — the language switcher stays.

### Document search
- `GET /api/documents?q=` searches `title`, `content` and `summary`
  (case-insensitive Prisma `contains`); empty `q` returns everything.
- Demo workspace switched from client-side title filtering to debounced (300ms)
  server-side search, with a localized "No documents found" empty state.
- Localized `demo.noResults` across all 5 languages; moved the now-shipped
  "Document Search" feature card to the Live section.

### Sprint 4 — Chat with Document
- Added a `chat()` method to `AIProvider` / `OllamaProvider` (free-text Q&A over
  the document content, capped at 6k chars).
- `POST /api/documents/[id]/chat` saves the user + assistant `ChatMessage`,
  answers via Ollama, and returns `503 "AI not available"` when no provider is
  configured (the Vercel default). `GET` returns the message history.
- Document viewer gained a chat section below AI Analysis: user/assistant
  bubbles (right/left, distinct colors), input + Send, a loader while answering,
  autoscroll, and graceful "AI unavailable" handling.
- Localized into all 5 languages. Verified locally end-to-end against Ollama.
- Audit hardening: persist both messages only after a successful answer (no
  orphaned user message on failure) and cap message length at 2000 chars.

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
