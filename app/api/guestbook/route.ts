import { getApprovedPosts, getAllPosts, createPost } from "@/lib/queries/guestbook";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const posts = searchParams.get("all") === "true"
    ? await getAllPosts()
    : await getApprovedPosts();
  return NextResponse.json(posts);
}

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
