import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getPool } from "@/lib/db";

export const runtime = "nodejs";

function csvEscape(v: unknown) {
  const s = v == null ? "" : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(headers: string[], rows: Record<string, unknown>[]) {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  }
  return lines.join("\n");
}

export async function GET(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  const type = new URL(request.url).searchParams.get("type") || "payments";
  const now = new Date().toISOString().slice(0, 10);

  if (type === "payments") {
    const result = await db.query(
      `select p.id, p.paid_at, p.amount, p.currency, p.method, p.status, p.reference, p.notes,
              i.name as customer, i.service, i.phone
       from payments p
       left join inquiries i on i.id = p.inquiry_id
       order by p.paid_at desc
       limit 2000`
    );
    const headers = ["id", "paid_at", "customer", "phone", "service", "amount", "currency", "method", "status", "reference", "notes"];
    const csv = toCsv(headers, result.rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="edris-payments-${now}.csv"`
      }
    });
  }

  if (type === "inquiries") {
    const result = await db.query(
      `select id, created_at, name, phone, service, status, assigned_to, quoted_amount, currency,
              tracking_token, admin_note
       from inquiries
       order by created_at desc
       limit 2000`
    );
    const headers = [
      "id", "created_at", "name", "phone", "service", "status", "assigned_to",
      "quoted_amount", "currency", "tracking_token", "admin_note"
    ];
    const csv = toCsv(headers, result.rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="edris-inquiries-${now}.csv"`
      }
    });
  }

  if (type === "receipts") {
    const result = await db.query(
      `select receipt_no, issued_at, customer_name, customer_phone, service_label, amount, currency, method, notes
       from receipts order by issued_at desc limit 2000`
    );
    const headers = ["receipt_no", "issued_at", "customer_name", "customer_phone", "service_label", "amount", "currency", "method", "notes"];
    const csv = toCsv(headers, result.rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="edris-receipts-${now}.csv"`
      }
    });
  }

  return NextResponse.json({ error: "Unknown export type. Use payments|inquiries|receipts" }, { status: 400 });
}
