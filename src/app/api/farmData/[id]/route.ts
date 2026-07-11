import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const cropId = params.id;
  const userId = request.headers.get("x-user-id");
  if (!cropId) {
    return NextResponse.json(
      { message: "Unauthorized: Missing Crop ID" },
      { status: 401 },
    );
  }
  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized: Missing User ID" },
      { status: 401 },
    );
  } else {
    try {
      const crop = prisma.farmDataHistory.findMany({
        where: {
          farmerId: userId,
          id: cropId,
        },
      });
      if (!crop)
        return NextResponse.json(
          { message: "Record not found" },
          { status: 404 },
        );
      return NextResponse.json(
        { message: "Got the crop history successfully", crop },
        { status: 200 },
      );
    } catch (error) {
      return NextResponse.json({ message: `${error}` }, { status: 401 });
    }
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  let body = await request.json();
  let userId = request.headers.get("x-user-id");

  let responseParams = await params;
  let cropId = responseParams.id;

  if (!cropId) {
    return NextResponse.json(
      { message: "Unauthorized: Missing Crop ID" },
      { status: 401 },
    );
  }
  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized: Missing User ID" },
      { status: 401 },
    );
  }
  if (!body) {
    return NextResponse.json(
      { message: "No data provided for update" },
      { status: 401 },
    );
  } else {
    try {
      const { createdAt, updatedAt, id, farmerId, ...data } = body;
      const newData = await prisma.farmDataHistory.updateMany({
        where: {
          id: cropId,
          farmerId: userId,
        },
        data: {
          crop: body.crop,
          season: body.season,
          cropYield: Number(body.cropYield),
          price: Number(body.price),
          earned: body.earned != null ? Number(body.earned) : null,
        },
      });
      return NextResponse.json(
        { message: `Sucessful`, newData },
        { status: 200 },
      );
    } catch (error) {
      return NextResponse.json({ message: `${error}` }, { status: 401 });
    }
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = request.headers.get("x-user-id");
  const resolvedParams = await params;
  const cropId = resolvedParams.id;
  if (!cropId) {
    return NextResponse.json({ message: "Missing Crop ID" }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized: Missing User ID" },
      { status: 401 },
    );
  }

  try {
    // Delete the record ONLY if it matches the ID AND the farmerId
    const deletedData = await prisma.farmDataHistory.deleteMany({
      where: {
        id: cropId,
        farmerId: userId,
      },
    });

    return NextResponse.json(
      { message: "Deleted successfully", data: deletedData },
      { status: 200 }, // Changed to 200 for successful deletion
    );
  } catch (error) {
    // If the record doesn't exist or isn't owned by the user, Prisma throws an error
    return NextResponse.json(
      { message: "Error: Could not delete record", error: String(error) },
      { status: 404 }, // 404 is often better here if the record wasn't found
    );
  }
}
