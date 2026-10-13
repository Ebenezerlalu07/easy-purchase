import crypto from "node:crypto";
import { MongoClient } from "mongodb";
import { hashPassword } from "../lib/auth/password.js";

function required(name) {
  const value = process.env[name];
  if (!value || !value.trim()) throw new Error(`${name} must be set in .env.local before running this script.`);
  return value.trim();
}

async function main() {
  const uri = required("MONGODB_URI");
  const dbName = process.env.MONGODB_DB?.trim() || "easy_purchase";
  const email = required("SUPERADMIN_EMAIL").toLowerCase();
  const password = required("SUPERADMIN_PASSWORD");
  const name = process.env.SUPERADMIN_NAME?.trim() || "Super Admin";

  if (password.length < 12) {
    throw new Error("SUPERADMIN_PASSWORD must be at least 12 characters long.");
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const admins = db.collection("admins");

    await admins.createIndex({ email: 1 }, { unique: true });
    const existingCount = await admins.countDocuments({});
    if (existingCount > 0) {
      const existing = await admins.findOne({ email });
      if (existing) {
        throw new Error(`An admin with ${email} already exists. No changes were made.`);
      }
      throw new Error("The admins collection already contains an account. Refusing to create another Super Admin automatically.");
    }

    const now = new Date();
    const result = await admins.insertOne({
      _id: crypto.randomUUID(),
      name,
      email,
      passwordHash: hashPassword(password),
      role: "superadmin",
      status: "active",
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
    });

    console.log(`Super Admin created successfully for ${email} (record ${result.insertedId}).`);
    console.log("Remove SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD, and SUPERADMIN_NAME from .env.local after setup if you no longer need them.");
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(`Super Admin setup failed: ${error.message}`);
  process.exitCode = 1;
});
