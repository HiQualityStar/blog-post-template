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
    let userId = "" as string;
    const authResult = await authenticateApiRoute(req);
    const blogs = await Blog.find({}).sort({ createdAt: 1 }).lean();
    if (isAuthSuccess(authResult)) userId = authResult.userId;
    // console.log(blogs);
    return NextResponse.json(
      { message: "Blogs found.", blogs, userId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { message: "Failed to fetch blogs." },
      { status: 500 }
    );
  }
};
