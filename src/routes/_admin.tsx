import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "@/lib/mock-auth";

export const Route = createFileRoute("/_admin")({
  ssr: false,
  beforeLoad: () => {
    if (!getSession()) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <Outlet />,
});
