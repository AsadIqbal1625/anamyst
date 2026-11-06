import crypto from "crypto";

/* Constant-time string compare, for passwords and signatures: response
   timing can't reveal how much of the value was right. */
export function safeEqual(a, b) {
  const x = Buffer.from(String(a ?? ""));
  const y = Buffer.from(String(b ?? ""));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
