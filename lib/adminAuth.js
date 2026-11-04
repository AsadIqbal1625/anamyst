import { verifyAdminToken } from "./adminToken";

/* True when the request carries a valid admin session cookie. For routes
   that are public but return extra data to the admin (e.g. cost price). */
export async function isAdminRequest(req) {
  const token = req.cookies?.get("admin-auth")?.value;
  return verifyAdminToken(process.env.AUTH_SECRET, token);
}
