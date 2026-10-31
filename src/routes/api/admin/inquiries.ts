import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/inquiries")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { requireOwner } = await import("@/lib/owner-auth.server");
        const { listInquiries } = await import("@/lib/inquiries.server");
        const gate = await requireOwner(request);
        if (gate instanceof Response) return gate;
        const url = new URL(request.url);
        const inquiries = await listInquiries(url.searchParams.get("q") ?? "", url.searchParams.get("status") ?? "");
        return Response.json({ inquiries }, { headers: { "Cache-Control": "no-store" } });
      },
    },
  },
});
