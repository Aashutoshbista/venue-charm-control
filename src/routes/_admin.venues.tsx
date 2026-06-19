import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { venues as initial, type Venue, type VenueStatus } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, PauseCircle, Ban, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/venues")({
  head: () => ({ meta: [{ title: "Venues — Venue Admin" }] }),
  component: VenuesPage,
});

const statusStyle: Record<VenueStatus, string> = {
  active: "bg-success/15 text-success border-success/30",
  suspended: "bg-warning/15 text-warning-foreground border-warning/30",
  blocked: "bg-destructive/15 text-destructive border-destructive/30",
  pending: "bg-muted text-muted-foreground border-border",
};

function VenuesPage() {
  const [list, setList] = useState<Venue[]>(initial);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | VenueStatus>("all");

  const filtered = list.filter(
    (v) =>
      (filter === "all" || v.status === filter) &&
      (q === "" ||
        v.name.toLowerCase().includes(q.toLowerCase()) ||
        v.owner.toLowerCase().includes(q.toLowerCase()) ||
        v.city.toLowerCase().includes(q.toLowerCase())),
  );

  const setStatus = (id: string, status: VenueStatus, msg: string) => {
    setList((l) => l.map((v) => (v.id === id ? { ...v, status } : v)));
    toast.success(msg);
  };

  const remove = (id: string) => {
    setList((l) => l.filter((v) => v.id !== id));
    toast.success("Venue deleted");
  };

  return (
    <AdminShell title="Venues">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Owners sign up on the venue management site. Here you can suspend, block or remove listings.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, owner or city"
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["all", "active", "pending", "suspended", "blocked"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${
                filter === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
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
                <th className="px-5 py-3 font-medium">Venue</th>
                <th className="px-5 py-3 font-medium">Owner</th>
                <th className="px-5 py-3 font-medium">City</th>
                <th className="px-5 py-3 font-medium text-right">Capacity</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Listed</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium">{v.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{v.owner}</td>
                  <td className="px-5 py-3 text-muted-foreground">{v.city}</td>
                  <td className="px-5 py-3 text-right">{v.capacity}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusStyle[v.status]}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{v.createdAt}</td>
                  <td className="px-5 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setStatus(v.id, "active", `${v.name} activated`)}>
                          <CheckCircle2 className="h-4 w-4" /> Activate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus(v.id, "suspended", `${v.name} suspended`)}>
                          <PauseCircle className="h-4 w-4" /> Suspend
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus(v.id, "blocked", `${v.name} blocked`)}>
                          <Ban className="h-4 w-4" /> Block
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => remove(v.id)} className="text-destructive focus:text-destructive">
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    No venues match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
