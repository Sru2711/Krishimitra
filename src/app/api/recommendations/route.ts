import { NextResponse } from "next/server";
import { recommendation } from "./recommendation";
import { ai } from "@/src/lib/gemini";
import { recommendationPrompt } from "@/src/lib/prompts";

// export async function POST(req: Request) {
//   let recommend: { cropName: string; score: number }[] = [];
//   let body = await req.json();
//   if (!body) return NextResponse.json({ message: "" }, { status: 401 });
//   else {
//     const recData = await recommendation(body, recommend);
//     const input = {
//       recommendations: recData.slice(0, 5),
//       soil: {
//         soilType: body.soilType,
//         soilPH: body.soilPH,
//         fertilityLevel: body.fertilityLevel,
//         organicCarbon: body.organicCarbon,
//         nitrogen: body.nitrogen,
//         clayPercentage: body.clayPercentage,
//         sandPercentage: body.sandPercentage,
//         siltPercentage: body.siltPercentage,
//       },
//       weather: {
//         temperature: body.temperature,
//         humidity: body.humidity,
//         rainfall: body.rainfall,
//       },
//     };
//     try {
//       const response = await ai.models.generateContent({
//         model: "gemini-3.6-flash",
//         // model: "gemini-2.5-flash",
//         contents: JSON.stringify(input),
//         config: {
//           systemInstruction: recommendationPrompt,
//           responseMimeType: "application/json",
//         },
//       });

//       const text = response.text;

//       if (!text) {
//         throw new Error("Empty response from Gemini");
//       }
//       console.log("text", text);
//       return NextResponse.json(JSON.parse(text));
//     } catch (error) {
//       console.error(error);

//       return NextResponse.json(
//         { error: "Failed to generate recommendations." },
//         { status: 500 },
//       );
//     }
//   }
// }

export async function POST(req: Request) {
  let recommend: { cropName: string; score: number }[] = [];

  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        { message: "Request body is required." },
        { status: 400 },
      );
    }

    /*
     * ---------------------------------------------------------
     * STEP 1: GET NORMAL CROP RECOMMENDATIONS
     * ---------------------------------------------------------
     */

    const recData = await recommendation(body, recommend);

    /*
     * ---------------------------------------------------------
     * STEP 2: PREPARE GEMINI INPUT
     * ---------------------------------------------------------
     */

    const input = {
      recommendations: recData.slice(0, 5),

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

    /*
     * ---------------------------------------------------------
     * STEP 3: GEMINI RETRY
     * ---------------------------------------------------------
     */

    const maxRetries = 3;

    let response: any = null;
    let lastError: any = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `🤖 Gemini recommendation attempt ${attempt + 1}/${maxRetries + 1}`,
        );

        response = await ai.models.generateContent({
          model: "gemini-3.5-flash-lite",
          // model: "gemini-2.5-flash-lite",
          // If you later want to test another model:
          // model: "gemini-2.5-flash",

          contents: JSON.stringify(input),

          config: {
            systemInstruction: recommendationPrompt,
            responseMimeType: "application/json",
          },
        });

        /*
         * Gemini succeeded.
         */
        break;
      } catch (error: any) {
        lastError = error;

        const status =
          error?.status || error?.response?.status || error?.error?.code;

        console.error(
          `❌ Gemini recommendation attempt ${attempt + 1} failed:`,
          {
            status,
            message: error?.message,
          },
        );

        /*
         * Only retry temporary errors.
         */
        const retryable =
          status === 429 ||
          status === 500 ||
          status === 502 ||
          status === 503 ||
          status === 504;

        /*
         * Don't retry permanent errors.
         */
        if (!retryable) {
          break;
        }

        /*
         * Stop after final attempt.
         */
        if (attempt === maxRetries) {
          break;
        }

        /*
         * Exponential backoff:
         *
         * attempt 0 -> 2 seconds
         * attempt 1 -> 4 seconds
         * attempt 2 -> 8 seconds
         */
        const delay = 2000 * Math.pow(2, attempt);

        console.log(`⏳ Gemini unavailable. Retrying in ${delay}ms...`);

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    /*
     * ---------------------------------------------------------
     * STEP 4: IF GEMINI FAILED COMPLETELY
     * ---------------------------------------------------------
     */

    if (!response) {
      console.error(
        "❌ Gemini recommendation failed after all retries:",
        lastError,
      );

      const status =
        lastError?.status ||
        lastError?.response?.status ||
        lastError?.error?.code;

      if (
        status === 429 ||
        status === 503 ||
        status === 502 ||
        status === 504
      ) {
        return NextResponse.json(
          {
            error:
              "AI recommendation service is temporarily unavailable. Please try again.",
            retryable: true,
          },
          {
            status: 503,
          },
        );
      }

      return NextResponse.json(
        {
          error: "Failed to generate recommendations.",
          retryable: false,
        },
        {
          status: 500,
        },
      );
    }

    /*
     * ---------------------------------------------------------
     * STEP 5: READ GEMINI RESPONSE
     * ---------------------------------------------------------
     */

    const text = response.text;

    if (!text) {
      console.error("❌ Gemini returned an empty response.");

      return NextResponse.json(
        {
          error: "Gemini returned an empty recommendation response.",
          retryable: true,
        },
        {
          status: 503,
        },
      );
    }

    console.log("🤖 Gemini recommendation response:", text);

    /*
     * ---------------------------------------------------------
     * STEP 6: PARSE JSON SAFELY
     * ---------------------------------------------------------
     */

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(text);
    } catch (parseError) {
      console.error("❌ Failed to parse Gemini JSON:", parseError);

      console.error("❌ Raw Gemini response:", text);

      return NextResponse.json(
        {
          error: "AI returned an invalid recommendation response.",
          retryable: true,
        },
        {
          status: 502,
        },
      );
    }

    /*
     * ---------------------------------------------------------
     * STEP 7: RETURN SUCCESS
     * ---------------------------------------------------------
     */

    return NextResponse.json(parsedResponse, {
      status: 200,
    });
  } catch (error: any) {
    /*
     * ---------------------------------------------------------
     * GLOBAL ERROR
     * ---------------------------------------------------------
     */

    console.error("❌ RECOMMENDATION API ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message || "Failed to generate recommendations.",
        retryable: false,
      },
      {
        status: 500,
      },
    );
  }
}
