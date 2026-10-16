import { unstable_cache } from "next/cache";
import ProductsClient from "@/components/ProductsClient";
import { readProducts } from "@/lib/products";

export const runtime = "nodejs";
export const revalidate = 60;

const getStoreProducts = unstable_cache(
    async () => {
        const products = await readProducts({ activeOnly: true });

        return products.map((product) => ({
            id: String(product.id ?? product._id ?? ""),
            name: String(product.name || ""),
            sku: String(product.sku || ""),
            productLink: String(product.productLink || ""),
            category: String(product.category || ""),
            brand: String(product.brand || ""),
            price: Number(product.price || 0),
            oldPrice:
                product.oldPrice === "" || product.oldPrice == null
                    ? null
                    : Number(product.oldPrice),
            stock: Number(product.stock || 0),
            featured: Boolean(product.featured),
            shortDescription: String(product.shortDescription || ""),
            description: String(
                product.description ||
                product.shortDescription ||
                "Product details will be available soon."
            ),
            createdAt: product.createdAt
                ? new Date(product.createdAt).toISOString()
                : null,
            updatedAt: product.updatedAt
                ? new Date(product.updatedAt).toISOString()
                : null,
        }));
    },
    ["storefront-products-v1"],
    {
        revalidate: 60,
        tags: ["storefront-products"],
    }
);

export default async function ProductsPage() {
    try {
        const products = await getStoreProducts();

        return (
            <ProductsClient
                initialProducts={products}
                initialError=""
            />
        );
    } catch (error) {
        console.error("Unable to render storefront products:", error);

        return (
            <ProductsClient
                initialProducts={[]}
                initialError="Unable to load products. Please try again."
            />
        );
    }
}
