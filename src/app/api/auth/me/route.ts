import { NextRequest, NextResponse } from "next/server";
import { findUserByToken } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("makon_session")?.value;
  if (!token) {
    return NextResponse.json({ user: null });
  }

  const user = findUserByToken(token);
  if (!user) {
    return NextResponse.json({ user: null });
  }

  const { password: _pw, sessionToken: _tok, ...safeUser } = user;
  void _pw;
  void _tok;
  return NextResponse.json({ user: safeUser });
}
