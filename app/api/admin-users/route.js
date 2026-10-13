import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabase } from "@/lib/mongodb";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROLE_MAP = {
  "Super Administrator": "superadmin",
  "Administrator": "admin",
  "Sales Manager": "sales_manager",
  "Catalogue Manager": "catalogue_manager",
};
const DISPLAY_ROLE = Object.fromEntries(Object.entries(ROLE_MAP).map(([label, key]) => [key, label]));
const STATUS_MAP = { Active: "active", Inactive: "inactive" };

async function requireSuperAdmin() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  if (!session) return null;
  const db = await getDatabase();
  const current = await db.collection("admins").findOne({ email: String(session.email).toLowerCase() });
  if (!current || current.status !== "active" || current.role !== "superadmin") return null;
  return { session, current };
}
function safeAdmin(doc) {
  return {
    id: String(doc._id),
    name: doc.name || "",
    email: doc.email || "",
    role: DISPLAY_ROLE[doc.role] || doc.role || "Administrator",
    status: doc.status === "active" ? "Active" : "Inactive",
    lastLogin: doc.lastLoginAt ? new Date(doc.lastLoginAt).toLocaleString("en-GB") : "Never",
    created: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("en-GB") : "",
    initials: String(doc.name || "").split(/\s+/).filter(Boolean).slice(0, 2).map(x => x[0]).join("").toUpperCase(),
  };
}
export async function GET() {
  const auth = await requireSuperAdmin();
  if (!auth) return NextResponse.json({ error: "Super Admin access required" }, { status: 403 });
  try {
    const db = await getDatabase();
    const docs = await db.collection("admins").find({}, { projection: { passwordHash: 0 } }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ admins: docs.map(safeAdmin) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin users list failed:", error);
    return NextResponse.json({ error: "Could not load admin users" }, { status: 500 });
  }
}
export async function POST(request) {
  const auth = await requireSuperAdmin();
  if (!auth) return NextResponse.json({ error: "Super Admin access required" }, { status: 403 });
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const roleLabel = String(body.role || "Administrator");
    const role = ROLE_MAP[roleLabel];
    const status = STATUS_MAP[body.status] || "active";
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid name and email." }, { status: 400 });
    if (password.length < 12) return NextResponse.json({ error: "Password must be at least 12 characters." }, { status: 400 });
    if (!role || role === "superadmin") return NextResponse.json({ error: "Only an existing Super Admin can create or promote a Super Admin." }, { status: 400 });
    const { hashPassword } = await import("@/lib/auth/password");
    const db = await getDatabase();
    const admins = db.collection("admins");
    await admins.createIndex({ email: 1 }, { unique: true });
    if (await admins.findOne({ email })) return NextResponse.json({ error: "An admin with this email already exists." }, { status: 409 });
    const now = new Date();
    const doc = { name, email, passwordHash: hashPassword(password), role, status, createdAt: now, updatedAt: now, lastLoginAt: null };
    const result = await admins.insertOne(doc);
    return NextResponse.json({ admin: safeAdmin({ ...doc, _id: result.insertedId }) }, { status: 201 });
  } catch (error) {
    if (error?.code === 11000) return NextResponse.json({ error: "An admin with this email already exists." }, { status: 409 });
    console.error("Admin user create failed:", error);
    return NextResponse.json({ error: "Could not create admin user" }, { status: 500 });
  }
}
