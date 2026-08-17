import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { prisma } from "@/src/lib/prisma";
import { CHAT_MODEL } from "@/src/lib/openRouter/openrouterModel";
import { chat_PROMPT } from "@/src/lib/prompts";
import { openrouter } from "@/src/lib/openRouter/provider";
import { convertToModelMessages } from "ai";

// export async function POST(req: NextRequest) {
//   const userId = req.headers.get("x-user-id");

//   if (!userId) {
//     return NextResponse.json({ message: "User Not Found" }, { status: 400 });
//   }

//   try {
//     const { messages, conversationId } = await req.json();

//     console.log("messages from user guyss ^^^^", messages);

//     const modelMessages = await convertToModelMessages(messages);
//     const farmer = await prisma.farmer.findUnique({
//       where: {
//         id: userId,
//       },
//     });

//     const soil = await prisma.soilData.findFirst({
//       where: {
//         farmerId: userId,
//       },
//     });

//     const farmerContext = `
// Farmer Information:

// - Location: ${farmer?.district ?? "Unknown"}
// - State: ${farmer?.state ?? "Unknown"}
// - Latitude: ${farmer?.latitude ?? "Unknown"}
// - Longitude: ${farmer?.longtitude ?? "Unknown"}

// Soil Information:

// - Soil Type: ${soil?.soilType ?? "Unknown"}
// - Soil pH: ${soil?.soilPH ?? "Unknown"}
// - Fertility Level: ${soil?.fertilityLevel ?? "Unknown"}
// - Organic Carbon: ${soil?.organicCarbon ?? "Unknown"}
// - Nitrogen: ${soil?.nitrogen ?? "Unknown"}
// `;

//     const result = streamText({
//       model: openrouter(CHAT_MODEL),

//       system: `
// ${chat_PROMPT}

// Farmer Context:
// ${farmerContext}
// `,

//       messages: modelMessages,
//       onFinish: async ({ text }) => {
//         console.log("🔥 ON FINISH FIRED");

//         console.log("AI TEXT:");
//         console.log(text);

//         const updatedMessage = [
//           ...messages,
//           {
//             role: "assistant",
//             parts: [
//               {
//                 type: "text",
//                 text: text,
//               },
//             ],
//           },
//         ];

//         console.log("📦 UPDATED MESSAGE:");
//         console.dir(updatedMessage, { depth: null });

//         const conversation = await prisma.conversation.findFirst({
//           where: {
//             id: conversationId,
//             farmerId: userId,
//           },
//         });

//         console.log("🔎 CONVERSATION FOUND:");
//         console.dir(conversation, { depth: null });

//         if (!conversation) {
//           throw new Error(
//             `Conversation ${conversationId} not found for farmer ${userId}`,
//           );
//         }

//         const conversion = await prisma.conversation.update({
//           where: {
//             id: conversationId,
//           },
//           data: {
//             messages: updatedMessage,
//           },
//         });

//         console.log("✅ DB UPDATE SUCCESS");
//         console.log("conversation id:", conversion.id);

//         console.log("💾 STORED MESSAGES:");
//         console.dir(conversion.messages, { depth: null });
//       },
//     });
//     console.log("Final result $$$$", result);

//     return result.toUIMessageStreamResponse();
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: "Failed to generate response" },
//       { status: 500 },
//     );
//   }
// }

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
 
  
  

  if (!userId) {
    return NextResponse.json({ message: "User Not Found" }, { status: 400 });
  }

  try {
    const { messages, converstaionalId } = await req.json();
    console.log("========== CHAT REQUEST ==========");
  console.log(JSON.stringify(messages, null, 2));
  console.log("===================================");

    const modelMessages = await convertToModelMessages(messages);

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

      messages: modelMessages,

      onFinish: async ({ text }) => {
        try {
          console.log("🔥 ON FINISH");

          const conversation = await prisma.conversation.findFirst({
            where: {
              id: converstaionalId,
              farmerId: userId,
            },
          });

          if (!conversation) {
            throw new Error("Conversation not found");
          }

          const existingMessages = Array.isArray(conversation.messages)
            ? conversation.messages
            : [];

          console.log("📦 EXISTING DB MESSAGES:", existingMessages.length);

          const existingIds = new Set(
            existingMessages.map((message: any) => message.id),
          );

          // Only add messages that aren't already stored
          const newMessages = messages.filter(
            (message: any) => !message.id || !existingIds.has(message.id),
          );

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

          const updatedMessages = [
            ...existingMessages,
            ...newMessages,
            assistantMessage,
          ];

          console.log("💾 FINAL MESSAGES:", updatedMessages.length);

          await prisma.conversation.update({
            where: {
              id: conversation.id,
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
    console.error("❌ CHAT ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to generate response",
      },
      {
        status: 500,
      },
    );
  }
}
