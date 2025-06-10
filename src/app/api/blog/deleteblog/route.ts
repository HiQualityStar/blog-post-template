import { authenticateApiRoute } from "@/lib/authMiddleware";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/blogModel";
import { BlogType } from "@/types/blogApiType";
import { NextRequest, NextResponse } from "next/server";

function isAuthSuccess(
  result: NextResponse | { ok: boolean; userId: string }
): result is { ok: boolean; userId: string } {
  return "ok" in result && result.ok === true;
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    const authResult = await authenticateApiRoute(req);
    if (!isAuthSuccess(authResult)) return authResult;
    const blogId = req.headers.get("x-blog-id");
    const userId = authResult.userId;

    const deletedBlog = await Blog.findById(blogId).lean<BlogType>();

    if (!deletedBlog) {
      return NextResponse.json({ message: "Blog not found." }, { status: 404 });
    }

    if (deletedBlog.userId !== userId) {
      return NextResponse.json({ message: "Access denied." }, { status: 400 });
    }

    await Blog.findByIdAndDelete(blogId).lean();
    const blogs = await Blog.find({}).sort({ createdAt: 1 }).lean();
    return NextResponse.json(
      { message: "Deleted successfully.", blogs, userId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { message: "Failed to delete blog.", status: 500 },
      { status: 500 }
    );
  }
}
