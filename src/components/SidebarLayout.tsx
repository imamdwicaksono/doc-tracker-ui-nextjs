"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Deteksi mobile dan atur state awal
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Lock scroll saat sidebar terbuka di mobile
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
    }
  }, [sidebarOpen, isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ✅ Sidebar */}
      <aside
        className={`
          bg-white dark:bg-gray-800 h-full shadow-md
          transition-all duration-300 ease-in-out
          ${isMobile ? `
            fixed z-40 w-64
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ` : `
            relative z-10
            ${sidebarCollapsed ? "w-20" : "w-64"}
          `}
        `}
      >
        <div className={`p-4 border-b border-gray-300 dark:border-gray-700 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!sidebarCollapsed && (
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">📄 DocTrack</h2>
          )}
          <button 
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isMobile ? (
              <ChevronLeft size={24} />
            ) : sidebarCollapsed ? (
              <ChevronRight size={24} />
            ) : (
              <ChevronLeft size={24} />
            )}
          </button>
        </div>
        
        <nav className="flex flex-col p-4 space-y-3 text-sm font-medium">
          <Link 
            href="/" 
            className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <span>🏠</span>
            {!sidebarCollapsed && <span className="ml-2">Home</span>}
          </Link>
          
          <Link 
            href="/trackers/create" 
            className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <span>➕</span>
            {!sidebarCollapsed && <span className="ml-2">Create Tracker</span>}
          </Link>
          
          <Link 
            href="/trackers" 
            className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <span>📍</span>
            {!sidebarCollapsed && <span className="ml-2">Trackers</span>}
          </Link>
          
          <LogoutButton 
            className={`text-blue-600 dark:text-blue-400 cursor-pointer ${sidebarCollapsed ? 'justify-center' : ''}`}
            iconOnly={sidebarCollapsed}
          />
        </nav>
      </aside>

      {/* ✅ Overlay untuk mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ✅ Konten Utama */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* ✅ Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-300 dark:bg-gray-900 dark:border-gray-700">
          <button
            onClick={toggleSidebar}
            className="text-2xl cursor-pointer lg:hidden"
            aria-label="Toggle Sidebar"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {sidebarCollapsed ? "DT" : "Document Tracking"}
            </h1>
          </div>
        </header>

        {/* ✅ Page Content */}
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarCollapsed ? '' : ''}`}>
          {children}
        </main>

        {/* ✅ Bottom Nav hanya di mobile */}
        {isMobile && (
          <nav className="fixed bottom-0 left-0 z-50 flex justify-around w-full py-2 text-blue-600 bg-white border-t border-gray-300 dark:bg-gray-800">
            <Link href="/trackers/create" className="flex flex-col items-center text-sm">
              <span>➕</span>
              <span className="text-xs">Create</span>
            </Link>
            <Link href="/" className="flex flex-col items-center text-sm">
              <span>🏠</span>
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/trackers" className="flex flex-col items-center text-sm">
              <span>📍</span>
              <span className="text-xs">Track</span>
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}