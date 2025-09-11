"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // ✅ Check login status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        setIsLoggedIn(res.ok);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  // ✅ Logout
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setIsLoggedIn(false);
    router.push("/"); // redirect after logout
  };

  return (
     <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">🎟 Eventify</Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/events">Events</Link>
          <Link href="/booking">My Bookings</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/auth/login" className="bg-white text-blue-700 px-3 py-1 rounded">Login</Link>
          <Link href="/auth/register" className="bg-yellow-400 text-black px-3 py-1 rounded">Signup</Link>
          <Link href="/auth/logout" className="bg-red-500 px-3 py-1 rounded">Logout</Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-blue-600 px-4 py-3 space-y-2">
          <Link href="/events" className="block">Events</Link>
          <Link href="/booking" className="block">My Bookings</Link>
          <Link href="/dashboard" className="block">Dashboard</Link>
          <Link href="/auth/login" className="block">Login</Link>
          <Link href="/auth/register" className="block">Signup</Link>
          <Link href="/auth/logout" className="block">Logout</Link>
        </div>
      )}
    </nav>
  );
}
