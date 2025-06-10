import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import authService from "@/lib/authService";
import User from "@/models/userModel";
import dbConnect from "@/lib/dbConnect"; // Ensure DB is connected

export type GoogleTokenPayload = {
  email: string;
  name: string;
  picture: string;
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
  await dbConnect(); // Connect to DB

  try {
    const body = await req.json();
    const { idToken } = body;

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload() as GoogleTokenPayload;

    if (!payload || !payload.email) {
      return NextResponse.json(
        { message: "Invalid token payload" },
        { status: 400 }
      );
    }

    let user = await authService.findUser(payload.email);

    if (!user) {
      user = await authService.createUser(payload);
      const token = jwt.sign(
        { userId: user._id },
        process.env.NEXT_PUBLIC_JWT_SECRET!,
        { expiresIn: "4h" }
      );
      return NextResponse.json(
        {
          message: "Signed up successfully.",
          token,
          user: { userName: user.userName, picture: user.picture },
        },
        { status: 201 }
      );
    } else {
      const token = jwt.sign(
        { userId: user._id },
        process.env.NEXT_PUBLIC_JWT_SECRET!,
        { expiresIn: "4h" }
      );
      const userInfo = await User.findOne({ email: payload.email })
        .select("userName picture")
        .lean();

      return NextResponse.json(
        {
          message: "Logged in successfully.",
          token,
          user: userInfo,
        },
        { status: 200 }
      );
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Google login error:", err.message);
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
