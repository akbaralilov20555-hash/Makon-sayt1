import { NextRequest, NextResponse } from "next/server";
import { addUser, findUserByEmail } from "@/lib/db";
import { hashPassword, generateSessionToken, isValidEmail, isStrongEnoughPassword } from "@/lib/auth";
import { User } from "@/types";

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; phone?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov formati" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const phone = (body.phone || "").trim();
  const password = body.password || "";

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Barcha maydonlarni to'ldiring" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Email manzili noto'g'ri" }, { status: 400 });
  }
  if (!isStrongEnoughPassword(password)) {
    return NextResponse.json({ error: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" }, { status: 400 });
  }

  const existing = findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "Bu email allaqachon ro'yxatdan o'tgan" }, { status: 409 });
  }

  const hashedPassword = await hashPassword(password);
  const sessionToken = generateSessionToken();

  const newUser: User = {
    id: "u" + Date.now() + Math.random().toString(36).slice(2, 7),
    name,
    email,
    phone,
    password: hashedPassword,
    sessionToken,
    role: "tenant",
    createdAt: new Date().toISOString(),
  };

  addUser(newUser);

  const { password: _pw, sessionToken: _tok, ...safeUser } = newUser;
  void _pw;
  void _tok;

  const res = NextResponse.json({ user: safeUser }, { status: 201 });
  res.cookies.set("makon_session", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
