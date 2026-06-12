import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAIProvider } from "@/lib/ai";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const messages = await prisma.chatMessage.findMany({
    where: { documentId: id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ messages });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const document = await prisma.document.findUnique({ where: { id } });
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }
    if (!document.content) {
      return NextResponse.json(
        { error: "Document has no extracted content yet" },
        { status: 400 }
      );
    }

    const ai = getAIProvider();
    if (!ai) {
      return NextResponse.json({ error: "AI not available" }, { status: 503 });
    }

    // Persist the user message before calling the model.
    await prisma.chatMessage.create({
      data: { documentId: id, role: "user", content: message },
    });

    const answer = await ai.chat({ content: document.content, message });

    const assistant = await prisma.chatMessage.create({
      data: { documentId: id, role: "assistant", content: answer },
    });

    return NextResponse.json({ message: assistant });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Chat failed" },
      { status: 500 }
    );
  }
}
