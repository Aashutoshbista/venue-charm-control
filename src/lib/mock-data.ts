export type VenueStatus = "active" | "suspended" | "blocked" | "pending";
export type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed";
export type ReportStatus = "open" | "investigating" | "resolved";

export interface Venue {
  id: string;
  name: string;
  owner: string;
  city: string;
  capacity: number;
  status: VenueStatus;
  createdAt: string;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  joined: string;
  bookings: number;
  status: "active" | "blocked";
}

export interface Booking {
  id: string;
  venue: string;
  customer: string;
  date: string;
  guests: number;
  amount: number;
  status: BookingStatus;
}

export interface Report {
  id: string;
  subject: string;
  target: string;
  by: string;
  date: string;
  status: ReportStatus;
}

export interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  status: "active" | "invited";
  joined: string;
}

export const venues: Venue[] = [
  { id: "v1", name: "Skyline Rooftop", owner: "Maya Patel", city: "Mumbai", capacity: 220, status: "active", createdAt: "2025-08-12" },
  { id: "v2", name: "Garden Pavilion", owner: "Rohan Mehta", city: "Pune", capacity: 380, status: "active", createdAt: "2025-09-03" },
  { id: "v3", name: "Loft 27", owner: "Aisha Khan", city: "Bangalore", capacity: 120, status: "suspended", createdAt: "2025-07-22" },
  { id: "v4", name: "Riverside Hall", owner: "Vikram Singh", city: "Delhi", capacity: 500, status: "active", createdAt: "2025-10-11" },
  { id: "v5", name: "The Warehouse", owner: "Neha Gupta", city: "Hyderabad", capacity: 800, status: "blocked", createdAt: "2025-06-30" },
  { id: "v6", name: "Marina Deck", owner: "Karan Verma", city: "Goa", capacity: 180, status: "pending", createdAt: "2025-11-01" },
  { id: "v7", name: "The Atrium", owner: "Sneha Iyer", city: "Chennai", capacity: 260, status: "active", createdAt: "2025-09-19" },
];

export const users: UserRow[] = [
  { id: "u1", name: "Priya Sharma", email: "priya@example.com", joined: "2025-04-12", bookings: 8, status: "active" },
  { id: "u2", name: "Arjun Kapoor", email: "arjun@example.com", joined: "2025-05-22", bookings: 3, status: "active" },
  { id: "u3", name: "Tanvi Rao", email: "tanvi@example.com", joined: "2025-06-08", bookings: 14, status: "active" },
  { id: "u4", name: "Devansh Joshi", email: "devansh@example.com", joined: "2025-06-30", bookings: 1, status: "blocked" },
  { id: "u5", name: "Meera Nair", email: "meera@example.com", joined: "2025-07-14", bookings: 6, status: "active" },
  { id: "u6", name: "Ishaan Bose", email: "ishaan@example.com", joined: "2025-08-02", bookings: 2, status: "active" },
];

export const bookings: Booking[] = [
  { id: "BK-1042", venue: "Skyline Rooftop", customer: "Priya Sharma", date: "2026-07-12", guests: 80, amount: 42000, status: "confirmed" },
  { id: "BK-1043", venue: "Garden Pavilion", customer: "Arjun Kapoor", date: "2026-07-15", guests: 200, amount: 115000, status: "pending" },
  { id: "BK-1044", venue: "Loft 27", customer: "Tanvi Rao", date: "2026-06-28", guests: 60, amount: 28000, status: "completed" },
  { id: "BK-1045", venue: "Riverside Hall", customer: "Meera Nair", date: "2026-08-04", guests: 320, amount: 175000, status: "confirmed" },
  { id: "BK-1046", venue: "The Atrium", customer: "Ishaan Bose", date: "2026-07-22", guests: 140, amount: 64000, status: "cancelled" },
  { id: "BK-1047", venue: "Marina Deck", customer: "Devansh Joshi", date: "2026-09-01", guests: 90, amount: 38500, status: "pending" },
];

export const reports: Report[] = [
  { id: "R-201", subject: "Misleading photos", target: "Loft 27", by: "Priya Sharma", date: "2026-06-10", status: "open" },
  { id: "R-202", subject: "Unresponsive owner", target: "The Warehouse", by: "Arjun Kapoor", date: "2026-06-08", status: "investigating" },
  { id: "R-203", subject: "Capacity dispute", target: "Garden Pavilion", by: "Tanvi Rao", date: "2026-06-02", status: "resolved" },
  { id: "R-204", subject: "Hidden charges", target: "Marina Deck", by: "Meera Nair", date: "2026-05-29", status: "open" },
];

export const messages: Message[] = [
  { id: "m1", from: "Maya Patel (owner)", subject: "Pending payout query", preview: "Hi team, my last payout for Skyline Rooftop seems delayed...", date: "2026-06-18", unread: true },
  { id: "m2", from: "Priya Sharma", subject: "Refund request", preview: "I cancelled BK-1041 due to a weather warning and...", date: "2026-06-18", unread: true },
  { id: "m3", from: "Rohan Mehta (owner)", subject: "Listing approval", preview: "Could you review my second listing? It's been...", date: "2026-06-17", unread: false },
  { id: "m4", from: "Support", subject: "Weekly digest", preview: "12 new venues, 48 bookings, 3 reports opened this week.", date: "2026-06-16", unread: false },
];

export const team: TeamMember[] = [
  { id: "t1", name: "Alex Admin", email: "admin@demo.com", role: "admin", status: "active", joined: "2025-01-04" },
  { id: "t2", name: "Sam Staff", email: "staff@demo.com", role: "staff", status: "active", joined: "2025-03-18" },
  { id: "t3", name: "Nikhil Rao", email: "nikhil@demo.com", role: "staff", status: "invited", joined: "2026-06-15" },
];

export const stats = {
  users: 1284,
  venues: venues.length,
  bookings: 482,
  revenue: 1842300,
  reports: reports.filter((r) => r.status !== "resolved").length,
  unreadMessages: messages.filter((m) => m.unread).length,
};

export const revenueSeries = [
  { m: "Jan", v: 120 },
  { m: "Feb", v: 168 },
  { m: "Mar", v: 142 },
  { m: "Apr", v: 210 },
  { m: "May", v: 188 },
  { m: "Jun", v: 264 },
  { m: "Jul", v: 248 },
];
