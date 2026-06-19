import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { users as initial, type UserRow } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Ban, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/users")({
  head: () => ({ meta: [{ title: "Users — Venue Admin" }] }),
  component: UsersPage,
});

function UsersPage() {
  const [list, setList] = useState<UserRow[]>(initial);
  const [q, setQ] = useState("");
  const filtered = list.filter(
    (u) => q === "" || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()),
  );

  const toggleBlock = (id: string) => {
    setList((l) =>
      l.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "blocked" : "active" } : u)),
    );
    const u = list.find((x) => x.id === id);
    toast.success(u && u.status === "active" ? "User blocked" : "User unblocked");
  };

  return (
    <AdminShell title="Users">
      <p className="text-sm text-muted-foreground">
        End-users register on the public site. You can block accounts that violate policy.
      </p>

      <div className="mt-4 relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users" className="pl-8 sm:max-w-md" />
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium text-right">Bookings</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {u.name.slice(0, 1)}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-5 py-3 text-muted-foreground">{u.joined}</td>
                  <td className="px-5 py-3 text-right">{u.bookings}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${
                        u.status === "active"
                          ? "bg-success/15 text-success border-success/30"
                          : "bg-destructive/15 text-destructive border-destructive/30"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      variant={u.status === "active" ? "outline" : "default"}
                      size="sm"
                      onClick={() => toggleBlock(u.id)}
                    >
                      {u.status === "active" ? (
                        <>
                          <Ban className="h-3.5 w-3.5" /> Block
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Unblock
                        </>
                      )}
                    </Button>
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
