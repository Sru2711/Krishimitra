import { ai } from "@/src/lib/gemini";
import { fieldAlertPrompt } from "@/src/lib/prompts";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body = await req.json();

  if (!body)
    NextResponse.json(
      { message: "Cannot find any info sorry!" },
      { status: 400 },
    );
  else {
    const input = {
      soil: {
        soilType: body.soilType,
        soilPH: body.soilPH,
        fertilityLevel: body.fertilityLevel,
        organicCarbon: body.organicCarbon,
        nitrogen: body.nitrogen,
        clayPercentage: body.clayPercentage,
        sandPercentage: body.sandPercentage,
        siltPercentage: body.siltPercentage,
      },
      weather: {
        temperature: body.temperature,
        humidity: body.humidity,
        rainfall: body.rainfall,
      },
    };
    try {
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: JSON.stringify(input),
        config: {
          systemInstruction: fieldAlertPrompt,
          responseMimeType: "application/json",
        },
      });

      const text = response.text;

      if (!text) {
        throw new Error("Empty response from Gemini");
      }
      return NextResponse.json(JSON.parse(text));
    } catch (error) {
      console.error(error);

      return NextResponse.json(
        { error: "Failed to generate warning." },
        { status: 500 },
      );
    }
  }
}
