import bcrypt from "bcryptjs";
import crypto from "crypto";

const SALT_ROUNDS = 10;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * Generates an opaque, unguessable session token. In this lightweight
 * file-backed setup the token itself IS the session id stored against the
 * user record server-side (see db.ts), so it can't be forged or decoded
 * client-side the way a hand-rolled JWT without verification could be.
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongEnoughPassword(password: string): boolean {
  return typeof password === "string" && password.length >= 6;
}
