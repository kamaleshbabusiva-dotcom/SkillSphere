"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, CameraOff, Mic, MicOff, PhoneOff,
  Users, MessageSquare, Shield, Share, Settings,
  Copy, Check, Video, Monitor, X, Send, Bot,
  Sparkles, Hand, Smile, MoreVertical, Maximize2,
  Grid, ChevronRight, Zap, Brain, ArrowRight,
  Clock, Volume2, VolumeX, ScreenShare, ScreenShareOff,
  UserPlus, Lock, Wifi, PanelRightClose, PanelRightOpen
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// ============================================================
// TYPES
// ============================================================

interface ChatMessage {
  id: string;
  sender: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  type: "user" | "bot" | "system";
  isTyping?: boolean;
}

interface Reaction {
  id: string;
  emoji: string;
  x: number;
}

// ============================================================
// AI BOT RESPONSES
// ============================================================

const botResponses: Record<string, string[]> = {
  help: [
    "I'm your SkillSphere AI Assistant! I can help with:\n• **Meeting controls** — mute, camera, screen share\n• **Skill questions** — ask about any tech topic\n• **Career advice** — role transitions, interviews\n• **Code help** — explain algorithms, debug logic\n\nJust type your question! 🚀",
  ],
  python: [
    "Python is a versatile language! Here are some quick tips:\n\n🐍 **List comprehensions** are 2x faster than loops\n🐍 Use **f-strings** for readable formatting\n🐍 **Type hints** improve code quality\n🐍 **asyncio** for concurrent I/O operations\n\nWant me to explain any specific concept?",
  ],
  interview: [
    "Here are my top interview tips:\n\n1. **STAR method** — Situation, Task, Action, Result\n2. **System design** — Start with requirements, then scale\n3. **Coding rounds** — Think aloud, test edge cases\n4. **Behavioral** — Show growth mindset\n\nWant me to do a mock question? 💡",
  ],
  react: [
    "React best practices:\n\n⚛️ **Custom hooks** for shared logic\n⚛️ **useMemo/useCallback** to prevent re-renders\n⚛️ **Server Components** in Next.js for performance\n⚛️ **Suspense boundaries** for loading states\n\nWhat React topic interests you most?",
  ],
  default: [
    "Great question! Let me think about that... 🤔\n\nBased on current industry trends, I'd recommend focusing on practical projects and building a strong portfolio. Want me to suggest a learning path?",
    "That's an interesting topic! Here's what I know:\n\nThe key is to break complex problems into smaller, manageable pieces. Would you like me to elaborate on any specific area?",
    "I can help with that! 💡\n\nLet me share some resources and insights. What specific aspect would you like to dive deeper into?",
    "Excellent question! Here's a high-level overview:\n\n• Start with fundamentals\n• Build projects to reinforce learning\n• Contribute to open source\n• Network with professionals\n\nShall I create a personalized plan?",
  ],
};

function getBotResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("help") || lower.includes("what can you do")) return botResponses.help[0];
  if (lower.includes("python")) return botResponses.python[0];
  if (lower.includes("interview") || lower.includes("job")) return botResponses.interview[0];
  if (lower.includes("react") || lower.includes("frontend")) return botResponses.react[0];
  const defaults = botResponses.default;
  return defaults[Math.floor(Math.random() * defaults.length)];
}

// ============================================================
// CHAT PANEL COMPONENT
// ============================================================

function ChatPanel({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  chatMode,
  setChatMode,
}: {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  chatMode: "meeting" | "ai";
  setChatMode: (mode: "meeting" | "ai") => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue.trim());
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (chatMode === "ai") return m.type === "bot" || (m.type === "user" && m.sender === "You (AI Chat)");
    return m.type !== "bot" && m.sender !== "You (AI Chat)";
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 380, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="h-full bg-[#0a0a0a] border-l border-white/[0.06] flex flex-col overflow-hidden relative z-10"
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex bg-white/[0.04] rounded-xl p-1 gap-0.5">
                <button
                  onClick={() => setChatMode("meeting")}
                  className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all relative ${
                    chatMode === "meeting" ? "text-white" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {chatMode === "meeting" && (
                    <motion.div
                      layoutId="chat-tab"
                      className="absolute inset-0 bg-indigo-600/30 rounded-lg border border-indigo-500/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <MessageSquare size={12} /> Chat
                  </span>
                </button>
                <button
                  onClick={() => setChatMode("ai")}
                  className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all relative ${
                    chatMode === "ai" ? "text-white" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {chatMode === "ai" && (
                    <motion.div
                      layoutId="chat-tab"
                      className="absolute inset-0 bg-violet-600/30 rounded-lg border border-violet-500/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Bot size={12} /> AI Assistant
                  </span>
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-gray-500 hover:text-white transition-all"
            >
              <X size={14} />
            </button>
          </div>

          {/* Mode indicator */}
          {chatMode === "ai" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="px-4 py-3 bg-violet-600/[0.06] border-b border-violet-500/10 shrink-0"
            >
              <div className="flex items-center gap-2 text-[11px] text-violet-400">
                <div className="w-5 h-5 rounded-md bg-violet-500/20 flex items-center justify-center">
                  <Brain size={11} />
                </div>
                <span className="font-medium">SkillSphere AI is ready to assist</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse ml-auto" />
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3 chat-scroll">
            {filteredMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 space-y-4">
                {chatMode === "ai" ? (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 animate-float">
                      <Bot size={32} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-300">AI Assistant</p>
                      <p className="text-[11px] text-gray-500 mt-1 max-w-[240px] leading-relaxed">
                        Ask me anything about skills, career, coding, or type <span className="text-violet-400 font-bold">help</span> to see what I can do.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                      {["Python tips", "Interview prep", "React help", "Career advice"].map((q) => (
                        <button
                          key={q}
                          onClick={() => onSendMessage(q)}
                          className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.08] hover:border-violet-500/20 transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500">
                      <MessageSquare size={32} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-300">Meeting Chat</p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Messages sent here are visible to all participants.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {filteredMessages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
              >
                {msg.type === "system" ? (
                  <div className="text-center py-2">
                    <span className="text-[10px] text-gray-600 bg-white/[0.03] px-3 py-1 rounded-full">
                      {msg.content}
                    </span>
                  </div>
                ) : (
                  <div className={`flex gap-2.5 ${msg.type === "user" ? "" : ""}`}>
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        msg.type === "bot"
                          ? "bg-violet-500/20 text-violet-400"
                          : "bg-indigo-500/20 text-indigo-400"
                      }`}
                    >
                      {msg.type === "bot" ? <Bot size={14} /> : msg.senderAvatar}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span
                          className={`text-[11px] font-bold ${
                            msg.type === "bot" ? "text-violet-400" : "text-gray-300"
                          }`}
                        >
                          {msg.type === "bot" ? "SkillSphere AI" : msg.sender.replace(" (AI Chat)", "")}
                        </span>
                        <span className="text-[9px] text-gray-600">
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div
                        className={`text-[12px] leading-relaxed rounded-2xl rounded-tl-md px-3.5 py-2.5 whitespace-pre-wrap ${
                          msg.type === "bot"
                            ? "bg-violet-500/[0.08] text-gray-200 border border-violet-500/10"
                            : "bg-white/[0.04] text-gray-300 border border-white/[0.06]"
                        }`}
                      >
                        {msg.isTyping ? (
                          <div className="flex items-center gap-1.5 py-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 typing-dot-1" />
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 typing-dot-2" />
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 typing-dot-3" />
                          </div>
                        ) : (
                          msg.content.split('\n').map((line, li) => (
                            <span key={li}>
                              {line.split(/(\*\*.*?\*\*)/).map((part, pi) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return <strong key={pi} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
                                }
                                return <span key={pi}>{part}</span>;
                              })}
                              {li < msg.content.split('\n').length - 1 && <br />}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/[0.06] shrink-0">
            <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl border border-white/[0.06] focus-within:border-indigo-500/30 transition-all px-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={chatMode === "ai" ? "Ask AI anything..." : "Type a message..."}
                className="flex-grow bg-transparent py-3 text-[13px] text-white placeholder:text-gray-600 focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                  inputValue.trim()
                    ? chatMode === "ai"
                      ? "bg-violet-600 hover:bg-violet-700 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-white/[0.04] text-gray-600"
                }`}
              >
                <Send size={14} />
              </button>
            </div>
            {chatMode === "ai" && (
              <p className="text-[9px] text-gray-600 mt-1.5 text-center">
                AI responses are generated locally • Not medical or legal advice
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// FLOATING REACTIONS
// ============================================================

function FloatingReactions({ reactions }: { reactions: Reaction[] }) {
  return (
    <div className="fixed bottom-32 left-0 right-0 pointer-events-none z-50">
      <AnimatePresence>
        {reactions.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 1, y: 0, x: `${r.x}%`, scale: 0.5 }}
            animate={{ opacity: 0, y: -200, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute text-3xl"
            style={{ left: `${r.x}%` }}
          >
            {r.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// ELAPSED TIME HOOK
// ============================================================

function useElapsedTime(isActive: boolean) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!isActive) { setElapsed(0); return; }
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive]);
  const mins = Math.floor(elapsed / 60).toString().padStart(2, "0");
  const secs = (elapsed % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

// ============================================================
// MAIN CONNECT PAGE
// ============================================================

export default function SkillSphereConnect() {
  const { user } = useAuth();
  const [isInCall, setIsInCall] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState<"meeting" | "ai">("meeting");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [layout, setLayout] = useState<"spotlight" | "grid">("spotlight");
  const elapsedTime = useElapsedTime(isInCall);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isInCall && !isCameraOff) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          streamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Media access error:", err));
    }

    return () => {
      if (isCameraOff && streamRef.current) {
        streamRef.current.getVideoTracks().forEach((t) => t.stop());
      }
    };
  }, [isInCall, isCameraOff]);

  const startMeeting = () => {
    const code = "SKL-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(code);
    setIsInCall(true);
    setMessages([
      {
        id: "sys-1",
        sender: "System",
        senderAvatar: "S",
        content: "Meeting started. Share the room code to invite others.",
        timestamp: new Date(),
        type: "system",
      },
    ]);
  };

  const joinMeeting = () => {
    if (roomCode.length > 3) {
      setIsInCall(true);
      setMessages([
        {
          id: "sys-2",
          sender: "System",
          senderAvatar: "S",
          content: `You joined the meeting (${roomCode}).`,
          timestamp: new Date(),
          type: "system",
        },
      ]);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode || roomCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const endCall = () => {
    setIsInCall(false);
    setIsChatOpen(false);
    setMessages([]);
    setReactions([]);
    setIsHandRaised(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const addReaction = (emoji: string) => {
    const id = `r-${Date.now()}-${Math.random()}`;
    const x = 20 + Math.random() * 60;
    setReactions((prev) => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2500);
  };

  const sendMessage = useCallback((text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: chatMode === "ai" ? "You (AI Chat)" : (user?.full_name || "You"),
      senderAvatar: user?.full_name?.[0]?.toUpperCase() || "Y",
      content: text,
      timestamp: new Date(),
      type: "user",
    };
    setMessages((prev) => [...prev, userMsg]);

    if (chatMode === "ai") {
      // Show typing indicator
      const typingId = `typing-${Date.now()}`;
      const typingMsg: ChatMessage = {
        id: typingId,
        sender: "AI",
        senderAvatar: "🤖",
        content: "",
        timestamp: new Date(),
        type: "bot",
        isTyping: true,
      };
      setTimeout(() => setMessages((prev) => [...prev, typingMsg]), 400);

      // Replace with actual response
      setTimeout(() => {
        const response = getBotResponse(text);
        setMessages((prev) =>
          prev
            .filter((m) => m.id !== typingId)
            .concat({
              id: `bot-${Date.now()}`,
              sender: "AI",
              senderAvatar: "🤖",
              content: response,
              timestamp: new Date(),
              type: "bot",
            })
        );
      }, 1200 + Math.random() * 800);
    }
  }, [chatMode, user?.full_name]);

  const userName = user?.full_name || "You";

  // ======================== PRE-CALL LOBBY ========================
  if (!isInCall) {
    return (
      <div className="min-h-[calc(100vh-4rem)] text-white overflow-hidden relative">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/[0.04] rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/[0.04] rounded-full blur-[150px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="h-full flex flex-col items-center justify-center p-8 text-center space-y-12 relative z-10"
        >
          {/* Header */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-2"
            >
              <div className="px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 text-[10px] uppercase font-bold text-green-400 tracking-widest flex items-center gap-1.5">
                <Wifi size={10} /> Secure Connection
              </div>
              <div className="px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[10px] uppercase font-bold text-indigo-400 tracking-widest flex items-center gap-1.5">
                <Lock size={10} /> E2E Encrypted
              </div>
            </motion.div>
            <h1 className="text-6xl font-black tracking-tighter">
              SkillSphere <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Connect</span>
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto text-lg leading-relaxed">
              Peer-to-peer professional collaboration. Secure video sessions with built-in <span className="text-indigo-400 font-semibold">AI assistant</span> and real-time chat.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            {/* Host */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="glass-glow p-10 rounded-[40px] border-indigo-500/20 bg-gradient-to-br from-indigo-600/[0.06] to-transparent space-y-8 group transition-all hover:border-indigo-500/30 hover-lift"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/30 group-hover:scale-110 transition-transform duration-500">
                <Video size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black">Host Session</h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Create a secure enclave for tutoring, mentoring, or team collaboration.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={startMeeting}
                  className="w-full py-4 bg-white text-black font-bold rounded-2xl transition-all hover:bg-gray-100 shadow-xl shadow-white/10 hover:shadow-white/20 flex items-center justify-center gap-2 group/btn"
                >
                  <Zap size={18} className="group-hover/btn:rotate-12 transition-transform" />
                  Start Instant Session
                </button>
                <div className="flex items-center justify-center gap-6 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1.5"><Users size={12} /> Up to 4 peers</span>
                  <span className="flex items-center gap-1.5"><Bot size={12} /> AI Assistant</span>
                </div>
              </div>
            </motion.div>

            {/* Join */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="glass p-10 rounded-[40px] space-y-8 group transition-all hover:border-white/20 hover-lift"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 group-hover:bg-white/15">
                <Users size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-black">Join Enclave</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter Code (e.g. SKL-A92X)"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 text-center text-indigo-400 font-bold tracking-[0.2em] focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all placeholder:tracking-normal placeholder:text-gray-600"
                  />
                  {roomCode && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center"
                    >
                      <Check size={14} className="text-green-400" />
                    </motion.div>
                  )}
                </div>
              </div>
              <button
                onClick={joinMeeting}
                disabled={roomCode.length < 4}
                className="w-full py-4 glass rounded-2xl font-bold hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Join with Code <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm font-medium"
          >
            {[
              { icon: Shield, label: "End-to-End Encrypted" },
              { icon: Monitor, label: "Ultra-Low Latency" },
              { icon: Bot, label: "Built-in AI Chat" },
              { icon: MessageSquare, label: "Real-time Messaging" },
            ].map((feat) => (
              <span key={feat.label} className="flex items-center gap-2 hover:text-gray-300 transition-colors">
                <feat.icon size={16} className="text-indigo-500/60" /> {feat.label}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ======================== IN-CALL VIEW ========================
  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col">
      <FloatingReactions reactions={reactions} />

      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-14 px-5 flex justify-between items-center border-b border-white/[0.06] bg-[#0a0a0a] shrink-0 z-20"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-full border border-red-500/20">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-red-400">Live</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Room:</span>
            <span className="text-white font-bold tracking-wider">{generatedCode || roomCode}</span>
            <button
              onClick={copyCode}
              className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-gray-500 hover:text-white transition-all"
            >
              {isCopied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            </button>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] rounded-full text-[11px] text-gray-400 font-medium">
            <Clock size={12} /> {elapsedTime}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
              showParticipants ? "bg-white/[0.08] text-white" : "bg-white/[0.04] text-gray-400 hover:text-white"
            }`}
          >
            <Users size={14} /> 1/4
          </button>
          <button
            onClick={() => setLayout(layout === "spotlight" ? "grid" : "spotlight")}
            className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            {layout === "spotlight" ? <Grid size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            onClick={() => { setIsChatOpen(!isChatOpen); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
              isChatOpen ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/20" : "bg-white/[0.04] text-gray-400 hover:text-white"
            }`}
          >
            <MessageSquare size={14} /> Chat
          </button>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-grow flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-grow flex flex-col p-4 relative">
          <div className={`flex-grow flex gap-3 ${layout === "grid" ? "flex-wrap" : ""}`}>
            {/* Main / Local Video */}
            <motion.div
              layout
              className={`relative bg-[#111] rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl ${
                layout === "spotlight" ? "flex-grow" : "w-[calc(50%-6px)] h-[calc(50%-6px)]"
              }`}
            >
              {!isCameraOff ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-gradient-to-br from-[#111] to-[#0a0a0a]">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600/30 to-violet-600/30 flex items-center justify-center text-3xl font-black text-white"
                  >
                    {userName[0]?.toUpperCase()}
                  </motion.div>
                  <p className="text-gray-500 font-bold text-sm">{userName}</p>
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest">Camera Off</p>
                </div>
              )}

              {/* Name badge */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-[11px] font-bold border border-white/10 flex items-center gap-2">
                  {isMuted && <MicOff size={11} className="text-red-400" />}
                  {isHandRaised && <span>✋</span>}
                  {userName} (You)
                </div>
              </div>

              {/* Quality indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4].map((bar) => (
                    <div key={bar} className={`w-1 rounded-full bg-green-400 ${bar === 1 ? "h-1.5" : bar === 2 ? "h-2.5" : bar === 3 ? "h-3.5" : "h-4"}`} />
                  ))}
                </div>
                <span className="text-[9px] text-green-400 font-bold">HD</span>
              </div>
            </motion.div>

            {/* Remote participants (simulated) */}
            {layout === "spotlight" ? (
              <div className="hidden lg:flex w-56 flex-col gap-3 shrink-0">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex-1 bg-[#111] rounded-xl border border-white/[0.06] flex flex-col items-center justify-center relative group overflow-hidden hover:border-white/10 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center text-gray-700">
                      <Users size={18} />
                    </div>
                    <p className="text-[9px] text-gray-600 mt-2 font-bold uppercase tracking-wider">
                      Slot {i}
                    </p>
                    <div className="absolute inset-0 bg-indigo-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="absolute bottom-2 right-2 w-6 h-6 rounded-md bg-indigo-600/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-indigo-400"
                    >
                      <UserPlus size={11} />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            ) : (
              // Grid layout — show 3 empty slots
              [1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  layout
                  className="w-[calc(50%-6px)] h-[calc(50%-6px)] bg-[#111] rounded-2xl border border-white/[0.06] flex flex-col items-center justify-center"
                >
                  <div className="w-14 h-14 rounded-full bg-white/[0.04] flex items-center justify-center text-gray-700">
                    <Users size={24} />
                  </div>
                  <p className="text-[10px] text-gray-600 mt-2 font-bold uppercase tracking-wider">Awaiting Peer</p>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Chat Panel */}
        <ChatPanel
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          messages={messages}
          onSendMessage={sendMessage}
          chatMode={chatMode}
          setChatMode={setChatMode}
        />
      </div>

      {/* Bottom Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="h-20 px-6 flex justify-center items-center gap-3 border-t border-white/[0.06] bg-[#0a0a0a] shrink-0 relative"
      >
        {/* Left — reactions */}
        <div className="absolute left-6 flex items-center gap-2">
          {["👍", "👏", "❤️", "🎉", "😂", "🔥"].map((emoji) => (
            <motion.button
              key={emoji}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => addReaction(emoji)}
              className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-lg transition-all border border-transparent hover:border-white/10"
            >
              {emoji}
            </motion.button>
          ))}
        </div>

        {/* Center — main controls */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isMuted
                ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                : "bg-white/[0.06] text-gray-300 hover:bg-white/[0.1] border border-white/[0.06]"
            }`}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCameraOff(!isCameraOff)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isCameraOff
                ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                : "bg-white/[0.06] text-gray-300 hover:bg-white/[0.1] border border-white/[0.06]"
            }`}
          >
            {isCameraOff ? <CameraOff size={20} /> : <Camera size={20} />}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isScreenSharing
                ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                : "bg-white/[0.06] text-gray-300 hover:bg-white/[0.1] border border-white/[0.06]"
            }`}
          >
            {isScreenSharing ? <ScreenShareOff size={20} /> : <ScreenShare size={20} />}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsHandRaised(!isHandRaised)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isHandRaised
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30"
                : "bg-white/[0.06] text-gray-300 hover:bg-white/[0.1] border border-white/[0.06]"
            }`}
          >
            <Hand size={20} />
          </motion.button>

          <div className="w-[1px] h-8 bg-white/[0.06] mx-1" />

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={endCall}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full flex items-center gap-2 font-bold transition-all shadow-lg shadow-red-600/20 text-sm"
          >
            <PhoneOff size={18} /> Leave
          </motion.button>
        </div>

        {/* Right — toggle chat */}
        <div className="absolute right-6 flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { setIsChatOpen(true); setChatMode("ai"); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 text-violet-400 text-[11px] font-bold transition-all"
          >
            <Bot size={14} /> AI Assistant
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { setIsChatOpen(!isChatOpen); setChatMode("meeting"); }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isChatOpen
                ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/20"
                : "bg-white/[0.06] text-gray-400 hover:text-white border border-white/[0.06]"
            }`}
          >
            {isChatOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
