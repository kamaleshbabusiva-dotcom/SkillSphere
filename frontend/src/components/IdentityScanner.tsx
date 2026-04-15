"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, AlertCircle, Shield, Cpu } from "lucide-react";

interface IdentityScannerProps {
  onAnalysisComplete: (data: any) => void;
}

export default function IdentityScanner({ onAnalysisComplete }: IdentityScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/skills/extract", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      const result = await response.json();

      if (result.is_valid_resume === false) {
        setUploadError(result.error_message || "Invalid upload. Please ensure you are uploading a professional resume.");
        return;
      }

      // Pass the whole result back to parental register logic
      onAnalysisComplete(result);
      
    } catch (error) {
      console.error("Extraction error:", error);
      setUploadError("Error connecting to intelligence engine. Ensure backend is active.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-2"
        >
          <Shield size={12} /> L3 Clearance Scanner
        </motion.div>
        <h2 className="text-3xl font-black tracking-tight">Initialize Registry Scan</h2>
        <p className="text-gray-400 text-sm max-w-sm mx-auto">
          Upload your professional profile to auto-configure your workforce identity.
        </p>
      </div>

      <div className="relative">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
        />
        <motion.div
          whileHover={!isUploading ? { scale: 1.01 } : {}}
          whileTap={!isUploading ? { scale: 0.99 } : {}}
          onClick={!isUploading ? handleUploadClick : undefined}
          className={`glass min-h-[300px] rounded-[40px] border-dashed border-2 flex flex-col items-center justify-center p-8 text-center group transition-all relative overflow-hidden ${
            uploadError ? 'border-red-500/50' : 'border-indigo-500/20 hover:border-indigo-500/50'
          } ${isUploading ? 'cursor-wait' : 'cursor-pointer'}`}
        >
          {isUploading ? (
            <div className="space-y-6 flex flex-col items-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Cpu className="text-indigo-400 animate-pulse" size={24} />
                </div>
              </div>
              <p className="text-lg font-bold text-white animate-pulse">Scanning Identity Matix...</p>
            </div>
          ) : (
            <>
              <AnimatePresence>
                {uploadError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-8 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full flex items-center gap-2 text-red-400 text-xs font-bold z-50 shadow-xl backdrop-blur-md"
                  >
                    <AlertCircle size={14} /> {uploadError}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
                <Upload className="text-indigo-400" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Registry Drop-zone</h3>
              <p className="text-gray-500 text-xs px-8">
                PDF, JPG, or PNG (L3 Intelligence Tier)
              </p>
            </>
          )}
          
          {isUploading && (
             <motion.div 
               initial={{ top: "-10%" }}
               animate={{ top: "110%" }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               className="absolute left-0 w-full h-[20%] bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent z-10 blur-md"
             />
          )}
        </motion.div>
      </div>
    </div>
  );
}
