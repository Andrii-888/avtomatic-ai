import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStorageProvider } from "@/lib/storage";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/documents/[id]">
) {
  try {
    const { id } = await ctx.params;
    const document = await prisma.document.findUnique({
      where: { id },
    });
    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ document });
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/documents/[id]">
) {
  try {
    const { id } = await ctx.params;

    const document = await prisma.document.findUnique({ where: { id } });
    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Удаляем файл из хранилища
    if (document.storageKey) {
      try {
        const storage = await getStorageProvider();
        await storage.delete(document.storageKey);
      } catch (e) {
        console.error("Storage delete error:", e);
      }
    }

    // Удаляем из БД
    await prisma.document.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
