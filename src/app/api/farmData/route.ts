import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 1. Get the userId from the header injected by your middleware
  const userId = request.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized: Missing User ID" },
      { status: 401 },
    );
  }

  try {
    // 2. AWAIT the Prisma call
    const farmData = await prisma.farmDataHistory.findMany({
      where: { farmerId: userId },
    });

    // 3. Return the data
    return NextResponse.json(
      {
        message: "Fetched successfully",
        data: farmData,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Something went wrong: ${error}` },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  let userId = request.headers.get("x-user-id");
  let body = await request.json();
  if (!userId) {
    return NextResponse.json({ message: `User id missing` }, { status: 401 });
  }
  if (!body || Object.keys(body).length === 0) {
    return NextResponse.json(
      { message: `Data to be saved is not available` },
      { status: 401 },
    );
  } else {
    try {
      const { createdAt, updatedAt, ...data } = body;
      const newData = await prisma.farmDataHistory.create({
        data: {
          ...data,
          cropYield: Number(data.cropYield),
          price: Number(data.price),
          earned: Number(data.earned),
          farmerId:userId,
          // farmer: {
          //   connect: {
          //     id: userId!,
          //   },
          // },
        },
      });
      return NextResponse.json(
        { message: `Added Successfully`, newData },
        { status: 200 },
      );
    } catch (error) {
      return NextResponse.json({ message: `Error: ${error}` }, { status: 401 });
    }
  }
}
