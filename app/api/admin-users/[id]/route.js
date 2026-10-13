import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const ROLE_MAP = { "Super Administrator": "superadmin", "Administrator": "admin", "Sales Manager": "sales_manager", "Catalogue Manager": "catalogue_manager" };
const STATUS_MAP = { Active: "active", Inactive: "inactive" };

async function getAuth() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  if (!session) return null;
  const db = await getDatabase();
  const current = await db.collection("admins").findOne({ email: String(session.email).toLowerCase() });
  if (!current || current.status !== "active" || current.role !== "superadmin") return null;
  return { db, current };
}
function safeAdmin(doc) {
  const display = { superadmin: "Super Administrator", admin: "Administrator", sales_manager: "Sales Manager", catalogue_manager: "Catalogue Manager" };
  return { id: String(doc._id), name: doc.name || "", email: doc.email || "", role: display[doc.role] || "Administrator", status: doc.status === "active" ? "Active" : "Inactive", lastLogin: doc.lastLoginAt ? new Date(doc.lastLoginAt).toLocaleString("en-GB") : "Never", created: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("en-GB") : "", initials: String(doc.name || "").split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase() };
}
export async function PATCH(request, { params }) {
  const auth = await getAuth();
  if (!auth) return NextResponse.json({ error: "Super Admin access required" }, { status: 403 });
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid admin ID" }, { status: 400 });
    const target = await auth.db.collection("admins").findOne({ _id: new ObjectId(id) });
    if (!target) return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    const body = await request.json();
    const update = { updatedAt: new Date() };
    if (body.name !== undefined) {
      const name = String(body.name).trim();
      if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
      update.name = name;
    }
    if (body.email !== undefined) {
      const email = String(body.email).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
      if (await auth.db.collection("admins").findOne({ email, _id: { $ne: target._id } })) return NextResponse.json({ error: "An admin with this email already exists" }, { status: 409 });
      update.email = email;
    }
    if (body.role !== undefined) {
      const role = ROLE_MAP[String(body.role)];
      if (!role) return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      if (role === "superadmin" && target.role !== "superadmin") return NextResponse.json({ error: "Super Admin promotion must be handled through a controlled server-side process." }, { status: 403 });
      if (target.role === "superadmin" && role !== "superadmin") {
        const count = await auth.db.collection("admins").countDocuments({ role: "superadmin", status: "active" });
        if (count <= 1) return NextResponse.json({ error: "Cannot demote the last active Super Admin." }, { status: 409 });
      }
      update.role = role;
    }
    if (body.status !== undefined) {
      const status = STATUS_MAP[String(body.status)];
      if (!status) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      if (target._id.equals(auth.current._id) && status !== "active") return NextResponse.json({ error: "You cannot deactivate your own account." }, { status: 409 });
      if (target.role === "superadmin" && status !== "active") {
        const count = await auth.db.collection("admins").countDocuments({ role: "superadmin", status: "active" });
        if (count <= 1) return NextResponse.json({ error: "Cannot deactivate the last active Super Admin." }, { status: 409 });
      }
      update.status = status;
    }
    if (body.password) {
      if (String(body.password).length < 12) return NextResponse.json({ error: "Password must be at least 12 characters." }, { status: 400 });
      const { hashPassword } = await import("@/lib/auth/password");
      update.passwordHash = hashPassword(String(body.password));
    }
    await auth.db.collection("admins").updateOne({ _id: target._id }, { $set: update });
    const saved = await auth.db.collection("admins").findOne({ _id: target._id }, { projection: { passwordHash: 0 } });
    return NextResponse.json({ admin: safeAdmin(saved) });
  } catch (error) {
    if (error?.code === 11000) return NextResponse.json({ error: "An admin with this email already exists." }, { status: 409 });
    console.error("Admin user update failed:", error);
    return NextResponse.json({ error: "Could not update admin user" }, { status: 500 });
  }
}
export async function DELETE(request, { params }) {
  const auth = await getAuth();
  if (!auth) return NextResponse.json({ error: "Super Admin access required" }, { status: 403 });
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid admin ID" }, { status: 400 });
    const target = await auth.db.collection("admins").findOne({ _id: new ObjectId(id) });
    if (!target) return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    if (target._id.equals(auth.current._id)) return NextResponse.json({ error: "You cannot delete your own account." }, { status: 409 });
    if (target.role === "superadmin" && target.status === "active") {
      const count = await auth.db.collection("admins").countDocuments({ role: "superadmin", status: "active" });
      if (count <= 1) return NextResponse.json({ error: "Cannot delete the last active Super Admin." }, { status: 409 });
    }
    await auth.db.collection("admins").deleteOne({ _id: target._id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin user delete failed:", error);
    return NextResponse.json({ error: "Could not delete admin user" }, { status: 500 });
  }
}
