// English — source of truth. The keys defined here are enforced (via MessageKey)
// across every other locale, so all languages stay structurally in sync.
export const en = {
  // common / CTAs
  "common.openDemo": "Open Demo",
  "common.tryDemo": "Try Demo",
  "common.howItWorks": "How it works",

  // nav
  "nav.tagline": "AI Document Assistant",

  // hero
  "hero.title": "Document Intelligence for Business",
  "hero.subtitle":
    "From PDF to structured data — locally, without sending data anywhere.",

  // "What we solve"
  "solve.title": "What we solve",
  "solve.subtitle": "From manual work to full automation.",

  // status badges on cards
  "badge.live": "Live",
  "badge.inDevelopment": "In Development",
  "badge.roadmap": "Roadmap",
  "card.tryIt": "Try it",

  // feature cards
  "features.pdf.title": "PDF to Structured Data",
  "features.pdf.desc": "Extract text from any PDF automatically.",
  "features.classify.title": "AI Document Classification",
  "features.classify.desc": "Detect invoice, contract, CV, certificate.",
  "features.extract.title": "Key Data Extraction",
  "features.extract.desc": "Pull amounts, dates, parties, names automatically.",
  "features.privacy.title": "Local AI Privacy",
  "features.privacy.desc":
    "Data never leaves your infrastructure. Ollama runs on-premise.",
  "features.summary.title": "Document Summary",
  "features.summary.desc":
    "Get the key points without reading the full document.",
  "features.status.title": "Auto Status Updates",
  "features.status.desc": "Real-time processing status without page refresh.",
  "features.chat.title": "Chat with Document",
  "features.chat.desc":
    "Ask questions about any document in natural language.",
  "features.search.title": "Document Search",
  "features.search.desc": "Find any document by its content instantly.",
  "features.cloud.title": "Cloud AI Providers",
  "features.cloud.desc":
    "Optional Claude or OpenAI for clients who prefer cloud.",
  "features.export.title": "Export to Excel / CSV",
  "features.export.desc":
    "Download extracted data as ready-to-use spreadsheets.",
  "features.ocr.title": "OCR for Scanned Documents",
  "features.ocr.desc": "Process scanned PDFs and images.",
  "features.erp.title": "ERP/CRM Integration",
  "features.erp.desc": "Export structured data directly to your business tools.",

  // how it works
  "section.howItWorks": "How it works",
  "steps.upload.title": "Upload PDF",
  "steps.upload.desc": "Drag and drop any business document.",
  "steps.analyze.title": "AI Analyzes Locally",
  "steps.analyze.desc":
    "Local LLM extracts and classifies data on your server.",
  "steps.structured.title": "Get Structured Data",
  "steps.structured.desc": "Use extracted data in your workflows.",

  // who is it for
  "section.whoIsItFor": "Who is it for",
  "audience.fiduciaries.title": "Fiduciaries",
  "audience.fiduciaries.desc": "Automate invoice and contract processing.",
  "audience.law.title": "Law Firms",
  "audience.law.desc": "Extract key terms from contracts instantly.",
  "audience.hr.title": "HR Teams",
  "audience.hr.desc": "Parse CVs and extract candidate data automatically.",

  // privacy section
  "privacy.title": "Your data never leaves your infrastructure",
  "privacy.body":
    "Analysis runs on a local AI model (Ollama) on your own server. No third-party cloud, no data sent anywhere — your confidential documents stay where they belong.",

  // footer
  "footer.cta.title": "Ready to put your documents to work?",
  "footer.cta.subtitle":
    "Try the assistant on your own PDFs — it runs locally, nothing leaves your machine.",
  "footer.brandDesc":
    "Document intelligence for business. From PDF to structured data — locally, without sending data anywhere.",
  "footer.localAi": "Local AI · on-premise",
  "footer.product": "Product",
  "footer.features": "Features",
  "footer.liveDemo": "Live demo",
  "footer.resources": "Resources",
  "footer.privacy": "Privacy",
  "footer.builtForSmes": "Built for SMEs",

  // demo workspace
  "demo.documents": "Documents",
  "demo.noDocuments": "No documents yet",
  "demo.uploadDocument": "Upload Document",
  "demo.uploading": "Uploading...",
  "demo.search": "Search documents...",
  "demo.emptySubtitle": "Upload a PDF to get started",
  "demo.uploadFirst": "Upload your first document",
  "demo.analyze": "Analyze",
  "demo.analyzing": "Analyzing...",
  "demo.fileTooLarge": "File too large (max 15 MB).",
  "demo.uploadFailed": "Upload failed.",

  // document status labels
  "status.READY": "Ready",
  "status.PROCESSING": "Processing",
  "status.ERROR": "Error",
  "status.UPLOADED": "Uploaded",
  "status.document": "Document",

  // document viewer
  "doc.back": "Back to documents",
  "doc.backShort": "Back",
  "doc.notFound": "Document not found",
  "doc.loadFailed": "Failed to load document",
  "doc.open": "Open",
  "doc.download": "Download",
  "doc.previewUnavailable": "Preview isn't available on this device.",
  "doc.openPdf": "Open PDF",
  "doc.noFile": "No file attached to this document.",
  "doc.summary": "Summary",
  "doc.aiAnalysis": "AI Analysis",
  "doc.documentType": "Document type",
  "doc.language": "Language",
  "doc.confidence": "Confidence",
  "doc.extractedEntities": "Extracted entities",
  "doc.analyzingDocument": "Analyzing document…",

  // detected document language labels
  "docLang.it": "Italian",
  "docLang.de": "German",
  "docLang.en": "English",
  "docLang.fr": "French",
  "docLang.ru": "Russian",
  "docLang.other": "Other",

  // language switcher
  "lang.label": "Language",
} as const;

export type MessageKey = keyof typeof en;
