import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import argon2 from "argon2";
import { generateToken } from "../helper";

export async function POST(req: Request) {
  let body = await req?.json();
  if (!body || Object.keys(body).length === 0) {
    return NextResponse.json({ error: "Request Body Empty" }, { status: 400 });
  } else {
    body.password = await argon2.hash(body.password);
    const { id, createdAt, updatedAt, ...data } = body;
    try {
      const farmer = await prisma.farmer.create({
        data,
      });
      let token = await generateToken(farmer);
      const { password, ...user } = farmer
      return NextResponse.json(
        {
           message: "Registration Successful",
          user,
          token,
        },
        { status: 201 },
      );
    } catch(error) {
      return NextResponse.json({ error: `${error}` }, { status: 500 });
    }
  }
}
