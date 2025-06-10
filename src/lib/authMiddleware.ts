import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function authenticateApiRoute(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      { message: "Access denied. No token provided." },
      { status: 401 }
    );
  }
  try {
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!) as {
      userId: string;
    };

    return {
      ok: true,
      userId: decoded.userId,
    };
  } catch {
    return NextResponse.json(
      { message: "Token is invalid or has expired!" },
      { status: 401 }
    );
  }
}
