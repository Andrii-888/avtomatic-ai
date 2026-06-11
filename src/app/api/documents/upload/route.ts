import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStorageProvider } from "@/lib/storage";

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 15 MB)" },
        { status: 413 }
      );
    }

    const storage = await getStorageProvider();

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
