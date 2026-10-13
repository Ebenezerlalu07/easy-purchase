const baseUrl = (process.env.VERIFY_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const email = process.env.VERIFY_ADMIN_EMAIL || process.env.SUPERADMIN_EMAIL;
const password = process.env.VERIFY_ADMIN_PASSWORD || process.env.SUPERADMIN_PASSWORD;
const cookieName = "easy_purchase_admin_session";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(path, options = {}, cookie = "") {
  const headers = new Headers(options.headers || {});
  if (cookie) headers.set("Cookie", cookie);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  return { response, body };
}

async function main() {
  if (!email || !password) {
    throw new Error("Set VERIFY_ADMIN_EMAIL and VERIFY_ADMIN_PASSWORD (or temporary SUPERADMIN_EMAIL/SUPERADMIN_PASSWORD) in .env.local before running this test.");
  }

  const login = await request("/api/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  assert(login.response.ok, `Admin login failed (${login.response.status}): ${login.body.message || "unknown error"}`);
  const setCookie = login.response.headers.get("set-cookie") || "";
  const match = setCookie.match(new RegExp(`${cookieName}=([^;]+)`));
  assert(match, `Login response did not set ${cookieName} cookie`);
  const cookie = `${cookieName}=${match[1]}`;

  const token = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const originalName = `Brand Verification ${token}`;
  const updatedName = `Brand Verification Updated ${token}`;
  const slug = originalName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  let brandId = null;
  let passed = [];

  try {
    const created = await request("/api/brands", {
      method: "POST",
      body: JSON.stringify({ name: originalName, slug, status: "Active", website: "", description: "Temporary automated API verification record", logo: "" }),
    }, cookie);
    assert(created.response.status === 201 && created.body.brand?.id, `Create failed (${created.response.status}): ${created.body.error || "missing brand id"}`);
    brandId = created.body.brand.id;
    passed.push("create brand (MongoDB insert)");

    const duplicate = await request("/api/brands", {
      method: "POST",
      body: JSON.stringify({ name: originalName.toUpperCase(), slug: `${slug}-different`, status: "Active" }),
    }, cookie);
    assert(duplicate.response.status === 409, `Duplicate-name validation failed; expected 409, got ${duplicate.response.status}`);
    passed.push("duplicate name validation (case-insensitive)");

    const listed = await request("/api/brands", { method: "GET" }, cookie);
    assert(listed.response.ok && listed.body.brands?.some((item) => item.id === brandId), "Created brand was not returned by a fresh GET; persistence check failed");
    passed.push("read-after-write persistence");

    const updated = await request(`/api/brands/${brandId}`, {
      method: "PATCH",
      body: JSON.stringify({ name: updatedName, slug: updatedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), status: "Inactive", website: "", description: "Updated by API verification", logo: "" }),
    }, cookie);
    assert(updated.response.ok && updated.body.brand?.name === updatedName && updated.body.brand?.status === "Inactive", `Update failed (${updated.response.status}): ${updated.body.error || "unexpected response"}`);
    passed.push("edit brand");

    const deleted = await request(`/api/brands/${brandId}`, { method: "DELETE" }, cookie);
    assert(deleted.response.ok && deleted.body.success, `Delete failed (${deleted.response.status}): ${deleted.body.error || "unexpected response"}`);
    brandId = null;
    passed.push("delete brand");

    const afterDelete = await request("/api/brands", { method: "GET" }, cookie);
    assert(afterDelete.response.ok && !afterDelete.body.brands?.some((item) => item.id === created.body.brand.id), "Deleted brand still appears in a fresh GET");
    passed.push("delete persistence verification");

    console.log("BRANDS API VERIFICATION PASSED");
    for (const item of passed) console.log(`PASS: ${item}`);
  } finally {
    if (brandId) {
      await request(`/api/brands/${brandId}`, { method: "DELETE" }, cookie).catch(() => {});
    }
  }
}

main().catch((error) => {
  console.error(`BRANDS API VERIFICATION FAILED: ${error.message}`);
  process.exitCode = 1;
});
