import { NextRequest, NextResponse } from "next/server";
import { findUserByToken, getUsers, saveUsers } from "@/lib/db";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("makon_session")?.value;

  if (token) {
    const user = findUserByToken(token);
    if (user) {
      const users = getUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx !== -1) {
        users[idx].sessionToken = undefined;
        saveUsers(users);
      }
    }
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("makon_session", "", { path: "/", maxAge: 0 });
  return res;
}
