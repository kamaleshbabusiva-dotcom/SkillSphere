"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, TrendingUp, Lightbulb, Shield, Zap } from "lucide-react";

interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  enlightenment_score: number;
  career_guidance?: {
    target_role: string;
    next_steps: string;
    key_skill_to_master: string;
  };
}

export default function SkillReport({ data }: { data: SWOTData }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="text-indigo-400" /> Professional SWOT Analysis
        </h2>
        <div className="flex items-center gap-4 bg-white/5 rounded-2xl px-6 py-3 border border-indigo-500/20">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Resilience Index</span>
          <span className="text-2xl font-black text-indigo-400">{data.enlightenment_score}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass p-6 rounded-[24px] border-l-4 border-green-500">
          <h3 className="text-lg font-bold flex items-center gap-2 text-green-400 mb-4">
            <CheckCircle2 size={20} /> Competitive Strengths
          </h3>
          <ul className="space-y-3">
            {data.strengths.map((s, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-green-500/50 mt-1.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Weaknesses */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass p-6 rounded-[24px] border-l-4 border-red-500">
          <h3 className="text-lg font-bold flex items-center gap-2 text-red-400 mb-4">
            <AlertCircle size={20} /> Vulnerability Points
          </h3>
          <ul className="space-y-3">
            {data.weaknesses.map((s, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-red-500/50 mt-1.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Opportunities */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-[24px] border-l-4 border-indigo-500">
          <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-400 mb-4">
            <TrendingUp size={20} /> Market Opportunities
          </h3>
          <ul className="space-y-3">
            {data.opportunities.map((s, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-indigo-500/50 mt-1.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Threats */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-[24px] border-l-4 border-yellow-500">
          <h3 className="text-lg font-bold flex items-center gap-2 text-yellow-400 mb-4">
            <Zap size={20} /> Strategic Threats
          </h3>
          <ul className="space-y-3">
            {data.threats.map((s, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-yellow-500/50 mt-1.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Boost Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass p-8 rounded-[32px] bg-indigo-500/5 border-indigo-500/20"
      >
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Lightbulb size={40} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Enlightenment Pathway: {data.career_guidance?.target_role || "Next Level Growth"}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {data.career_guidance?.next_steps || "To boost your role readiness, focus on evolutionary skill acquisition. Mastering new patterns will enlighten your profile for Executive recruiters."}
              {data.career_guidance?.key_skill_to_master && (
                <> Focus on mastering <span className="text-indigo-400 font-bold italic">{data.career_guidance.key_skill_to_master}</span>.</>
              )}
            </p>
            <div className="flex flex-wrap gap-4">
               <button className="px-6 py-2 bg-indigo-600 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20">View Action Items</button>
               <button className="px-6 py-2 glass rounded-xl text-xs font-bold">Optimize Resume</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
