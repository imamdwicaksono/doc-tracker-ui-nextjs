// components/SidebarMobile.tsx
"use client";
import Link from "next/link";
import LogoutButton from "./auth/LogoutButton";
import { useEffect } from "react";

export default function SidebarMobile({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [show]);

  return (
    <div className={`fixed inset-0 z-40 ${show ? "block" : "hidden"}`}>
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      />

      {/* Slide Menu */}
      <div className="absolute top-0 left-0 w-64 h-full p-4 bg-white shadow-xl dark:bg-gray-800 animate-slide-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400">
            Menu
          </h2>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>
        <nav className="flex flex-col space-y-3">
          <Link href="/" onClick={onClose}>🏠 Home</Link>
          <Link href="/trackers/create" onClick={onClose}>➕ Create</Link>
          <Link href="/trackers" onClick={onClose}>📍 Trackers</Link>
          <LogoutButton className="text-blue-600 dark:text-blue-400" />
        </nav>
      </div>
    </div>
  );
}
