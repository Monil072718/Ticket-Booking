// src/app/auth/login/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || "Login failed");
        return;
      }
      router.push("/dashboard/user");
    } catch (error: any) {
      setErr(error.message || "Network error");
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={submit} className="space-y-3">
        <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full border p-2" />
        <input required value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" type="password" className="w-full border p-2" />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Login</button>
      </form>
      {err && <p className="text-red-600 mt-3">{err}</p>}
    </main>
  );
}
