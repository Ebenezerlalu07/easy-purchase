import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

function serialize(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { ...rest, id: String(doc.id || _id) };
}

export async function readProducts({ activeOnly = false } = {}) {
  const db = await getDatabase();
  const collection = db.collection("products");

  const filter = activeOnly
    ? { status: { $in: ["Active", "active"] } }
    : {};

  const docs = await collection
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map(serialize);
}

export async function writeProducts(products) {
  // Kept as a compatibility helper for existing API handlers, but persists to MongoDB.
  const db = await getDatabase();
  const collection = db.collection("products");
  const current = await collection.find({}, { projection: { id: 1 } }).toArray();
  const nextIds = new Set(products.map((p) => String(p.id)));
  const currentIds = new Set(current.map((p) => String(p.id || p._id)));
  const removed = [...currentIds].filter((id) => !nextIds.has(id));
  if (removed.length) await collection.deleteMany({ id: { $in: removed } });
  for (const product of products) {
    const { id, ...data } = product;
    await collection.updateOne(
      { id: String(id) },
      { $set: { ...data, id: String(id) } },
      { upsert: true }
    );
  }
}

export async function findProductById(id) {
  const db = await getDatabase();
  let doc = await db.collection("products").findOne({ id: String(id) });
  if (!doc && ObjectId.isValid(String(id))) doc = await db.collection("products").findOne({ _id: new ObjectId(String(id)) });
  return serialize(doc);
}
