"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

export default function AdminLogin() {

  const router =
    useRouter();

  const [email,
    setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [error,
    setError] =
    useState("");

  function handleLogin(
    e
  ) {

    e.preventDefault();

    /* CHANGE THESE */
    const adminEmail =
      "admin@anamyst.com";

    const adminPassword =
      "anamyst123";

    if (

      email === adminEmail &&

      password === adminPassword

    ) {

      localStorage.setItem(

        "anamystAdmin",

        "true"

      );

      router.push(
        "/admin"
      );

    } else {

      setError(
        "Invalid credentials"
      );

    }

  }

  return (

    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[32px] p-8">

        <p className="uppercase tracking-[6px] text-[#D4AF37] text-xs mb-4 text-center">

          ANAMYST Admin

        </p>

        <h1 className="text-4xl font-bold text-center mb-8">

          Admin Login

        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37]"
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37]"
            required
          />

          {/* ERROR */}
          {error && (

            <p className="text-red-400 text-sm">

              {error}

            </p>

          )}

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-[#D4AF37] text-black py-4 rounded-2xl font-bold hover:opacity-90 transition"
          >

            Login

          </button>

        </form>

      </div>

    </div>

  );

}