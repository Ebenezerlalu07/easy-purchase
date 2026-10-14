import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { createHash } from "node:crypto";

export const runtime = "nodejs";
const SETTINGS_ID = "site-settings";
const COLLECTION = "settings";

async function requireAdmin() {
  // Load session/auth code only for protected requests. Public footer settings
  // must remain available even if admin-session configuration is broken.
  const [{ cookies }, { COOKIE_NAME, verifySessionToken }] = await Promise.all([
    import("next/headers"),
    import("@/lib/auth/session"),
  ]);
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

async function getCollection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");
  const client = new MongoClient(uri);
  await client.connect();
  return { client, collection: client.db(process.env.MONGODB_DB || "easy_purchase").collection(COLLECTION) };
}

function normalizeSettings(value = {}) {
  const defaults = {
    companyName: "Top Range Building Materials", email: "", phone: "", whatsapp: "",
    address: "", websiteName: "Easy Purchase", websiteUrl: "", currency: "AED",
    quotationPrefix: "QT", quotationValidity: "3", vatRate: "0",
    emailNotifications: true, quotationNotifications: true, customerNotifications: true,
    maintenanceMode: false, showWhatsApp: true, logoUrl: "",
  };
  const result = { ...defaults };
  for (const key of Object.keys(defaults)) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      result[key] = typeof defaults[key] === "boolean"
        ? value[key] === true
        : String(value[key] ?? "").trim();
    }
  }
  return result;
}

async function uploadLogoToCloudinary(file) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary environment variables are not configured");
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) throw new Error("Logo must be PNG, JPG, or WebP");
  if (file.size > 5 * 1024 * 1024) throw new Error("Logo must be 5 MB or smaller");

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = "easy-purchase/settings";
  const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest("hex");
  const form = new FormData();
  form.append("file", new Blob([await file.arrayBuffer()], { type: file.type }), file.name || "company-logo");
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: form });
  const result = await response.json();
  if (!response.ok || !result.secure_url) throw new Error(result?.error?.message || "Cloudinary logo upload failed");
  return result.secure_url;
}

export async function GET(request) {
  // The footer only needs these public fields; keep admin-only settings private.
  const isPublicRequest = new URL(request.url).searchParams.get("public") === "1";
  if (!isPublicRequest && !(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let client;
  try {
    const connection = await getCollection();
    client = connection.client;
    const stored = await connection.collection.findOne({ _id: SETTINGS_ID });
    const settings = normalizeSettings(stored || {});

    if (isPublicRequest) {
      return NextResponse.json({
        settings: {
          companyName: settings.companyName,
          email: settings.email,
          phone: settings.phone,
          whatsapp: settings.whatsapp,
          address: settings.address,
          logoUrl: settings.logoUrl,
          showWhatsApp: settings.showWhatsApp,
        },
      }, { headers: { "Cache-Control": "no-store" } });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("GET /api/settings failed:", error);
    return NextResponse.json({ error: "Unable to load settings" }, { status: 500 });
  } finally {
    await client?.close();
  }
}

export async function PUT(request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let client;
  try {
    const type = request.headers.get("content-type") || "";
    let incoming;
    let logoUrl = "";
    if (type.includes("multipart/form-data")) {
      const form = await request.formData();
      const raw = form.get("settings");
      incoming = typeof raw === "string" ? JSON.parse(raw) : {};
      const logo = form.get("logo");
      if (logo && typeof logo.arrayBuffer === "function" && logo.size > 0) logoUrl = await uploadLogoToCloudinary(logo);
    } else {
      incoming = await request.json();
    }

    const settings = normalizeSettings(incoming);
    settings.logoUrl = logoUrl || (typeof incoming.logoUrl === "string" ? incoming.logoUrl : "");
    if (settings.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
      return NextResponse.json({ error: "Enter a valid business email address" }, { status: 400 });
    }

    const connection = await getCollection();
    client = connection.client;
    await connection.collection.updateOne(
      { _id: SETTINGS_ID },
      { $set: { ...settings, updatedAt: new Date() } },
      { upsert: true },
    );
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("PUT /api/settings failed:", error);
    return NextResponse.json({ error: error.message || "Unable to save settings" }, { status: 500 });
  } finally {
    await client?.close();
  }
}
