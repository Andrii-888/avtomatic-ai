import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { extractText } from "unpdf";
import { getAIProvider } from "@/lib/ai";

export class DocumentService {
  async extractText(documentId: string): Promise<string> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) throw new Error("Document not found");
    if (!document.blobUrl) throw new Error("No file URL");

    const response = await fetch(document.blobUrl);
    if (!response.ok) throw new Error(`Failed to fetch file: ${response.status}`);

    const arrayBuffer = await response.arrayBuffer();

    // unpdf ships a serverless build of PDF.js, so no DOMMatrix polyfill is needed.
    const { text } = await extractText(new Uint8Array(arrayBuffer), {
      mergePages: true,
    });

    await prisma.document.update({
      where: { id: documentId },
      data: { content: text, contentLength: text.length },
    });

    return text;
  }

  async analyzeWithAI(
    documentId: string,
    text: string,
    filename: string
  ): Promise<void> {
    const ai = getAIProvider();

    // Skip analysis when no provider is configured or there's too little text.
    if (!ai || text.length < 50) {
      console.log("[ANALYZE] Skipped", documentId, {
        hasProvider: Boolean(ai),
        textLength: text.length,
      });
      return;
    }

    const analysis = await ai.analyzeDocument({ text, filename });

    await prisma.document.update({
      where: { id: documentId },
      data: { type: analysis.documentType, summary: analysis.summary },
    });

    // Persist structured fields (language, confidence, entities) in Extraction.
    await prisma.extraction.deleteMany({ where: { documentId } });
    await prisma.extraction.create({
      data: { documentId, data: analysis as unknown as Prisma.InputJsonValue },
    });
  }

  async process(documentId: string): Promise<void> {
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "PROCESSING" },
    });

    try {
      const text = await this.extractText(documentId);

      const document = await prisma.document.findUnique({
        where: { id: documentId },
        select: { title: true },
      });
      await this.analyzeWithAI(documentId, text, document?.title ?? "");

      await prisma.document.update({
        where: { id: documentId },
        data: { status: "READY" },
      });
    } catch (error) {
      console.error("[PROCESS] ERROR", documentId, error);
      await prisma.document.update({
        where: { id: documentId },
        data: {
          status: "ERROR",
          errorMsg: error instanceof Error ? error.message : String(error),
        },
      });
      throw error;
    }
  }
}
