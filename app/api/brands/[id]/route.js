import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { saveCatalog, removeCatalog } from "@/lib/catalog";
export const runtime = "nodejs";
async function isAdmin() { const session = await verifySessionToken((await cookies()).get(COOKIE_NAME)?.value); return Boolean(session && ["superadmin", "Super Administrator", "admin"].includes(session.role)); }
const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });
export async function PATCH(request, { params }) {
  if (!await isAdmin()) return unauthorized();
  try { const { id } = await params; const result = await saveCatalog("brands", await request.json(), id); if (result.error) return NextResponse.json({ error: result.error }, { status: result.status }); return NextResponse.json({ brand: result.record }); }
  catch (error) { console.error("brands update error:", error); return NextResponse.json({ error: "Could not update record" }, { status: 500 }); }
}
export async function DELETE(request, { params }) {
  if (!await isAdmin()) return unauthorized();
  try { const { id } = await params; const result = await removeCatalog("brands", id); if (result.error) return NextResponse.json({ error: result.error }, { status: result.status }); return NextResponse.json(result); }
  catch (error) { console.error("brands delete error:", error); return NextResponse.json({ error: "Could not delete record" }, { status: 500 }); }
}
