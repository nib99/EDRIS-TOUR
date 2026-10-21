import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getPool } from "@/lib/db";
import { z } from "zod";

export const runtime = "nodejs";

const upsertSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(2).max(120),
  phone: z.string().min(7).max(40),
  email: z.string().max(160).optional().default(""),
  notes: z.string().max(3000).optional().default("")
});

export async function GET(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  const q = new URL(request.url).searchParams.get("q")?.trim() || "";
  const result = await db.query(
    `select
       c.id, c.name, c.phone, c.email, c.notes, c.created_at, c.updated_at,
       (select count(*)::int from inquiries i where i.customer_id = c.id or i.phone = c.phone) as inquiry_count,
       coalesce((
         select sum(p.amount) from payments p
         where p.customer_id = c.id and p.status = 'completed'
       ), 0) as total_paid
     from customers c
     where ($1 = '' or c.name ilike '%' || $1 || '%' or c.phone ilike '%' || $1 || '%')
     order by c.updated_at desc
     limit 200`,
    [q]
  );
  return NextResponse.json({ customers: result.rows });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  try {
    const body = upsertSchema.parse(await request.json());
    if (body.id) {
      const result = await db.query(
        `update customers set name=$1, phone=$2, email=$3, notes=$4, updated_at=now()
         where id=$5
         returning *`,
        [body.name, body.phone, body.email || "", body.notes || "", body.id]
      );
      if (!result.rowCount) return NextResponse.json({ error: "Not found." }, { status: 404 });
      return NextResponse.json({ customer: result.rows[0] });
    }
    const result = await db.query(
      `insert into customers (name, phone, email, notes)
       values ($1,$2,$3,$4)
       on conflict (phone) do update set
         name = excluded.name,
         email = excluded.email,
         notes = excluded.notes,
         updated_at = now()
       returning *`,
      [body.name, body.phone, body.email || "", body.notes || ""]
    );
    return NextResponse.json({ customer: result.rows[0] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Invalid request.";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return NextResponse.json({ error: "Phone number already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
