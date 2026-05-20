"use client";

import {
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

export default function AdminProtection({

  children,

}) {

  const router =
    useRouter();

  useEffect(() => {

    const isAdmin =
      localStorage.getItem(
        "anamystAdmin"
      );

    if (!isAdmin) {

      router.push(
        "/admin-login"
      );

    }

  }, []);

  return children;

}