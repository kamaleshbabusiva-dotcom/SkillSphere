"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  User,
  Globe,
  Crown,
  Users,
  KeyRound,
  Fingerprint,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [loginMode, setLoginMode] = useState<"user" | "admin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  // Admin credentials (mock)
  const ADMIN_EMAIL = "admin@skillsphere.ai";
  const ADMIN_PASSWORD = "admin123";
  const ADMIN_KEY = "SS-ADMIN-2026";

  const handleUserLogin = () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      login({
        id: Math.floor(Math.random() * 1000),
        email,
        full_name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        role: "user",
        extracted_skills: {
          Technical: ["Python", "FastAPI", "React"],
          Soft: ["Communication"],
          Domain: ["AI Engineering"],
        },
        current_readiness_score: 75,
        future_readiness_score: 85,
      });
      setIsLoading(false);
    }, 800);
  };

  const handleAdminLogin = () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (!adminKey) {
      setError("Admin Security Key is required");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Validate admin credentials
      if (
        email === ADMIN_EMAIL &&
        password === ADMIN_PASSWORD &&
        adminKey === ADMIN_KEY
      ) {
        login({
          id: 0,
          email: ADMIN_EMAIL,
          full_name: "System Administrator",
          role: "admin",
          extracted_skills: {
            Technical: [
              "System Architecture",
              "Cloud Infrastructure",
              "AI/ML Operations",
              "DevOps",
              "Security",
            ],
            Soft: [
              "Strategic Leadership",
              "Team Management",
              "Decision Making",
            ],
            Domain: [
              "Enterprise Software",
              "Workforce Analytics",
              "Platform Engineering",
            ],
          },
          current_readiness_score: 98,
          future_readiness_score: 100,
        });
      } else {
        setError("Invalid admin credentials or security key");
      }
      setIsLoading(false);
    }, 1200);
  };

  const isAdmin = loginMode === "admin";

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs — colors shift based on mode */}
      <motion.div
        animate={{
          background: isAdmin
            ? "radial-gradient(circle, rgba(234,179,8,0.2) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
        }}
        transition={{ duration: 0.8 }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full"
      />
      <motion.div
        animate={{
          background: isAdmin
            ? "radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
        }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full"
      />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Role Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 bg-white/5 rounded-2xl p-1.5 backdrop-blur-xl border border-white/10"
        >
          {[
            {
              id: "user" as const,
              label: "User Login",
              icon: Users,
              desc: "Employee Access",
            },
            {
              id: "admin" as const,
              label: "Admin Login",
              icon: Crown,
              desc: "System Control",
            },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setLoginMode(mode.id);
                setError("");
                setEmail("");
                setPassword("");
                setAdminKey("");
              }}
              className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-bold transition-all relative flex items-center justify-center gap-2 ${
                loginMode === mode.id ? "text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {loginMode === mode.id && (
                <motion.div
                  layoutId="login-mode-pill"
                  className={`absolute inset-0 rounded-xl border ${
                    mode.id === "admin"
                      ? "bg-gradient-to-r from-amber-600/30 to-red-600/30 border-amber-500/30"
                      : "bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-indigo-500/30"
                  }`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <mode.icon size={16} />
                <div className="text-left">
                  <p className="text-xs font-black leading-tight">{mode.label}</p>
                  <p className="text-[9px] opacity-60 font-normal">{mode.desc}</p>
                </div>
              </span>
            </button>
          ))}
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass rounded-[32px] p-10 relative shadow-2xl transition-all duration-500 ${
            isAdmin ? "border-amber-500/20" : "border-white/10"
          }`}
        >
          {/* Admin top accent bar */}
          {isAdmin && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"
            />
          )}

          {/* Header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={loginMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-10"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg ${
                  isAdmin
                    ? "bg-gradient-to-br from-amber-500 to-red-600 shadow-amber-500/20"
                    : "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20"
                }`}
              >
                {isAdmin ? (
                  <Crown className="text-white" size={32} />
                ) : (
                  <Shield className="text-white" size={32} />
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isAdmin ? "Admin Control Panel" : "Enterprise Access"}
              </h1>
              <p className="text-gray-400 mt-2 text-sm">
                {isAdmin
                  ? "Elevated access • System administration"
                  : "SkillSphere AI Intelligence System"}
              </p>
              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] text-amber-400 font-bold uppercase tracking-widest"
                >
                  <KeyRound size={10} /> Restricted Access Zone
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              <motion.div
                key={loginMode}
                initial={{ opacity: 0, x: isAdmin ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isAdmin ? -20 : 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">
                    {isAdmin ? "Admin Email" : "Work Email"}
                  </label>
                  <div className="relative group">
                    <Mail
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                        isAdmin
                          ? "text-gray-500 group-focus-within:text-amber-400"
                          : "text-gray-500 group-focus-within:text-indigo-400"
                      }`}
                      size={20}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder={
                        isAdmin
                          ? "admin@skillsphere.ai"
                          : "name@company.com"
                      }
                      className={`w-full bg-white/5 border rounded-2xl px-12 py-4 focus:outline-none transition-all text-sm ${
                        isAdmin
                          ? "border-white/10 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10"
                          : "border-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10"
                      }`}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">
                    {isAdmin ? "Admin Password" : "Security Key"}
                  </label>
                  <div className="relative group">
                    <Lock
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                        isAdmin
                          ? "text-gray-500 group-focus-within:text-amber-400"
                          : "text-gray-500 group-focus-within:text-indigo-400"
                      }`}
                      size={20}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="••••••••"
                      className={`w-full bg-white/5 border rounded-2xl px-12 py-4 focus:outline-none transition-all text-sm pr-12 ${
                        isAdmin
                          ? "border-white/10 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10"
                          : "border-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Admin-only: Security Key */}
                {isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="text-sm font-medium text-gray-400 ml-1 flex items-center gap-1.5">
                      <Fingerprint size={14} className="text-amber-400" />
                      Admin Security Key
                    </label>
                    <div className="relative group">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-400 transition-colors" size={20} />
                      <input
                        type="password"
                        value={adminKey}
                        onChange={(e) => {
                          setAdminKey(e.target.value);
                          setError("");
                        }}
                        placeholder="SS-ADMIN-XXXX"
                        className="w-full bg-white/5 border border-amber-500/20 rounded-2xl px-12 py-4 focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 transition-all text-sm placeholder:text-gray-600"
                      />
                    </div>
                    <p className="text-[10px] text-gray-600 ml-1 flex items-center gap-1">
                      <AlertCircle size={10} /> Required for system-level access
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-xs px-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  className="rounded bg-white/5 border-white/10 text-indigo-500 focus:ring-0"
                />
                Remember device
              </label>
              <a
                href="#"
                className={`font-medium ${
                  isAdmin
                    ? "text-amber-400 hover:text-amber-300"
                    : "text-indigo-400 hover:text-indigo-300"
                }`}
              >
                Forgot Access?
              </a>
            </div>

            {/* Submit Button */}
            <button
              onClick={isAdmin ? handleAdminLogin : handleUserLogin}
              disabled={isLoading}
              className={`w-full py-4 font-bold rounded-2xl flex items-center justify-center gap-2 group mt-2 transition-all ${
                isLoading
                  ? "opacity-60 cursor-not-allowed"
                  : ""
              } ${
                isAdmin
                  ? "bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-xl shadow-amber-600/30 hover:shadow-amber-600/50"
                  : "bg-white text-black hover:bg-gray-200 shadow-xl shadow-white/5"
              }`}
            >
              {isLoading ? (
                <>
                  <div
                    className={`w-5 h-5 border-2 rounded-full animate-spin ${
                      isAdmin
                        ? "border-white/30 border-t-white"
                        : "border-black/30 border-t-black"
                    }`}
                  />
                  {isAdmin ? "Verifying Admin..." : "Authorizing..."}
                </>
              ) : (
                <>
                  {isAdmin ? (
                    <>
                      <KeyRound size={18} />
                      Admin Authorization
                    </>
                  ) : (
                    <>
                      Authorize Session
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          {/* SSO Section — User mode only */}
          {!isAdmin && (
            <>
              <div className="mt-8 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0b0c10] px-4 text-gray-500">
                    SSO Shortcuts
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button className="flex items-center justify-center gap-3 py-3 glass rounded-xl hover:bg-white/10 transition-all text-sm font-medium">
                  <User size={18} /> GitHub
                </button>
                <button className="flex items-center justify-center gap-3 py-3 glass rounded-xl hover:bg-white/10 transition-all text-sm font-medium">
                  <Globe size={18} /> Google
                </button>
              </div>
            </>
          )}

          {/* Admin Credentials Hint */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 space-y-2"
            >
              <p className="text-[10px] text-amber-400/60 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={10} /> Demo Admin Credentials
              </p>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-12">Email:</span>
                  <span className="text-amber-300/80">admin@skillsphere.ai</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-12">Pass:</span>
                  <span className="text-amber-300/80">admin123</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-12">Key:</span>
                  <span className="text-amber-300/80">SS-ADMIN-2026</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Register Link */}
          <p className="text-center text-sm text-gray-400 mt-8">
            {isAdmin ? (
              <span className="text-gray-600 text-xs">
                Admin accounts are provisioned by the system.
              </span>
            ) : (
              <>
                New to the operating system?{" "}
                <Link
                  href="/register"
                  className="text-indigo-400 font-bold hover:underline"
                >
                  Request Identity
                </Link>
              </>
            )}
          </p>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-[10px] text-gray-600 flex items-center justify-center gap-1.5">
            <Lock size={10} />
            {isAdmin
              ? "This session is monitored. All admin actions are logged."
              : "256-bit encrypted session • Enterprise-grade security"}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
