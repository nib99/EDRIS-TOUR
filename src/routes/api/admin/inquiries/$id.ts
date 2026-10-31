import { createFileRoute } from "@tanstack/react-router";
import { isCheckState, isPaymentStatus, isStatus } from "@/lib/catalog";

export const Route = createFileRoute("/api/admin/inquiries/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { requireOwner } = await import("@/lib/owner-auth.server");
        const { getInquiry } = await import("@/lib/inquiries.server");
        const gate = await requireOwner(request);
        if (gate instanceof Response) return gate;
        const inquiry = await getInquiry(params.id);
        if (!inquiry) return Response.json({ error: "not_found" }, { status: 404 });
        return Response.json(inquiry, { headers: { "Cache-Control": "no-store" } });
      },
      PATCH: async ({ request, params }) => {
        const { requireOwner } = await import("@/lib/owner-auth.server");
        const { patchInquiry } = await import("@/lib/inquiries.server");
        const gate = await requireOwner(request);
        if (gate instanceof Response) return gate;
        let body: Record<string, unknown>;
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          return Response.json({ error: "validation" }, { status: 400 });
        }
        if (body.status !== undefined && (typeof body.status !== "string" || !isStatus(body.status))) {
          return Response.json({ error: "validation" }, { status: 400 });
        }
        if (
          body.paymentStatus !== undefined &&
          (typeof body.paymentStatus !== "string" || !isPaymentStatus(body.paymentStatus))
        ) {
          return Response.json({ error: "validation" }, { status: 400 });
        }
        const checklist = Array.isArray(body.checklist) ? body.checklist : undefined;
        if (checklist) {
          for (const item of checklist) {
            if (!item || typeof item !== "object") return Response.json({ error: "validation" }, { status: 400 });
            const row = item as { id?: unknown; state?: unknown };
            if (typeof row.id !== "number" || typeof row.state !== "string" || !isCheckState(row.state)) {
              return Response.json({ error: "validation" }, { status: 400 });
            }
          }
        }
        const text = (value: unknown, max: number) =>
          value == null ? null : String(value).replace(/[\u0000-\u001F]/g, "").trim().slice(0, max);
        let paymentAmount: number | null | undefined;
        if (body.paymentAmount === undefined) paymentAmount = undefined;
        else if (body.paymentAmount == null || body.paymentAmount === "") paymentAmount = null;
        else {
          const amount = Number(body.paymentAmount);
          if (!Number.isFinite(amount) || amount < 0 || amount > 100000000) {
            return Response.json({ error: "validation" }, { status: 400 });
          }
          paymentAmount = Math.round(amount * 100) / 100;
        }
        const updated = await patchInquiry(params.id, {
          status: body.status as never,
          appendNote: typeof body.appendNote === "string" ? body.appendNote.slice(0, 500) : undefined,
          assignedStaff: body.assignedStaff === undefined ? undefined : text(body.assignedStaff, 80),
          paymentAmount,
          paymentStatus: body.paymentStatus as never,
          paymentMethod: body.paymentMethod === undefined ? undefined : text(body.paymentMethod, 40),
          receiptNumber: body.receiptNumber === undefined ? undefined : text(body.receiptNumber, 40),
          applicationRef: body.applicationRef === undefined ? undefined : text(body.applicationRef, 40),
          applicationAuthority: body.applicationAuthority === undefined ? undefined : text(body.applicationAuthority, 80),
          checklist: checklist as Array<{ id: number; state: "missing" | "received" | "verified" }> | undefined,
        });
        if (!updated) return Response.json({ error: "not_found" }, { status: 404 });
        return Response.json(updated, { headers: { "Cache-Control": "no-store" } });
      },
    },
  },
});
