import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PublicChrome } from "@/components/public-chrome";

export const Route = createFileRoute("/_public")({
  component: () => (
    <PublicChrome>
      <Outlet />
    </PublicChrome>
  ),
});
