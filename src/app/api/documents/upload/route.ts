import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStorageProvider } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files allowed" },
        { status: 400 }
      );
    }

    const storage = getStorageProvider();

    const { key, url } = await storage.upload(file, {
      filename: file.name,
      contentType: file.type,
      size: file.size,
    });

    const document = await prisma.document.create({
      data: {
        title: file.name,
        storageKey: key,
        blobUrl: url,
        status: "UPLOADED",
      },
    });

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
