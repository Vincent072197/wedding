import { NextResponse } from "next/server";
import { lookupRsvpByPhone } from "@/lib/queries/rsvp";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone")?.trim();
  if (!phone) {
    return NextResponse.json({ error: "phone required" }, { status: 400 });
  }
  const guest = await lookupRsvpByPhone(phone);
  if (!guest) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(guest);
}
