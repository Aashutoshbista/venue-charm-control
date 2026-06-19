import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AdminShell } from "@/components/admin-shell";
import { team as initial, type TeamMember } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/team")({
  head: () => ({ meta: [{ title: "Team — Venue Admin" }] }),
  component: TeamPage,
});

function TeamPage() {
  const [list, setList] = useState<TeamMember[]>(initial);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "staff">("staff");

  const invite = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    const id = `t${Date.now()}`;
    const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    setList((l) => [
      ...l,
      { id, name, email, role, status: "invited", joined: new Date().toISOString().slice(0, 10) },
    ]);
    toast.success(`Invite sent to ${email}`, {
      description: `They'll receive a link to join as ${role}.`,
    });
    setEmail("");
    setRole("staff");
  };

  const remove = (id: string) => {
    setList((l) => l.filter((m) => m.id !== id));
    toast.success("Member removed");
  };

  const copyLink = (m: TeamMember) => {
    const link = `${window.location.origin}/invite/${m.id}-${Math.random().toString(36).slice(2, 8)}`;
    navigator.clipboard.writeText(link).catch(() => {});
    toast.success("Invite link copied", { description: link });
  };

  return (
    <AdminShell title="Team & invites">
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold">Members</h2>
            <p className="text-xs text-muted-foreground">Admins and staff with access to this panel.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {list.map((m) => (
                  <tr key={m.id} className="border-t border-border">
                    <td className="px-5 py-3">
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.email}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium capitalize">
                        {m.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${
                          m.status === "active"
                            ? "bg-success/15 text-success border-success/30"
                            : "bg-warning/15 text-warning-foreground border-warning/30"
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        {m.status === "invited" && (
                          <Button variant="ghost" size="sm" onClick={() => copyLink(m)}>
                            <Copy className="h-3.5 w-3.5" /> Link
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => remove(m.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <form onSubmit={invite} className="h-fit rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-semibold leading-tight">Invite a teammate</h2>
              <p className="text-xs text-muted-foreground">They'll get an email with a join link.</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as "admin" | "staff")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin — full access</SelectItem>
                  <SelectItem value="staff">Staff — limited access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              <Send className="h-4 w-4" /> Send invite
            </Button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
