"use client";
import { useState } from "react";
import SidebarMobile from "./SidebarMobile";

export default function MobileHeader() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 md:hidden">
        <h1 className="text-xl font-bold text-blue-600">Document Tracker</h1>
        <button onClick={() => setShowSidebar(true)} className="text-2xl">
          ☰
        </button>
      </div>

      <SidebarMobile show={showSidebar} onClose={() => setShowSidebar(false)} />
    </>
  );
}
