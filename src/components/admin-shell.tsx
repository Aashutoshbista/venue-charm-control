import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarCheck,
  Flag,
  MessageSquare,
  UserCog,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
} from "lucide-react";
import { signOut, getSession } from "@/lib/mock-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/venues", label: "Venues", icon: Building2 },
  { to: "/users", label: "Users", icon: Users },
  { to: "/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/reports", label: "Reports", icon: Flag },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/team", label: "Team", icon: UserCog },
] as const;

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const session = getSession();
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <SidebarBody pathname={pathname} onNav={() => setOpen(false)} onSignOut={handleSignOut} session={session} />
      </aside>

      {/* Sidebar — mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-sidebar-border bg-sidebar shadow-xl">
            <SidebarBody pathname={pathname} onNav={() => setOpen(false)} onSignOut={handleSignOut} session={session} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
          <button
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold sm:text-lg">{title}</h1>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search…" className="h-9 w-56 pl-8" />
            </div>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden sm:block text-right leading-tight">
              <div className="text-sm font-medium">{session?.name ?? "Guest"}</div>
              <div className="text-xs capitalize text-muted-foreground">{session?.role ?? "—"}</div>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {(session?.name ?? "?").slice(0, 1)}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarBody({
  pathname,
  onNav,
  onSignOut,
  session,
}: {
  pathname: string;
  onNav: () => void;
  onSignOut: () => void;
  session: ReturnType<typeof getSession>;
}) {
  return (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-bold">
          V
        </div>
        <div className="font-semibold tracking-tight">Venue Admin</div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onNav}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="mb-2 rounded-md bg-sidebar-accent/50 px-3 py-2 text-xs text-sidebar-foreground/80">
          Signed in as <span className="font-medium">{session?.email}</span>
        </div>
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </>
  );
}
