import { NextResponse } from "next/server";
import { deletePhoto, updatePhotoVisibility } from "@/lib/queries/gallery";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await deletePhoto(parseInt(id));
  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { isVisible } = await request.json();
  const { id } = await params;
  await updatePhotoVisibility(parseInt(id), isVisible);
  return NextResponse.json({ success: true });
}
