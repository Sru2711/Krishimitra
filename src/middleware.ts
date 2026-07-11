import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const auth = request.headers.get("authorization");

  if (!auth?.startsWith("Bearer")) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  const token = auth.split(" ")[1];

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

    const { payload } = await jwtVerify(token, secret);

    const headers = new Headers(request.headers);
    headers.set("x-user-id", payload.id as string);

    return NextResponse.next({
      request: {
        headers,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Invalid token" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher:[
    '/api/user/:path*', 
    '/api/farmData/:path*'
  ], 
};