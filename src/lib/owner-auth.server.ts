import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { SignJWT, jwtVerify } from "jose";
import { getSql } from "@/lib/db";

const scryptAsync = promisify(scrypt);
const COOKIE = "edris_session";
const DEMO_PASSWORD = "edris-owner";
const DEV_SESSION_SECRET = "dev-only-edris-session-secret-change-me";
const WEEK = 60 * 60 * 24 * 7;

type Mode = "env" | "stored" | "demo" | "setup";

type Settings = {
  password_hash: string | null;
  session_secret: string | null;
};

const hits = new Map<string, number[]>();

function isHosted(): boolean {
  return process.env.VERCEL === "1";
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "local";
}

export function rateLimit(request: Request, bucket: string, limit: number, windowMs: number): boolean {
  const key = `${bucket}:${clientKey(request)}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((stamp) => now - stamp < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

function shaEqual(input: string, expected: string): boolean {
  const left = Buffer.from(input);
  const right = Buffer.from(expected);
  const size = Math.max(left.length, right.length, 1);
  const a = Buffer.alloc(size);
  const b = Buffer.alloc(size);
  left.copy(a);
  right.copy(b);
  return timingSafeEqual(a, b) && left.length === right.length;
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = (await scryptAsync(password, salt, 32)) as Buffer;
  return `scrypt$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

async function verifyStored(password: string, stored: string): Promise<boolean> {
  const [alg, saltB64, hashB64] = stored.split("$");
  if (alg !== "scrypt" || !saltB64 || !hashB64) return false;
  const salt = Buffer.from(saltB64, "base64url");
  const expected = Buffer.from(hashB64, "base64url");
  const actual = (await scryptAsync(password, salt, expected.length)) as Buffer;
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

async function readSettings(): Promise<Settings | null> {
  const sql = await getSql();
  const rows = await sql<Settings>`
    select password_hash, session_secret from owner_settings where id = 1
  `;
  return rows[0] ?? null;
}

export async function authMode(): Promise<{ mode: Mode; demoPassword?: string }> {
  if (process.env.OWNER_PASSWORD && process.env.OWNER_PASSWORD.length >= 8) {
    return { mode: "env" };
  }
  const settings = await readSettings();
  if (settings?.password_hash) return { mode: "stored" };
  if (!isHosted()) return { mode: "demo", demoPassword: DEMO_PASSWORD };
  return { mode: "setup" };
}

async function passwordMatches(password: string): Promise<boolean> {
  const env = process.env.OWNER_PASSWORD;
  if (env && env.length >= 8) return shaEqual(password, env);
  const settings = await readSettings();
  if (settings?.password_hash) return verifyStored(password, settings.password_hash);
  if (!isHosted()) return shaEqual(password, DEMO_PASSWORD);
  return false;
}

async function sessionKey(): Promise<Uint8Array> {
  const fromEnv = process.env.SESSION_SECRET?.trim();
  if (fromEnv && fromEnv.length >= 16) return new TextEncoder().encode(fromEnv);
  const settings = await readSettings();
  if (settings?.session_secret && settings.session_secret.length >= 16) {
    return new TextEncoder().encode(settings.session_secret);
  }
  if (!isHosted()) return new TextEncoder().encode(DEV_SESSION_SECRET);
  const created = randomBytes(32).toString("base64url");
  const sql = await getSql();
  await sql`
    insert into owner_settings (id, session_secret)
    values (1, ${created})
    on conflict (id) do update
      set session_secret = coalesce(owner_settings.session_secret, excluded.session_secret),
          updated_at = now()
  `;
  const again = await readSettings();
  const secret = again?.session_secret || created;
  return new TextEncoder().encode(secret);
}

export function readCookie(request: Request, name = COOKIE): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

function secureRequest(request: Request): boolean {
  const forwarded = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (forwarded) return forwarded === "https";
  return new URL(request.url).protocol === "https:";
}

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  let originHost = "";
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host") ||
    new URL(request.url).host;
  return originHost === host;
}

function cookieHeader(token: string, request: Request, maxAge: number): string {
  const parts = [
    `${COOKIE}=${encodeURIComponent(token)}`,
    "HttpOnly",
    "SameSite=Lax",
    "Path=/",
    `Max-Age=${maxAge}`,
  ];
  if (secureRequest(request)) parts.push("Secure");
  return parts.join("; ");
}

async function signSession(): Promise<string> {
  return new SignJWT({ role: "owner" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("owner")
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(await sessionKey());
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, await sessionKey());
    return payload.role === "owner" && payload.sub === "owner";
  } catch {
    return false;
  }
}

export async function requireOwner(request: Request): Promise<Response | { ok: true }> {
  if (request.method !== "GET" && request.method !== "HEAD" && !sameOrigin(request)) {
    return Response.json({ error: "bad_origin" }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  const token = readCookie(request);
  if (!token || !(await verifySession(token))) {
    return Response.json({ error: "unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  return { ok: true };
}

export async function loginOwner(request: Request, password: string): Promise<Response> {
  if (!sameOrigin(request)) {
    return Response.json({ error: "bad_origin" }, { status: 403 });
  }
  if (!rateLimit(request, "login", 8, 10 * 60 * 1000)) {
    return Response.json({ error: "rate" }, { status: 429 });
  }
  if (!(await passwordMatches(password))) {
    return Response.json({ error: "invalid_password" }, { status: 401 });
  }
  const token = await signSession();
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Set-Cookie": cookieHeader(token, request, WEEK),
    },
  });
}

export async function logoutOwner(request: Request): Promise<Response> {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Set-Cookie": cookieHeader("", request, 0),
    },
  });
}

export async function setupOwner(request: Request, password: string): Promise<Response> {
  if (!sameOrigin(request)) {
    return Response.json({ error: "bad_origin" }, { status: 403 });
  }
  if (process.env.OWNER_PASSWORD && process.env.OWNER_PASSWORD.length >= 8) {
    return Response.json({ error: "env_password" }, { status: 409 });
  }
  const existing = await readSettings();
  if (existing?.password_hash) {
    return Response.json({ error: "already_set" }, { status: 409 });
  }
  if (password.length < 10 || password.length > 200) {
    return Response.json({ error: "password_short" }, { status: 400 });
  }
  const passwordHash = await hashPassword(password);
  const secret = randomBytes(32).toString("base64url");
  const sql = await getSql();
  await sql`
    insert into owner_settings (id, password_hash, session_secret)
    values (1, ${passwordHash}, ${secret})
    on conflict (id) do update
      set password_hash = coalesce(owner_settings.password_hash, excluded.password_hash),
          session_secret = coalesce(owner_settings.session_secret, excluded.session_secret),
          updated_at = now()
  `;
  const token = await signSession();
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Set-Cookie": cookieHeader(token, request, WEEK),
    },
  });
}

export function generateSecrets(): { ownerPassword: string; sessionSecret: string } {
  return {
    ownerPassword: randomBytes(18).toString("base64url"),
    sessionSecret: randomBytes(32).toString("base64url"),
  };
}
