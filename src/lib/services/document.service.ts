import { prisma } from "@/lib/prisma";
import { extractText } from "unpdf";

export class DocumentService {
  async extractText(documentId: string): Promise<string> {
    console.log("[PROCESS] Start", documentId);

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) throw new Error("Document not found");
    if (!document.blobUrl) throw new Error("No file URL");

    console.log("[PROCESS] Downloading file", document.blobUrl);
    const response = await fetch(document.blobUrl);
    console.log("[PROCESS] Download status", response.status);
    if (!response.ok) throw new Error(`Failed to fetch file: ${response.status}`);

    const arrayBuffer = await response.arrayBuffer();
    console.log("[PROCESS] File size", arrayBuffer.byteLength);

    console.log("[PROCESS] Extracting text");
    console.time("pdf");
    const { text } = await extractText(new Uint8Array(arrayBuffer), {
      mergePages: true,
    });
    console.timeEnd("pdf");
    console.log("[PROCESS] Text extracted", text.length);

    console.log("[PROCESS] Saving to DB");
    await prisma.document.update({
      where: { id: documentId },
      data: { content: text, contentLength: text.length },
    });

    console.log("[PROCESS] READY");
    return text;
  }

  async process(documentId: string): Promise<void> {
    console.log("[PROCESS] Status => PROCESSING");
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "PROCESSING" },
    });

    try {
      await this.extractText(documentId);
      console.log("[PROCESS] Status => READY");
      await prisma.document.update({
        where: { id: documentId },
        data: { status: "READY" },
      });
    } catch (error) {
      console.error("[PROCESS] ERROR", error);
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
