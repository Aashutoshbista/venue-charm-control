import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { bookings, type BookingStatus } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const Route = createFileRoute("/_admin/bookings")({
  head: () => ({ meta: [{ title: "Bookings — Venue Admin" }] }),
  component: BookingsPage,
});

const tone: Record<BookingStatus, string> = {
  confirmed: "bg-success/15 text-success border-success/30",
  pending: "bg-warning/15 text-warning-foreground border-warning/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
  completed: "bg-muted text-muted-foreground border-border",
};

function BookingsPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const filtered = bookings.filter(
    (b) =>
      (filter === "all" || b.status === filter) &&
      (q === "" || b.id.toLowerCase().includes(q.toLowerCase()) || b.venue.toLowerCase().includes(q.toLowerCase()) || b.customer.toLowerCase().includes(q.toLowerCase())),
  );
  const totalRevenue = filtered.filter((b) => b.status !== "cancelled").reduce((a, b) => a + b.amount, 0);

  return (
    <AdminShell title="Bookings & orders">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Total bookings" value={bookings.length} />
        <Stat label="Confirmed" value={bookings.filter((b) => b.status === "confirmed").length} />
        <Stat label="Revenue (filtered)" value={`₹${totalRevenue.toLocaleString()}`} />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search bookings" className="pl-8" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["all", "confirmed", "pending", "cancelled", "completed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full border px-3 py-1 text-xs capitalize ${
                filter === s ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Venue</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium text-right">Guests</th>
                <th className="px-5 py-3 font-medium text-right">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="px-5 py-3 font-mono text-xs">{b.id}</td>
                  <td className="px-5 py-3 font-medium">{b.venue}</td>
                  <td className="px-5 py-3 text-muted-foreground">{b.customer}</td>
                  <td className="px-5 py-3 text-muted-foreground">{b.date}</td>
                  <td className="px-5 py-3 text-right">{b.guests}</td>
                  <td className="px-5 py-3 text-right">₹{b.amount.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${tone[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
