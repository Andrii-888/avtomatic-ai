import { prisma } from "@/lib/prisma";

export class DocumentService {
  async extractText(documentId: string): Promise<string> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) throw new Error("Document not found");
    if (!document.blobUrl) throw new Error("No file URL");

    // Скачиваем файл из Supabase по URL
    const response = await fetch(document.blobUrl);
    if (!response.ok) throw new Error("Failed to fetch file from storage");

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse");
    const parsed = await pdfParse(buffer);

    const content = parsed.text;
    const contentLength = content.length;

    await prisma.document.update({
      where: { id: documentId },
      data: { content, contentLength },
    });

    return content;
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
      await prisma.document.update({
        where: { id: documentId },
        data: {
          status: "ERROR",
          errorMsg: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }
}
