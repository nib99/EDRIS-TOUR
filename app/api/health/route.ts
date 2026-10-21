import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ ok: true, service: "edris-tour-travel", time: new Date().toISOString() });
}
