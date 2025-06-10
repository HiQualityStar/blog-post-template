import { authenticateApiRoute } from "@/lib/authMiddleware";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/blogModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

function isAuthSuccess(
  result: NextResponse | { ok: boolean; userId: string }
): result is { ok: boolean; userId: string } {
  return "ok" in result && result.ok === true;
}
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const authResult = await authenticateApiRoute(req);
    if (!isAuthSuccess(authResult)) return authResult;
    const userId = authResult.userId;
    const body = await req.json();

    const { title, desc, tags } = body;

    // Validate input
    if (!userId || !title || !desc || !tags || !Array.isArray(tags)) {
      return NextResponse.json(
        { message: "Invalid data provided.", status: 400 },
        { status: 400 }
      );
    }
    //find username
    const user = await User.findById(userId)
      .select("userName")
      .lean<{ userName: string }>();

    // Save to DB
    await Blog.create({
      userId,
      userName: user?.userName,
      title,
      desc,
      tags,
      time: Date.now(), // correct Date
    });

    return NextResponse.json(
      { message: "Published successfully.", status: 201 },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error publishing blog:", error);
    return NextResponse.json(
      { message: "Failed to publish blog.", status: 500 },
      { status: 500 }
    );
  }
}
