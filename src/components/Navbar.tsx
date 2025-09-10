"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = document.cookie.includes("token=");
    setIsLoggedIn(token);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    document.cookie = "token=; Max-Age=0; path=/;"; // clear cookie
    setIsLoggedIn(false);
    window.location.href = "/"; // redirect
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white">
      <div className="font-bold text-xl">
        <Link href="/">EventBooking</Link>
      </div>
      <div className="space-x-4">
        <Link href="/">Events</Link>
        <Link href="/dashboard">Dashboard</Link>
        {isLoggedIn && <Link href="/bookings">My Bookings</Link>}
        {!isLoggedIn ? (
          <>
            <Link href="/auth/login">Login</Link>
            <Link href="/auth/signup">Signup</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
