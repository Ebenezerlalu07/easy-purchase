import { randomUUID } from "node:crypto";
import { getDatabase } from "@/lib/mongodb";

export const catalogCollections = { categories: "categories", brands: "brands" };

export function makeSlug(value) {
  return String(value || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function serializeCatalog(doc, products = 0) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { ...rest, id: String(doc.id || _id), products };
}

export async function listCatalog(type) {
  const db = await getDatabase();
  const docs = await db.collection(catalogCollections[type]).find({}).sort({ name: 1 }).toArray();
  const products = await db.collection("products").find({}, { projection: { category: 1, brand: 1 } }).toArray();
  return docs.map((doc) => {
    const key = type === "categories" ? "category" : "brand";
    const count = products.filter((product) => String(product[key] || "").toLowerCase() === String(doc.name).toLowerCase()).length;
    return serializeCatalog(doc, count);
  });
}

export async function saveCatalog(type, body, id = null) {
  const name = String(body?.name || "").trim();
  if (!name) return { error: "Name is required", status: 400 };
  const slug = makeSlug(body.slug || name);
  if (!slug) return { error: "A valid name or slug is required", status: 400 };
  const status = body.status || "Active";
  if (!["Active", "Inactive"].includes(status)) return { error: "Invalid status", status: 400 };
  const db = await getDatabase();
  const collection = db.collection(catalogCollections[type]);
  // Enforce duplicate checks by both slug and case-insensitive name. Checking
  // only the slug allowed the same brand name to be saved with a custom slug.
  const duplicateConditions = [
    { slug },
    { name: { $regex: `^${escapeRegex(name)}$`, $options: "i" } },
  ];
  const duplicateQuery = {
    $or: duplicateConditions,
    ...(id ? { id: { $ne: String(id) } } : {}),
  };
  const duplicate = await collection.findOne(duplicateQuery);
  if (duplicate) return { error: "A brand or category with this name or slug already exists", status: 409 };
  const now = new Date().toISOString();
  const fields = type === "categories"
    ? { name, slug, description: String(body.description || "").trim(), status }
    : { name, slug, website: String(body.website || "").trim(), description: String(body.description || "").trim(), status, logo: String(body.logo || "").trim() };
  if (id) {
    const result = await collection.findOneAndUpdate({ id: String(id) }, { $set: { ...fields, updatedAt: now } }, { returnDocument: "after" });
    if (!result) return { error: "Record not found", status: 404 };
    const products = await db.collection("products").countDocuments({ [type === "categories" ? "category" : "brand"]: result.name });
    return { record: serializeCatalog(result, products) };
  }
  const record = { id: randomUUID(), ...fields, createdAt: now, updatedAt: now };
  await collection.insertOne(record);
  return { record: serializeCatalog(record, 0), status: 201 };
}

export async function removeCatalog(type, id) {
  const db = await getDatabase();
  const collection = db.collection(catalogCollections[type]);
  const record = await collection.findOne({ id: String(id) });
  if (!record) return { error: "Record not found", status: 404 };
  const key = type === "categories" ? "category" : "brand";
  const count = await db.collection("products").countDocuments({ [key]: record.name });
  if (count > 0) return { error: `Cannot delete this ${type === "categories" ? "category" : "brand"} while products use it`, status: 409 };
  await collection.deleteOne({ id: String(id) });
  return { success: true };
}
