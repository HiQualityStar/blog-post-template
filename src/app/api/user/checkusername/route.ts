import { authenticateApiRoute } from "@/lib/authMiddleware";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

// Type guard to check auth result
function isAuthSuccess(
  result: NextResponse | { ok: boolean; userId: string }
): result is { ok: boolean; userId: string } {
  return typeof result === "object" && "ok" in result && result.ok === true;
}

export const GET = async (req: NextRequest) => {
  await dbConnect();

  try {
    const authResult = await authenticateApiRoute(req);

    if (!isAuthSuccess(authResult)) {
      // If it's a NextResponse (unauthorized, etc), just return it
      return authResult;
    }

    const user = await User.findById(authResult.userId)
      .select("userName")
      .lean<{ userName: string }>();
    console.log(user);
    if (user?.userName) {
      return NextResponse.json(
        { message: "Username exists." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Username does not exist." },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      { message: "Failed to check username." },
      { status: 500 }
    );
  }
};
