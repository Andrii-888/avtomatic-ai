import { prisma } from "@/lib/prisma";
import { extractText } from "unpdf";

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

  async process(documentId: string): Promise<void> {
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "PROCESSING" },
    });

    try {
      await this.extractText(documentId);
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
