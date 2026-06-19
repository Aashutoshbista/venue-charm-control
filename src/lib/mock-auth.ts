export type Role = "admin" | "staff";

export interface Session {
  email: string;
  name: string;
  role: Role;
}

const KEY = "admin-panel-session";

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function signIn(email: string, password: string): Session | null {
  // Demo accounts
  const accounts: Record<string, { password: string; name: string; role: Role }> = {
    "admin@demo.com": { password: "admin123", name: "Alex Admin", role: "admin" },
    "staff@demo.com": { password: "staff123", name: "Sam Staff", role: "staff" },
  };
  const acc = accounts[email.toLowerCase()];
  if (!acc || acc.password !== password) return null;
  const session: Session = { email: email.toLowerCase(), name: acc.name, role: acc.role };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function signOut() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
