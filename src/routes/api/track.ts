import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { rateLimit, sameOrigin } = await import("@/lib/owner-auth.server");
        const { trackInquiry } = await import("@/lib/inquiries.server");
        const { phoneKey } = await import("@/lib/catalog");
        if (!sameOrigin(request)) return Response.json({ error: "bad_origin" }, { status: 403 });
        if (!rateLimit(request, "track", 30, 10 * 60 * 1000)) {
          return Response.json({ error: "rate" }, { status: 429 });
        }
        let body: { reference?: unknown; phone?: unknown };
        try {
          body = (await request.json()) as { reference?: unknown; phone?: unknown };
        } catch {
          return Response.json({ error: "validation" }, { status: 400 });
        }
        const reference = String(body.reference ?? "").trim().slice(0, 20);
        const phone = String(body.phone ?? "").trim().slice(0, 24);
        if (!/^ETT-[A-Z0-9]{6}$/i.test(reference) || phoneKey(phone).length < 9) {
          return Response.json({ error: "not_found" }, { status: 404 });
        }
        const file = await trackInquiry(reference, phone);
        if (!file) return Response.json({ error: "not_found" }, { status: 404 });
        return Response.json(file, { headers: { "Cache-Control": "no-store" } });
      },
    },
  },
});
