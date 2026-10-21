import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { generateShortCode } from "@/lib/tracking";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(7).max(40),
  service: z.string().min(2).max(120),
  message: z.string().max(2000).optional().default("")
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const db = getPool();
    if (!db) {
      return NextResponse.json({ error: "Service inbox is not configured yet." }, { status: 503 });
    }

    let customerId: number | null = null;
    try {
      const existing = await db.query(`select id from customers where phone = $1 limit 1`, [body.phone]);
      if (existing.rows[0]) {
        customerId = existing.rows[0].id;
        await db.query(
          `update customers set name = $1, updated_at = now() where id = $2`,
          [body.name, customerId]
        );
      } else {
        const created = await db.query(
          `insert into customers (name, phone) values ($1, $2) returning id`,
          [body.name, body.phone]
        );
        customerId = created.rows[0].id;
      }
    } catch {
      /* customers table may not exist yet */
    }

    const trackingToken = generateShortCode();

    const inserted = await db.query(
      `insert into inquiries (name, phone, service, message, customer_id, tracking_token, tracking_token_created_at)
       values ($1,$2,$3,$4,$5,$6, now())
       returning id, tracking_token`,
      [body.name, body.phone, body.service, body.message, customerId, trackingToken]
    );
    const inquiryId = inserted.rows[0].id as number;
    const token = inserted.rows[0].tracking_token as string;

    try {
      const serviceKey = body.service.toLowerCase().replace(/\s+/g, "_");
      const templates = await db.query(
        `select doc_name, required from document_templates
         where service_code = $1 or $2 ilike '%' || replace(service_code, '_', ' ') || '%'
         order by sort_order
         limit 20`,
        [serviceKey, body.service]
      );
      for (const t of templates.rows) {
        await db.query(
          `insert into inquiry_documents (inquiry_id, doc_name, required)
           values ($1, $2, $3)`,
          [inquiryId, t.doc_name, t.required]
        );
      }
    } catch {
      /* optional */
    }

    return NextResponse.json({ ok: true, id: inquiryId, trackingCode: token });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
