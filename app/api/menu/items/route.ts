import { NextResponse } from "next/server";
import { createMenuItem } from "@/lib/queries/menu";

export async function POST(request: Request) {
  const { categoryId, nameZh, nameEn } = await request.json();

  if (!categoryId || !nameZh) {
    return NextResponse.json(
      { error: "categoryId and nameZh are required" },
      { status: 400 },
    );
  }
  const item = await createMenuItem(categoryId, nameZh, nameEn ?? "");
  return NextResponse.json(item, { status: 201 });
}
