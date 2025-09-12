"use client";

import { useEffect } from "react";

interface LoginSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export default function LoginSuccessModal({ isOpen, onClose, userName }: LoginSuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // auto-close after 3 sec
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[300px] text-center animate-fadeIn">
        <h2 className="text-xl font-semibold text-green-600">✅ Login Successful</h2>
        <p className="mt-2 text-gray-600">Welcome back, <b>{userName}</b>!</p>
      </div>
    </div>
  );
}
