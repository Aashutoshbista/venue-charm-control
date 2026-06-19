import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { reports as initial, type Report, type ReportStatus } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/reports")({
  head: () => ({ meta: [{ title: "Reports — Venue Admin" }] }),
  component: ReportsPage,
});

const tone: Record<ReportStatus, string> = {
  open: "bg-destructive/15 text-destructive border-destructive/30",
  investigating: "bg-warning/15 text-warning-foreground border-warning/30",
  resolved: "bg-success/15 text-success border-success/30",
};

function ReportsPage() {
  const [list, setList] = useState<Report[]>(initial);

  const setStatus = (id: string, status: ReportStatus) => {
    setList((l) => l.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(`Marked as ${status}`);
  };

  return (
    <AdminShell title="Reports">
      <p className="text-sm text-muted-foreground">Complaints raised by users against venues or other accounts.</p>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-mono text-muted-foreground">{r.id}</div>
                <h3 className="mt-1 font-semibold leading-tight">{r.subject}</h3>
              </div>
              <span className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${tone[r.status]}`}>
                {r.status}
              </span>
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <div>
                <span className="text-muted-foreground">Target: </span>
                <span className="font-medium">{r.target}</span>
              </div>
              <div className="text-muted-foreground">
                Reported by {r.by} · {r.date}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "investigating")}>Investigate</Button>
              <Button size="sm" onClick={() => setStatus(r.id, "resolved")}>Resolve</Button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
