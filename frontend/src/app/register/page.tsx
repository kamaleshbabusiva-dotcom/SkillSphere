"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Shield, User, Mail, Lock, Briefcase, ArrowRight, Sparkles } from "lucide-react";
import IdentityScanner from "@/components/IdentityScanner";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const [step, setStep] = useState(1); // Start at step 1
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const { login } = useAuth();

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result);
    if (result.bio) {
       // Maybe derive name from bio or just let them fill it
    }
    // Auto-fill designation if target role exists
    if (result.career_guidance?.target_role) {
       setDesignation(result.career_guidance.target_role);
    }
    setStep(1); // Move to next step
  };

  const handleFinalize = () => {
    // Construct the user object with real intelligence data
    login({
      id: Math.floor(Math.random() * 10000),
      email,
      full_name: fullName || email.split('@')[0],
      role: "user",
      extracted_skills: analysisResult?.extracted_skills || { Technical: [], Soft: [], Domain: [] },
      swot_data: analysisResult?.swot ? {
        ...analysisResult.swot,
        career_guidance: analysisResult.career_guidance
      } : undefined,
      bio: analysisResult?.bio,
      target_role: designation,
      current_readiness_score: analysisResult?.swot?.enlightenment_score || 70,
      future_readiness_score: (analysisResult?.swot?.enlightenment_score || 70) + 12
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass rounded-[32px] p-10 relative z-10 border-white/10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Request Identity</h1>
          <p className="text-gray-400 mt-2">Join the workforce transformation OS</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {analysisResult && (
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl flex items-center gap-3 mb-4">
                     <Sparkles className="text-indigo-400" size={18} />
                     <p className="text-[10px] text-gray-300 font-medium">Identity scan successful. Intelligence profile initialized.</p>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 focus:outline-none focus:border-indigo-500/50 transition-all text-sm" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Work Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@company.com" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 focus:outline-none focus:border-indigo-500/50 transition-all text-sm" 
                    />
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 group shadow-xl shadow-white/5 transition-all">
                  Continue to Role <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Current Designation</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                      type="text" 
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="Frontend Architect" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 focus:outline-none focus:border-indigo-500/50 transition-all text-sm" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Master Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 focus:outline-none focus:border-indigo-500/50 transition-all text-sm" 
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-4 glass rounded-2xl font-bold hover:bg-white/5 transition-all">Back</button>
                  <button 
                    onClick={handleFinalize}
                    className="flex-[2] py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all"
                  >
                    Finalize Identity
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <p className="text-center text-sm text-gray-400 mt-10">
          Already verified? <Link href="/login" className="text-indigo-400 font-bold hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
