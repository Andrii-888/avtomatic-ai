import type { MessageKey } from "./en";

// Italiano
export const it: Record<MessageKey, string> = {
  "common.openDemo": "Apri la demo",
  "common.tryDemo": "Prova la demo",
  "common.howItWorks": "Come funziona",

  "nav.tagline": "Assistente documentale IA",

  "hero.title": "Intelligenza documentale per le aziende",
  "hero.subtitle":
    "Dal PDF ai dati strutturati — in locale, senza inviare dati da nessuna parte.",

  "solve.title": "Cosa risolviamo",
  "solve.subtitle": "Dal lavoro manuale all'automazione completa.",

  "badge.live": "Attivo",
  "badge.inDevelopment": "In sviluppo",
  "badge.roadmap": "In programma",
  "card.tryIt": "Provalo",

  "features.pdf.title": "Dal PDF ai dati strutturati",
  "features.pdf.desc": "Estrai automaticamente il testo da qualsiasi PDF.",
  "features.classify.title": "Classificazione documenti con IA",
  "features.classify.desc":
    "Riconosce fatture, contratti, CV e certificati.",
  "features.extract.title": "Estrazione dei dati chiave",
  "features.extract.desc":
    "Ricava automaticamente importi, date, parti e nomi.",
  "features.privacy.title": "Privacy con IA locale",
  "features.privacy.desc":
    "I dati non lasciano mai la tua infrastruttura. Ollama gira on-premise.",
  "features.summary.title": "Sintesi del documento",
  "features.summary.desc":
    "Ottieni i punti chiave senza leggere l'intero documento.",
  "features.status.title": "Aggiornamenti di stato automatici",
  "features.status.desc":
    "Stato di elaborazione in tempo reale, senza ricaricare la pagina.",
  "features.chat.title": "Chatta con il documento",
  "features.chat.desc":
    "Fai domande su qualsiasi documento in linguaggio naturale.",
  "features.search.title": "Ricerca nei documenti",
  "features.search.desc":
    "Trova qualsiasi documento dal suo contenuto in un istante.",
  "features.cloud.title": "Provider IA in cloud",
  "features.cloud.desc":
    "Claude o OpenAI opzionali per chi preferisce il cloud.",
  "features.export.title": "Esportazione in Excel / CSV",
  "features.export.desc":
    "Scarica i dati estratti come fogli di calcolo pronti all'uso.",
  "features.ocr.title": "OCR per documenti scansionati",
  "features.ocr.desc": "Elabora PDF scansionati e immagini.",
  "features.erp.title": "Integrazione ERP/CRM",
  "features.erp.desc":
    "Esporta i dati strutturati direttamente nei tuoi strumenti aziendali.",

  "section.howItWorks": "Come funziona",
  "steps.upload.title": "Carica il PDF",
  "steps.upload.desc": "Trascina qui qualsiasi documento aziendale.",
  "steps.analyze.title": "L'IA analizza in locale",
  "steps.analyze.desc":
    "Un LLM locale estrae e classifica i dati sul tuo server.",
  "steps.structured.title": "Ottieni dati strutturati",
  "steps.structured.desc": "Usa i dati estratti nei tuoi flussi di lavoro.",

  "section.whoIsItFor": "A chi è rivolto",
  "audience.fiduciaries.title": "Fiduciari",
  "audience.fiduciaries.desc":
    "Automatizza l'elaborazione di fatture e contratti.",
  "audience.law.title": "Studi legali",
  "audience.law.desc":
    "Estrai all'istante le clausole chiave dai contratti.",
  "audience.hr.title": "Team HR",
  "audience.hr.desc":
    "Analizza i CV ed estrai automaticamente i dati dei candidati.",

  "privacy.title": "I tuoi dati non lasciano mai la tua infrastruttura",
  "privacy.body":
    "L'analisi avviene su un modello IA locale (Ollama) sul tuo server. Nessun cloud di terze parti, nessun dato inviato altrove — i tuoi documenti riservati restano dove devono stare.",

  "footer.cta.title": "Pronto a mettere al lavoro i tuoi documenti?",
  "footer.cta.subtitle":
    "Prova l'assistente sui tuoi PDF — gira in locale, nulla esce dal tuo computer.",
  "footer.brandDesc":
    "Intelligenza documentale per le aziende. Dal PDF ai dati strutturati — in locale, senza inviare dati da nessuna parte.",
  "footer.localAi": "IA locale · on-premise",
  "footer.product": "Prodotto",
  "footer.features": "Funzionalità",
  "footer.liveDemo": "Demo dal vivo",
  "footer.resources": "Risorse",
  "footer.privacy": "Privacy",
  "footer.builtForSmes": "Pensato per le PMI",

  "demo.documents": "Documenti",
  "demo.noDocuments": "Ancora nessun documento",
  "demo.uploadDocument": "Carica documento",
  "demo.uploading": "Caricamento...",
  "demo.search": "Cerca documenti...",
  "demo.emptySubtitle": "Carica un PDF per iniziare",
  "demo.uploadFirst": "Carica il tuo primo documento",
  "demo.analyze": "Analizza",
  "demo.analyzing": "Analisi...",
  "demo.fileTooLarge": "File troppo grande (max 15 MB).",
  "demo.uploadFailed": "Caricamento non riuscito.",

  "status.READY": "Pronto",
  "status.PROCESSING": "In elaborazione",
  "status.ERROR": "Errore",
  "status.UPLOADED": "Caricato",
  "status.document": "Documento",

  "doc.back": "Torna ai documenti",
  "doc.backShort": "Indietro",
  "doc.notFound": "Documento non trovato",
  "doc.loadFailed": "Impossibile caricare il documento",
  "doc.open": "Apri",
  "doc.download": "Scarica",
  "doc.previewUnavailable":
    "L'anteprima non è disponibile su questo dispositivo.",
  "doc.openPdf": "Apri il PDF",
  "doc.noFile": "Nessun file allegato a questo documento.",
  "doc.summary": "Sintesi",
  "doc.aiAnalysis": "Analisi IA",
  "doc.documentType": "Tipo di documento",
  "doc.language": "Lingua",
  "doc.confidence": "Affidabilità",
  "doc.extractedEntities": "Entità estratte",
  "doc.analyzingDocument": "Analisi del documento…",

  "docLang.it": "Italiano",
  "docLang.de": "Tedesco",
  "docLang.en": "Inglese",
  "docLang.fr": "Francese",
  "docLang.ru": "Russo",
  "docLang.other": "Altro",

  "chat.title": "Chatta con il documento",
  "chat.placeholder": "Fai una domanda su questo documento…",
  "chat.send": "Invia",
  "chat.empty": "Chiedi qualsiasi cosa su questo documento.",
  "chat.error": "Impossibile ottenere una risposta.",
  "chat.unavailable": "La chat IA non è disponibile in questo ambiente.",

  "lang.label": "Lingua",
};
