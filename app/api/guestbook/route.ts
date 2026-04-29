import { getApprovedPosts, createPost } from "@/lib/queries/guestbook";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { guestName, message } = await request.json();
  if (!guestName || !message) {
    return NextResponse.json(
      { error: "guestName and message are required" },
      { status: 400 },
    );
  }
  const post = await createPost(guestName, message);
  return NextResponse.json(post, { status: 201 });
}

export async function GET() {
  const posts = await getApprovedPosts();
  return NextResponse.json(posts);
}
