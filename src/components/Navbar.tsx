"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react"; // ✅ icon library (lucide-react)

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // ✅ Check login status from backend
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
    router.push("/");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            🎟️ Eventify
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/events" className="hover:text-green-400">
              Event List
            </Link>

            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                >
                  Signup
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 px-4 pb-4 space-y-4">
          <Link
            href="/events"
            className="block hover:text-green-400"
            onClick={() => setMenuOpen(false)}
          >
            Event List
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="block bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setMenuOpen(false)}
              >
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full text-left bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
