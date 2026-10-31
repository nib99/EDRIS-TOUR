import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/inquiries")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { rateLimit, sameOrigin } = await import("@/lib/owner-auth.server");
        const { validateInquiry } = await import("@/lib/inquiry-validate");
        const { createInquiry } = await import("@/lib/inquiries.server");
        if (!sameOrigin(request)) return Response.json({ error: "bad_origin" }, { status: 403 });
        if (!rateLimit(request, "inquiry", 20, 10 * 60 * 1000)) {
          return Response.json({ error: "rate", field: "rate" }, { status: 429 });
        }
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "validation", field: "generic" }, { status: 400 });
        }
        const parsed = validateInquiry(body);
        if (!parsed.ok) return Response.json({ error: "validation", field: parsed.field }, { status: 400 });
        try {
          const created = await createInquiry(parsed.value);
          return Response.json(created, { status: 201 });
        } catch (error) {
          console.error(error);
          return Response.json({ error: "server", field: "generic" }, { status: 500 });
        }
      },
    },
  },
});
