import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value; //  Reads the httpOnly cookie set during login
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  try {
    await verifyToken(token); // If token is expired or tampered, jwtVerify throws → we catch and redirect
    return NextResponse.next(); // │ Token is valid — let the request through
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url)); // Token missing or invalid — send to login page
  }
}
export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"], // Tells Next.js which routes to intercept — only /admin and everything under it
};
