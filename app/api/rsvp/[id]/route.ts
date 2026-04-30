import { NextResponse } from "next/server";
import { assignTable } from "@/lib/queries/rsvp";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { tableNumber } = await request.json();
  await assignTable(Number(id), tableNumber ?? null);
  return NextResponse.json({ success: true });
}
