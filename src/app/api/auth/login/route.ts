import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, saveUsers, getUsers } from "@/lib/db";
import { verifyPassword, generateSessionToken, isValidEmail } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov formati" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  if (!email || !password || !isValidEmail(email)) {
    return NextResponse.json({ error: "Email yoki parol noto'g'ri" }, { status: 401 });
  }

  const user = findUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "Email yoki parol noto'g'ri" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Email yoki parol noto'g'ri" }, { status: 401 });
  }

  const sessionToken = generateSessionToken();
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx !== -1) {
    users[idx].sessionToken = sessionToken;
    saveUsers(users);
  }

  const { password: _pw, sessionToken: _tok, ...safeUser } = user;
  void _pw;
  void _tok;

  const res = NextResponse.json({ user: safeUser });
  res.cookies.set("makon_session", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
