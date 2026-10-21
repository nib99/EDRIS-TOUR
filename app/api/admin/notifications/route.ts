import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getPool } from "@/lib/db";
import { queueNotification, statusChangeMessage, paymentReceivedMessage } from "@/lib/notifications";
import { z } from "zod";

export const runtime = "nodejs";

const sendSchema = z.object({
  channel: z.enum(["whatsapp", "sms", "email"]),
  recipient: z.string().min(5).max(80),
  body: z.string().min(1).max(2000),
  templateKey: z.string().max(64).optional(),
  inquiryId: z.number().int().positive().optional(),
  customerId: z.number().int().positive().optional()
});

const quickSchema = z.object({
  type: z.enum(["status_change", "payment_received"]),
  inquiryId: z.number().int().positive().optional(),
  channel: z.enum(["whatsapp", "sms"]).optional().default("whatsapp"),
  statusLabel: z.string().max(60).optional(),
  amount: z.string().max(40).optional(),
  currency: z.string().max(8).optional(),
  receiptNo: z.string().max(40).optional()
});

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  const result = await db.query(
    `select * from notification_log order by created_at desc limit 80`
  );
  return NextResponse.json({ notifications: result.rows });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const json = await request.json();

    if (json.type) {
      const body = quickSchema.parse(json);
      const db = getPool();
      if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

      if (!body.inquiryId) {
        return NextResponse.json({ error: "inquiryId required for quick notify." }, { status: 400 });
      }
      const inq = await db.query(
        `select name, phone, service from inquiries where id = $1`,
        [body.inquiryId]
      );
      if (!inq.rowCount) return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
      const row = inq.rows[0];

      let message = "";
      if (body.type === "status_change") {
        message = statusChangeMessage(row.name, row.service, body.statusLabel || "updated");
      } else {
        message = paymentReceivedMessage(
          row.name,
          body.amount || "0",
          body.currency || "ETB",
          body.receiptNo
        );
      }

      const result = await queueNotification({
        channel: body.channel,
        recipient: row.phone,
        body: message,
        templateKey: body.type,
        inquiryId: body.inquiryId
      });
      return NextResponse.json(result);
    }

    const body = sendSchema.parse(json);
    const result = await queueNotification(body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
