import { getDatabase } from "@/lib/mongodb";
import { verifyPassword } from "@/lib/auth/password";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export async function authenticateAdmin(email, password) {
  const normalizedEmail = normalizeEmail(email);
  const submittedPassword = String(password || "");
  if (!normalizedEmail || !submittedPassword) return null;

  const db = await getDatabase();
  const admin = await db.collection("admins").findOne({ email: normalizedEmail });
  if (!admin || admin.status !== "active" || !verifyPassword(submittedPassword, admin.passwordHash)) {
    return null;
  }

  await db.collection("admins").updateOne(
    { _id: admin._id },
    { $set: { lastLoginAt: new Date(), updatedAt: new Date() } }
  );

  return {
    id: admin._id.toString(),
    email: admin.email,
    name: admin.name,
    role: admin.role,
  };
}
