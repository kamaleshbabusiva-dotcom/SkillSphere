"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, AreaChart, Area,
  CartesianGrid, PieChart, Pie,
} from "recharts";
import {
  Activity, Target, TrendingUp, Users, Shield, Zap, Cpu, Sparkles,
  Upload, CheckCircle2, X, Download, FileText, Settings, ChevronRight,
  ExternalLink, ScanLine, MessageSquare, Briefcase, BarChart3, Clock,
  Award, ArrowUpRight, Info, GraduationCap, BookOpen, Star, Play,
  Globe, ArrowRight, Layers, Eye,
} from "lucide-react";
import SkillReport from "@/components/SkillReport";
import NewsDashboard from "@/components/NewsDashboard";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

// ---------- Smooth Animated Counter ----------
function useAnimatedCounter(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.round(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

// ---------- Smooth container variants ----------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ---------- Stat Expandable Panel ----------
function StatDetailPanel({ stat, onClose }: { stat: any; onClose: () => void }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, height: 0, marginTop: 0 }}
      animate={{ opacity: 1, height: "auto", marginTop: 24 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      className="col-span-full glass-glow rounded-[28px] p-7 overflow-hidden"
    >
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
            <stat.icon size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black">{stat.label} — {t("breakdown")}</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">{stat.description}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
        >
          <X size={14} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stat.details.map((d: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.06] hover:border-white/[0.1] transition-all"
          >
            <p className="text-[9px] uppercase tracking-[0.15em] text-gray-500 font-bold mb-1.5">{d.label}</p>
            <p className="text-2xl font-black">{d.value}</p>
            <p className="text-[11px] text-gray-500 mt-1">{d.note}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ExportModal({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => { setExporting(false); setDone(true); setTimeout(() => onClose(), 1500); }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="glass-glow rounded-[32px] p-10 max-w-lg w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="text-center py-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
              <CheckCircle2 className="text-green-400 mx-auto mb-4" size={48} />
            </motion.div>
            <h3 className="text-2xl font-black">{t("export_complete")}</h3>
            <p className="text-gray-400 mt-2">{t("export_complete_desc")}</p>
          </div>
        ) : exporting ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold">{t("compiling_report")}</h3>
            <p className="text-gray-500 mt-2 text-sm">{t("aggregating_data")}</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <Download className="text-indigo-400" /> {t("export_analysis")}
              </h3>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { format: "PDF", desc: t("pdf_desc"), icon: FileText, color: "text-red-400", bg: "bg-red-500/10" },
                { format: "JSON", desc: t("json_desc"), icon: BarChart3, color: "text-green-400", bg: "bg-green-500/10" },
                { format: "CSV", desc: t("csv_desc"), icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" },
              ].map((opt) => (
                <button
                  key={opt.format}
                  onClick={handleExport}
                  className="w-full flex items-center gap-4 p-5 glass rounded-2xl hover:bg-white/[0.06] transition-all group text-left hover-lift"
                >
                  <div className={`w-10 h-10 rounded-xl ${opt.bg} flex items-center justify-center`}>
                    <opt.icon className={opt.color} size={20} />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-sm">{opt.format} {t("export_fmt")}</p>
                    <p className="text-[11px] text-gray-500">{opt.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ---------- Config Modal ----------
function ConfigModal({ onClose, benchmark, setBenchmark }: { onClose: () => void; benchmark: string; setBenchmark: (v: string) => void }) {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("dark");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="glass-glow rounded-[32px] p-10 max-w-lg w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black flex items-center gap-3">
            <Settings className="text-indigo-400" /> {t("system_config")}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2 block">{t("default_benchmark")}</label>
            <select
              value={benchmark}
              onChange={(e) => setBenchmark(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 text-sm transition-all"
            >
              <option value="ai_architect">AI Architect (SF)</option>
              <option value="principal_eng">Principal Engineer</option>
              <option value="data_scientist">Data Scientist</option>
              <option value="devops_lead">DevOps Lead</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
            <div>
              <p className="font-bold text-sm">{t("realtime_notifications")}</p>
              <p className="text-[11px] text-gray-500">{t("notifications_desc")}</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-11 h-6 rounded-full relative transition-all ${notifications ? "bg-indigo-600" : "bg-white/10"}`}
            >
              <motion.div
                layout
                className="w-4.5 h-4.5 bg-white rounded-full absolute top-[3px]"
                style={{ left: notifications ? "22px" : "3px" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
            <div>
              <p className="font-bold text-sm">{t("interface_theme")}</p>
              <p className="text-[11px] text-gray-500">{t("theme_desc")}</p>
            </div>
            <div className="flex gap-1.5">
              {["dark", "midnight"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded-lg text-[11px] font-bold capitalize transition-all ${
                    theme === t ? "bg-indigo-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20 mt-2"
          >
            {t("save")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------- Main Dashboard ----------
export default function Dashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [showExportModal, setShowExportModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedStatIndex, setSelectedStatIndex] = useState<number | null>(null);
  const [benchmark, setBenchmark] = useState("ai_architect");
  const [activeTab, setActiveTab] = useState<"overview" | "skills" | "velocity" | "matrix">("overview");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const roleMetadata: Record<string, { label: string, icon: any, salary: string, fit: number, color: string }> = {
    ai_architect: { label: "AI Architect", icon: Cpu, salary: "₹35-75L", fit: 92, color: "indigo" },
    principal_eng: { label: "Principal Eng", icon: Zap, salary: "₹50-90L", fit: 88, color: "violet" },
    data_scientist: { label: "Data Scientist", icon: Activity, salary: "₹25-55L", fit: 95, color: "emerald" },
    devops_lead: { label: "DevOps Lead", icon: Target, salary: "₹22-45L", fit: 84, color: "orange" },
  };

  const extractedSkills = user?.extracted_skills;
  const swotData = user?.swot_data;

  const benchmarkMultipliers: Record<string, number> = {
    ai_architect: 1.0,
    principal_eng: 0.9,
    data_scientist: 1.1,
    devops_lead: 0.85,
  };

  const multiplier = benchmarkMultipliers[benchmark] || 1.0;

  const mockRadarData = [
    { subject: "Python", A: 80, fullMark: 100 },
    { subject: "Cloud Arch", A: 40, fullMark: 100 },
    { subject: "System Design", A: 65, fullMark: 100 },
    { subject: "AI Models", A: 30, fullMark: 100 },
    { subject: "Leadership", A: 90, fullMark: 100 },
  ];

  const mockGapData = [
    { name: "LLM Ops", gap: 70 },
    { name: "Vector DB", gap: 60 },
    { name: "RAG Patterns", gap: 85 },
    { name: "Data Ethics", gap: 40 },
  ];

  const radarData = extractedSkills?.Technical?.length
    ? extractedSkills.Technical.slice(0, 5).map((s) => ({
        subject: s,
        A: Math.round((75 + Math.random() * 20) * multiplier),
        fullMark: 100,
      }))
    : mockRadarData.map((d) => ({ ...d, A: Math.round(d.A * multiplier) }));

  const gapData = extractedSkills?.Domain?.length
    ? extractedSkills.Domain.slice(0, 4).map((s) => ({ name: s, gap: 40 + Math.round(Math.random() * 50) }))
    : mockGapData;

  const velocityData = [
    { month: t("jan"), value: 40, sessions: 12 },
    { month: t("feb"), value: 45, sessions: 14 },
    { month: t("mar"), value: 42, sessions: 11 },
    { month: t("apr"), value: 55, sessions: 18 },
    { month: t("may"), value: 68, sessions: 22 },
    { month: t("jun"), value: 78, sessions: 28 },
  ];

  const score = swotData?.enlightenment_score || 72;
  const animatedScore = useAnimatedCounter(score);
  const techCount = extractedSkills?.Technical?.length || 5;
  const animatedTechCount = useAnimatedCounter(techCount);

  const benchmarkLabels: Record<string, string> = {
    ai_architect: "AI Architect (SF)",
    principal_eng: "Principal Engineer",
    data_scientist: "Data Scientist",
    devops_lead: "DevOps Lead",
  };

  const statsData = [
    {
      label: t("skill_match"),
      value: `${animatedScore}%`,
      rawValue: score,
      icon: Target,
      color: "text-green-400",
      trend: "+4.2%",
      trendUp: true,
      description: "How well your skills align with your target role.",
      details: [
        { label: "Technical Fit", value: `${Math.round(score * 0.9)}%`, note: "Core engineering capabilities" },
        { label: "Soft Skill Fit", value: `${Math.round(score * 1.05)}%`, note: "Leadership & communication" },
        { label: "Domain Fit", value: `${Math.round(score * 0.95)}%`, note: "Industry-specific knowledge" },
      ],
    },
    {
      label: t("gap_severity"),
      value: score > 80 ? "Low" : "Elevated",
      rawValue: score > 80 ? 30 : 65,
      icon: Activity,
      color: "text-red-400",
      trend: "Analyzed",
      trendUp: false,
      description: "Aggregate severity of your competency gaps.",
      details: [
        { label: "Critical Gaps", value: score > 80 ? "1" : "3", note: "Below 40% proficiency" },
        { label: "Moderate Gaps", value: "2", note: "Between 40-70%" },
        { label: "On Track", value: `${techCount - 2}`, note: "Above 70% proficiency" },
      ],
    },
    {
      label: t("tech_breadth"),
      value: `${animatedTechCount} Core`,
      rawValue: techCount,
      icon: Cpu,
      color: "text-blue-400",
      trend: "High",
      trendUp: true,
      description: "Distinct technical competencies in your profile.",
      details: [
        { label: "Primary Stack", value: extractedSkills?.Technical?.[0] || "Python", note: "Strongest skill" },
        { label: "Growth Area", value: extractedSkills?.Technical?.slice(-1)?.[0] || "Cloud", note: "Fastest improving" },
        { label: "Coverage", value: `${Math.round((techCount / 8) * 100)}%`, note: "vs. role requirement of 8" },
      ],
    },
    {
      label: t("mobility"),
      value: user?.target_role?.split(" ").slice(0, 2).join(" ") || "Lead Eng",
      rawValue: 82,
      icon: Users,
      color: "text-purple-400",
      trend: "82%",
      trendUp: true,
      description: "Career trajectory and role readiness.",
      details: [
        { label: "Role Match", value: "82%", note: "Alignment with target" },
        { label: "ETA", value: "12 Weeks", note: "Time to readiness" },
        { label: "Demand", value: "Very High", note: "Market hiring activity" },
      ],
    },
  ];

  const quickActions = [
    { label: t("scan_resume"), icon: ScanLine, href: "/scan", color: "from-indigo-600 to-purple-600", description: t("scan_desc"), readiness: 100, status: "Active" },
    { label: t("skill_lab"), icon: Zap, href: "/lab", color: "from-emerald-600 to-teal-600", description: t("lab_desc"), readiness: 65, status: "Dossier" },
    { label: t("codey_arena"), icon: Target, href: "/codey", color: "from-violet-600 to-purple-600", description: t("codey_desc"), readiness: 42, status: "Dossier" },
    { label: t("mentor"), icon: MessageSquare, href: "/mentor", color: "from-green-600 to-emerald-600", description: t("mentor_desc"), readiness: 100, status: "Active" },
    { label: t("job_market"), icon: Briefcase, href: "/opportunities", color: "from-orange-600 to-red-600", description: t("job_desc"), readiness: 88, status: "Live" },
    { label: t("gap_analysis") || "Gap Analysis", icon: BarChart3, href: "/gap-analysis", color: "from-blue-600 to-cyan-600", description: t("gap_desc"), readiness: 95, status: "Complete" },
    { label: t("peer_connect"), icon: Users, href: "/connect", color: "from-pink-600 to-rose-600", description: t("peer_desc"), readiness: 30, status: "Deploying" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-10 mb-20">
      {/* Market Alert Ticker */}
      <div className="w-full bg-indigo-500/5 border-y border-indigo-500/10 py-3 overflow-hidden whitespace-nowrap relative">
        <motion.div 
          animate={{ x: ["100%", "-100%"] }} 
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 items-center"
        >
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
             <Zap size={12} /> {t("live_status")}: {t("python_demand")}
          </span>
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
             <TrendingUp size={12} /> {t("calibrated")}: {t("cloud_architecture")}
          </span>
          <span className="text-[10px] font-black text-green-400 uppercase tracking-widest flex items-center gap-2">
             <Sparkles size={12} /> {t("mentor_intro").slice(0, 50)}...
          </span>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showExportModal && <ExportModal onClose={() => setShowExportModal(false)} />}
        {showConfigModal && (
          <ConfigModal onClose={() => setShowConfigModal(false)} benchmark={benchmark} setBenchmark={setBenchmark} />
        )}
      </AnimatePresence>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {/* ========== HEADER ========== */}
        <motion.header variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <div className="px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20 text-[10px] uppercase font-bold text-yellow-400 tracking-widest flex items-center gap-1.5">
                <Clock size={11} /> Live
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[1.05]">
              Executive{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Intelligence
              </span>
            </h1>
            <p className="text-gray-500 mt-3 font-medium text-base max-w-xl leading-relaxed">
              Welcome back, <span className="text-white font-semibold">{user?.full_name || "Administrator"}</span> — Real-time professional mapping & career intelligence.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => setShowExportModal(true)}
              className="px-6 py-3.5 bg-white text-black hover:bg-gray-100 rounded-xl font-bold transition-all shadow-lg shadow-white/5 flex items-center gap-2 group text-sm hover-lift"
            >
              <Upload size={16} className="group-hover:-translate-y-0.5 transition-transform" /> {t("export")}
            </button>
            <button
              onClick={() => setShowConfigModal(true)}
              className="px-6 py-3.5 glass hover:bg-white/[0.08] rounded-xl font-bold transition-all text-sm flex items-center gap-2"
            >
              <Settings size={15} /> {t("config")}
            </button>
          </div>
        </motion.header>

        {/* ========== TAB SWITCHER ========== */}
        <motion.div variants={itemVariants} className="flex gap-1.5 bg-white/[0.03] rounded-xl p-1 w-fit border border-white/[0.06]">
          {[
            { id: "overview" as const, label: t("overview"), icon: Eye },
            { id: "skills" as const, label: t("skill_deep_dive"), icon: Layers },
            { id: "velocity" as const, label: t("growth_velocity"), icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-lg text-[12px] font-bold transition-all relative flex items-center gap-2 ${
                activeTab === tab.id ? "text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="dashboard-tab"
                  className="absolute inset-0 bg-indigo-600/20 rounded-lg border border-indigo-500/20"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <tab.icon size={14} /> {tab.label}
              </span>
            </button>
          ))}
        </motion.div>

        {/* ========== STATS GRID ========== */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, i) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              onClick={() => setSelectedStatIndex(selectedStatIndex === i ? null : i)}
              className={`glass p-6 rounded-[24px] flex items-center gap-5 group cursor-pointer transition-all duration-300 ${
                selectedStatIndex === i
                  ? "border-indigo-500/30 bg-indigo-500/[0.04]"
                  : "hover:border-white/15"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-300 border border-white/[0.06]`}
              >
                <stat.icon size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.15em] mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-black truncate">{stat.value}</p>
                  <span className={`text-[10px] font-bold ${stat.trendUp ? "text-green-400" : "text-gray-400"}`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-[9px] text-gray-600 mt-0.5 flex items-center gap-1">
                  <Info size={9} /> Tap to expand
                </p>
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {selectedStatIndex !== null && (
              <StatDetailPanel stat={statsData[selectedStatIndex]} onClose={() => setSelectedStatIndex(null)} />
            )}
          </AnimatePresence>
        </motion.div>

        {/* ========== MAIN CONTENT TABS ========== */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Radar Chart */}
              <motion.div className="lg:col-span-2 glass-glow p-8 rounded-[32px]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div className="flex-grow">
                    <h2 className="text-2xl font-black flex items-center gap-2.5">
                      <Shield className="text-indigo-400" size={22} /> Competency Landscape
                    </h2>
                    <p className="text-gray-500 text-[12px] mt-1 italic">
                      Intelligence matrix calibrated to <span className="text-indigo-400 font-bold">{roleMetadata[benchmark].label}</span>
                    </p>
                  </div>
                </div>

                {/* --- UNIQUE ROLE SELECTOR --- */}
                <div className="flex gap-4 overflow-x-auto pb-6 chat-scroll no-scrollbar mb-4">
                  {Object.entries(roleMetadata).map(([id, meta]) => (
                    <motion.button
                      key={id}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setBenchmark(id);
                        setIsScanning(true);
                        setTimeout(() => setIsScanning(false), 1500);
                      }}
                      className={`min-w-[180px] p-5 rounded-[24px] border transition-all text-left relative overflow-hidden group ${
                        benchmark === id 
                          ? "bg-indigo-600/10 border-indigo-500 shadow-xl shadow-indigo-500/10" 
                          : "bg-white/[0.02] border-white/[0.06] hover:border-white/20"
                      }`}
                    >
                      {benchmark === id && (
                        <motion.div 
                          layoutId="active-role-glow"
                          className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none"
                        />
                      )}
                      
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${benchmark === id ? "text-indigo-400" : "text-gray-600"}`}>
                          <meta.icon size={18} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${benchmark === id ? "text-indigo-400" : "text-gray-500"}`}>
                          {meta.fit}% Fit
                        </span>
                      </div>
                      
                      <h4 className={`text-sm font-black mb-1 ${benchmark === id ? "text-white" : "text-gray-400"}`}>{meta.label}</h4>
                      
                      <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${meta.fit}%` }}
                          className={`h-full rounded-full transition-colors ${benchmark === id ? "bg-indigo-500" : "bg-gray-700"}`}
                        />
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="h-[450px] relative transition-all duration-700">
                  <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                    <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id="mainRadarGrad" x1="0" y1="0" x2="1" y2="1">
                       <stop offset="0%" stopColor="#6366f1" />
                       <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </svg>
                  
                  {isScanning && (
                    <motion.div 
                      initial={{ top: "-100%" }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                      className="absolute left-0 w-full h-20 bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent z-10 pointer-events-none"
                    />
                  )}

                  {isMounted && (
                    <motion.div 
                      key={benchmark}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isScanning ? 0.3 : 1 }}
                      className="w-full h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="#ffffff08" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 10, fontWeight: "black", letterSpacing: "0.1em" }} />
                      
                      {/* Deep Layer */}
                        <Radar 
                          name={t("baseline")} 
                        dataKey="A" 
                        stroke="none"
                        fill="#6366f1" 
                        fillOpacity={0.15} 
                        animationDuration={1500} 
                      />
                      
                      {/* Interaction/Glow Layer */}
                      <Radar 
                        name={t("curr_intel")} 
                        dataKey="A" 
                        stroke="#6366f1" 
                        strokeWidth={4}
                        fill="#6366f1" 
                        fillOpacity={0.4} 
                        animationDuration={1000} 
                        style={{ filter: 'url(#neonGlow)' }}
                        onClick={(data) => {
                          if (data && data.payload) {
                            setSelectedSkill(data.payload.subject);
                          }
                        }}
                        className="cursor-pointer"
                      />
                          <Tooltip 
                            contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "16px", padding: "14px" }} 
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </motion.div>
                  )}
                </div>

                {/* Skill Drilldown Detail (Interactive Overlay) */}
                <AnimatePresence>
                  {selectedSkill && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-8 p-6 glass rounded-[24px] border border-indigo-500/20 bg-indigo-500/[0.02]"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                            <Target size={20} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-black">{selectedSkill} — {t("drilldown")}</h3>
                            <p className="text-[11px] text-gray-500 uppercase font-black tracking-widest">{t("mastery_intel")}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedSkill(null)}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/[0.03] p-4 rounded-xl">
                          <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">{t("proficiency")}</p>
                          <p className="text-xl font-black text-indigo-400">82%</p>
                          <div className="h-1 w-full bg-white/5 rounded-full mt-2">
                             <div className="h-full bg-indigo-500 rounded-full" style={{ width: '82%' }} />
                          </div>
                        </div>
                        <div className="bg-white/[0.03] p-4 rounded-xl">
                          <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">{t("market_demand")}</p>
                          <p className="text-xl font-black text-green-400">{t("high")}</p>
                          <p className="text-[10px] text-gray-600 font-medium">+15% vs Last Quarter</p>
                        </div>
                        <div className="bg-white/[0.03] p-4 rounded-xl">
                          <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">{t("learning_path")}</p>
                          <p className="text-xl font-black text-amber-400">{t("advanced")}</p>
                          <p className="text-[10px] text-gray-600 font-medium">3 {t("courses_recommended")}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex gap-3">
                        <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[11px] font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
                           {t("explore_expert")}
                        </button>
                        <button className="px-5 py-2.5 glass text-white rounded-xl text-[11px] font-bold hover:bg-white/10 transition-all">
                           {t("compare_benchmarks")}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Right column */}
              <div className="space-y-6 flex flex-col">
                {/* Velocity mini */}
                <motion.div className="glass p-7 rounded-[28px] flex-grow flex flex-col">
                  <div className="mb-6">
                    <h2 className="text-lg font-black flex items-center gap-2">
                      <Zap className="text-yellow-400" size={18} /> {t("skill_velocity")}
                    </h2>
                    <p className="text-gray-500 text-[11px] mt-1">{t("acquisition_rate_6_months")}</p>
                  </div>
                  <div className="h-[140px] flex-grow">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={velocityData}>
                        <defs>
                          <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                        <XAxis dataKey="month" tick={{ fill: "#555", fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "12px", padding: "10px" }}
                          formatter={(value: any) => [`${value} pts`, t("velocity")]}
                          labelFormatter={(label: any) => `${t("month")}: ${label}`}
                        />
                        <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" animationDuration={1200} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Gap bars */}
                <motion.div className="glass p-7 rounded-[28px] flex-grow">
                  <h2 className="text-lg font-black mb-6 flex items-center gap-2">
                    <Cpu className="text-indigo-400" size={18} /> {t("structural_gaps")}
                  </h2>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={gapData} layout="vertical" margin={{ left: -20, right: 16 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" tick={{ fill: "#888", fontSize: 11, fontWeight: "bold" }} width={90} />
                        <Tooltip
                          cursor={{ fill: "transparent" }}
                          contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "14px", padding: "10px" }}
                          formatter={(value: any) => [`${value}% ${t("gap")}`, t("severity")]}
                        />
                        <Bar 
                          dataKey="gap" 
                          radius={[0, 8, 8, 0]} 
                          animationDuration={1000}
                        >
                          {gapData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={selectedSkill === entry.name ? "#f59e0b" : entry.gap > 75 ? "#ef4444" : "#6366f1"}
                              stroke={selectedSkill === entry.name ? "#fff" : "none"}
                              strokeWidth={2}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === "skills" && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {/* Skill category cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    title: t("technical_skills"),
                    icon: Cpu,
                    color: "text-blue-400",
                    border: "border-blue-500/10",
                    barColor: (p: number) => p > 80 ? "bg-green-500" : p > 60 ? "bg-indigo-500" : "bg-yellow-500",
                    hoverColor: "group-hover:text-blue-400",
                    skills: extractedSkills?.Technical || ["Python", "FastAPI", "React", "Docker", "SQL"],
                  },
                  {
                    title: t("soft_skills"),
                    icon: Users,
                    color: "text-purple-400",
                    border: "border-purple-500/10",
                    barColor: () => "bg-purple-500",
                    hoverColor: "group-hover:text-purple-400",
                    skills: extractedSkills?.Soft || ["Communication", "Leadership", "Problem Solving"],
                  },
                  {
                    title: t("domain_expertise"),
                    icon: Award,
                    color: "text-yellow-400",
                    border: "border-yellow-500/10",
                    barColor: () => "bg-yellow-500",
                    hoverColor: "group-hover:text-yellow-400",
                    skills: extractedSkills?.Domain || ["AI Engineering", "Cloud Computing"],
                  },
                ].map((cat) => (
                  <div key={cat.title} className={`glass p-7 rounded-[28px] ${cat.border}`}>
                    <h3 className="text-base font-black mb-5 flex items-center gap-2">
                      <cat.icon className={cat.color} size={18} /> {cat.title}
                    </h3>
                    <div className="space-y-3.5">
                      {cat.skills.map((skill, i) => {
                        const proficiency = 55 + Math.round(Math.random() * 40);
                        return (
                          <div key={skill} className="group">
                            <div className="flex justify-between text-[12px] mb-1.5">
                              <span className="font-medium">{skill}</span>
                              <span className={`text-gray-500 ${cat.hoverColor} transition-colors font-bold`}>{proficiency}%</span>
                            </div>
                            <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${proficiency}%` }}
                                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                className={`h-full rounded-full ${cat.barColor(proficiency)}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* ====== RECOMMENDED COURSES ====== */}
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black flex items-center gap-2.5">
                      <GraduationCap className="text-indigo-400" size={22} /> {t("recommended_paths")}
                    </h2>
                    <p className="text-gray-500 text-[12px] mt-1">{t("ai_matched_courses")}</p>
                  </div>
                  <div className="px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[10px] uppercase font-bold text-indigo-400 tracking-widest flex items-center gap-1.5">
                    <Sparkles size={10} /> {t("ai_matched")}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    { title: "Machine Learning Specialization", provider: "Coursera", instructor: "Andrew Ng • Stanford", rating: 4.9, reviews: "182K", duration: "3 months", level: "Beginner", enrolled: "4.8M+", gradient: "from-blue-600 to-indigo-600", tags: ["ML", "AI", "Neural Networks"], url: "https://www.coursera.org/specializations/machine-learning-introduction", logo: "🎓", match: 96 },
                    { title: "Python for Everybody", provider: "Coursera", instructor: "Dr. Charles Severance • UMich", rating: 4.8, reviews: "230K", duration: "8 months", level: "Beginner", enrolled: "3.4M+", gradient: "from-yellow-600 to-orange-600", tags: ["Python", "Web", "Data"], url: "https://www.coursera.org/specializations/python", logo: "🐍", match: 92 },
                    { title: "Deep Learning Specialization", provider: "Coursera", instructor: "Andrew Ng • DeepLearning.AI", rating: 4.9, reviews: "145K", duration: "5 months", level: "Intermediate", enrolled: "1.2M+", gradient: "from-purple-600 to-pink-600", tags: ["Deep Learning", "CNNs", "RNNs"], url: "https://www.coursera.org/specializations/deep-learning", logo: "🧠", match: 88 },
                    { title: "Google Cloud Architecture", provider: "Coursera", instructor: "Google Cloud Training", rating: 4.7, reviews: "38K", duration: "4 months", level: "Advanced", enrolled: "520K+", gradient: "from-cyan-600 to-teal-600", tags: ["Cloud", "GCP", "DevOps"], url: "https://www.coursera.org/professional-certificates/gcp-cloud-architect", logo: "☁️", match: 85 },
                    { title: "Full-Stack with React", provider: "Coursera", instructor: "Jogesh Muppala • HKUST", rating: 4.7, reviews: "52K", duration: "4 months", level: "Intermediate", enrolled: "380K+", gradient: "from-green-600 to-emerald-600", tags: ["React", "Node.js", "Express"], url: "https://www.coursera.org/specializations/full-stack-react", logo: "⚛️", match: 82 },
                    { title: "IBM Data Science Certificate", provider: "Coursera", instructor: "IBM Skills Network", rating: 4.6, reviews: "98K", duration: "5 months", level: "Beginner", enrolled: "870K+", gradient: "from-red-600 to-rose-600", tags: ["Data Science", "SQL", "Python"], url: "https://www.coursera.org/professional-certificates/ibm-data-science", logo: "📊", match: 79 },
                  ].map((course, i) => (
                    <motion.a
                      key={course.title}
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      className="glass rounded-[22px] overflow-hidden group hover:border-indigo-500/20 transition-all cursor-pointer relative block hover-lift"
                    >
                      {/* Banner */}
                      <div className={`h-24 bg-gradient-to-br ${course.gradient} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute top-3 left-3 text-3xl">{course.logo}</div>
                        <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-full text-[9px] font-bold text-white flex items-center gap-1">
                          <Sparkles size={9} className="text-yellow-400" /> {course.match}% {t("match")}
                        </div>
                        <div className="absolute bottom-2 left-3">
                          <div className="px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-md text-[8px] font-bold text-white/80 inline-flex items-center gap-1">
                            <Globe size={8} /> {course.provider}
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-4 space-y-2.5">
                        <h3 className="font-black text-[13px] leading-tight group-hover:text-indigo-300 transition-colors line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                          <GraduationCap size={10} className="text-gray-600" /> {course.instructor}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-black text-amber-400">{course.rating}</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }, (_, si) => (
                              <Star key={si} size={10} className={si < Math.floor(course.rating) ? "text-amber-400 fill-amber-400" : "text-gray-600"} />
                            ))}
                          </div>
                          <span className="text-[9px] text-gray-500">({course.reviews})</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {course.tags.map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 bg-white/[0.04] rounded text-[8px] font-bold text-gray-400 border border-white/[0.06]">{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                          <div className="flex items-center gap-2.5 text-[9px] text-gray-500">
                            <span className="flex items-center gap-1"><Clock size={9} /> {course.duration}</span>
                            <span className="flex items-center gap-1"><Users size={9} /> {course.enrolled}</span>
                          </div>
                          <div className={`px-2 py-0.5 rounded-full text-[8px] font-bold border ${
                            course.level === "Beginner" ? "text-green-400 bg-green-500/10 border-green-500/20" :
                            course.level === "Intermediate" ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" :
                            "text-red-400 bg-red-500/10 border-red-500/20"
                          }`}>{course.level}</div>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Browse more */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="glass p-7 rounded-[28px] bg-gradient-to-r from-indigo-600/[0.06] via-transparent to-purple-600/[0.06] flex flex-col md:flex-row items-center justify-between gap-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h3 className="text-base font-black">{t("explore_courses")}</h3>
                      <p className="text-gray-500 text-[12px] mt-0.5">{t("world_class_learning")}</p>
                    </div>
                  </div>
                  <a
                    href="https://www.coursera.org/search?query=skills"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 whitespace-nowrap flex items-center gap-2 group text-sm"
                  >
                    {t("browse_coursera")} <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === "velocity" && (
            <motion.div
              key="velocity"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="glass-glow p-8 rounded-[32px]">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-black flex items-center gap-2.5">
                      <TrendingUp className="text-green-400" size={22} /> {t("growth_velocity")}
                    </h2>
                    <p className="text-gray-500 text-[12px] mt-1 italic">{t("velocity_desc")}</p>
                  </div>
                </div>
                <div className="h-[380px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={velocityData}>
                      <defs>
                        <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                      <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 12 }} />
                      <YAxis tick={{ fill: "#666", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "14px", padding: "14px" }}
                        formatter={(value: any, name: string) => {
                          if (name === "value") return [`${value} pts`, t("velocity_score")];
                          return [`${value} sessions`, t("learning_sessions")];
                        }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} fill="url(#colorVelocity)" animationDuration={1500} />
                      <Area type="monotone" dataKey="sessions" stroke="#6366f1" strokeWidth={2} fill="transparent" strokeDasharray="5 5" animationDuration={1500} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-6 mt-5">
                  <div className="flex items-center gap-2 text-[12px] text-gray-400">
                    <div className="w-4 h-1 bg-green-500 rounded-full" /> {t("velocity_score")}
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-gray-400">
                    <div className="w-4 h-0.5 bg-indigo-500 rounded-full" style={{ borderTop: "2px dashed #6366f1" }} /> {t("learning_sessions")}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SWOT Report */}
        {swotData && <SkillReport data={swotData} />}

        {/* ========== QUICK ACTIONS ========== */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-black mb-5 flex items-center gap-2.5">
            <Sparkles className="text-indigo-400" size={20} /> {t("quick_actions")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {quickActions.map((action, i) => (
              <Link key={action.label} href={action.href}>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass p-5 rounded-[20px] group hover:border-indigo-500/20 transition-all cursor-pointer relative overflow-hidden h-full hover-lift"
                >
                  <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                    <span className={`px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-tighter ${action.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-500'}`}>
                      {t(action.status.toLowerCase())}
                    </span>
                    <span className="text-[8px] font-black text-gray-600 bg-black/20 p-0.5 rounded-sm">
                      {action.readiness}% {t("ready")}
                    </span>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <action.icon size={18} className="text-white" />
                  </div>
                  <h3 className="font-bold text-[12px] mb-0.5">{action.label}</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{action.description}</p>
                  <ArrowUpRight size={12} className="absolute top-4 right-4 text-gray-700 group-hover:text-white transition-colors" />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ========== NEWS DASHBOARD ========== */}
        <motion.div variants={itemVariants}>
          <NewsDashboard />
        </motion.div>

        {/* ========== TRANSFORMATION CTA ========== */}
        <motion.div
          variants={itemVariants}
          className="glass-glow p-10 rounded-[36px] bg-gradient-to-br from-indigo-600/[0.08] via-transparent to-purple-600/[0.04] relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/15 shrink-0 animate-float">
                <Sparkles size={32} />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-black mb-2 tracking-tight leading-tight">
                  {t("strategy_title")}
                </p>
                <p className="text-gray-400 max-w-xl text-[13px] leading-relaxed">
                  {language === "Tamil" ? (
                    <>
                      {t("strategy_desc_1")}
                      <span className="text-white font-semibold">{t("workforce_resilience")}</span>
                      {t("strategy_desc_2")}
                      <span className="text-indigo-400 font-bold">
                        {extractedSkills?.Technical?.slice(0, 3).join(", ") || "Advanced AI"}
                      </span>
                      {t("strategy_desc_3")} {t("weeks_12")} {t("strategy_desc_4")}
                    </>
                  ) : (
                    <>
                      {t("strategy_desc_1")} {" "}
                      <span className="text-white font-semibold">{t("workforce_resilience")}</span>
                      {t("strategy_desc_2")}
                      <span className="text-indigo-400 font-bold">
                        {extractedSkills?.Technical?.slice(0, 3).join(", ") || "Advanced AI"}
                      </span>
                      {t("strategy_desc_3")} {t("weeks_12")}.
                    </>
                  )}
                </p>
              </div>
            </div>
            <Link href="/gap-analysis">
              <button className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-all shadow-xl shadow-indigo-600/25 whitespace-nowrap text-sm group flex items-center gap-2">
                {t("initialize_pathway")} <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/[0.06] blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/[0.06] blur-[100px] rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
}
