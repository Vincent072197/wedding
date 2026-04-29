import { NextResponse } from "next/server";
import { getAllRsvps, upsertRsvp } from "@/lib/queries/rsvp";

export async function GET() {
  const rsvps = await getAllRsvps();
  return NextResponse.json(rsvps);
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    name,
    phone,
    attending,
    adultCount,
    childCount,
    mealPreference,
    note,
  } = body;

  if (!name || !phone || !attending) {
    return NextResponse.json(
      { error: "name, phone and attending are required" },
      { status: 400 },
    );
  }

  const rsvp = await upsertRsvp({
    name,
    phone,
    attending,
    adultCount: adultCount ?? 1,
    childCount: childCount ?? 0,
    mealPreference,
    note,
  });

  return NextResponse.json(rsvp, { status: 201 });
}
