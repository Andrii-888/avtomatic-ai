import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export class DocumentService {
  async extractText(documentId: string): Promise<string> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) throw new Error("Document not found");
    if (!document.storageKey) throw new Error("No storage key");

    // Читаем файл локально (для local provider)
    const filePath = path.join(process.cwd(), "public", document.storageKey);
    const buffer = fs.readFileSync(filePath);

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
