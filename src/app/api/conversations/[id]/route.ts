import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { convertToModelMessages, streamText } from "ai";
import { CHAT_MODEL } from "@/src/lib/openRouter/openrouterModel";
import { chat_PROMPT } from "@/src/lib/prompts";
import { openrouter } from "@/src/lib/openRouter/provider";

// Get one single convo
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ message: "User Not Found" }, { status: 400 });
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
        { status: 404 },
      );
    }

    return NextResponse.json(conversation, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch conversation:", error);

    return NextResponse.json(
      { message: "Failed to fetch conversation" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json(
      { message: "User Not found, please login again" },
      { status: 400 },
    );
  }

  try {
    const { id: conversationalId } = await params;

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { message: "Message is required" },
        { status: 400 },
      );
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationalId,
        farmerId: userId,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation not found" },
        { status: 404 },
      );
    }

    const existingMessages = Array.isArray(conversation.messages)
      ? conversation.messages
      : [];

    /*
     * Build the complete conversation for the AI.
     *
     * Existing DB messages
     * +
     * new user message
     */
    const messagesForAI = [
      ...existingMessages,
      message,
    ];

    const convertedMessages =
      await convertToModelMessages(messagesForAI);

    const farmer = await prisma.farmer.findUnique({
      where: {
        id: userId,
      },
    });

    const soil = await prisma.soilData.findFirst({
      where: {
        farmerId: userId,
      },
    });

    const farmerContext = `
Farmer Information:

- Location: ${farmer?.district ?? "Unknown"}
- State: ${farmer?.state ?? "Unknown"}
- Latitude: ${farmer?.latitude ?? "Unknown"}
- Longitude: ${farmer?.longtitude ?? "Unknown"}

Soil Information:

- Soil Type: ${soil?.soilType ?? "Unknown"}
- Soil pH: ${soil?.soilPH ?? "Unknown"}
- Fertility Level: ${soil?.fertilityLevel ?? "Unknown"}
- Organic Carbon: ${soil?.organicCarbon ?? "Unknown"}
- Nitrogen: ${soil?.nitrogen ?? "Unknown"}
`;

    const result = streamText({
      model: openrouter(CHAT_MODEL),

      system: `
${chat_PROMPT}

Farmer Context:
${farmerContext}
`,

      messages: convertedMessages,

      onFinish: async ({ text }) => {
        try {
          const assistantMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            parts: [
              {
                type: "text",
                text,
              },
            ],
          };

          /*
           * Save:
           *
           * old messages
           * +
           * new user message
           * +
           * new assistant response
           */
          const updatedMessages = [
            ...existingMessages,
            message,
            assistantMessage,
          ];

          await prisma.conversation.update({
            where: {
              id: conversationalId,
            },
            data: {
              messages: updatedMessages,
            },
          });

          console.log("✅ CONVERSATION SAVED");
        } catch (error) {
          console.error("❌ FAILED TO SAVE:", error);
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("❌ PATCH ERROR:", error);

    return NextResponse.json(
      {
        message: "Could not update your message",
      },
      {
        status: 400,
      },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json(
      { message: "Could not delete, user not found" },
      { status: 400 },
    );
  }

  try {
    const { id } = await params;

    await prisma.conversation.delete({
      where: {
        id,
        farmerId: userId,
      },
    });

    return NextResponse.json(
      { message: "Conversation deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete conversation error:", error);

    return NextResponse.json(
      { message: "Could not delete conversation" },
      { status: 500 },
    );
  }
}
