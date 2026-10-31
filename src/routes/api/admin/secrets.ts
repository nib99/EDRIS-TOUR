import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/secrets")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { generateSecrets, requireOwner } = await import("@/lib/owner-auth.server");
        const gate = await requireOwner(request);
        if (gate instanceof Response) return gate;
        return Response.json(generateSecrets(), { headers: { "Cache-Control": "no-store" } });
      },
    },
  },
});
