import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getPool } from "@/lib/db";
import { z } from "zod";

export const runtime = "nodejs";

const createSchema = z.object({
  inquiryId: z.number().int().positive().optional().nullable(),
  customerId: z.number().int().positive().optional().nullable(),
  amount: z.number().positive(),
  currency: z.string().max(8).optional().default("ETB"),
  method: z.enum(["cash", "bank_transfer", "telebirr", "cbe_birr", "chapa", "other"]),
  status: z.enum(["pending", "completed", "failed", "refunded"]).optional().default("completed"),
  reference: z.string().max(120).optional().default(""),
  notes: z.string().max(1000).optional().default(""),
  issueReceipt: z.boolean().optional().default(true)
});

export async function GET(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  const url = new URL(request.url);
  const inquiryId = url.searchParams.get("inquiryId");
  const limit = Math.min(Number(url.searchParams.get("limit") || 100), 300);

  const params: (string | number)[] = [];
  let where = "";
  if (inquiryId) {
    params.push(Number(inquiryId));
    where = `where p.inquiry_id = $1`;
  }

  const result = await db.query(
    `select
       p.*,
       i.name as inquiry_name,
       i.service as inquiry_service,
       c.name as customer_name
     from payments p
     left join inquiries i on i.id = p.inquiry_id
     left join customers c on c.id = p.customer_id
     ${where}
     order by p.paid_at desc
     limit ${limit}`,
    params
  );
  return NextResponse.json({ payments: result.rows });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  try {
    const body = createSchema.parse(await request.json());

    let customerId = body.customerId || null;
    let customerName = "";
    let customerPhone = "";
    let serviceLabel = "Service";

    if (body.inquiryId) {
      const inq = await db.query(
        `select id, name, phone, service, customer_id from inquiries where id = $1`,
        [body.inquiryId]
      );
      if (!inq.rowCount) return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
      const row = inq.rows[0];
      customerName = row.name;
      customerPhone = row.phone;
      serviceLabel = row.service;
      customerId = customerId || row.customer_id;
      if (!customerId) {
        const c = await db.query(
          `insert into customers (name, phone) values ($1,$2)
           on conflict (phone) do update set name = excluded.name, updated_at = now()
           returning id`,
          [row.name, row.phone]
        );
        customerId = c.rows[0].id;
        await db.query(`update inquiries set customer_id = $1 where id = $2`, [customerId, body.inquiryId]);
      }
    } else if (customerId) {
      const c = await db.query(`select name, phone from customers where id = $1`, [customerId]);
      if (c.rowCount) {
        customerName = c.rows[0].name;
        customerPhone = c.rows[0].phone;
      }
    }

    const pay = await db.query(
      `insert into payments
         (inquiry_id, customer_id, amount, currency, method, status, reference, notes)
       values ($1,$2,$3,$4,$5,$6,$7,$8)
       returning *`,
      [
        body.inquiryId || null,
        customerId,
        body.amount,
        body.currency || "ETB",
        body.method,
        body.status || "completed",
        body.reference || "",
        body.notes || ""
      ]
    );
    const payment = pay.rows[0];

    let receipt = null;
    if (body.issueReceipt && body.status === "completed") {
      const seq = await db.query(`select nextval('receipt_no_seq') as n`);
      const receiptNo = `EDR-${String(seq.rows[0].n).padStart(5, "0")}`;
      const rec = await db.query(
        `insert into receipts
           (receipt_no, inquiry_id, customer_id, payment_id, customer_name, customer_phone,
            service_label, amount, currency, method, notes)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         returning *`,
        [
          receiptNo,
          body.inquiryId || null,
          customerId,
          payment.id,
          customerName || "Customer",
          customerPhone,
          serviceLabel,
          body.amount,
          body.currency || "ETB",
          body.method,
          body.notes || ""
        ]
      );
      receipt = rec.rows[0];
    }

    return NextResponse.json({ payment, receipt });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
