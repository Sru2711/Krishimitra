import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { prisma } from "@/src/lib/prisma";
import { CHAT_MODEL } from "@/src/lib/openRouter/openrouterModel";
import { chat_PROMPT } from "@/src/lib/prompts";
import { openrouter } from "@/src/lib/openRouter/provider";


export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json(
      { message: "User Not Found" },
      { status: 400 }
    );
  }

  try {
    const { messages } = await req.json();

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

      messages,
    });

    return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to generate response" },
      { status: 500 }
    );
  }
}