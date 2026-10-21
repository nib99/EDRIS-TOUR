import { NextResponse } from "next/server";
import { makeSession, sessionCookie, verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (typeof password !== "string" || password.length < 1 || password.length > 300) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    if (!verifyPassword(password)) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(sessionCookie.name, makeSession(), sessionCookie);
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
