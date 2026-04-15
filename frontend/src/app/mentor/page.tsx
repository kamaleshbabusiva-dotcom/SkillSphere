"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Zap, Target, Brain, History, ArrowRight, Lightbulb, BookOpen, MessageSquare, Mic, MicOff, Volume2, Copy, Check, RefreshCw, ChevronRight, Phone, PhoneCall, X, LayoutDashboard, MessageCircle, UserCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { SkillGapRadar, SalaryVisualizer, ResumeATSDisplay, CareerTimeline, LearningPlanTracker, InterviewCockpit } from "@/components/ModelComponents";

interface Message {
  id: string;
  role: "bot" | "user";
  content: string;
  timestamp: Date;
}

// Quick action suggestions
const quickActions = [
  { text: "Mock Interview Simulation", icon: Target, color: "text-red-400", bg: "bg-red-500/10 border-red-500/15" },
  { text: "Salary Benchmark Analysis", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/15" },
  { text: "Resume Optimization Tips", icon: Sparkles, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/15" },
  { text: "Bridge My Skill Gap", icon: Brain, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/15" },
  { text: "Career Path Options", icon: ArrowRight, color: "text-green-400", bg: "bg-green-500/10 border-green-500/15" },
  { text: "Learning Plan This Week", icon: BookOpen, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/15" },
];

// Context cards
const contextCards = [
  { label: "Target Role", value: "Senior AI Architect", color: "text-indigo-400" },
  { label: "Readiness", value: "78%", color: "text-green-400" },
  { label: "Top Gap", value: "Vector DB Scaling", color: "text-red-400" },
  { label: "Streak", value: "12 days 🔥", color: "text-amber-400" },
];

export default function AIMentor() {
  const { user } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  
  // Initialize messages when language changes
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "init-1",
          role: "bot",
          content: `${t("welcome")}, **${user?.full_name || "there"}**! 👋\n\n${t("mentor_intro") || "I am your skill intelligence partner. How can we optimize your roadmap today?"}`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [language, user]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [abusiveAlert, setAbusiveAlert] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState<string | null>(null);
  const [activeModelData, setActiveModelData] = useState<any>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isTyping) return;

    // Simple client-side abusive word check (prevents sending and shows alert)
    const containsAbusive = (text: string) => {
      if (!text) return false;
      const banned = [
        "nudity",
        "nude",
        "porn",
        "sex",
        "fuck",
        "shit",
        "bitch",
        "cunt",
        "asshole",
        "slut",
      ];
      const pattern = new RegExp(`\\b(${banned.join("|")})\\b`, "i");
      return pattern.test(text);
    };

    if (containsAbusive(textToSend)) {
      setAbusiveAlert("Abusive language detected. Please keep chat respectful.");
      window.setTimeout(() => setAbusiveAlert(null), 6000);
      return;
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = textToSend;
    if (!overrideInput) setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8000/api/mentor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          language: language
        }),
      });

      const data = await response.json();
      
      // Parse [MODEL_DATA] from bot response
      const modelMatch = data.response.match(/\[MODEL_DATA\](.*?)\[\/MODEL_DATA\]/s);
      let cleanResponse = data.response;
      
      if (modelMatch) {
        try {
          const parsed = JSON.parse(modelMatch[1]);
          setActiveModelData(parsed);
          setShowDashboard(true);
          cleanResponse = data.response.replace(/\[MODEL_DATA\].*?\[\/MODEL_DATA\]/s, "").trim();
          
          // If the AI ONLY returned JSON, provide a contextual bridge text
          if (!cleanResponse) {
             cleanResponse = `I've generated the requested ${parsed.type} analysis for you. Check the intelligence dashboard on the right.`;
          }
        } catch (e) {
          console.error("Model data parse error:", e);
        }
      }

      // Check bot response for abusive words as well
      if (containsAbusive(cleanResponse)) {
        setAbusiveAlert("Abusive language detected in incoming message.");
        window.setTimeout(() => setAbusiveAlert(null), 6000);
      }
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content: cleanResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Mentor sync error:", error);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: "bot",
        content: "I've encountered a connection issue. Please check that the backend server is running on port 8000 and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const generateCode = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/mentor/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user?.id || 1 }),
      });
      const data = await response.json();
      setPairingCode(data.code);
    } catch (e) {
      console.error("Code gen error", e);
    }
  };

  const handleCallInitiation = async () => {
    if (!phoneNumber.trim()) return;
    setIsCalling(true);
    setCallStatus("Initiating call...");
    
    try {
      const response = await fetch("http://localhost:8000/api/mentor/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phoneNumber,
          user_context: {
            full_name: user?.full_name || "User",
            target_role: "Senior AI Architect", // Should ideally be from profile
            readiness_score: "78%"
          }
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCallStatus("Call initiated! Check your phone.");
        setTimeout(() => {
          setIsCallModalOpen(false);
          setIsCalling(false);
          setCallStatus(null);
        }, 3000);
      } else {
        setCallStatus(`Error: ${data.detail || "Call failed"}`);
        setIsCalling(false);
      }
    } catch (error) {
      setCallStatus("Failed to connect to backend.");
      setIsCalling(false);
    }
  };

  // Render message content with basic markdown support
  const renderContent = (content: string) => {
    return content.split("\n").map((line, li) => (
      <span key={li}>
        {line.split(/(\*\*.*?\*\*)/).map((part, pi) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pi} className="text-white font-semibold">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={pi}>{part}</span>;
        })}
        {li < content.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto h-[calc(100vh-5rem)] flex flex-col lg:flex-row gap-5">
      {/* ====== SIDEBAR ====== */}
      <div className="hidden lg:flex flex-col w-72 space-y-4 shrink-0">
        {/* AI Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-glow p-5 rounded-[24px] bg-gradient-to-br from-indigo-600/[0.06] to-transparent"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">AI Mentor Engine</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-green-400 font-medium">Online</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {contextCards.map((card) => (
              <div
                key={card.label}
                className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-all"
              >
                <p className="text-[9px] text-gray-500 uppercase tracking-[0.15em] font-bold mb-0.5">{card.label}</p>
                <p className={`text-[12px] font-bold ${card.color}`}>{card.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-5 rounded-[24px] flex-grow"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={15} className="text-amber-400" />
            <h3 className="font-bold text-[12px] text-gray-300">{t("quick_prompts")}</h3>
          </div>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <button
                key={action.text}
                onClick={() => {
                  handleSend(action.text);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all hover:bg-white/[0.04] group ${action.bg}`}
              >
                <action.icon size={14} className={action.color} />
                <span className="text-[11px] text-gray-400 font-medium group-hover:text-white transition-colors">
                  {action.text}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Session History Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-5 rounded-[24px]"
        >
          <div className="flex items-center gap-2 mb-3 text-gray-400">
            <History size={14} />
            <h3 className="font-bold text-[12px]">Past Sessions</h3>
          </div>
          <div className="space-y-2 opacity-30">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-3 bg-white/[0.04] rounded-full" style={{ width: `${90 - i * 15}%` }} />
            ))}
          </div>
          <p className="text-[9px] text-gray-600 mt-3">{t("history_coming") || "Session history coming soon"}</p>
        </motion.div>

        {/* Connect with Mentor Card */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="glass p-5 rounded-[24px] bg-indigo-600/5 border border-indigo-500/10"
        >
          <div className="flex items-center gap-2 mb-4">
             <UserCheck size={16} className="text-indigo-400" />
             <h3 className="font-bold text-[12px] text-gray-300">{t("connect_mentor")}</h3>
          </div>
          
          {pairingCode ? (
             <div className="p-4 bg-black/40 rounded-xl border border-indigo-500/20 text-center">
                <p className="text-[10px] text-gray-500 uppercase font-black mb-1">{t("pairing_code")}</p>
                <p className="text-2xl font-black text-white tracking-[0.2em]">{pairingCode}</p>
             </div>
          ) : (
             <button 
               onClick={generateCode}
               className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-bold transition-all"
             >
                {t("gen_code")}
             </button>
          )}
          <p className="text-[10px] text-gray-500 mt-3 leading-relaxed">
             Give this code to your Admin to link your accounts for specialized career tracking.
          </p>
        </motion.div>
      </div>

      {/* ====== MAIN CHAT ====== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-grow glass-glow rounded-[24px] overflow-hidden flex flex-col relative"
      >
        {abusiveAlert && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-red-600 text-white font-bold flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
            </svg>
            <span>{abusiveAlert}</span>
            <button onClick={() => setAbusiveAlert(null)} className="ml-2 text-white/80 hover:text-white">Dismiss</button>
          </div>
        )}
        {/* Chat Header */}
        <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold flex items-center gap-2">
                {t("mentor")}
                <span className="text-[9px] px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/15 rounded-full text-indigo-400 font-bold uppercase tracking-wider">
                  AI-Powered
                </span>
              </h2>
              <p className="text-[10px] text-gray-500">
                {isTyping ? t("thinking") : `${messages.length} messages in session`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: "reset-1",
                    role: "bot",
                    content: "Session reset! How can I help you today?",
                    timestamp: new Date(),
                  },
                ]);
              }}
              className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-gray-500 hover:text-white transition-all"
              title="New session"
            >
              <RefreshCw size={14} />
            </button>
            <div className="h-8 w-[1px] bg-white/5 mx-1" />
            <button
               onClick={() => setIsCallModalOpen(true)}
               className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
            >
               <Phone size={12} />
               {t("call_ai")}
            </button>
          </div>
        </div>

        {/* Unified Dashboard Overlay / Split View */}
        <AnimatePresence>
          {showDashboard && activeModelData && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="absolute inset-y-0 right-0 w-full lg:w-[450px] z-30 glass-glow border-l border-white/10 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                    <LayoutDashboard size={14} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">
                      {activeModelData.type.replace("_", " ")} Intelligence
                    </h3>
                    <p className="text-[10px] text-indigo-400 font-bold">SkillSphere Pro Model</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDashboard(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-gray-500 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                {activeModelData.type === "gap" && <SkillGapRadar data={activeModelData.radar_data} />}
                {activeModelData.type === "salary" && <SalaryVisualizer data={activeModelData.data} location={activeModelData.location} currency={activeModelData.currency} />}
                {activeModelData.type === "resume" && <ResumeATSDisplay score={activeModelData.ats_score} missing={activeModelData.missing} suggestions={activeModelData.suggestions} />}
                {activeModelData.type === "path" && <CareerTimeline steps={activeModelData.steps} />}
                {activeModelData.type === "plan" && <LearningPlanTracker schedule={activeModelData.schedule} />}
                {activeModelData.type === "interview" && <InterviewCockpit scores={activeModelData.scores} count={activeModelData.question_count} />}
              </div>

              <div className="p-6 border-t border-white/10 bg-indigo-600/5 shrink-0">
                 <button 
                   onClick={() => {
                     alert(`Executing strategy for ${activeModelData.type}... Check Skill Lab for updates.`);
                     setShowDashboard(false);
                   }}
                   className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all shadow-xl shadow-white/5 active:scale-[0.98]"
                 >
                    Execute This Strategy
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-5 space-y-4 chat-scroll">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={`flex gap-3 group ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "bot" && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/15">
                    <Bot size={16} />
                  </div>
                )}
                <div className="relative max-w-[80%]">
                  <div
                    className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                      msg.role === "bot"
                        ? "bg-white/[0.04] text-gray-200 rounded-tl-md border border-white/[0.06]"
                        : "bg-indigo-600 text-white rounded-tr-md shadow-lg shadow-indigo-600/20"
                    }`}
                  >
                    {renderContent(msg.content)}
                  </div>
                  {/* Action bar for bot messages */}
                  {msg.role === "bot" && (
                    <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => copyMessage(msg.id, msg.content)}
                        className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all"
                      >
                        {copiedId === msg.id ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                        {copiedId === msg.id ? "Copied" : "Copy"}
                      </button>
                      <span className="text-[9px] text-gray-600">
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                    {user?.full_name?.[0]?.toUpperCase() || "Y"}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-white/[0.04] px-4 py-3 rounded-2xl rounded-tl-md border border-white/[0.06] flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full typing-dot-1" />
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full typing-dot-2" />
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full typing-dot-3" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/[0.06] shrink-0">
          {/* Mobile quick actions */}
          <div className="flex gap-2 overflow-x-auto pb-3 chat-scroll lg:hidden">
            {quickActions.slice(0, 4).map((action) => (
              <button
                key={action.text}
                onClick={() => {
                  handleSend(action.text);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-lg text-[10px] font-bold text-gray-400 hover:text-white whitespace-nowrap transition-all border border-white/[0.06]"
              >
                <action.icon size={11} className={action.color} />
                {action.text}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-grow relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask your AI mentor anything..."
                disabled={isTyping}
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-indigo-500/40 focus:bg-white/[0.06] transition-all text-[13px] placeholder:text-gray-600 disabled:opacity-50"
              />
              {activeModelData && (
                <button 
                  onClick={() => setShowDashboard(!showDashboard)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    showDashboard 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40" 
                      : "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                  }`}
                  title={showDashboard ? "Hide dashboard" : "Show active model"}
                >
                  <LayoutDashboard size={14} className={!showDashboard ? "animate-pulse" : ""} />
                </button>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                input.trim() && !isTyping
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-white/[0.04] text-gray-600"
              }`}
            >
              <Send size={16} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ====== CALL MODAL ====== */}
      <AnimatePresence>
        {isCallModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isCalling && setIsCallModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass-glow p-8 rounded-[32px] border border-white/10 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-600/30">
                  <PhoneCall size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black mb-2">Voice AI Mentor</h2>
                  <p className="text-gray-400 text-sm">
                    Enter your phone number to start a real-time career coaching session with SkillSphere AI.
                  </p>
                </div>

                <div className="w-full space-y-4">
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+1234567890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 text-center text-indigo-400 font-bold tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all placeholder:tracking-normal placeholder:text-gray-600"
                    />
                  </div>
                  
                  {callStatus && (
                    <p className={`text-[11px] font-bold ${callStatus.includes("Error") ? "text-red-400" : "text-green-400"}`}>
                      {callStatus}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsCallModalOpen(false)}
                      disabled={isCalling}
                      className="flex-1 py-4 glass rounded-2xl font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCallInitiation}
                      disabled={isCalling || !phoneNumber.trim()}
                      className="flex-[2] py-4 bg-white text-black font-bold rounded-2xl transition-all hover:bg-gray-100 shadow-xl shadow-white/10 disabled:opacity-30 flex items-center justify-center gap-2"
                    >
                      {isCalling ? <RefreshCw size={18} className="animate-spin text-black" /> : <><Sparkles size={18} /> Start Call</>}
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-gray-600">
                  Standard call rates may apply. Voice AI mentor uses Vapi telephony.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
