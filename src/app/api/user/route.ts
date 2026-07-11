import { NextResponse } from "next/server";
import { verifyToken } from "../helper";
import prisma from "@/src/lib/prisma";

export async function GET(request: Request) {
  // Get the ID that the middleware validated and attached
  const userId = request.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ message: "User ID missing" }, { status: 403 });
  }

  const user = await prisma.farmer.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Security: Remove password before sending to frontend
  const { password, ...userWithoutPassword } = user;

  return NextResponse.json(userWithoutPassword);
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { message: "Request body is empty" },
        { status: 400 }
      );
    }

    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const farmer = await prisma.farmer.update({
      where: {
        id: userId,
      },
      data: {
        farmerType: body.farmerType,
        landHolding: body.landHolding,
        primaryCrop: body.primaryCrop,
      },
    });

    return NextResponse.json(
      {
        message: "Farmer profile updated successfully",
        farmer,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Could not update farmer profile, because of ${error}`,
      },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const farmer = await prisma.farmer.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json(
      {
        message: "Farmer profile deleted successfully",
        farmer,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Could not delete farmer profile",
      },
      { status: 500 }
    );
  }
}