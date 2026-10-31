import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/setup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { setupOwner } = await import("@/lib/owner-auth.server");
        let password = "";
        try {
          const body = (await request.json()) as { password?: unknown };
          password = String(body.password ?? "");
        } catch {
          return Response.json({ error: "validation" }, { status: 400 });
        }
        return setupOwner(request, password);
      },
    },
  },
});
