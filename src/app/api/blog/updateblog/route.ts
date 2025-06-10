import { authenticateApiRoute } from "@/lib/authMiddleware";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/blogModel";
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
    const blogId = req.headers.get("x-blog-id");
    const userId = authResult.userId;

    const body = await req.json();
    const { title, desc, tags } = body;

    // ✅ Validate input
    if (!userId || !title || !desc || !tags || !Array.isArray(tags)) {
      return NextResponse.json(
        { message: "Invalid data provided.", status: 400 },
        { status: 400 }
      );
    }

    await Blog.findByIdAndUpdate(blogId, {
      userId,
      title,
      desc,
      tags,
      time: Date.now(),
    });
    return NextResponse.json(
      { message: "Updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { message: "Failed to update blog.", status: 500 },
      { status: 500 }
    );
  }
}
