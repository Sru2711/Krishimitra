import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ message: "User not found" }, { status: 400 });
  } else {
    try {
      const conversationIdResponse = await prisma.conversation.create({
        data: {
          farmerId: userId,
        },
      });
      return NextResponse.json(
        { conversationId: conversationIdResponse },
        { status: 200 },
      );
    } catch (error) {
      console.error("Failed to create conversation:", error);
      return NextResponse.json(
        { message: "Could not create conversationalId" },
        { status: 400 },
      );
    }
  }
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json(
      { message: "User Not Found" },
      { status: 400 }
    );
  }

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        farmerId: userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(conversations, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch conversations:", error);

    return NextResponse.json(
      { message: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}