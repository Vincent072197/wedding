import { NextResponse } from "next/server";
import { deletePhoto, updatePhotoVisibility } from "@/lib/queries/gallery";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  await deletePhoto(parseInt(params.id));
  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { isVisible } = await request.json();
  await updatePhotoVisibility(parseInt(params.id), isVisible);
  return NextResponse.json({ success: true });
}
