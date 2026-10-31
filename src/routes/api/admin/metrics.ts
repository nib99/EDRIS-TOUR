import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/metrics")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { requireOwner } = await import("@/lib/owner-auth.server");
        const { metrics } = await import("@/lib/inquiries.server");
        const gate = await requireOwner(request);
        if (gate instanceof Response) return gate;
        return Response.json(await metrics(), { headers: { "Cache-Control": "no-store" } });
      },
    },
  },
});
