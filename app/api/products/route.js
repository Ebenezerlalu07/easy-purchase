import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { readProducts, writeProducts } from "@/lib/products";
import { getDatabase } from "@/lib/mongodb";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });
async function admin() {
  return verifySessionToken((await cookies()).get(COOKIE_NAME)?.value);
}
export async function GET() {
  if (!(await admin())) return unauthorized();
  return NextResponse.json(
    { products: await readProducts() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(request) {
  if (!(await admin())) return unauthorized();
  const body = await request.json().catch(() => null);
  const error = await validate(body);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const products = await readProducts();
  if (
    products.some((p) => p.sku.toLowerCase() === body.sku.trim().toLowerCase())
  )
    return NextResponse.json({ error: "SKU already exists" }, { status: 409 });
  const now = new Date().toISOString();
  const product = {
    ...normalize(body),
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  products.unshift(product);
  await writeProducts(products);
  return NextResponse.json({ product }, { status: 201 });
}
export async function validate(b) {
  if (!b || typeof b !== "object") return "Invalid product";
  for (const key of ["name", "sku", "productLink", "category", "brand"])
    if (typeof b[key] !== "string" || !b[key].trim())
      return `${key} is required`;
  if (
    !Number.isFinite(Number(b.price)) ||
    Number(b.price) < 0 ||
    !Number.isFinite(Number(b.stock)) ||
    Number(b.stock) < 0 ||
    !Number.isInteger(Number(b.stock))
  )
    return "Invalid price or stock";
  if (
    b.oldPrice !== "" &&
    b.oldPrice != null &&
    (!Number.isFinite(Number(b.oldPrice)) || Number(b.oldPrice) < 0)
  )
    return "Invalid old price";
  if (!["Active", "Draft", "Inactive"].includes(b.status))
    return "Invalid status";
  const db = await getDatabase();
  const category = await db
    .collection("categories")
    .findOne({
      name: { $regex: `^${escapeRegex(b.category.trim())}$`, $options: "i" },
      status: "Active",
    });
  if (!category)
    return "Please select an active category from the Categories page";
  const brand = await db
    .collection("brands")
    .findOne({
      name: { $regex: `^${escapeRegex(b.brand.trim())}$`, $options: "i" },
      status: "Active",
    });
  if (!brand) return "Please select an active brand from the Brands page";
  return null;
}
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
export function normalize(b) {
  return {
    name: b.name.trim(),
    sku: b.sku.trim(),
    productLink: b.productLink.trim(),
    category: b.category.trim(),
    brand: b.brand.trim(),
    price: Number(b.price),
    oldPrice: b.oldPrice === "" || b.oldPrice == null ? "" : Number(b.oldPrice),
    // Save the selling unit, e.g. Kg, Piece, Box, Meter
    unit: String(b.unit || "").trim(),
    stock: Number(b.stock),
    status: b.status,
    featured: Boolean(b.featured),
    shortDescription: String(b.shortDescription || ""),
    description: String(b.description || ""),
  };
}
