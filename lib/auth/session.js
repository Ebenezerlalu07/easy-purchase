const COOKIE_NAME = "easy_purchase_admin_session";
const DEFAULT_TTL_SECONDS = 60 * 60 * 8;

function getSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error("JWT_SECRET is not configured or is too short. Set a 32+ character JWT_SECRET in .env.local.");
    }
    return secret;
}

function base64urlEncode(value) {
    const bytes = typeof value === "string" ? new TextEncoder().encode(value) : value;
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64urlDecode(value) {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (value.length % 4)) % 4);
    const binary = atob(padded);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function encodeJson(value) {
    return base64urlEncode(JSON.stringify(value));
}

async function getKey() {
    return crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(getSecret()),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"]
    );
}

async function sign(input) {
    const key = await getKey();
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(input));
    return base64urlEncode(new Uint8Array(signature));
}

export async function createSessionToken(admin) {
    const now = Math.floor(Date.now() / 1000);
    const ttl = Number(process.env.ADMIN_SESSION_TTL || DEFAULT_TTL_SECONDS);
    const header = encodeJson({ alg: "HS256", typ: "JWT" });
    const payload = encodeJson({
        sub: String(admin.id || admin.email),
        email: admin.email,
        name: admin.name,
        role: admin.role,
        iat: now,
        exp: now + ttl,
    });
    const unsigned = `${header}.${payload}`;
    return `${unsigned}.${await sign(unsigned)}`;
}

export async function verifySessionToken(token) {
    if (!token || typeof token !== "string") return null;

    try {
        const [header, payload, signature] = token.split(".");
        if (!header || !payload || !signature) return null;

        const key = await getKey();
        const valid = await crypto.subtle.verify(
            "HMAC",
            key,
            base64urlDecode(signature),
            new TextEncoder().encode(`${header}.${payload}`)
        );
        if (!valid) return null;

        const decoded = JSON.parse(new TextDecoder().decode(base64urlDecode(payload)));
        const now = Math.floor(Date.now() / 1000);
        if (!decoded.exp || decoded.exp <= now || !decoded.email) return null;

        return decoded;
    } catch {
        return null;
    }
}

export function getSessionCookieOptions() {
    const ttl = Number(process.env.ADMIN_SESSION_TTL || DEFAULT_TTL_SECONDS);
    return {
        name: COOKIE_NAME,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: ttl,
    };
}

export { COOKIE_NAME };
