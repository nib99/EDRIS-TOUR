import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getPool } from "@/lib/db";
import { z } from "zod";

export const runtime = "nodejs";

const updateSchema = z.object({
  status: z.enum(["new", "contacted", "documents_pending", "in_progress", "completed", "cancelled"]).optional(),
  adminNote: z.string().max(3000).optional(),
  assignedTo: z.string().max(120).optional(),
  quotedAmount: z.number().nonnegative().nullable().optional(),
  currency: z.string().max(8).optional()
});

async function ensureCustomer(db: NonNullable<ReturnType<typeof getPool>>, name: string, phone: string) {
  const existing = await db.query(`select id from customers where phone = $1 limit 1`, [phone]);
  if (existing.rows[0]) {
    await db.query(
      `update customers set name = $1, updated_at = now() where id = $2`,
      [name, existing.rows[0].id]
    );
    return existing.rows[0].id as number;
  }
  const created = await db.query(
    `insert into customers (name, phone) values ($1, $2) returning id`,
    [name, phone]
  );
  return created.rows[0].id as number;
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getPool();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  const result = await db.query(`
    select
      i.id, i.name, i.phone, i.service, i.message, i.status, i.admin_note,
      i.customer_id, i.assigned_to, i.quoted_amount, i.currency,
      i.tracking_token, i.created_at, i.updated_at,
      coalesce((
        select count(*)::int from inquiry_documents d
        where d.inquiry_id = i.id and d.status = 'pending' and d.required = true
      ), 0) as docs_pending,
      coalesce((
        select count(*)::int from inquiry_documents d where d.inquiry_id = i.id
      ), 0) as docs_total,
      coalesce((
        select sum(p.amount) from payments p
        where p.inquiry_id = i.id and p.status = 'completed'
      ), 0) as paid_total
    from inquiries i
    order by
      case i.status
        when 'new' then 0
        when 'contacted' then 1
        when 'documents_pending' then 2
        when 'in_progress' then 3
        when 'completed' then 4
        else 5
      end,
      i.created_at desc
    limit 300
  `);
  return NextResponse.json({ inquiries: result.rows });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getPool();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  const url = new URL(request.url);
  const id = Number(url.searchParams.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid inquiry ID." }, { status: 400 });
  }

  try {
    const body = updateSchema.parse(await request.json());
    const current = await db.query(
      `select id, name, phone, customer_id from inquiries where id = $1`,
      [id]
    );
    if (!current.rowCount) return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    const row = current.rows[0];

    let customerId = row.customer_id as number | null;
    if (!customerId) {
      customerId = await ensureCustomer(db, row.name, row.phone);
    }

    const result = await db.query(
      `update inquiries set
         status = coalesce($1, status),
         admin_note = coalesce($2, admin_note),
         assigned_to = coalesce($3, assigned_to),
         quoted_amount = case when $4::boolean then $5 else quoted_amount end,
         currency = coalesce($6, currency),
         customer_id = $7,
         updated_at = now()
       where id = $8
       returning id, status, admin_note, assigned_to, quoted_amount, currency, customer_id, updated_at`,
      [
        body.status ?? null,
        body.adminNote ?? null,
        body.assignedTo ?? null,
        body.quotedAmount !== undefined,
        body.quotedAmount ?? null,
        body.currency ?? null,
        customerId,
        id
      ]
    );
    return NextResponse.json({ inquiry: result.rows[0] });
  } catch {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  try {
    const body = await request.json();
    const id = Number(body.inquiryId);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid inquiry ID." }, { status: 400 });
    }
    if (body.action === "ensureToken") {
      const { generateShortCode } = await import("@/lib/tracking");
      const current = await db.query(
        `select id, tracking_token from inquiries where id = $1`,
        [id]
      );
      if (!current.rowCount) return NextResponse.json({ error: "Not found." }, { status: 404 });
      if (current.rows[0].tracking_token) {
        return NextResponse.json({ tracking_token: current.rows[0].tracking_token });
      }
      let token = generateShortCode();
      for (let i = 0; i < 5; i++) {
        try {
          const updated = await db.query(
            `update inquiries set tracking_token = $1, tracking_token_created_at = now(), updated_at = now()
             where id = $2 returning tracking_token`,
            [token, id]
          );
          return NextResponse.json({ tracking_token: updated.rows[0].tracking_token });
        } catch {
          token = generateShortCode();
        }
      }
      return NextResponse.json({ error: "Could not assign token." }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
