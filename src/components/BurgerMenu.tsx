"use client";
import { useState } from "react";
import SidebarMobile from "./SidebarMobile";

export default function BurgerMenu() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <button onClick={() => setShowSidebar(true)} className="text-2xl">
        ☰
      </button>
      <SidebarMobile show={showSidebar} onClose={() => setShowSidebar(false)} />
    </>
  );
}
