import { NextResponse } from "next/server";
import { readProducts } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public storefront catalogue. Only active products are exposed to customers;
 * draft and inactive records remain available through the authenticated admin API.
 */
export async function GET() {
  try {
    const products = await readProducts();
    const activeProducts = products
      .filter((product) => String(product.status || "Active").toLowerCase() === "active")
      .map((product) => ({
        id: String(product.id),
        name: String(product.name || ""),
        sku: String(product.sku || ""),
        productLink: String(product.productLink || ""),
        category: String(product.category || ""),
        brand: String(product.brand || ""),
        price: Number(product.price || 0),
        oldPrice: product.oldPrice === "" || product.oldPrice == null ? null : Number(product.oldPrice),
        stock: Number(product.stock || 0),
        featured: Boolean(product.featured),
        shortDescription: String(product.shortDescription || ""),
        description: String(product.description || product.shortDescription || ""),
        createdAt: product.createdAt || null,
        updatedAt: product.updatedAt || null,
      }));

    return NextResponse.json(
      { products: activeProducts, count: activeProducts.length },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    console.error("Storefront product listing error:", error);
    return NextResponse.json(
      { error: "Could not load the product catalogue. Check the database connection and try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
