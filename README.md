# Avtomatic.AI

**AI document assistant that keeps your data on your own infrastructure.**

Avtomatic.AI ingests PDF documents, extracts their text, and analyzes them with a
local LLM — classifying the document, detecting its language, and pulling out
structured entities. The AI runs **on-premise via Ollama**, so document contents
never leave the client's infrastructure.

🔗 **Live demo:** https://avtomatic-ai.vercel.app

---

## Why

Regulated Swiss SMEs — **fiduciaries (Treuhänder), law firms, and HR teams** —
handle highly confidential documents (invoices, contracts, CVs, certificates) and
are wary of sending them to third-party AI clouds.

Avtomatic.AI's core promise: **data never leaves the client's infrastructure.**
Analysis is performed by a local model (Ollama / `llama3.2`). The cloud deployment
runs with AI disabled (`AI_PROVIDER=none`) and gracefully skips analysis, so the
hosted demo never ships document text to an external provider.

---

## Status

| Sprint | Scope | Status |
| ------ | ----- | ------ |
| **Sprint 1** | Project scaffold, UI shell, database & storage wiring | ✅ Done |
| **Sprint 2** | Document upload, listing, viewer, delete | ✅ Done |
| **Sprint 3A** | PDF text extraction (unpdf, serverless PDF.js) | ✅ Done |
| **Sprint 3B** | AI analysis layer (Ollama) + provider abstraction + UI | ✅ Done |
| **Polish** | Landing redesign, shared UI, upload hardening, **signed URLs** | ✅ Done |

See [`CHANGELOG.md`](./CHANGELOG.md) for the detailed history.

---

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Framework | **Next.js 16** (App Router, Turbopack) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** + **shadcn/ui** |
| Database | **PostgreSQL** (**Neon**) via **Prisma 7** (`@prisma/adapter-neon`) |
| Storage | **Supabase Storage** (pluggable: also Local / Cloudflare R2) |
| PDF extraction | **unpdf** (serverless build of PDF.js — no DOMMatrix workarounds) |
| AI | **Ollama** (`llama3.2`) locally, with a `none` fallback on Vercel |
| Validation | **Zod** |
| Runtime | **Node.js 22** |
| Hosting | **Vercel** |

---

## Architecture

### Document pipeline

```
upload → store (Supabase) → extractText (unpdf) → analyzeWithAI (Ollama) → persist → UI
```

`DocumentService.process()` runs the full pipeline and tracks status
(`UPLOADED → PROCESSING → READY | ERROR`):

1. **`extractText()`** — fetches the PDF from storage and extracts text with `unpdf`.
2. **`analyzeWithAI()`** — sends the text to the configured AI provider, validates
   the response with Zod, and persists the result. Skipped when no provider is
   configured or the text is shorter than 50 characters.

### AI provider abstraction

The AI layer is provider-agnostic behind a single interface:

```ts
interface AIProvider {
  analyzeDocument(input: { text: string; filename: string }): Promise<DocumentAnalysis>;
}
```

```
src/lib/ai/
├── types.ts     # DocumentAnalysisSchema (Zod) + AIProvider interface
├── ollama.ts    # OllamaProvider — local llama3.2
└── index.ts     # getAIProvider() factory (AI_PROVIDER switch)
```

`getAIProvider()` returns the configured provider, or `null` when
`AI_PROVIDER` is unset or `none` (the Vercel default) so analysis is skipped
safely. Future providers — **`ClaudeProvider`**, **`OpenAIProvider`** — plug in
by implementing `AIProvider` and registering in the factory.

The analysis result is validated against a strict schema:

```ts
const DocumentAnalysisSchema = z.object({
  documentType: z.enum(["invoice", "contract", "cv", "certificate", "other"]),
  language: z.enum(["it", "de", "en", "fr", "ru", "other"]),
  confidence: z.number().min(0).max(1),
  summary: z.string(),
  entities: z.record(z.string(), z.unknown()),
});
```

### Pluggable storage

`src/lib/storage/` exposes a `StorageProvider` interface with three
implementations selected via `STORAGE_PROVIDER`: `supabase` (default in use),
`local`, and `r2` (Cloudflare R2).

### Security & privacy

- **Signed URLs** — files are read through short-lived signed URLs
  (`StorageProvider.getSignedUrl`) instead of permanent public links. The
  document API returns a fresh 1-hour URL; server-side extraction signs for 120s.
- **Upload hardening** — PDF-only, 15 MB limit, and filenames sanitized into
  path-safe storage keys (`buildStorageKey`).
- For full privacy the Supabase bucket must be **private** and
  `SUPABASE_SERVICE_ROLE_KEY` set (server-only) so signing works against it.

---

## Project Structure

```
src/
├── app/
│   ├── demo/                        # Document workspace (list, upload, viewer)
│   │   ├── page.tsx                 # Documents list + upload + delete + analyze
│   │   └── doc/[id]/page.tsx        # Document viewer + AI analysis cards
│   └── api/documents/
│       ├── route.ts                 # GET list
│       ├── upload/route.ts          # POST upload
│       └── [id]/
│           ├── route.ts             # GET (incl. extractions) / DELETE
│           └── process/route.ts     # POST run pipeline
├── lib/
│   ├── ai/                          # AI provider abstraction
│   ├── storage/                     # Pluggable storage providers
│   ├── services/document.service.ts # Pipeline: extract + analyze
│   └── prisma.ts                    # Prisma client (Neon adapter)
└── generated/prisma/                # Generated Prisma client (git-ignored)

prisma/schema.prisma                 # Document, Extraction, ChatMessage
```

---

## Getting Started

### Prerequisites

- **Node.js 22** (`.nvmrc` provided — `nvm use` / `fnm use`)
- A **Neon** PostgreSQL database
- A **Supabase** project with a storage bucket
- **[Ollama](https://ollama.com)** running locally with the model pulled:
  ```bash
  ollama pull llama3.2
  ```

### Setup

```bash
# 1. Install dependencies (runs prisma generate via postinstall)
npm install

# 2. Configure environment (see below), then push the schema
npx prisma db push

# 3. Run the dev server
npm run dev
```

Open http://localhost:3000/demo.

### Environment variables

Create `.env.local`:

```bash
# Database (Neon)
DATABASE_URL="postgresql://..."

# Storage
STORAGE_PROVIDER="supabase"        # supabase | local | r2
SUPABASE_URL="https://xxxx.supabase.co"
SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."   # server-only; required for signed URLs on a private bucket
SUPABASE_BUCKET="avtomatic-ai"

# AI (local only — leave unset/none in the cloud)
AI_PROVIDER="ollama"               # ollama | none
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.2"
```

> **On Vercel**, leave `AI_PROVIDER` unset (or `none`). The pipeline still
> extracts text and reaches `READY`; AI analysis is skipped because `localhost`
> Ollama is unreachable from the cloud.

---

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start the dev server |
| `npm run build` | `prisma generate` + production build |
| `npm start` | Run the production server |
| `npm run lint` | Lint with ESLint |

---

## Roadmap

- **Cloud AI providers** — `ClaudeProvider` / `OpenAIProvider` for clients who
  opt into hosted analysis.
- **Chat over documents** — the `ChatMessage` model is already in the schema.
- **More document types & richer entity extraction.**

---

## License

Private — all rights reserved.
