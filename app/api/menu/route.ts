import { NextResponse } from "next/server";
import { getMenuWithItems } from "@/lib/queries/menu";

export async function GET() {
  const menu = await getMenuWithItems();
  return NextResponse.json(menu);
}
