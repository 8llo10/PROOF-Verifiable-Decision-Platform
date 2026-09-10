import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { hasSupabase } from "./supabase-admin";

const COOKIE = "proof_admin";
const DEMO_PASSWORD = "proof-demo-2026";
const DEMO_COOKIE_SECRET = "proof-demo-cookie-secret-not-for-production";

function configuredPassword() {
  const password = process.env.PROOF_ADMIN_PASSWORD;
  if (password) return password;
  if (!hasSupabase()) return DEMO_PASSWORD;
  throw new Error("PROOF_ADMIN_PASSWORD is required when persistence is enabled.");
}

function cookieSecret() {
  const secret = process.env.PROOF_COOKIE_SECRET;
  if (secret) return secret;
  if (!hasSupabase()) return DEMO_COOKIE_SECRET;
  throw new Error("PROOF_COOKIE_SECRET is required when persistence is enabled.");
}

function adminToken() {
  return createHmac("sha256", cookieSecret()).update("proof-admin-v1").digest("hex");
}

export function verifyAdminPassword(candidate: string) {
  const expected = configuredPassword();
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdmin() {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;

  const expected = adminToken();
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function setAdminCookie() {
  (await cookies()).set(COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
}

export async function clearAdminCookie() {
  (await cookies()).delete(COOKIE);
}
