"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LoginSuccessModal from "./LoginSuccessModal";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success) {
          setUser(data.user);

          // show success modal only once
          if (!user) {
            setShowModal(true);
          }
        }
      } catch {
        console.log("Not logged in");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <>
      <nav className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">🎟 Eventify</Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/events">Events</Link>
            {user && <Link href="/booking">My Bookings</Link>}
            {user && <Link href="/dashboard">Dashboard</Link>}

            {/* ✅ Only admin */}
            {user?.role === "admin" && (
              <Link href="/events/create" className="bg-purple-500 px-3 py-1 rounded">
                Create Event
              </Link>
            )}

            {!user ? (
              <>
                <Link href="/auth/login" className="bg-white text-blue-700 px-3 py-1 rounded">
                  Login
                </Link>
                <Link href="/auth/register" className="bg-yellow-400 text-black px-3 py-1 rounded">
                  Signup
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
                Logout
              </button>
            )}
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
            {user && <Link href="/booking" className="block">My Bookings</Link>}
            {user && <Link href="/dashboard" className="block">Dashboard</Link>}

            {/* ✅ Only admin */}
            {user?.role === "admin" && (
              <Link href="/events/create" className="block text-purple-200">
                Create Event
              </Link>
            )}

            {!user ? (
              <>
                <Link href="/auth/login" className="block">Login</Link>
                <Link href="/auth/register" className="block">Signup</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="block text-left w-full">
                Logout
              </button>
            )}
          </div>
        )}
      </nav>

      {/* ✅ Modal appears after login */}
      <LoginSuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userName={user?.name || ""}
      />
    </>
  );
}
