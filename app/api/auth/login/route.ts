import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import db from "@/lib/db";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 },
    );
  }
  const result = await db.query(
    "SELECT id,email,password_hash FROM admins WHERE email = $1",
    [email],
  );
  const admin = result.rows[0];
  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  // Compares plain password against the hash — never store plain text
  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = await signToken({ adminId: admin.id, email: admin.email });
  const response = NextResponse.json({ success: true });
  response.cookies.set("token", token, {
    httpOnly: true, // // Cookie can't be read by JavaScript — XSS protection
    secure: process.env.NODE_ENV === "production", // Cookie can't be read by JavaScript — XSS protection
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 3, //  3 days in seconds — matches the JWT expiry
  });
  return response;
}
