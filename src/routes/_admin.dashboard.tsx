import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { stats, bookings, reports, revenueSeries } from "@/lib/mock-data";
import { Building2, Users, CalendarCheck, IndianRupee, Flag, MessageSquare, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_admin/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Venue Admin" }] }),
  component: Dashboard,
});

const cards = [
  { label: "Total users", value: stats.users.toLocaleString(), icon: Users, delta: "+8.2%", tone: "success" as const },
  { label: "Active venues", value: stats.venues, icon: Building2, delta: "+3", tone: "success" as const },
  { label: "Bookings (mo)", value: stats.bookings, icon: CalendarCheck, delta: "+12%", tone: "success" as const },
  { label: "Revenue", value: `₹${(stats.revenue / 100000).toFixed(1)}L`, icon: IndianRupee, delta: "+5.4%", tone: "success" as const },
  { label: "Open reports", value: stats.reports, icon: Flag, delta: "2 new", tone: "warning" as const },
  { label: "Unread messages", value: stats.unreadMessages, icon: MessageSquare, delta: "today", tone: "default" as const },
];

function Dashboard() {
  const max = Math.max(...revenueSeries.map((r) => r.v));
  return (
    <AdminShell title="Dashboard">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => {
          const Icon = c.icon;
          const toneClass =
            c.tone === "success"
              ? "text-success"
              : c.tone === "warning"
              ? "text-warning"
              : "text-muted-foreground";
          return (
            <div key={c.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`text-xs font-medium ${toneClass}`}>{c.delta}</span>
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-tight">{c.value}</div>
              <div className="text-xs text-muted-foreground">{c.label}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Revenue trend</h2>
              <p className="text-xs text-muted-foreground">Last 7 months (₹ thousands)</p>
            </div>
            <span className="flex items-center gap-1 text-xs text-success">
              <TrendingUp className="h-3.5 w-3.5" /> +18% YoY
            </span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-2 sm:gap-4">
            {revenueSeries.map((r) => (
              <div key={r.m} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary/60"
                  style={{ height: `${(r.v / max) * 100}%` }}
                  title={`₹${r.v}k`}
                />
                <span className="text-xs text-muted-foreground">{r.m}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-semibold">Recent reports</h2>
          <p className="text-xs text-muted-foreground">Latest user complaints</p>
          <ul className="mt-4 space-y-3">
            {reports.slice(0, 4).map((r) => (
              <li key={r.id} className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{r.subject}</div>
                  <div className="truncate text-xs text-muted-foreground">{r.target} · by {r.by}</div>
                </div>
                <Badge variant={r.status === "resolved" ? "secondary" : "default"} className="capitalize">
                  {r.status}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold">Recent bookings</h2>
          <span className="text-xs text-muted-foreground">{bookings.length} shown</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Venue</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium text-right">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="px-5 py-3 font-mono text-xs">{b.id}</td>
                  <td className="px-5 py-3">{b.venue}</td>
                  <td className="px-5 py-3 text-muted-foreground">{b.customer}</td>
                  <td className="px-5 py-3 text-muted-foreground">{b.date}</td>
                  <td className="px-5 py-3 text-right">₹{b.amount.toLocaleString()}</td>
                  <td className="px-5 py-3"><BookingBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

function BookingBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: "bg-success/15 text-success border-success/30",
    pending: "bg-warning/15 text-warning-foreground border-warning/30",
    cancelled: "bg-destructive/15 text-destructive border-destructive/30",
    completed: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${map[status]}`}>
      {status}
    </span>
  );
}
