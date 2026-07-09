"use client";

/* Admin route protection is enforced server-side in proxy.js
   (signed httpOnly session cookie). This wrapper stays only for
   backwards compatibility with existing imports. */

export default function AdminProtection({ children }) {
  return children;
}
