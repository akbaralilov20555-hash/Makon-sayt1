import fs from "fs";
import path from "path";
import { Listing, User } from "@/types";
import { initialListings } from "@/data/listings";

/**
 * Demo file-based "database".
 *
 * IMPORTANT: serverless platforms (Vercel, AWS Lambda, etc.) deploy the app
 * to a READ-ONLY filesystem — only `/tmp` is writable, and even that is
 * wiped whenever a new instance/cold-start happens. So we:
 *   1. Try `process.cwd()/.db` first (works great for local dev / a normal
 *      always-on Node server, where data persists across restarts).
 *   2. If that's not writable, fall back to `/tmp/.makon-db` (works on
 *      Vercel — persists for the lifetime of the warm serverless instance).
 *   3. If even that fails, fall back to a plain in-memory array so the app
 *      never crashes or shows "no listings" — it just won't persist
 *      between requests.
 *
 * This is intentionally simple and meant for demos/prototypes. For a real
 * production deployment, swap this out for a real database (Postgres,
 * Supabase, etc.).
 */

let DB_DIR = path.join(process.cwd(), ".db");
const LISTINGS_FILE_NAME = "listings.json";
const USERS_FILE_NAME = "users.json";

let fsReady = false;
let memoryListings: Listing[] = initialListings;
let memoryUsers: User[] = [];

function listingsFile() {
  return path.join(DB_DIR, LISTINGS_FILE_NAME);
}
function usersFile() {
  return path.join(DB_DIR, USERS_FILE_NAME);
}

function tryInitAt(dir: string): boolean {
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const probe = path.join(dir, `.write-test-${process.pid}`);
    fs.writeFileSync(probe, "ok");
    fs.unlinkSync(probe);
    DB_DIR = dir;
    return true;
  } catch {
    return false;
  }
}

function ensureDb() {
  if (fsReady) return;

  if (tryInitAt(path.join(process.cwd(), ".db")) || tryInitAt(path.join("/tmp", ".makon-db"))) {
    try {
      if (!fs.existsSync(listingsFile())) {
        writeJsonAtomic(listingsFile(), initialListings);
      }
      if (!fs.existsSync(usersFile())) {
        writeJsonAtomic(usersFile(), []);
      }
      fsReady = true;
      return;
    } catch {
      // fall through to in-memory mode below
    }
  }

  // No writable directory available at all — operate fully in-memory for
  // the lifetime of this process so the app still works for a demo.
  fsReady = false;
}

function writeJsonAtomic(filePath: string, data: unknown) {
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tmpPath, filePath);
}

function readJsonSafe<T>(filePath: string, fallback: T): T {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    if (!raw.trim()) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getListings(): Listing[] {
  ensureDb();
  if (!fsReady) return memoryListings;
  return readJsonSafe<Listing[]>(listingsFile(), initialListings);
}

export function saveListings(listings: Listing[]) {
  ensureDb();
  if (!fsReady) {
    memoryListings = listings;
    return;
  }
  try {
    writeJsonAtomic(listingsFile(), listings);
  } catch {
    fsReady = false;
    memoryListings = listings;
  }
}

export function addListing(listing: Listing): Listing {
  const listings = getListings();
  listings.unshift(listing);
  saveListings(listings);
  return listing;
}

export function getListingById(id: string): Listing | undefined {
  return getListings().find((l) => l.id === id);
}

export function getUsers(): User[] {
  ensureDb();
  if (!fsReady) return memoryUsers;
  return readJsonSafe<User[]>(usersFile(), []);
}

export function saveUsers(users: User[]) {
  ensureDb();
  if (!fsReady) {
    memoryUsers = users;
    return;
  }
  try {
    writeJsonAtomic(usersFile(), users);
  } catch {
    fsReady = false;
    memoryUsers = users;
  }
}

export function addUser(user: User): User {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  return user;
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function findUserByToken(token: string): User | undefined {
  if (!token) return undefined;
  return getUsers().find((u) => u.sessionToken === token);
}
