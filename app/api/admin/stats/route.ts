import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getPool } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  const [inquiries, payments, customers, docs, recentPayments] = await Promise.all([
    db.query(`
      select
        count(*)::int as total,
        count(*) filter (where status = 'new')::int as new_count,
        count(*) filter (where status in ('contacted','documents_pending','in_progress'))::int as active,
        count(*) filter (where status = 'completed')::int as completed,
        count(*) filter (where status = 'cancelled')::int as cancelled
      from inquiries
    `),
    db.query(`
      select
        coalesce(sum(amount) filter (where status = 'completed'), 0) as revenue_total,
        coalesce(sum(amount) filter (where status = 'completed' and paid_at >= date_trunc('month', now())), 0) as revenue_month,
        coalesce(sum(amount) filter (where status = 'completed' and paid_at >= current_date), 0) as revenue_today,
        count(*) filter (where status = 'completed')::int as payment_count,
        count(*) filter (where status = 'pending')::int as pending_count
      from payments
    `),
    db.query(`select count(*)::int as total from customers`),
    db.query(`
      select
        count(*) filter (where status = 'pending' and required = true)::int as pending_required,
        count(*) filter (where status in ('received','verified'))::int as received
      from inquiry_documents
    `),
    db.query(`
      select method, count(*)::int as c, coalesce(sum(amount),0) as total
      from payments
      where status = 'completed'
      group by method
      order by total desc
    `)
  ]);

  return NextResponse.json({
    inquiries: inquiries.rows[0],
    payments: payments.rows[0],
    customers: customers.rows[0],
    documents: docs.rows[0],
    byMethod: recentPayments.rows
  });
}
