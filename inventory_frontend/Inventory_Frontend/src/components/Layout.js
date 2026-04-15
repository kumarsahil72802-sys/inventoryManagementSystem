"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/login") {
      router.replace("/login");
      return;
    }
    if (isAuthenticated && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, pathname, router]);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="app-container">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="main-content">
        <Header onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)} />
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}