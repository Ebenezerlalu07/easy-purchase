import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { readProducts, writeProducts } from "@/lib/products";
import { normalize, validate } from "../route";
export const runtime = "nodejs";
async function allowed() {
  return verifySessionToken((await cookies()).get(COOKIE_NAME)?.value);
}
export async function PATCH(request, { params }) {
  if (!(await allowed()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const error = await validate(body);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const products = await readProducts();
  const index = products.findIndex((p) => String(p.id) === id);
  if (index < 0)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (
    products.some(
      (p) =>
        String(p.id) !== id &&
        p.sku.toLowerCase() === body.sku.trim().toLowerCase(),
    )
  )
    return NextResponse.json({ error: "SKU already exists" }, { status: 409 });
  const product = {
    ...products[index],
    ...normalize(body),
    updatedAt: new Date().toISOString(),
  };
  products[index] = product;
  await writeProducts(products);
  return NextResponse.json({ product });
}
export async function DELETE(request, { params }) {
  if (!(await allowed()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const products = await readProducts();
  if (!products.some((p) => String(p.id) === id))
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  await writeProducts(products.filter((p) => String(p.id) !== id));
  return NextResponse.json({ success: true });
}
