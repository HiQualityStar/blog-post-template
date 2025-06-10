import { authenticateApiRoute } from "@/lib/authMiddleware";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/blogModel";
import { NextRequest, NextResponse } from "next/server";

function isAuthSuccess(
  result: NextResponse | { ok: boolean; userId: string }
): result is { ok: boolean; userId: string } {
  return "ok" in result && result.ok === true;
}

export const GET = async (req: NextRequest) => {
  await dbConnect();

  try {
    const authResult = await authenticateApiRoute(req);
    if (!isAuthSuccess(authResult)) return authResult;
    const blogId = req.headers.get("x-blog-id");

    if (!blogId) {
      return NextResponse.json({ message: "Missing blog ID" }, { status: 400 });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog found", blog }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { message: "Failed to fetch blog" },
      { status: 500 }
    );
  }
};
