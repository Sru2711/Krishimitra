import { NextResponse } from "next/server";
import argon2 from "argon2";
import prisma from "@/src/lib/prisma";
import { generateToken } from "../helper";

export async function POST(req: Request) {
  let body = await req.json();
  if (!body || Object.keys(body).length === 0) {
    return NextResponse.json({ error: "Request Body Empty" }, { status: 400 });
  } else if (!body.mobile || !body.password) {
    return NextResponse.json(
      { error: "Mobile and password are required" },
      { status: 400 },
    );
  } else {
    const farmer = await prisma.farmer.findUnique({
      where: {
        mobile: body.mobile,
      },
    });
    if (!farmer) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    } else {
      const validPassword = await argon2.verify(farmer.password, body.password);
      // const validEmail = farmer.email === body.email;
      if (!validPassword) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 },
        );
      } else {
        const soilData = await prisma.soilData.findFirst({
          where: {
            farmerId: farmer.id,
          },
        });
        let token = await generateToken(farmer);
        const { password, ...user } = farmer;
        return NextResponse.json(
          {
            message: "Login Successful",
            user,
            soilData,
            token,
          },
          { status: 200 },
        );
      }
    }
  }
}
