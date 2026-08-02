import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import argon2 from "argon2";
import { generateToken } from "../helper";

export async function POST(req: Request) {
  let body = await req.json();
  if (!body || Object.keys(body).length === 0) {
    return NextResponse.json(
      { message: "Error while retrieving your soil data" },
      { status: 400 },
    );
  } else {
    try {
      let userId = req.headers.get("x-user-id");
      if (!userId) {
        return NextResponse.json(
          { message: "User ID is missing." },
          { status: 401 },
        );
      }
      const newData = await prisma.soilData.create({
        data: {
          farmerId: userId,
          soilType: body.soilType,
          fertilityLevel: body.fertilityLevel,
          soilPH: body.soilPH,
          organicCarbon: body.organicCarbon,
          clayPercentage: body.clayPercentage,
          sandPercentage: body.sandPercentage,
          siltPercentage: body.siltPercentage,
          cationExchangeCapacity: body.cationExchangeCapacity,
          nitrogen: body.nitrogen,
          bulkDensity: body.bulkDensity,
          coarseFragments: body.coarseFragments,
          apiProvider: body.apiProvider,
          lastFetchedAt: new Date(),
        },
      });
      return NextResponse.json({
        message: "Your soil information is stored with us",
      });
    } catch (error) {
      return NextResponse.json({
        message: `Your soil information is stored with us ${error}`,
      });
    }
  }
}
