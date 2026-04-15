"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import {
  Crown,
  Users,
  TrendingUp,
  Activity,
  Search,
  Filter,
  GraduationCap,
  BookOpen,
  Code2,
  Brain,
  Shield,
  Eye,
  Mail,
  BarChart3,
  Clock,
  Award,
  Zap,
  Star,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Video,
  MessageSquare,
  Monitor,
  Globe,
  Target,
  Flame,
  UserCheck,
  UserX,
  FileText,
  Download,
  MoreVertical,
  X,
  RefreshCw,
  Cpu,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Plus, UserPlus, Send, Check } from "lucide-react";
import NewsDashboard from "@/components/NewsDashboard";


// ============================================================
// MOCK LEARNER DATA
// ============================================================

interface Learner {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  joinedDate: string;
  status: "active" | "idle" | "offline";
  skills: string[];
  coursesCompleted: number;
  coursesInProgress: number;
  labScore: number;
  codeyScore: number;
  readinessScore: number;
  totalXP: number;
  lastActive: string;
  streak: number;
  sessionsAttended: number;
}

const mockLearners: Learner[] = [
  {
    id: 1, name: "Aarav Sharma", email: "aarav@company.com", avatar: "AS",
    role: "Frontend Developer", department: "Engineering",
    joinedDate: "2026-01-15", status: "active",
    skills: ["React", "TypeScript", "Next.js", "CSS"],
    coursesCompleted: 4, coursesInProgress: 2, labScore: 85, codeyScore: 72,
    readinessScore: 78, totalXP: 620, lastActive: "2 min ago", streak: 12,
    sessionsAttended: 8,
  },
  {
    id: 2, name: "Priya Patel", email: "priya@company.com", avatar: "PP",
    role: "Data Scientist", department: "AI/ML",
    joinedDate: "2026-02-08", status: "active",
    skills: ["Python", "TensorFlow", "SQL", "Pandas"],
    coursesCompleted: 6, coursesInProgress: 1, labScore: 92, codeyScore: 88,
    readinessScore: 91, totalXP: 890, lastActive: "5 min ago", streak: 24,
    sessionsAttended: 15,
  },
  {
    id: 3, name: "Rahul Kumar", email: "rahul@company.com", avatar: "RK",
    role: "Backend Engineer", department: "Engineering",
    joinedDate: "2026-01-22", status: "idle",
    skills: ["Python", "FastAPI", "PostgreSQL", "Docker"],
    coursesCompleted: 3, coursesInProgress: 3, labScore: 68, codeyScore: 75,
    readinessScore: 72, totalXP: 480, lastActive: "1 hour ago", streak: 5,
    sessionsAttended: 6,
  },
  {
    id: 4, name: "Sneha Reddy", email: "sneha@company.com", avatar: "SR",
    role: "Cloud Architect", department: "DevOps",
    joinedDate: "2026-03-01", status: "active",
    skills: ["AWS", "Terraform", "Kubernetes", "CI/CD"],
    coursesCompleted: 5, coursesInProgress: 2, labScore: 88, codeyScore: 82,
    readinessScore: 86, totalXP: 750, lastActive: "Just now", streak: 18,
    sessionsAttended: 12,
  },
  {
    id: 5, name: "Vikram Singh", email: "vikram@company.com", avatar: "VS",
    role: "Full Stack Developer", department: "Engineering",
    joinedDate: "2026-02-14", status: "offline",
    skills: ["React", "Node.js", "MongoDB", "GraphQL"],
    coursesCompleted: 2, coursesInProgress: 4, labScore: 55, codeyScore: 48,
    readinessScore: 58, totalXP: 310, lastActive: "2 days ago", streak: 0,
    sessionsAttended: 3,
  },
  {
    id: 6, name: "Ananya Gupta", email: "ananya@company.com", avatar: "AG",
    role: "ML Engineer", department: "AI/ML",
    joinedDate: "2026-01-30", status: "active",
    skills: ["PyTorch", "Computer Vision", "MLOps", "Python"],
    coursesCompleted: 7, coursesInProgress: 1, labScore: 95, codeyScore: 91,
    readinessScore: 94, totalXP: 950, lastActive: "8 min ago", streak: 30,
    sessionsAttended: 20,
  },
  {
    id: 7, name: "Karthik Iyer", email: "karthik@company.com", avatar: "KI",
    role: "DevOps Engineer", department: "DevOps",
    joinedDate: "2026-03-10", status: "idle",
    skills: ["Docker", "Jenkins", "Linux", "Ansible"],
    coursesCompleted: 3, coursesInProgress: 2, labScore: 71, codeyScore: 65,
    readinessScore: 69, totalXP: 420, lastActive: "3 hours ago", streak: 7,
    sessionsAttended: 5,
  },
  {
    id: 8, name: "Meera Nair", email: "meera@company.com", avatar: "MN",
    role: "UI/UX Designer", department: "Design",
    joinedDate: "2026-02-20", status: "active",
    skills: ["Figma", "CSS", "Design Systems", "Prototyping"],
    coursesCompleted: 4, coursesInProgress: 1, labScore: 76, codeyScore: 42,
    readinessScore: 73, totalXP: 520, lastActive: "15 min ago", streak: 9,
    sessionsAttended: 7,
  },
  {
    id: 9, name: "Arjun Mehta", email: "arjun@company.com", avatar: "AM",
    role: "Security Engineer", department: "Security",
    joinedDate: "2026-01-10", status: "active",
    skills: ["Penetration Testing", "SIEM", "Cloud Security", "Python"],
    coursesCompleted: 5, coursesInProgress: 2, labScore: 83, codeyScore: 79,
    readinessScore: 81, totalXP: 680, lastActive: "30 min ago", streak: 14,
    sessionsAttended: 10,
  },
  {
    id: 10, name: "Divya Joshi", email: "divya@company.com", avatar: "DJ",
    role: "Product Manager", department: "Product",
    joinedDate: "2026-03-05", status: "offline",
    skills: ["Agile", "Analytics", "Strategy", "Communication"],
    coursesCompleted: 2, coursesInProgress: 3, labScore: 62, codeyScore: 35,
    readinessScore: 55, totalXP: 250, lastActive: "1 week ago", streak: 0,
    sessionsAttended: 2,
  },
  {
    id: 11, name: "Rohan Desai", email: "rohan@company.com", avatar: "RD",
    role: "Blockchain Developer", department: "Engineering",
    joinedDate: "2026-02-28", status: "active",
    skills: ["Solidity", "Web3.js", "Ethereum", "Rust"],
    coursesCompleted: 3, coursesInProgress: 2, labScore: 79, codeyScore: 84,
    readinessScore: 77, totalXP: 580, lastActive: "12 min ago", streak: 11,
    sessionsAttended: 9,
  },
  {
    id: 12, name: "Ishita Verma", email: "ishita@company.com", avatar: "IV",
    role: "QA Lead", department: "Quality",
    joinedDate: "2026-01-25", status: "idle",
    skills: ["Selenium", "Cypress", "API Testing", "Performance"],
    coursesCompleted: 4, coursesInProgress: 1, labScore: 74, codeyScore: 58,
    readinessScore: 70, totalXP: 460, lastActive: "5 hours ago", streak: 3,
    sessionsAttended: 4,
  },
];

// Mock active sessions
const mockSessions = [
  { id: 1, host: "Priya Patel", topic: "Deep Learning Workshop", participants: 4, duration: "45 min", status: "live" as const },
  { id: 2, host: "Sneha Reddy", topic: "AWS Architecture Review", participants: 3, duration: "22 min", status: "live" as const },
  { id: 3, host: "Ananya Gupta", topic: "MLOps Best Practices", participants: 6, duration: "1h 10 min", status: "live" as const },
];

// ============================================================
// ADMIN DASHBOARD COMPONENT
// ============================================================

export default function AdminDashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [activeView, setActiveView] = useState<"overview" | "learners" | "connect">("overview");
  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);
  const [pairingCode, setPairingCode] = useState("");
  const [pairingStatus, setPairingStatus] = useState<string | null>(null);

  const handlePairUser = async () => {
    if (!pairingCode.trim()) return;
    setPairingStatus("Connecting...");
    try {
      const response = await fetch("http://localhost:8000/api/mentor/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: pairingCode.toUpperCase(),
          admin_id: user?.id || 99
        }),
      });
      const data = await response.json();
      if (data.success) {
        setPairingStatus(`Success! Connected to ${data.mentee_name}`);
        setTimeout(() => {
          setIsPairingModalOpen(false);
          setPairingStatus(null);
          setPairingCode("");
        }, 2000);
      } else {
        setPairingStatus(`Error: ${data.detail || "Invalid code"}`);
      }
    } catch (e) {
      setPairingStatus("Connection failed.");
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "idle" | "offline">("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "readiness" | "xp" | "streak">("readiness");

  // Filtered & sorted learners
  const filteredLearners = useMemo(() => {
    let list = [...mockLearners];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (l) => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.role.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") list = list.filter((l) => l.status === statusFilter);
    if (departmentFilter !== "all") list = list.filter((l) => l.department === departmentFilter);

    list.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "readiness") return b.readinessScore - a.readinessScore;
      if (sortBy === "xp") return b.totalXP - a.totalXP;
      if (sortBy === "streak") return b.streak - a.streak;
      return 0;
    });
    return list;
  }, [searchQuery, statusFilter, departmentFilter, sortBy]);

  const allDepartments = [...new Set(mockLearners.map((l) => l.department))];

  // Aggregate stats
  const totalLearners = mockLearners.length;
  const activeLearners = mockLearners.filter((l) => l.status === "active").length;
  const avgReadiness = Math.round(mockLearners.reduce((s, l) => s + l.readinessScore, 0) / totalLearners);
  const totalCoursesCompleted = mockLearners.reduce((s, l) => s + l.coursesCompleted, 0);
  const totalSessions = mockSessions.length;

  // Department distribution
  const deptChart = allDepartments.map((dept) => ({
    name: dept,
    count: mockLearners.filter((l) => l.department === dept).length,
    avgScore: Math.round(
      mockLearners.filter((l) => l.department === dept).reduce((s, l) => s + l.readinessScore, 0) /
      mockLearners.filter((l) => l.department === dept).length
    ),
  }));

  const deptColors = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];

  // Activity timeline
  const activityData = [
    { day: "Mon", logins: 8, courses: 12, labs: 6 },
    { day: "Tue", logins: 10, courses: 15, labs: 9 },
    { day: "Wed", logins: 7, courses: 10, labs: 5 },
    { day: "Thu", logins: 12, courses: 18, labs: 11 },
    { day: "Fri", logins: 9, courses: 14, labs: 8 },
    { day: "Sat", logins: 4, courses: 6, labs: 3 },
    { day: "Sun", logins: 3, courses: 5, labs: 2 },
  ];

  // Performance tiers
  const tiers = {
    excellent: mockLearners.filter((l) => l.readinessScore >= 85).length,
    good: mockLearners.filter((l) => l.readinessScore >= 70 && l.readinessScore < 85).length,
    needsWork: mockLearners.filter((l) => l.readinessScore < 70).length,
  };

  const tierPieData = [
    { name: "Excellent (85%+)", value: tiers.excellent, fill: "#22c55e" },
    { name: "Good (70-84%)", value: tiers.good, fill: "#f59e0b" },
    { name: "Needs Improvement (<70%)", value: tiers.needsWork, fill: "#ef4444" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 mb-20 px-6">
      {/* Learner Detail Modal */}
      <AnimatePresence>
        {selectedLearner && (
          <LearnerDetailModal learner={selectedLearner} onClose={() => setSelectedLearner(null)} />
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 text-[10px] uppercase font-bold text-amber-400 tracking-widest flex items-center gap-1.5">
                <Crown size={12} /> Admin Panel
              </div>
              <div className="px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20 text-[10px] uppercase font-bold text-red-400 tracking-widest flex items-center gap-1.5">
                <Shield size={12} /> Elevated Access
              </div>
              <div className="px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 text-[10px] uppercase font-bold text-green-400 tracking-widest flex items-center gap-1.5">
                <Activity size={12} /> {activeLearners} Online
              </div>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-black tracking-tighter">
              Workforce <span className="text-amber-500">Command Center</span>
            </motion.h1>
          </div>
          <button 
            onClick={() => setIsPairingModalOpen(true)}
            className="px-6 py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-amber-500 hover:text-white transition-all shadow-xl shadow-white/5 flex items-center gap-2"
          >
            <UserPlus size={16} />
            {t("admin_pair")}
          </button>
        </header>

        {/* View Tabs */}
        <div className="flex gap-2 bg-white/5 rounded-2xl p-1.5 w-fit">
          {[
            { id: "overview" as const, label: t("overview"), icon: BarChart3 },
            { id: "learners" as const, label: t("learner_dashboard"), icon: Users },
            { id: "connect" as const, label: t("live_sessions"), icon: Video },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative flex items-center gap-2 ${
                activeView === tab.id ? "text-white" : "text-gray-500 hover:text-white"
              }`}
            >
              {activeView === tab.id && (
                <motion.div layoutId="admin-tab" className="absolute inset-0 bg-amber-600/30 rounded-xl border border-amber-500/30" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <tab.icon size={16} /> {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* ============== OVERVIEW VIEW ============== */}
        <AnimatePresence mode="wait">
          {activeView === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                {[
                  { label: t("total_learners"), value: totalLearners.toString(), icon: Users, color: "text-amber-400", gradient: "from-amber-600/20" },
                  { label: t("active_now"), value: activeLearners.toString(), icon: UserCheck, color: "text-green-400", gradient: "from-green-600/20" },
                  { label: t("avg_readiness"), value: `${avgReadiness}%`, icon: Target, color: "text-indigo-400", gradient: "from-indigo-600/20" },
                  { label: t("courses_done"), value: totalCoursesCompleted.toString(), icon: GraduationCap, color: "text-purple-400", gradient: "from-purple-600/20" },
                  { label: t("live_sessions"), value: totalSessions.toString(), icon: Video, color: "text-red-400", gradient: "from-red-600/20" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`glass p-6 rounded-[28px] flex items-center gap-4 group hover:border-amber-500/20 transition-all bg-gradient-to-br ${stat.gradient} to-transparent`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform border border-white/5`}>
                      <stat.icon size={24} />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</p>
                      <p className="text-2xl font-black">{stat.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Heatmap */}
                <div className="lg:col-span-2 glass p-8 rounded-[36px]">
                  <h2 className="text-xl font-black mb-1 flex items-center gap-2">
                    <TrendingUp className="text-green-400" size={20} /> {t("learner_growth")}
                  </h2>
                  <p className="text-gray-500 text-xs mb-6">{t("weekly_activity_desc")}</p>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData}>
                        <defs>
                          <linearGradient id="adminLogin" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="adminCourse" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                        <XAxis dataKey="day" tick={{ fill: "#666", fontSize: 11 }} />
                        <YAxis tick={{ fill: "#555", fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: "#050505", border: "1px solid #333", borderRadius: "16px", padding: "12px" }} />
                        <Area type="monotone" dataKey="logins" stroke="#f59e0b" strokeWidth={2} fill="url(#adminLogin)" name={t("logins")} />
                        <Area type="monotone" dataKey="courses" stroke="#6366f1" strokeWidth={2} fill="url(#adminCourse)" name={t("course_progress")} />
                        <Area type="monotone" dataKey="labs" stroke="#22c55e" strokeWidth={2} fill="transparent" strokeDasharray="5 5" name={t("lab_sessions")} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Performance Tiers */}
                <div className="glass p-8 rounded-[36px]">
                  <h2 className="text-xl font-black mb-2 flex items-center gap-2">
                    <Cpu className="text-indigo-400" size={20} /> {t("workforce_readiness")}
                  </h2>
                  <p className="text-gray-500 text-xs mb-8">{t("role_readiness_dist") || "Role readiness distribution across the workforce"}</p>
                  <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={tierPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0} animationDuration={800}>
                          {tierPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#050505", border: "1px solid #333", borderRadius: "16px", padding: "12px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-2">
                    {tierPieData.map((t) => (
                      <div key={t.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.fill }} />
                          <span className="text-gray-400">{t.name}</span>
                        </div>
                        <span className="font-bold">{t.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Department Breakdown */}
              <div className="glass p-8 rounded-[36px]">
                <h2 className="text-xl font-black mb-2 flex items-center gap-2">
                  <Globe className="text-amber-400" size={20} /> {t("dept_perf")}
                </h2>
                <p className="text-gray-500 text-xs mb-6">Average readiness score & learner count by department</p>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deptChart} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                      <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 11, fontWeight: "bold" }} />
                      <YAxis tick={{ fill: "#555", fontSize: 10 }} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#050505", border: "1px solid #333", borderRadius: "16px", padding: "12px" }} 
                        formatter={(value: any, name: any) => [`${value}${name === "avgScore" ? "%" : ""}`, name === "avgScore" ? t("avg_readiness") : t("learners")]} 
                      />
                      <Bar dataKey="avgScore" radius={[8, 8, 0, 0]} animationDuration={1000}>
                        {deptChart.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={deptColors[index % deptColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI News Dashboard */}
              <NewsDashboard />

              {/* Top Performers */}
              <div>
                <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                  <Star className="text-amber-400" size={20} /> {t("top_performers")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...mockLearners].sort((a, b) => b.totalXP - a.totalXP).slice(0, 3).map((learner, i) => (
                    <motion.div
                      key={learner.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setSelectedLearner(learner)}
                      className="glass p-6 rounded-[28px] cursor-pointer hover:border-amber-500/30 transition-all group relative overflow-hidden"
                    >
                      <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${i === 0 ? "bg-amber-500 text-black" : i === 1 ? "bg-gray-400 text-black" : "bg-amber-700 text-white"}`}>
                        #{i + 1}
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-black ${i === 0 ? "bg-gradient-to-br from-amber-500 to-yellow-600" : "bg-gradient-to-br from-gray-700 to-gray-900"} border border-white/10`}>
                          {learner.avatar}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">{learner.name}</h3>
                          <p className="text-[10px] text-gray-500">{learner.role}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white/5 rounded-xl p-2">
                          <p className="text-lg font-black text-amber-400">{learner.totalXP}</p>
                          <p className="text-[9px] text-gray-500 font-bold">{t("xp")}</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-2">
                          <p className="text-lg font-black text-green-400">{learner.readinessScore}%</p>
                          <p className="text-[9px] text-gray-500 font-bold">{t("ready")}</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-2">
                          <p className="text-lg font-black text-orange-400">{learner.streak}🔥</p>
                          <p className="text-[9px] text-gray-500 font-bold">{t("streak")}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ============== LEARNERS VIEW ============== */}
          {activeView === "learners" && (
            <motion.div key="learners" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              {/* Search & Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("search_placeholder")}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-3.5 focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 transition-all text-sm"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <div className="flex gap-1 bg-white/5 rounded-xl p-1">
                    {(["all", "active", "idle", "offline"] as const).map((s) => (
                      <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-lg text-[11px] font-bold capitalize transition-all ${statusFilter === s ? "bg-amber-600/30 text-amber-300 border border-amber-500/30" : "text-gray-500 hover:text-white"}`}>
                        {s === "active" ? "🟢" : s === "idle" ? "🟡" : s === "offline" ? "🔴" : "◻️"} {s}
                      </button>
                    ))}
                  </div>
                  <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-amber-500/50 cursor-pointer">
                    <option value="all">{t("all_depts")}</option>
                    {allDepartments.map((d) => (<option key={d} value={d}>{d}</option>))}
                  </select>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-amber-500/50 cursor-pointer">
                    <option value="readiness">{t("sort_by")}: {t("readiness")}</option>
                    <option value="xp">{t("sort_by")}: {t("xp")}</option>
                    <option value="streak">{t("sort_by")}: {t("streak")}</option>
                    <option value="name">{t("sort_by")}: Name</option>
                  </select>
                </div>
              </div>

              <p className="text-xs text-gray-500">{filteredLearners.length} {t("learners_found")}</p>

              {/* Learner Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLearners.map((learner, i) => (
                  <motion.div
                    key={learner.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedLearner(learner)}
                    className="glass p-5 rounded-[24px] cursor-pointer hover:border-amber-500/20 transition-all group relative"
                  >
                    {/* Status dot */}
                    <div className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${
                      learner.status === "active" ? "bg-green-400 shadow-lg shadow-green-400/40" :
                      learner.status === "idle" ? "bg-yellow-400 shadow-lg shadow-yellow-400/40" :
                      "bg-gray-600"
                    }`} />

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-xs font-black">
                        {learner.avatar}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-bold text-sm truncate">{learner.name}</h3>
                        <p className="text-[10px] text-gray-500 truncate">{learner.role} • {learner.department}</p>
                      </div>
                    </div>

                    {/* Readiness bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-gray-500 font-bold">{t("readiness")}</span>
                        <span className={`font-black ${learner.readinessScore >= 80 ? "text-green-400" : learner.readinessScore >= 60 ? "text-yellow-400" : "text-red-400"}`}>{learner.readinessScore}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${learner.readinessScore}%` }} transition={{ duration: 0.8, delay: i * 0.04 }} className={`h-full rounded-full ${learner.readinessScore >= 80 ? "bg-green-500" : learner.readinessScore >= 60 ? "bg-yellow-500" : "bg-red-500"}`} />
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { val: learner.totalXP, label: t("xp"), color: "text-amber-400" },
                        { val: learner.labScore + "%", label: t("lab"), color: "text-indigo-400" },
                        { val: learner.codeyScore + "%", label: t("code"), color: "text-violet-400" },
                        { val: learner.streak + "🔥", label: t("streak"), color: "text-orange-400" },
                      ].map((s) => (
                        <div key={s.label} className="bg-white/[0.03] rounded-lg py-1.5">
                          <p className={`text-xs font-black ${s.color}`}>{s.val}</p>
                          <p className="text-[8px] text-gray-600 font-bold">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Skills preview */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {learner.skills.slice(0, 3).map((sk) => (
                        <span key={sk} className="px-1.5 py-0.5 bg-white/5 rounded text-[8px] font-bold text-gray-500 border border-white/5">{sk}</span>
                      ))}
                      {learner.skills.length > 3 && <span className="text-[8px] text-gray-600 self-center">+{learner.skills.length - 3}</span>}
                    </div>

                    {/* Last active */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                      <span className="text-[9px] text-gray-600 flex items-center gap-1"><Clock size={9} /> {learner.lastActive}</span>
                      <ChevronRight size={12} className="text-gray-600 group-hover:text-amber-400 transition-colors" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ============== CONNECT / LIVE SESSIONS VIEW ============== */}
          {activeView === "connect" && (
            <motion.div key="connect" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              {/* Live Sessions Header */}
              <div className="glass p-8 rounded-[36px] bg-gradient-to-r from-red-600/10 via-transparent to-amber-600/10 border-red-500/10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-400">
                      <Video size={28} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black flex items-center gap-2">
                        Live Sessions Monitor
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] text-red-400 font-bold">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> {mockSessions.length} LIVE
                        </span>
                      </h2>
                      <p className="text-gray-500 text-sm mt-0.5">Real-time oversight of all SkillSphere Connect sessions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Session Cards */}
              <div className="space-y-4">
                {mockSessions.map((session, i) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-6 rounded-[28px] hover:border-red-500/20 transition-all"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center relative">
                          <Monitor size={22} className="text-red-400" />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">{session.topic}</h3>
                          <p className="text-[11px] text-gray-500">Hosted by <span className="text-amber-400 font-bold">{session.host}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Users size={14} /> {session.participants} participants
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock size={14} /> {session.duration}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> LIVE
                        </div>
                        <button className="px-4 py-2 glass rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-1.5 text-amber-400 border border-amber-500/20">
                          <Eye size={14} /> Monitor
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* All Learners - Connect Status */}
              <div>
                <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                  <Users className="text-amber-400" size={20} /> Learner Connection Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockLearners.filter((l) => l.status === "active").map((learner, i) => (
                    <motion.div
                      key={learner.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass p-4 rounded-[20px] flex items-center gap-3 hover:border-green-500/20 transition-all"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-[10px] font-black">
                          {learner.avatar}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0b0c10]" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-bold truncate">{learner.name}</p>
                        <p className="text-[9px] text-gray-500 truncate">{learner.lastActive}</p>
                      </div>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-500 hover:text-amber-400">
                        <MessageSquare size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Session Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Total Sessions Today", value: "14", icon: Video, color: "text-red-400", sub: "Across all departments" },
                  { label: "Avg Session Duration", value: "38 min", icon: Clock, color: "text-amber-400", sub: "Per meeting" },
                  { label: "Total Participants", value: "42", icon: Users, color: "text-green-400", sub: "Unique learners today" },
                ].map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass p-6 rounded-[28px] flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${stat.color} border border-white/5`}>
                      <stat.icon size={24} />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</p>
                      <p className="text-2xl font-black">{stat.value}</p>
                      <p className="text-[9px] text-gray-600">{stat.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pairing Modal */}
      <AnimatePresence>
        {isPairingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPairingModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md glass p-10 rounded-[40px] border border-white/10 shadow-2xl">
               <div className="absolute top-0 right-0 p-6">
                  <button onClick={() => setIsPairingModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-gray-500 transition-all">
                     <X size={20} />
                  </button>
               </div>
               
               <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-500/20">
                     <Users size={40} className="text-white" />
                  </div>
                  <div>
                     <h2 className="text-3xl font-black mb-2">{t("admin_pair")}</h2>
                     <p className="text-gray-400 text-sm leading-relaxed">
                        Enter the unique 6-digit connection code generated by the learner to link their intelligence profile to your dashboard.
                     </p>
                  </div>

                  <div className="w-full space-y-4">
                     <input
                        type="text"
                        maxLength={6}
                        placeholder="X7Y2Z9"
                        value={pairingCode}
                        onChange={(e) => setPairingCode(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/10 rounded-[20px] px-6 py-5 text-center text-3xl font-black text-amber-500 tracking-[0.3em] uppercase focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.08] transition-all placeholder:tracking-normal placeholder:text-gray-700"
                     />
                     
                     {pairingStatus && (
                        <p className={`text-[11px] font-black uppercase tracking-widest ${pairingStatus.includes("Error") ? "text-red-400" : "text-green-400"}`}>
                           {pairingStatus}
                        </p>
                     )}

                     <button
                        onClick={handlePairUser}
                        disabled={pairingCode.length < 6 || pairingStatus === "Connecting..."}
                        className="w-full py-5 bg-white text-black font-black rounded-[24px] transition-all hover:bg-amber-500 hover:text-white shadow-2xl shadow-black/10 disabled:opacity-30 flex items-center justify-center gap-3"
                     >
                        {pairingStatus === "Connecting..." ? <RefreshCw size={20} className="animate-spin" /> : <><Sparkles size={20} /> {t("connect_btn")}</>}
                     </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// LEARNER DETAIL MODAL
// ============================================================

function LearnerDetailModal({ learner, onClose }: { learner: Learner; onClose: () => void }) {
  const radarData = [
    { skill: "Lab", score: learner.labScore },
    { skill: "Codey", score: learner.codeyScore },
    { skill: "Courses", score: Math.round((learner.coursesCompleted / 7) * 100) },
    { skill: "Readiness", score: learner.readinessScore },
    { skill: "Engage", score: Math.min(100, learner.sessionsAttended * 8) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass rounded-[36px] p-8 max-w-2xl w-full border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-black ${
              learner.readinessScore >= 85 ? "bg-gradient-to-br from-amber-500 to-yellow-600" : "bg-gradient-to-br from-gray-700 to-gray-900"
            } border border-white/10`}>
              {learner.avatar}
            </div>
            <div>
              <h2 className="text-xl font-black">{learner.name}</h2>
              <p className="text-sm text-gray-400">{learner.role} • {learner.department}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  learner.status === "active" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                  learner.status === "idle" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                  "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                }`}>{learner.status}</span>
                <span className="text-[10px] text-gray-500">{learner.email}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X size={20} /></button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: "Readiness", value: `${learner.readinessScore}%`, color: learner.readinessScore >= 80 ? "text-green-400" : "text-yellow-400" },
            { label: "Total XP", value: learner.totalXP.toString(), color: "text-amber-400" },
            { label: "Streak", value: `${learner.streak} days`, color: "text-orange-400" },
            { label: "Sessions", value: learner.sessionsAttended.toString(), color: "text-indigo-400" },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Radar */}
        <div className="glass p-6 rounded-[28px] mb-6">
          <h3 className="text-sm font-black mb-4 flex items-center gap-2"><Target size={16} className="text-amber-400" /> Competency Map</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#222" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "#666", fontSize: 10, fontWeight: "bold" }} />
                <Radar name="Score" dataKey="score" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4 mb-6">
          {[
            { label: "Skill Lab Score", value: learner.labScore, color: "bg-indigo-500" },
            { label: "Codey Arena Score", value: learner.codeyScore, color: "bg-violet-500" },
            { label: "Course Completion", value: Math.round((learner.coursesCompleted / (learner.coursesCompleted + learner.coursesInProgress)) * 100), color: "bg-green-500" },
          ].map((bar) => (
            <div key={bar.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400 font-bold">{bar.label}</span>
                <span className="font-black">{bar.value}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${bar.value}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${bar.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {learner.skills.map((s) => (
              <span key={s} className="px-3 py-1.5 bg-white/5 rounded-xl text-xs font-bold text-gray-300 border border-white/5">{s}</span>
            ))}
          </div>
        </div>

        {/* Course Progress */}
        <div className="flex items-center justify-between text-sm glass p-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <GraduationCap size={20} className="text-green-400" />
            <div>
              <p className="font-bold text-xs">{learner.coursesCompleted} Courses Completed</p>
              <p className="text-[10px] text-gray-500">{learner.coursesInProgress} in progress</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <Clock size={12} /> Joined {learner.joinedDate}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
