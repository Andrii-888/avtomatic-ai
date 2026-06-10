# Avtomatic.AI — AI Document Assistant

Smart automation and AI-powered document processing for businesses.

**Live demo:** https://avtomatic-ai.vercel.app

---

## What is this?

Avtomatic.AI is a demo product that shows how AI can help businesses work with documents automatically — upload a PDF, get AI analysis, ask questions about the document.

Built as a portfolio project to demonstrate AI automation capabilities for Swiss SMEs.

---

## Current Status

### ✅ Sprint 1 — Done

- Landing page with positioning
- PDF upload and storage
- Documents list with search
- Document viewer (PDF preview)
- Responsive layout (mobile + desktop)
- PostgreSQL database (Neon)
- Deployed on Vercel

### 🔄 Sprint 2 — In Progress

- Claude API integration
- Automatic document type detection (Invoice, Contract, CV, Insurance)
- Key field extraction (parties, dates, amounts)
- Document summary generation

### ⬜ Sprint 3 — Planned

- Chat with document (ask questions, get answers)
- Chat history saved to database

### ⬜ Sprint 4 — Planned

- Search across all documents
- Filters by type, date, status

### ⬜ Sprint 5 — Planned

- RAG (search by document content)
- Vector embeddings
- Multi-document search

---

## Tech Stack

| Layer     | Technology                                  |
| --------- | ------------------------------------------- |
| Framework | Next.js 16 (App Router)                     |
| UI        | React 19, Tailwind CSS v4, shadcn/ui        |
| Database  | PostgreSQL via Prisma 7 + Neon (serverless) |
| Storage   | Local filesystem (dev) / Vercel Blob (prod) |
| AI        | Anthropic Claude API (coming Sprint 2)      |
| Deploy    | Vercel                                      |

---

## Data Model

```prisma
Document     — id, title, type, summary, content, blobUrl, status, createdAt
Extraction   — id, documentId, data (JSON)   ← AI extracted fields
ChatMessage  — id, documentId, role, content ← chat history
```

---

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add DATABASE_URL from neon.tech

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

DATABASE_URL=postgresql://... # Neon PostgreSQL
BLOB_READ_WRITE_TOKEN=... # Vercel Blob (for production uploads)
ANTHROPIC_API_KEY=... # Claude API (Sprint 2)

---

## Project Structure

src/
├── app/
│ ├── page.tsx # Landing page
│ ├── demo/
│ │ ├── page.tsx # Documents list
│ │ └── doc/[id]/page.tsx # Document viewer
│ └── api/documents/
│ ├── route.ts # GET /api/documents
│ ├── upload/route.ts # POST /api/documents/upload
│ └── [id]/route.ts # GET /api/documents/[id]
├── lib/
│ └── prisma.ts # Prisma client singleton
└── generated/
└── prisma/ # Generated Prisma client

---

Built with ☕ and Claude API
