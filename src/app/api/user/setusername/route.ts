import { authenticateApiRoute } from "@/lib/authMiddleware";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

function isAuthSuccess(
  result: NextResponse | { ok: boolean; userId: string }
): result is { ok: boolean; userId: string } {
  return "ok" in result && result.ok === true;
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  try {
    const authResult = await authenticateApiRoute(req);
    if (!isAuthSuccess(authResult)) return authResult;
    const userId = authResult.userId;

    const body = await req.json();
    const { userName } = body;
    await User.findByIdAndUpdate(userId, { userName });
    return NextResponse.json(
      { message: "Updated  successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating username:", error);
    return NextResponse.json(
      { message: "Failed to update username", status: 500 },
      { status: 500 }
    );
  }
}
