import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { listCatalog, saveCatalog } from "@/lib/catalog";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });
async function isAdmin() { const session = await verifySessionToken((await cookies()).get(COOKIE_NAME)?.value); return Boolean(session && ["superadmin", "Super Administrator", "admin"].includes(session.role)); }
export async function GET() {
  if (!await isAdmin()) return unauthorized();
  try { return NextResponse.json({ brands: await listCatalog("brands") }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { console.error("brands list error:", error); return NextResponse.json({ error: "Could not load brands" }, { status: 500 }); }
}
export async function POST(request) {
  if (!await isAdmin()) return unauthorized();
  try { const result = await saveCatalog("brands", await request.json()); if (result.error) return NextResponse.json({ error: result.error }, { status: result.status }); return NextResponse.json({ brand: result.record }, { status: result.status || 201 }); }
  catch (error) { console.error("brands create error:", error); return NextResponse.json({ error: "Could not save record" }, { status: 500 }); }
}
