"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import IdentityScanner from "@/components/IdentityScanner";
import SkillReport from "@/components/SkillReport";

export default function ScanDashboard() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result);
  };

  const resetScan = () => {
    setAnalysisResult(null);
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] p-8 max-w-7xl mx-auto space-y-12 mb-20 px-6">
      <header className="mb-10 text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-5xl font-black tracking-tighter">
          Ad-Hoc <span className="text-indigo-500">Identity Scan</span>
        </h1>
        <p className="text-gray-400 italic">
          Run an immediate diagnostic on any professional registry file. Intelligence data generated here is local to this session and does not overwrite your core context.
        </p>
      </header>
      
      <AnimatePresence mode="wait">
        {!analysisResult ? (
          <motion.div 
            key="scanner-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto"
          >
            <IdentityScanner onAnalysisComplete={handleAnalysisComplete} />
          </motion.div>
        ) : (
          <motion.div 
            key="results-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="flex justify-between items-center bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-3xl">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                    <Sparkles size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold">Analysis Complete</h3>
                    <p className="text-sm text-gray-400">The intelligence engine has formulated a comprehensive SWOT profile.</p>
                 </div>
               </div>
               <button 
                  onClick={resetScan}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-sm font-bold flex items-center gap-2"
               >
                 Scan Another Profile <ArrowRight size={16} />
               </button>
            </div>

            {analysisResult.swot && (
               <SkillReport data={{
                 ...analysisResult.swot,
                 career_guidance: analysisResult.career_guidance
               }} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
