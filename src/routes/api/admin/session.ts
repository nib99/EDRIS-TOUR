import { createFileRoute } from "@tanstack/react-router";

const noStore = { "Cache-Control": "no-store" };

export const Route = createFileRoute("/api/admin/session")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { authMode, readCookie, verifySession } = await import("@/lib/owner-auth.server");
        const mode = await authMode();
        const token = readCookie(request);
        const authenticated = Boolean(token && (await verifySession(token)));
        if (authenticated) {
          return Response.json({ authenticated: true, mode: mode.mode }, { headers: noStore });
        }
        return Response.json({ authenticated: false, ...mode }, { headers: noStore });
      },
      POST: async ({ request }) => {
        const { loginOwner } = await import("@/lib/owner-auth.server");
        let password = "";
        try {
          const body = (await request.json()) as { password?: unknown };
          password = String(body.password ?? "");
        } catch {
          return Response.json({ error: "validation" }, { status: 400, headers: noStore });
        }
        if (password.length < 1 || password.length > 200) {
          return Response.json({ error: "invalid_password" }, { status: 401, headers: noStore });
        }
        return loginOwner(request, password);
      },
      DELETE: async ({ request }) => {
        const { logoutOwner } = await import("@/lib/owner-auth.server");
        return logoutOwner(request);
      },
    },
  },
});
