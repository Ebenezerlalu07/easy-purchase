import { getDatabase } from "@/lib/mongodb";

export async function readQuotations() {
  const db = await getDatabase();
  return db.collection("quotations").find({}).sort({ createdAt: -1 }).toArray().then((docs) =>
    docs.map(({ _id, ...quote }) => ({ ...quote, id: String(quote.id || _id) }))
  );
}

export async function writeQuotations(quotations) {
  // Compatibility helper for existing API handlers; records are stored in MongoDB.
  const db = await getDatabase();
  const collection = db.collection("quotations");
  const current = await collection.find({}, { projection: { id: 1 } }).toArray();
  const nextIds = new Set(quotations.map((q) => String(q.id)));
  const currentIds = new Set(current.map((q) => String(q.id || q._id)));
  const removed = [...currentIds].filter((id) => !nextIds.has(id));
  if (removed.length) await collection.deleteMany({ id: { $in: removed } });
  for (const quotation of quotations) {
    const { _id, ...data } = quotation;
    await collection.updateOne({ id: String(data.id) }, { $set: { ...data, id: String(data.id) } }, { upsert: true });
  }
}

export async function nextQuotationId() {
  const db = await getDatabase();
  const counter = await db.collection("counters").findOneAndUpdate(
    { _id: "quotationId" },
    { $inc: { sequence: 1 } },
    { upsert: true, returnDocument: "after" }
  );
  const sequence = counter?.sequence ?? counter?.value?.sequence ?? 1;
  return `QT-${String(sequence).padStart(4, "0")}`;
}
