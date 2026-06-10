import { prisma } from "@/lib/prisma";

export class DocumentService {
  async extractText(documentId: string): Promise<string> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) throw new Error("Document not found");
    if (!document.blobUrl) throw new Error("No file URL");

    const response = await fetch(document.blobUrl);
    if (!response.ok) throw new Error("Failed to fetch file from storage");

    const arrayBuffer = await response.arrayBuffer();

    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "";

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let content = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      content +=
        textContent.items
          .map((item: any) => ("str" in item ? item.str : ""))
          .join(" ") + "\n";
    }

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
