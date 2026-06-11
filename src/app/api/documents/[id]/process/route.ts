import { NextRequest, NextResponse, after } from "next/server";
import { prisma } from "@/lib/prisma";
import { DocumentService } from "@/lib/services/document.service";

const documentService = new DocumentService();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Flip to PROCESSING synchronously so clients that start polling
    // immediately see the new state.
    await prisma.document.update({
      where: { id },
      data: { status: "PROCESSING", errorMsg: null },
    });

    // Run the (potentially slow) pipeline in the background after the response
    // is sent — reliable on Vercel Fluid Compute via after().
    after(async () => {
      try {
        await documentService.process(id);
      } catch (e) {
        console.error("[process] background error", id, e);
      }
    });

    return NextResponse.json({ status: "PROCESSING" }, { status: 202 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
