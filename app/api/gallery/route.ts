import { getVisiblePhotos, createPhoto } from "@/lib/queries/gallery";
import { NextResponse } from "next/server";

export async function GET() {
  const photos = await getVisiblePhotos();
  return NextResponse.json(photos);
}
export async function POST(request: Request) {
  const { url, caption, altText, uploadedBy } = await request.json();
  if (!url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }
  const photo = await createPhoto(
    url,
    caption ?? "",
    altText ?? "",
    uploadedBy,
  );
  return NextResponse.json(photo, { status: 201 });
}
