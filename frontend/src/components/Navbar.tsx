"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  LogOut, Menu, X, ChevronDown,
  LayoutDashboard, ScanLine, Zap, Code2,
  Users, MessageSquare, Briefcase, Crown,
  Sparkles, Shield, Globe, FileSearch, Target, ShieldCheck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user?.full_name
    ? user.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "??";

  const isAdmin = user?.role === "admin";

  const NavItems = [
    { name: t("dashboard"), href: "/", icon: LayoutDashboard },
    { name: t("scan"), href: "/scan", icon: FileSearch },
    { name: t("jobs"), href: "/opportunities", icon: Briefcase },
    { name: t("mentor"), href: "/mentor", icon: MessageSquare },
    { name: t("connect"), href: "/connect", icon: Users },
    { name: t("codey"), href: "/codey", icon: Target },
    { name: t("admin"), href: "/admin", icon: ShieldCheck },
  ];

  return (
    <>
      <nav className="border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 hidden sm:inline">
                  SkillSphere
                </span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden lg:flex items-center gap-0.5">
                {NavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all relative flex items-center gap-1.5 ${isActive
                          ? "text-white"
                          : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]"
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 bg-white/[0.08] rounded-lg border border-white/[0.06]"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <item.icon size={13} className={isActive ? "text-indigo-400" : ""} />
                        {t(item.name.toLowerCase().replace(" ", "_"))}
                      </span>
                    </Link>
                  );
                })}

                {/* Admin Link */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all relative flex items-center gap-1.5 ml-1 ${pathname === "/admin"
                        ? "text-amber-400"
                        : "text-amber-500/50 hover:text-amber-400 hover:bg-amber-500/[0.06]"
                      }`}
                  >
                    {pathname === "/admin" && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-amber-500/10 rounded-lg border border-amber-500/15"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Crown size={13} /> Admin
                    </span>
                  </Link>
                )}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Status badge */}
              <div className="hidden md:flex items-center gap-2">
                {isAdmin ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/[0.08] border border-amber-500/15 rounded-lg">
                    <Crown size={11} className="text-amber-400" />
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{t("admin_pair").split(" ")[0]}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/[0.08] border border-indigo-500/15 rounded-lg">
                    <Sparkles size={11} className="text-indigo-400" />
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Pro</span>
                  </div>
                )}
              </div>

              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold cursor-pointer transition-all border ${isAdmin
                    ? "bg-gradient-to-br from-amber-600 to-red-700 border-amber-500/20 hover:border-amber-400/40 shadow-lg shadow-amber-500/10"
                    : "bg-gradient-to-br from-indigo-600 to-violet-700 border-indigo-500/20 hover:border-indigo-400/40 shadow-lg shadow-indigo-500/10"
                  }`}
              >
                {initials}
              </div>

              {/* Language Switcher */}
              <div className="relative group/lang">
                <button className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-gray-500 hover:text-white transition-all">
                  <Globe size={15} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-32 glass rounded-xl border border-white/10 opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all z-50 overflow-hidden shadow-2xl">
                  {["English", "Tamil", "Hindi", "Spanish", "French"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang as any)}
                      className={`w-full px-4 py-2 text-left text-[11px] font-bold hover:bg-white/5 transition-all ${language === lang ? "text-indigo-400 bg-indigo-500/5" : "text-gray-400"
                        }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                title="Logout"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/[0.08] transition-all"
              >
                <LogOut size={15} />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed top-14 inset-x-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                        ? "bg-white/[0.06] text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                  >
                    <item.icon size={16} className={isActive ? "text-indigo-400" : ""} />
                    {item.name}
                  </Link>
                );
              })}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${pathname === "/admin"
                      ? "bg-amber-500/10 text-amber-400"
                      : "text-amber-500/60 hover:text-amber-400 hover:bg-amber-500/[0.06]"
                    }`}
                >
                  <Crown size={16} /> {t("admin_pair")}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
