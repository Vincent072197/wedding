import { NextResponse } from "next/server";
import { likePost } from "@/lib/queries/guestbook";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const postId = parseInt(params.id);
  const fingerprint = request.headers.get("x-forwarded-for") ?? "unknown";
  await likePost(postId, fingerprint);
  return NextResponse.json({ success: true });
}
