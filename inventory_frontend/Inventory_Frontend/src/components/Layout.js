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
  const [isLoading, setIsLoading] = useState(true);

  // Check if current page is login page (handles both /login and /login/)
  const isLoginPage = pathname === "/login" || pathname === "/login/";

  useEffect(() => {
    // Small delay to allow auth state to be read from localStorage
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && !isLoginPage) {
      router.replace("/login");
      return;
    }
    if (isAuthenticated && isLoginPage) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, pathname, router, isLoading, isLoginPage]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e0e0e0',
          borderTop: '4px solid #1976d2',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Login page - no sidebar, no header
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Not authenticated and not on login page - don't render anything (redirect happening)
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated - show full layout with sidebar
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