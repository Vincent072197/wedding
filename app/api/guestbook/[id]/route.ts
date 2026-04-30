import { NextResponse } from "next/server";
import { toggleApproval, deleteGuestbookPost } from "@/lib/queries/guestbook";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await deleteGuestbookPost(parseInt(id));
  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { isApproved } = await request.json();
  const { id } = await params;
  await toggleApproval(parseInt(id), isApproved);
  return NextResponse.json({ success: true });
}
