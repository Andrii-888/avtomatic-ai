import type { MessageKey } from "./en";

// Deutsch
export const de: Record<MessageKey, string> = {
  "common.openDemo": "Demo öffnen",
  "common.tryDemo": "Demo testen",
  "common.howItWorks": "So funktioniert's",

  "nav.tagline": "KI-Dokumentenassistent",

  "hero.title": "Dokumenten-Intelligenz für Unternehmen",
  "hero.subtitle":
    "Vom PDF zu strukturierten Daten — lokal, ohne Daten irgendwohin zu senden.",

  "solve.title": "Was wir lösen",
  "solve.subtitle": "Von manueller Arbeit zur vollständigen Automatisierung.",

  "badge.live": "Live",
  "badge.inDevelopment": "In Entwicklung",
  "badge.roadmap": "Geplant",
  "card.tryIt": "Ausprobieren",

  "features.pdf.title": "Vom PDF zu strukturierten Daten",
  "features.pdf.desc": "Extrahiert automatisch Text aus jedem PDF.",
  "features.classify.title": "KI-Dokumentenklassifizierung",
  "features.classify.desc":
    "Erkennt Rechnungen, Verträge, Lebensläufe und Zeugnisse.",
  "features.extract.title": "Extraktion der Schlüsseldaten",
  "features.extract.desc":
    "Erfasst automatisch Beträge, Daten, Parteien und Namen.",
  "features.privacy.title": "Datenschutz durch lokale KI",
  "features.privacy.desc":
    "Daten verlassen Ihre Infrastruktur nie. Ollama läuft on-premise.",
  "features.summary.title": "Dokumentenzusammenfassung",
  "features.summary.desc":
    "Erhalten Sie die Kernpunkte, ohne das ganze Dokument zu lesen.",
  "features.status.title": "Automatische Statusaktualisierung",
  "features.status.desc":
    "Verarbeitungsstatus in Echtzeit, ohne die Seite neu zu laden.",
  "features.chat.title": "Mit dem Dokument chatten",
  "features.chat.desc":
    "Stellen Sie Fragen zu jedem Dokument in natürlicher Sprache.",
  "features.search.title": "Dokumentensuche",
  "features.search.desc":
    "Finden Sie jedes Dokument sofort über seinen Inhalt.",
  "features.cloud.title": "KI-Anbieter in der Cloud",
  "features.cloud.desc":
    "Optional Claude oder OpenAI für Kunden, die die Cloud bevorzugen.",
  "features.export.title": "Export nach Excel / CSV",
  "features.export.desc":
    "Laden Sie extrahierte Daten als sofort nutzbare Tabellen herunter.",
  "features.ocr.title": "OCR für gescannte Dokumente",
  "features.ocr.desc": "Verarbeitet gescannte PDFs und Bilder.",
  "features.erp.title": "ERP-/CRM-Integration",
  "features.erp.desc":
    "Exportiert strukturierte Daten direkt in Ihre Unternehmenstools.",

  "section.howItWorks": "So funktioniert's",
  "steps.upload.title": "PDF hochladen",
  "steps.upload.desc": "Ziehen Sie ein beliebiges Geschäftsdokument hierher.",
  "steps.analyze.title": "KI analysiert lokal",
  "steps.analyze.desc":
    "Ein lokales LLM extrahiert und klassifiziert die Daten auf Ihrem Server.",
  "steps.structured.title": "Strukturierte Daten erhalten",
  "steps.structured.desc":
    "Nutzen Sie die extrahierten Daten in Ihren Workflows.",

  "section.whoIsItFor": "Für wen ist es gedacht",
  "audience.fiduciaries.title": "Treuhänder",
  "audience.fiduciaries.desc":
    "Automatisiert die Verarbeitung von Rechnungen und Verträgen.",
  "audience.law.title": "Anwaltskanzleien",
  "audience.law.desc":
    "Extrahiert sofort die wichtigsten Vertragsklauseln.",
  "audience.hr.title": "HR-Teams",
  "audience.hr.desc":
    "Wertet Lebensläufe aus und extrahiert automatisch Bewerberdaten.",

  "privacy.title": "Ihre Daten verlassen Ihre Infrastruktur nie",
  "privacy.body":
    "Die Analyse läuft auf einem lokalen KI-Modell (Ollama) auf Ihrem eigenen Server. Keine Drittanbieter-Cloud, keine Daten werden irgendwohin gesendet — Ihre vertraulichen Dokumente bleiben dort, wo sie hingehören.",

  "footer.cta.title": "Bereit, Ihre Dokumente arbeiten zu lassen?",
  "footer.cta.subtitle":
    "Testen Sie den Assistenten mit Ihren eigenen PDFs — er läuft lokal, nichts verlässt Ihren Rechner.",
  "footer.brandDesc":
    "Dokumenten-Intelligenz für Unternehmen. Vom PDF zu strukturierten Daten — lokal, ohne Daten irgendwohin zu senden.",
  "footer.localAi": "Lokale KI · on-premise",
  "footer.product": "Produkt",
  "footer.features": "Funktionen",
  "footer.liveDemo": "Live-Demo",
  "footer.resources": "Ressourcen",
  "footer.privacy": "Datenschutz",
  "footer.builtForSmes": "Für KMU gemacht",

  "demo.documents": "Dokumente",
  "demo.noDocuments": "Noch keine Dokumente",
  "demo.noResults": "Keine Dokumente gefunden",
  "demo.uploadDocument": "Dokument hochladen",
  "demo.uploading": "Wird hochgeladen...",
  "demo.search": "Dokumente suchen...",
  "demo.emptySubtitle": "Laden Sie ein PDF hoch, um zu starten",
  "demo.uploadFirst": "Laden Sie Ihr erstes Dokument hoch",
  "demo.analyze": "Analysieren",
  "demo.analyzing": "Analyse...",
  "demo.fileTooLarge": "Datei zu groß (max. 15 MB).",
  "demo.uploadFailed": "Hochladen fehlgeschlagen.",

  "status.READY": "Bereit",
  "status.PROCESSING": "In Bearbeitung",
  "status.ERROR": "Fehler",
  "status.UPLOADED": "Hochgeladen",
  "status.document": "Dokument",

  "doc.back": "Zurück zu den Dokumenten",
  "doc.backShort": "Zurück",
  "doc.notFound": "Dokument nicht gefunden",
  "doc.loadFailed": "Dokument konnte nicht geladen werden",
  "doc.open": "Öffnen",
  "doc.download": "Herunterladen",
  "doc.previewUnavailable":
    "Die Vorschau ist auf diesem Gerät nicht verfügbar.",
  "doc.openPdf": "PDF öffnen",
  "doc.noFile": "Diesem Dokument ist keine Datei zugeordnet.",
  "doc.summary": "Zusammenfassung",
  "doc.aiAnalysis": "KI-Analyse",
  "doc.documentType": "Dokumententyp",
  "doc.language": "Sprache",
  "doc.confidence": "Konfidenz",
  "doc.extractedEntities": "Extrahierte Entitäten",
  "doc.analyzingDocument": "Dokument wird analysiert…",

  "docLang.it": "Italienisch",
  "docLang.de": "Deutsch",
  "docLang.en": "Englisch",
  "docLang.fr": "Französisch",
  "docLang.ru": "Russisch",
  "docLang.other": "Andere",

  "chat.title": "Mit dem Dokument chatten",
  "chat.placeholder": "Stelle eine Frage zu diesem Dokument…",
  "chat.send": "Senden",
  "chat.empty": "Frage alles über dieses Dokument.",
  "chat.error": "Es konnte keine Antwort abgerufen werden.",
  "chat.unavailable": "Der KI-Chat ist in dieser Umgebung nicht verfügbar.",

  "lang.label": "Sprache",
};
