import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getPool } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const no = url.searchParams.get("no");

  if (id || no) {
    const result = await db.query(
      `select * from receipts where ($1::bigint is not null and id = $1) or ($2::text is not null and receipt_no = $2) limit 1`,
      [id ? Number(id) : null, no || null]
    );
    if (!result.rowCount) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ receipt: result.rows[0] });
  }

  const result = await db.query(
    `select * from receipts order by issued_at desc limit 150`
  );
  return NextResponse.json({ receipts: result.rows });
}
