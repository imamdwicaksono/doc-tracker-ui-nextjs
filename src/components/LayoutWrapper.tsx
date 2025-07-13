"use client";
import SidebarLayout from "./SidebarLayout";

export default function LayoutWrapper({
  children,
  isFormLogin,
}: {
  children: React.ReactNode;
  isFormLogin: boolean;
}) {
  if (isFormLogin) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <>

      <SidebarLayout>
        {children}
      </SidebarLayout>
    </>
  );
}
