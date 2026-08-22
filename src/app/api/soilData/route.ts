import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import argon2 from "argon2";
import { generateToken } from "../helper";

// export async function POST(req: Request) {
//   let body = await req.json();
//   if (!body || Object.keys(body).length === 0) {
//     return NextResponse.json(
//       { message: "Error while retrieving your soil data" },
//       { status: 400 },
//     );
//   } else {
//     try {
//       let userId = req.headers.get("x-user-id");
//       if (!userId) {
//         return NextResponse.json(
//           { message: "User ID is missing." },
//           { status: 401 },
//         );
//       }
//       const newData = await prisma.soilData.create({
//         data: {
//           farmerId: userId,
//           soilType: body.soilType,
//           fertilityLevel: body.fertilityLevel,
//           soilPH: body.soilPH,
//           organicCarbon: body.organicCarbon,
//           clayPercentage: body.clayPercentage,
//           sandPercentage: body.sandPercentage,
//           siltPercentage: body.siltPercentage,
//           cationExchangeCapacity: body.cationExchangeCapacity,
//           nitrogen: body.nitrogen,
//           bulkDensity: body.bulkDensity,
//           coarseFragments: body.coarseFragments,
//           apiProvider: body.apiProvider,
//           lastFetchedAt: new Date(),
//         },
//       });
//       return NextResponse.json({
//         message: "Your soil information is stored with us",
//       });
//     } catch (error) {
//       return NextResponse.json({
//         message: `Your soil information is stored with us ${error}`,
//       });
//     }
//   }
// }

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("🌱 SOIL API BODY:", body);

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Soil data is empty",
        },
        { status: 400 }
      );
    }

    /*
     * DO NOT REMOVE THIS.
     *
     * Your middleware is responsible for putting
     * x-user-id into the request.
     */
    const userId = req.headers.get("x-user-id");

    console.log("🌱 SOIL API USER ID:", userId);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is missing.",
        },
        { status: 401 }
      );
    }

    /*
     * Check whether this farmer already has soil data.
     *
     * We are NOT changing your database schema.
     * This simply makes the endpoint retry-safe.
     */
    const existingSoil = await prisma.soilData.findFirst({
      where: {
        farmerId: userId,
      },
    });

    let soilData;

    if (existingSoil) {
      /*
       * Soil already exists.
       *
       * This means this request is a RETRY.
       * Update the existing soil record instead
       * of creating another one.
       */
      console.log(
        "🔄 EXISTING SOIL FOUND. UPDATING:",
        existingSoil.id
      );

      soilData = await prisma.soilData.update({
        where: {
          id: existingSoil.id,
        },
        data: {
          soilType: body.soilType,
          fertilityLevel: body.fertilityLevel,
          soilPH: body.soilPH,
          organicCarbon: body.organicCarbon,
          clayPercentage: body.clayPercentage,
          sandPercentage: body.sandPercentage,
          siltPercentage: body.siltPercentage,
          cationExchangeCapacity:
            body.cationExchangeCapacity,
          nitrogen: body.nitrogen,
          bulkDensity: body.bulkDensity,
          coarseFragments: body.coarseFragments,
          apiProvider: body.apiProvider,
          lastFetchedAt: new Date(),
        },
      });
    } else {
      /*
       * First successful soil collection.
       */
      console.log(
        "🌱 NO EXISTING SOIL. CREATING NEW RECORD."
      );

      soilData = await prisma.soilData.create({
        data: {
          farmerId: userId,
          soilType: body.soilType,
          fertilityLevel: body.fertilityLevel,
          soilPH: body.soilPH,
          organicCarbon: body.organicCarbon,
          clayPercentage: body.clayPercentage,
          sandPercentage: body.sandPercentage,
          siltPercentage: body.siltPercentage,
          cationExchangeCapacity:
            body.cationExchangeCapacity,
          nitrogen: body.nitrogen,
          bulkDensity: body.bulkDensity,
          coarseFragments: body.coarseFragments,
          apiProvider: body.apiProvider,
          lastFetchedAt: new Date(),
        },
      });
    }

    console.log("✅ SOIL SAVED:", soilData);

    return NextResponse.json(
      {
        success: true,
        message: "Your soil information is stored with us",
        soilData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ SOIL API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to store soil information",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}
