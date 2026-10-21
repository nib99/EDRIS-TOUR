import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getPool } from "@/lib/db";
import { z } from "zod";

export const runtime = "nodejs";

const updateSchema = z.object({
  status: z.enum(["pending", "received", "verified", "rejected", "waived"]),
  notes: z.string().max(1000).optional().default("")
});

const seedSchema = z.object({
  inquiryId: z.number().int().positive(),
  serviceCode: z.string().min(1).max(64).optional()
});

export async function GET(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  const inquiryId = Number(new URL(request.url).searchParams.get("inquiryId"));
  if (!Number.isSafeInteger(inquiryId) || inquiryId <= 0) {
    return NextResponse.json({ error: "inquiryId required." }, { status: 400 });
  }

  const result = await db.query(
    `select id, inquiry_id, doc_name, required, status, notes, received_at, created_at, updated_at
     from inquiry_documents
     where inquiry_id = $1
     order by id`,
    [inquiryId]
  );
  return NextResponse.json({ documents: result.rows });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid document ID." }, { status: 400 });
  }

  try {
    const body = updateSchema.parse(await request.json());
    const receivedAt =
      body.status === "received" || body.status === "verified" ? new Date().toISOString() : null;
    const result = await db.query(
      `update inquiry_documents set
         status = $1,
         notes = $2,
         received_at = case when $3::timestamptz is not null then coalesce(received_at, $3) else received_at end,
         updated_at = now()
       where id = $4
       returning *`,
      [body.status, body.notes || "", receivedAt, id]
    );
    if (!result.rowCount) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ document: result.rows[0] });
  } catch {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }
}

/** Seed checklist from templates for an inquiry */
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  try {
    const body = seedSchema.parse(await request.json());
    const inquiry = await db.query(`select id, service from inquiries where id = $1`, [body.inquiryId]);
    if (!inquiry.rowCount) return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });

    const existing = await db.query(
      `select count(*)::int as c from inquiry_documents where inquiry_id = $1`,
      [body.inquiryId]
    );
    if (existing.rows[0].c > 0) {
      return NextResponse.json({ ok: true, seeded: 0, message: "Checklist already exists." });
    }

    const service = inquiry.rows[0].service as string;
    const code = body.serviceCode || service.toLowerCase().replace(/\s+/g, "_");
    const templates = await db.query(
      `select doc_name, required from document_templates
       where service_code = $1 or $2 ilike '%' || replace(service_code, '_', ' ') || '%'
       order by sort_order limit 30`,
      [code, service]
    );

    let seeded = 0;
    for (const t of templates.rows) {
      await db.query(
        `insert into inquiry_documents (inquiry_id, doc_name, required) values ($1,$2,$3)`,
        [body.inquiryId, t.doc_name, t.required]
      );
      seeded += 1;
    }
    return NextResponse.json({ ok: true, seeded });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
