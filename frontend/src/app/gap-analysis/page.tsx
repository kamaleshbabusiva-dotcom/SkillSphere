"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, ArrowRight, TrendingUp, Sparkles, BookOpen } from "lucide-react";

export default function GapAnalysis() {
  const futureSkills = [
    { skill: "Large Language Model Orchestration", urgency: "High", reason: "Shift from building models to orchestrating specialized agents." },
    { skill: "AI Ethics & Compliance", urgency: "Medium", reason: "Regulatory frameworks like EU AI Act require specialized oversight." },
  ];

  const roadmap = [
    { week: 1, focus: "Foundations", milestone: "Advanced RAG Patterns", status: "completed" },
    { week: 2, focus: "Integration", milestone: "Vector DB Optimization", status: "current" },
    { week: 3, focus: "Deployment", milestone: "Scalable Inference Endpoints", status: "upcoming" },
    { week: 4, focus: "Ethics", milestone: "AI Guardrail Implementation", status: "upcoming" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Transformation Roadmap</h1>
          <p className="text-gray-400 mt-2">Bridging the gap between your profile and target: <b>Senior AI Architect</b></p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Match Probability</p>
          <p className="text-4xl font-bold text-indigo-400">82%</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Future Prediction */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-400" /> Future Readiness
          </h2>
          <div className="space-y-4">
            {futureSkills.map((item, i) => (
              <motion.div 
                key={item.skill}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-5 rounded-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.urgency === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {item.urgency} URGENCY
                  </span>
                </div>
                <h3 className="font-bold text-lg pr-16">{item.skill}</h3>
                <p className="text-sm text-gray-400 mt-2 line-clamp-2">{item.reason}</p>
                <button className="mt-4 text-xs font-bold text-indigo-400 flex items-center gap-1 hover:gap-2 transition-all">
                  EXPLORE SKILL <ArrowRight size={12} />
                </button>
              </motion.div>
            ))}
          </div>
          
          <div className="glass p-6 rounded-2xl border-l-4 border-yellow-400">
             <div className="flex gap-4">
                <Sparkles className="text-yellow-400 shrink-0" />
                <p className="text-sm text-gray-300">
                  <b>AI Insight:</b> Based on current industry hiring trends in SF and London, 
                  mastering <b>Agentic Workflows</b> would increase your fit probability to 94%.
                </p>
             </div>
          </div>
        </div>

        {/* Center/Right: Learning Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen size={20} className="text-green-400" /> Prescriptive Path
          </h2>
          <div className="glass rounded-3xl p-8 relative">
            <div className="absolute left-[3.25rem] top-24 bottom-24 w-0.5 bg-white/5" />
            
            <div className="space-y-12">
              {roadmap.map((step, i) => (
                <motion.div 
                  key={step.week}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-8 items-start relative z-10"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    step.status === 'completed' ? 'bg-green-500 text-white' : 
                    step.status === 'current' ? 'bg-indigo-600 text-white ring-4 ring-indigo-600/20' : 
                    'bg-white/5 text-gray-500'
                  }`}>
                    {step.status === 'completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </div>
                  <div className="pt-1 flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Week {step.week}</span>
                        <h3 className="text-xl font-bold mt-1">{step.focus}</h3>
                      </div>
                      {step.status === 'current' && (
                        <span className="bg-indigo-600/10 text-indigo-400 text-[10px] font-bold px-3 py-1 rounded-full border border-indigo-600/20">
                          ACTIVE MODULE
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 mt-1">{step.milestone}</p>
                    
                    {step.status === 'current' && (
                      <div className="mt-4 flex gap-3">
                         <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm border border-white/10 transition-all">
                           Resource Lab
                         </button>
                         <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm transition-all shadow-lg shadow-indigo-600/20">
                           Attempt Certification
                         </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
