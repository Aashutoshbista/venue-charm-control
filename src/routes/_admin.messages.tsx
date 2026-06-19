import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { messages as initial, type Message } from "@/lib/mock-data";

export const Route = createFileRoute("/_admin/messages")({
  head: () => ({ meta: [{ title: "Messages — Venue Admin" }] }),
  component: MessagesPage,
});

function MessagesPage() {
  const [list, setList] = useState<Message[]>(initial);
  const [active, setActive] = useState<string>(initial[0]?.id ?? "");
  const current = list.find((m) => m.id === active);

  const open = (id: string) => {
    setActive(id);
    setList((l) => l.map((m) => (m.id === id ? { ...m, unread: false } : m)));
  };

  return (
    <AdminShell title="Messages">
      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <ul className="divide-y divide-border">
            {list.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => open(m.id)}
                  className={`w-full text-left px-4 py-3 transition-colors hover:bg-muted/60 ${
                    active === m.id ? "bg-accent/60" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 truncate text-sm font-medium">{m.from}</div>
                    {m.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                  <div className="mt-0.5 truncate text-sm">{m.subject}</div>
                  <div className="truncate text-xs text-muted-foreground">{m.preview}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{m.date}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          {current ? (
            <>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <div className="text-xs text-muted-foreground">{current.from}</div>
                  <h2 className="text-lg font-semibold">{current.subject}</h2>
                </div>
                <div className="text-xs text-muted-foreground">{current.date}</div>
              </div>
              <div className="prose prose-sm mt-4 max-w-none text-sm leading-relaxed text-foreground/90">
                <p>{current.preview}</p>
                <p>
                  Hi team, please look into this at your earliest convenience. I've attached the booking ID and the
                  relevant conversation history in our shared workspace.
                </p>
                <p>Thanks,<br />{current.from}</p>
              </div>
              <div className="mt-6 rounded-lg border border-border bg-background p-3">
                <textarea
                  placeholder="Write a reply…"
                  rows={3}
                  className="w-full resize-none bg-transparent text-sm outline-none"
                />
                <div className="mt-2 flex justify-end">
                  <button className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Send reply
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="grid h-full place-items-center text-sm text-muted-foreground">Select a message</div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
