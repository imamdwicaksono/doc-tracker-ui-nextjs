"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";

const web_url = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";

export default function LayoutWrapper({
  children,
  isFormLogin,
}: {
  children: React.ReactNode;
  isFormLogin: boolean;
}) {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Cek preferensi dark mode
  useEffect(() => {
    const dark = localStorage.getItem("theme") === "dark";
    setDarkMode(dark);
    document.documentElement.classList.toggle("dark", dark);

    const updateLayout = () => {
      setIsMobile(window.innerWidth < 640);
    };

    updateLayout(); // run once
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newDark);
  };

  if (isFormLogin) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <div className="flex min-h-screen text-gray-900 bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 p-4 bg-white border-r border-gray-300 dark:bg-gray-800 dark:border-gray-700">
        <div className="mb-8 text-xl font-bold text-blue-600 dark:text-blue-400">
          DocTracker
        </div>
        <nav className="flex flex-col space-y-4 text-sm">
          <Link href={`${web_url}/`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
            🏠 Dashboard
          </Link>
          <Link href={`${web_url}/trackers/create`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
            ➕ Create Tracker
          </Link>
          <Link href={`${web_url}/trackers`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
            📍 All Trackers
          </Link>
          <LogoutButton className="font-medium text-blue-600 dark:text-blue-400" />
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-300 dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-lg font-semibold">Tracking Dashboard</h1>
          <button
            onClick={toggleDarkMode}
            className="px-3 py-1 text-sm bg-gray-200 rounded dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {isMobile ? (
            <div className="p-4 text-center border border-gray-500 border-dashed">
              📱 *Mobile View* <br />
              {children}
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
