import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export const runtime = "nodejs";

const PUBLIC_STATUSES: Record<string, { en: string; am: string; om: string }> = {
  new: { en: "Received", am: "ተቀብለናል", om: "Fudhatameera" },
  contacted: { en: "Contacted", am: "ተገናኝተናል", om: "Qunnamneerra" },
  documents_pending: { en: "Documents pending", am: "ሰነዶች በመጠባበቅ ላይ", om: "Dokumeentii eegaa jira" },
  in_progress: { en: "In progress", am: "በሂደት ላይ", om: "Adeemsa irratti" },
  completed: { en: "Completed", am: "ተጠናቋል", om: "Xumurameera" },
  cancelled: { en: "Cancelled", am: "ተሰርዟል", om: "Haqameera" }
};

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.trim();
  if (!token || token.length < 8 || token.length > 64) {
    return NextResponse.json({ error: "Invalid tracking code." }, { status: 400 });
  }

  const db = getPool();
  if (!db) return NextResponse.json({ error: "Service unavailable." }, { status: 503 });

  const result = await db.query(
    `select
       i.id, i.name, i.service, i.status, i.created_at, i.updated_at, i.tracking_token,
       coalesce((
         select count(*)::int from inquiry_documents d
         where d.inquiry_id = i.id and d.required = true and d.status = 'pending'
       ), 0) as docs_pending,
       coalesce((
         select count(*)::int from inquiry_documents d where d.inquiry_id = i.id and d.required = true
       ), 0) as docs_required,
       coalesce((
         select count(*)::int from inquiry_documents d
         where d.inquiry_id = i.id and d.status in ('received','verified')
       ), 0) as docs_done
     from inquiries i
     where i.tracking_token = $1
     limit 1`,
    [token]
  );

  if (!result.rowCount) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 });
  }

  const row = result.rows[0];
  const status = PUBLIC_STATUSES[row.status] || PUBLIC_STATUSES.new;

  const parts = String(row.name).trim().split(/\s+/);
  const masked =
    parts.length === 1 ? parts[0] : `${parts[0]} ${parts[parts.length - 1]![0]}.`;

  return NextResponse.json({
    tracking: {
      code: row.tracking_token,
      name: masked,
      service: row.service,
      status: row.status,
      statusLabel: status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      documents: {
        required: row.docs_required,
        pending: row.docs_pending,
        done: row.docs_done
      }
    }
  });
}
