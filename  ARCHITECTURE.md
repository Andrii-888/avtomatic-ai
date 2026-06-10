Отличные улучшения от ChatGPT. Давай обновим ARCHITECTURE.md с учётом всех замечаний.
Замени содержимое файла:
markdown

# Avtomatic.AI — Architecture & Technical Specification

**Live:** https://avtomatic-ai.vercel.app  
**Repo:** https://github.com/Andrii-888/avtomatic-ai  
**Status:** Sprint 2 in progress

---

## Vision

AI-powered document processing platform for businesses.  
Upload a PDF → extract structured data → ask questions → automate workflows.

**Target:** Swiss SMEs (fiduciaries, lawyers, insurance brokers, HR)  
**Goal:** Working SaaS product to show potential Swiss partner

---

## Non-Goals (v1)

- No user authentication
- No multi-tenant architecture
- No billing system
- No vector database / embeddings
- No real-time collaboration
- No mobile app

---

## Core Processing Pipeline

Upload PDF ↓
Store file (StorageProvider) ↓
Create Document (status = UPLOADED) ↓
Extract text (pdf-parse) ↓
Update status = PROCESSING ↓
Send to AIProvider ↓
Save Extraction to DB ↓
Update status = READY ↓
Enable Chat

---

## System Architecture

Browser
↓
Next.js API (Vercel)
↓
┌─────────────────────────────────┐
│ API Layer │
│ POST /api/documents/upload │
│ GET /api/documents │
│ GET /api/documents/[id] │
│ POST /api/documents/[id]/process│
│ POST /api/documents/[id]/chat │
└─────────────────────────────────┘
↓
┌─────────────────────────────────┐
│ Services Layer │
│ StorageService │
│ DocumentService │
│ AIService │
└─────────────────────────────────┘
↓
┌──────────────┬──────────────────┐
│ Storage │ AI │
│ Local (dev) │ Claude (primary)│
│ R2 (prod) │ OpenAI (future) │
│ │ Ollama (local) │
└──────────────┴──────────────────┘
↓
┌─────────────────────────────────┐
│ Data Layer │
│ Neon PostgreSQL (metadata) │
│ Cloudflare R2 (PDF files) │
└─────────────────────────────────┘

---

## Processing Model

**Current: Sequential (MVP)**
Upload → Store → Extract Text → AI Analyze → Save → Ready

**Future: Queue-based**
Upload → Store → Queue Job → Worker → AI → Save → Notify

- BullMQ + Redis for job queue
- Background workers
- Retry mechanism on AI failure
- Webhook notifications

---

## Interfaces

### StorageProvider

```typescript
export interface StorageProvider {
  upload(
    file: File | Blob | ReadableStream,
    metadata: {
      filename: string;
      contentType: string;
      size?: number;
    }
  ): Promise<{ key: string; url: string }>;

  delete(key: string): Promise<void>;
  getUrl(key: string): Promise<string>;
}
```

**Implementations:**

- `LocalStorageProvider` — saves to `public/uploads/` (dev only)
- `R2StorageProvider` — Cloudflare R2 (production)

### AIProvider

```typescript
export interface AIProvider {
  analyzeDocument(input: {
    text: string;
    metadata?: {
      filename: string;
      language?: string;
    };
  }): Promise<DocumentAnalysis>;

  answerQuestion(input: {
    documentText: string;
    question: string;
    chatHistory?: ChatMessage[];
  }): Promise<string>;
}

export interface DocumentAnalysis {
  documentType: string; // invoice | contract | cv | insurance | report
  language: string; // it | de | en | fr
  confidence: number; // 0-1
  entities: Record<string, unknown>;
  summary: string;
}
```

**Implementations:**

- `ClaudeProvider` — Anthropic Claude (primary)
- `OpenAIProvider` — OpenAI GPT (fallback)
- `OllamaProvider` — local models (self-hosted)

---

## Data Model

```prisma
Document {
  id          String    — cuid
  title       String    — original filename
  type        String?   — invoice | contract | cv | insurance | report
  summary     String?   — AI generated summary
  content     String?   — extracted text from PDF
  storageKey  String?   — key in R2 or local path
  blobUrl     String?   — public URL
  status      String    — UPLOADED | PROCESSING | READY | ERROR
  errorMsg    String?   — error message if status = ERROR
  createdAt   DateTime

  extractions  Extraction[]
  messages     ChatMessage[]
}

Extraction {
  id          String
  documentId  String
  data        Json      — structured AI output
}

ChatMessage {
  id          String
  documentId  String
  role        String    — user | assistant
  content     String
  createdAt   DateTime
}
```

### AI Extraction Output Format

```json
{
  "documentType": "invoice",
  "language": "it",
  "confidence": 0.95,
  "entities": {
    "invoiceNumber": "INV-2025-001",
    "amount": 2500,
    "currency": "CHF",
    "company": "ABC SA",
    "counterparty": "XYZ SA",
    "issueDate": "2025-05-01",
    "dueDate": "2025-06-30"
  },
  "summary": "Invoice from ABC SA to XYZ SA for CHF 2500..."
}
```

---

## Error Handling Strategy

- Every document has `status` field with `ERROR` state
- Error message stored in `errorMsg` field
- Failed processing can be retried via `POST /api/documents/[id]/process`
- AI failures logged separately from storage failures
- Client always sees human-readable status

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Storage
STORAGE_PROVIDER=local         # local | r2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=avtomatic-ai
R2_PUBLIC_URL=https://...

# AI
AI_PROVIDER=claude             # claude | openai | ollama
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
OLLAMA_BASE_URL=http://localhost:11434
```

---

## File Structure (target)

src/
├── app/
│ ├── page.tsx
│ ├── demo/
│ │ ├── page.tsx
│ │ └── doc/[id]/page.tsx
│ └── api/
│ └── documents/
│ ├── route.ts
│ ├── upload/route.ts
│ └── [id]/
│ ├── route.ts
│ ├── process/route.ts
│ └── chat/route.ts
├── lib/
│ ├── prisma.ts
│ ├── storage/
│ │ ├── index.ts # getStorageProvider()
│ │ ├── types.ts # StorageProvider interface
│ │ ├── local.ts # LocalStorageProvider
│ │ └── r2.ts # R2StorageProvider
│ └── ai/
│ ├── index.ts # getAIProvider()
│ ├── types.ts # AIProvider interface
│ ├── claude.ts # ClaudeProvider
│ ├── openai.ts # OpenAIProvider
│ └── ollama.ts # OllamaProvider
└── generated/
└── prisma/

---

## Tech Stack

| Layer       | Technology                         | Status      |
| ----------- | ---------------------------------- | ----------- |
| Framework   | Next.js 16, App Router, TypeScript | ✅ Done     |
| UI          | Tailwind CSS v4, shadcn/ui         | ✅ Done     |
| Database    | PostgreSQL, Prisma 7, Neon         | ✅ Done     |
| Storage     | Local → Cloudflare R2              | 🔄 Sprint 2 |
| PDF Parsing | pdf-parse                          | ⬜ Sprint 3 |
| AI          | Claude API → OpenAI → Ollama       | ⬜ Sprint 3 |
| Deploy      | Vercel                             | ✅ Done     |

---

## Roadmap

### ✅ Sprint 1 — Foundation

- [x] Next.js + Prisma + Neon
- [x] PDF upload (local storage)
- [x] Documents list + search
- [x] PDF viewer
- [x] Responsive layout
- [x] Deploy to Vercel

### 🔄 Sprint 2 — Storage & Pipeline

- [ ] Update landing copy
- [ ] StorageProvider interface + LocalStorageProvider
- [ ] R2StorageProvider
- [ ] Cloudflare R2 setup
- [ ] Status pipeline (UPLOADED → PROCESSING → READY → ERROR)
- [ ] errorMsg field in Document model
- [ ] storageKey field in Document model

### ⬜ Sprint 3 — AI Extraction

- [ ] pdf-parse: extract text
- [ ] AIProvider interface + ClaudeProvider
- [ ] POST /api/documents/[id]/process
- [ ] Save Extraction to DB
- [ ] Document page: extracted fields UI

### ⬜ Sprint 4 — Chat

- [ ] POST /api/documents/[id]/chat
- [ ] Chat UI with history
- [ ] ChatMessage saved to DB
- [ ] Context: document text + chat history → Claude

### ⬜ Sprint 5 — Search & Polish

- [ ] Full-text search
- [ ] Filter by type, status, date
- [ ] Landing: Use Cases section
- [ ] Landing: Swiss market copy

### ⬜ Sprint 6 — Multi-provider

- [ ] OpenAIProvider
- [ ] OllamaProvider
- [ ] STORAGE_PROVIDER env switch
- [ ] AI_PROVIDER env switch

---

## Key Decisions

**Cloudflare R2 over Vercel Blob**  
Portable. Works on Vercel, VPS, Docker. S3-compatible. 10GB free tier.

**Abstraction over direct API calls**  
Today Claude. Tomorrow OpenAI or Ollama. One interface, no rewrite.

**pdf-parse before Claude**  
Text extraction is deterministic and cheap. Claude only processes text — faster and cheaper.

**Sequential pipeline now, queue later**  
MVP needs simplicity. Queue (BullMQ) added when processing takes >3 seconds or volume grows.

**POST /api/documents/[id]/process (not auto-analyze)**  
Explicit trigger = easier to debug, easier to add queue later.
