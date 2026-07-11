import * as jwt from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";

// export function verifyToken(req: Request) {
//   let token = req.headers.get("authorization");
//   if (!token) {
//     return NextResponse.json(
//       { message: "Please send Valid Token" },
//       { status: 401 },
//     );
//   } else {
//     try {
//       let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);

//       return decoded

//     } catch{
//       return NextResponse.json(
//         { message: "Invalid Token" },
//         { status: 401 },
//       );
//     }
//   }
// }

export function verifyToken(token: string) {
  if (!token) {
    throw new Error("No token");
  }

  return jwt.verify(token, process.env.JWT_SECRET_KEY!);
}

export async function generateToken(userBody: any) {
  const token = jwt.sign(
    {
      id: userBody.id,
      email: userBody.email,
    },
    process.env.JWT_SECRET_KEY!,
    {
      expiresIn: "1d",
    },
  );

  return token;
}

