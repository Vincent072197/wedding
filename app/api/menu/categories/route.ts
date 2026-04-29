import { NextResponse } from "next/server";
import { createCategory } from "@/lib/queries/menu";
import { error } from "console";

export async function POST(request: Request) {
  const { nameZh, nameEn } = await request.json();
  if (nameZh) {
    return (NextResponse.json({ error: "nameZh is requred" }), { status: 400 });
  }
  const category = await createCategory(nameZh, nameEn ?? "");
  return NextResponse.json(category, { status: 201 });
}
