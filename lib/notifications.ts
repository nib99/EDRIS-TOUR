/**
 * Notification hooks for WhatsApp / SMS.
 *
 * Phase 3 ships a durable queue + log. Wire a real provider by setting
 * env vars and implementing sendViaProvider below.
 *
 * Suggested Ethiopian providers:
 *   - Twilio (SMS / WhatsApp)
 *   - Africa's Talking
 *   - Telebirr business messaging (when available)
 *   - Local SMS gateways
 *
 * Env (optional):
 *   NOTIFY_PROVIDER=none|twilio|africas_talking|custom
 *   TWILIO_ACCOUNT_SID=
 *   TWILIO_AUTH_TOKEN=
 *   TWILIO_FROM=
 *   WHATSAPP_FROM=whatsapp:+251...
 */

import { getPool } from "./db";

export type NotifyChannel = "whatsapp" | "sms" | "email";

export type NotifyPayload = {
  channel: NotifyChannel;
  recipient: string;
  body: string;
  templateKey?: string;
  inquiryId?: number;
  customerId?: number;
};

export async function queueNotification(payload: NotifyPayload) {
  const db = getPool();
  if (!db) return { ok: false as const, error: "Database not configured." };

  const provider = (process.env.NOTIFY_PROVIDER || "none").toLowerCase();
  let status: "queued" | "sent" | "failed" | "skipped" = "queued";
  let providerRef = "";
  let errorMessage = "";
  let sentAt: string | null = null;

  if (provider === "none") {
    status = "skipped";
    errorMessage = "NOTIFY_PROVIDER is not configured; logged only.";
  } else {
    try {
      const result = await sendViaProvider(provider, payload);
      status = result.ok ? "sent" : "failed";
      providerRef = result.ref || "";
      errorMessage = result.error || "";
      if (result.ok) sentAt = new Date().toISOString();
    } catch (err) {
      status = "failed";
      errorMessage = err instanceof Error ? err.message : "Provider error";
    }
  }

  const row = await db.query(
    `insert into notification_log
       (channel, recipient, template_key, body, status, provider_ref, inquiry_id, customer_id, error_message, sent_at)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     returning id, status`,
    [
      payload.channel,
      payload.recipient,
      payload.templateKey || "",
      payload.body,
      status,
      providerRef,
      payload.inquiryId || null,
      payload.customerId || null,
      errorMessage,
      sentAt
    ]
  );

  return { ok: true as const, id: row.rows[0].id as number, status: row.rows[0].status as string };
}

async function sendViaProvider(
  provider: string,
  payload: NotifyPayload
): Promise<{ ok: boolean; ref?: string; error?: string }> {
  // Architecture stub — implement real HTTP calls here.
  // Keep secrets in env; never log tokens.
  if (provider === "twilio") {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from =
      payload.channel === "whatsapp"
        ? process.env.WHATSAPP_FROM || process.env.TWILIO_FROM
        : process.env.TWILIO_FROM;
    if (!sid || !token || !from) {
      return { ok: false, error: "Twilio credentials incomplete." };
    }
    // Example shape (uncomment when ready):
    // const auth = Buffer.from(`${sid}:${token}`).toString("base64");
    // const to = payload.channel === "whatsapp" ? `whatsapp:${payload.recipient}` : payload.recipient;
    // const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    //   method: "POST",
    //   headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    //   body: new URLSearchParams({ From: from, To: to, Body: payload.body })
    // });
    // ...
    return { ok: false, error: "Twilio integration scaffolded — enable in lib/notifications.ts" };
  }

  if (provider === "africas_talking") {
    return { ok: false, error: "Africa's Talking scaffolded — enable in lib/notifications.ts" };
  }

  return { ok: false, error: `Unknown NOTIFY_PROVIDER: ${provider}` };
}

/** Convenience templates for common owner actions */
export function statusChangeMessage(name: string, service: string, statusLabel: string) {
  return `Selam ${name}, EDRIS Tour & Travel: your ${service} request is now "${statusLabel}". Call us if you need help.`;
}

export function paymentReceivedMessage(name: string, amount: string, currency: string, receiptNo?: string) {
  const ref = receiptNo ? ` Receipt: ${receiptNo}.` : "";
  return `Selam ${name}, we received ${amount} ${currency}.${ref} Thank you — EDRIS Tour & Travel.`;
}
