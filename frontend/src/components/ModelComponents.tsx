"use client";

import React from "react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line
} from "recharts";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Calendar, Trophy, Zap, Target, Briefcase, MapPin, TrendingUp, Search } from "lucide-react";

// --- Skill Gap Radar Component ---
export const SkillGapRadar = ({ data }: { data: any[] }) => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="#ffffff20" />
        <PolarAngleAxis dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 10 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="Current"
          dataKey="current"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.4}
        />
        <Radar
          name="Target"
          dataKey="target"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.2}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: "#1e1b4b", border: "1px solid #ffffff10", borderRadius: "12px" }}
          itemStyle={{ color: "#fff", fontSize: "12px" }}
        />
      </RadarChart>
    </ResponsiveContainer>
  </div>
);

// --- Salary Benchmark Component ---
export const SalaryVisualizer = ({ data, location, currency }: { data: any[], location: string, currency: string }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <MapPin size={14} className="text-indigo-400" />
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{location}</span>
      </div>
      <span className="text-[10px] px-2 py-0.5 bg-indigo-500/10 rounded-full text-indigo-400 font-bold">2026 Forecast</span>
    </div>
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 10 }} />
          <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={(val) => `${currency}${val}L`} />
          <Tooltip 
            cursor={{ fill: '#ffffff05' }}
            contentStyle={{ backgroundColor: "#1e1b4b", border: "1px solid #ffffff10", borderRadius: "12px" }}
          />
          <Bar dataKey="low" name="Min Salary" fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="high" name="Max Salary" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// --- Resume ATS Score Component ---
export const ResumeATSDisplay = ({ score, missing, suggestions }: { score: number, missing: string[], suggestions: string[] }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-6">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
            className="text-indigo-500"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (251.2 * score) / 100}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-black text-white">{score}</span>
          <span className="text-[8px] text-gray-500 uppercase font-black">ATS Score</span>
        </div>
      </div>
      <div className="flex-grow">
        <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
          <Search size={14} className="text-amber-400" /> Key Gaps
        </h4>
        <div className="flex flex-wrap gap-2">
          {missing.map(skill => (
            <span key={skill} className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-md text-[10px] text-red-400 font-bold uppercase tracking-wider">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
    <div className="space-y-2">
      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Strategy</h4>
      <div className="grid grid-cols-1 gap-2">
        {suggestions.map((s, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.1] transition-all group">
            <CheckCircle2 size={14} className="text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] text-gray-300 font-medium">{s}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- Career Path Timeline ---
export const CareerTimeline = ({ steps }: { steps: any[] }) => (
  <div className="space-y-4 py-2">
    {steps.map((step, i) => (
      <div key={i} className="relative flex gap-4 pb-4 last:pb-0">
        {i < steps.length - 1 && (
          <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500/50 to-transparent" />
        )}
        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${i === 0 ? "bg-indigo-600 shadow-lg shadow-indigo-600/30" : "bg-white/5 border border-white/10"}`}>
          {i === 0 ? <Zap size={12} className="text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />}
        </div>
        <div className="flex-grow glass p-3 rounded-2xl border border-white/[0.06] hover:border-indigo-500/20 transition-all">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-[12px] font-bold text-white">{step.role}</h4>
            <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">{step.salary}</span>
          </div>
          <p className="text-[10px] text-gray-500 font-medium italic">{step.time}</p>
        </div>
      </div>
    ))}
  </div>
);

// --- Learning Progress Tracker ---
export const LearningPlanTracker = ({ schedule }: { schedule: any[] }) => (
  <div className="grid grid-cols-1 gap-3">
    {schedule.map((day, i) => (
      <motion.div 
        key={i}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}
        className="group relative flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.06] rounded-[20px] transition-all hover:bg-white/[0.06] hover:border-white/[0.1]"
      >
        <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex flex-col items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all">
          <span className="text-[9px] font-black text-indigo-400 group-hover:text-white uppercase leading-none mb-0.5">{day.day}</span>
          <Calendar size={12} className="text-indigo-400 group-hover:text-white" />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-0.5">
            <h4 className="text-[12px] font-bold text-gray-200">{day.task}</h4>
            <span className="text-[9px] text-indigo-400 font-black">{day.time}</span>
          </div>
          {day.goal && (
            <p className="text-[10px] text-gray-500 italic leading-relaxed">
              <span className="text-indigo-400 font-bold not-italic">{t("goal")}:</span> {day.goal}
            </p>
          )}
        </div>
        <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-600 hover:text-green-400 hover:border-green-400/50 transition-all">
          <CheckCircle2 size={16} />
        </button>
      </motion.div>
    ))}
  </div>
);

// --- Interview Cockpit ---
export const InterviewCockpit = ({ scores, count }: { scores: any, count: number }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[10px] font-black text-white uppercase tracking-widest">{t("live_session")}</span>
      </div>
      <span className="text-[10px] font-bold text-gray-500">Q#{count}</span>
    </div>

    <div className="grid grid-cols-3 gap-3">
      {[
        { label: t("confidence"), value: scores.confidence, color: "text-amber-400" },
        { label: t("clarity"), value: scores.clarity, color: "text-indigo-400" },
        { label: t("technical"), value: scores.technical, color: "text-green-400" }
      ].map(metric => (
        <div key={metric.label} className="p-3 bg-white/[0.03] rounded-2xl border border-white/[0.06] text-center">
          <p className="text-[9px] text-gray-500 uppercase font-black mb-1">{metric.label}</p>
          <p className={`text-lg font-black ${metric.color}`}>{metric.value}%</p>
        </div>
      ))}
    </div>

    <div className="p-5 glass rounded-[24px] border border-white/[0.1] bg-gradient-to-br from-indigo-600/10 to-transparent">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
          <div className="w-4 h-4 bg-black rounded-sm" />
        </div>
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider italic">{t("ai_interviewer")}</h4>
          <div className="flex gap-0.5 mt-0.5">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-0.5 w-3 bg-indigo-500/40 rounded-full" />)}
          </div>
        </div>
      </div>
      <p className="text-[11px] text-indigo-200/70 font-medium leading-relaxed italic">
        "{t("interview_prompt")}"
      </p>
    </div>
  </div>
);
