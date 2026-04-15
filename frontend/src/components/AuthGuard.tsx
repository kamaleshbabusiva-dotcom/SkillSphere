"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = pathname === "/login" || pathname === "/register";
      const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

      if (!isAuthenticated && !isPublicRoute) {
        // Not logged in and on a protected page → send to login
        router.push("/login");
      } else if (isAuthenticated && isPublicRoute) {
        // Logged in but on login/register → redirect to appropriate page
        router.push(user?.role === "admin" ? "/admin" : "/");
      } else if (isAuthenticated && isAdminRoute && user?.role !== "admin") {
        // Non-admin trying to access admin route → redirect to home
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-600 font-medium uppercase tracking-widest">Loading SkillSphere...</p>
        </div>
      </div>
    );
  }

  // Block rendering of admin routes for non-admin users
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  if (isAdminRoute && user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
