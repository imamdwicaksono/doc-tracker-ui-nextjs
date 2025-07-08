"use client";

import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";
import BurgerMenu from "@/components/BurgerMenu";
import { useEffect } from "react";
import { checkAuth } from "@/lib/api";

const web_url = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const check = async () => {
      const res = await checkAuth()
      console.log('checkAuth', res);
      console.log('window.location.pathname', window.location.pathname);

      if (!res && window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }

      if (res && window.location.pathname === '/auth/login') {
        window.location.href = '/';
      }
    };
    check();
  }, []);

  return (
    <>
      {/* Mobile Header */}
      <header className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-300 sm:hidden">
        <Link href={`${web_url}/`} className="text-lg font-semibold text-blue-600">Document Tracking</Link>
        <BurgerMenu />
      </header>

      {/* Desktop Navbar */}
      <nav className="items-center justify-between hidden p-4 bg-gray-100 border-b border-gray-300 sm:flex">
        <Link href={`${web_url}/`} className="text-lg font-semibold text-blue-600">Document Tracking</Link>
        <div className="flex items-center space-x-4">
          <Link href={`${web_url}/`} className="font-semibold text-blue-600">🏠 Home</Link>
          <Link href={`${web_url}/trackers/create`} className="font-semibold text-blue-600">➕ Create Tracker</Link>
          <Link href={`${web_url}/trackers`} className="font-semibold text-blue-600">📍 Trackers</Link>
          <LogoutButton className='font-semibold text-blue-600' />
        </div>
      </nav>

      {children}

      {/* Mobile Navbar */}
      <nav className="fixed bottom-0 left-0 z-10 flex justify-around w-full py-2 text-sm bg-gray-100 border-t border-gray-300 sm:hidden">
        <Link href={`${web_url}/trackers/create`} className="flex flex-col items-center text-blue-600">
          <span>➕</span><span>Create</span>
        </Link>
        <Link href={`${web_url}/`} className="flex flex-col items-center text-blue-600">
          <span>🏠</span><span>Home</span>
        </Link>
        <Link href={`${web_url}/trackers`} className="flex flex-col items-center text-blue-600">
          <span>📍</span><span>Track</span>
        </Link>
      </nav>
    </>
  );
}
