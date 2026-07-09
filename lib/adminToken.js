/* Signed admin session tokens (HMAC-SHA256, Web Crypto — works in
   both API routes and the proxy/edge runtime) */

const encoder = new TextEncoder();

async function getKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createAdminToken(
  secret,
  ttlMs = 7 * 24 * 60 * 60 * 1000
) {
  const expiry = Date.now() + ttlMs;
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(String(expiry))
  );
  const sigHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${expiry}.${sigHex}`;
}

export async function verifyAdminToken(secret, token) {
  try {
    if (!secret || !token) return false;

    const [expiryStr, sigHex] = token.split(".");
    if (!expiryStr || !sigHex) return false;

    const expiry = Number(expiryStr);
    if (!expiry || Date.now() > expiry) return false;

    const key = await getKey(secret);
    const sigBytes = new Uint8Array(
      sigHex.match(/.{2}/g).map((h) => parseInt(h, 16))
    );

    return await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      encoder.encode(expiryStr)
    );
  } catch {
    return false;
  }
}
