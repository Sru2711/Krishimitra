import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json(
      { message: "User Not Found" },
      { status: 400 }
    );
  }

  try {
    const { id: conversationId } = await params;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        farmerId: userId,
      },
      select: {
        id: true,
        title: true,
        messages: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json(conversation, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch conversation:", error);

    return NextResponse.json(
      { message: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}