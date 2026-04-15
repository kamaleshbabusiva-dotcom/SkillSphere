"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, DollarSign, Clock, CheckCircle2, Star, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const initialJobs = [
  { title: "Senior AI Product Architect", cat: "Engineering", loc: "San Francisco", sal: "$240k", match: 92, posted: "2d ago", tags: ["LLM", "Orchestration"], recommended: true },
  { title: "Principal ML Engineer", cat: "Engineering", loc: "New York", sal: "$220k", match: 78, posted: "5d ago", tags: ["PyTorch", "CUDA"], recommended: false },
  { title: "Head of AI Policy", cat: "Legal", loc: "London", sal: "Competitive", match: 85, posted: "1d ago", tags: ["Ethics", "Policy"], recommended: true },
  { title: "Staff Backend Engineer", cat: "Engineering", loc: "Remote", sal: "$200k", match: 88, posted: "3h ago", tags: ["Go", "Distributed"], recommended: false },
  { title: "Data Scientist (NLP)", cat: "Data", loc: "Boston", sal: "$180k", match: 72, posted: "1w ago", tags: ["BERT", "Transformers"], recommended: false },
  { title: "VP of Talent Intelligence", cat: "HR", loc: "San Francisco", sal: "$300k", match: 95, posted: "12h ago", tags: ["Strategy", "Analytics"], recommended: true },
  { title: "DevOps Architect (AI Systems)", cat: "Engineering", loc: "Seattle", sal: "$210k", match: 81, posted: "4d ago", tags: ["K8s", "Mojo"], recommended: false },
  { title: "Security Researcher (LLM)", cat: "Security", loc: "Remote", sal: "$195k", match: 89, posted: "2d ago", tags: ["Red Teaming", "Jailbreak"], recommended: false },
  { title: "Product Manager (AI Agents)", cat: "Product", loc: "New York", sal: "$190k", match: 91, posted: "1d ago", tags: ["User Experience", "AI UX"], recommended: true },
  { title: "Cloud Solutions Architect", cat: "Engineering", loc: "Austin", sal: "$185k", match: 65, posted: "1w ago", tags: ["Azure", "Terraform"], recommended: false },
  { title: "Full Stack Lead (Next.js)", cat: "Engineering", loc: "Remote", sal: "$175k", match: 84, posted: "6h ago", tags: ["React", "Turbopack"], recommended: false },
  { title: "AI Research Scientist", cat: "Research", loc: "London", sal: "£160k", match: 70, posted: "3d ago", tags: ["RLHF", "Scaling Laws"], recommended: false },
  { title: "Internal Comms Strategy", cat: "Corp", loc: "Chicago", sal: "$140k", match: 60, posted: "2w ago", tags: ["Internal", "Culture"], recommended: false },
  { title: "Sales Engineering Lead", cat: "Sales", loc: "Remote", sal: "$250k OTE", match: 77, posted: "1d ago", tags: ["Demos", "Enterprise"], recommended: false },
  { title: "QA Engineer (Automation)", cat: "Engineering", loc: "Boston", sal: "$150k", match: 50, posted: "2w ago", tags: ["Cypress", "Appium"], recommended: false },
  { title: "Growth Marketing (AI Tools)", cat: "Marketing", loc: "Remote", sal: "$160k", match: 82, posted: "3d ago", tags: ["Growth", "Ads"], recommended: true },
  { title: "Principal Data Engineer", cat: "Data", loc: "Remote", sal: "$215k", match: 86, posted: "1d ago", tags: ["Spark", "Iceberg"], recommended: false },
  { title: "UX Director (Human-AI)", cat: "Design", loc: "New York", sal: "$230k", match: 93, posted: "2d ago", tags: ["Figma", "Research"], recommended: true },
  { title: "Customer Success Architect", cat: "Success", loc: "London", sal: "£145k", match: 74, posted: "5d ago", tags: ["Integration", "KPIs"], recommended: false },
  { title: "VP of Engineering", cat: "Engineering", loc: "San Francisco", sal: "$350k+", match: 91, posted: "1d ago", tags: ["Leadership", "Scale"], recommended: true },
];

export default function Opportunities() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const { user } = useAuth();

  // Modal & application state
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setApplicantName(user.full_name || "");
      setApplicantEmail(user.email || "");
    }
  }, [user]);

  const generateApplication = (job: any) => {
    const skillList = user?.extracted_skills ? [
      ...(user.extracted_skills.Technical || []),
      ...(user.extracted_skills.Soft || []),
      ...(user.extracted_skills.Domain || []),
    ] : [];

    const topSkills = skillList.slice(0, 6).join(", ") || job.tags.join(", ");

    const intro = `Dear Hiring Team,\n\nI am excited to apply for the ${job.title} role in the ${job.cat} team. With experience in ${topSkills}, I am confident I can contribute to your ${job.tags.join("/")} initiatives.`;

    const body = `In my recent work I have delivered outcomes like scaling AI systems, designing robust ML infrastructure, and collaborating across product and research teams. My profile aligns with the job's focus on ${job.tags.join(", ")} and innovation-focused delivery.`;

    const closing = `\n\nThank you for considering my application. I would welcome the opportunity to discuss how my background can help achieve the goals of the ${job.title} role.`;

    return `${intro}\n\n${body}${closing}`;
  };

  const openApplyModal = (job: any) => {
    setSelectedJob(job);
    setCoverLetter(generateApplication(job));
    setShowModal(true);
    setSubmitStatus(null);
  };

  const practiceSubmit = () => {
    if (!selectedJob) return;
    const apps = JSON.parse(localStorage.getItem("practice_apps") || "[]");
    const record = {
      job: selectedJob.title,
      company: "Innovation Division",
      applicantName,
      applicantEmail,
      coverLetter,
      timestamp: new Date().toISOString(),
      outcome: "Practice submission saved",
    };
    apps.unshift(record);
    localStorage.setItem("practice_apps", JSON.stringify(apps));
    setSubmitStatus("Practice application saved — you can review it under Practice Applications in your profile.");
    setTimeout(() => setShowModal(false), 1200);
  };

  const categories = ["All", "Engineering", "Data", "Product", "Design", "HR", "Legal", "Research"];

  const filteredJobs = initialJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                         job.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === "All" || job.cat === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold">Internal Talent Marketplace</h1>
          <p className="text-gray-400 mt-2">Personalized opportunities based on your skill evolution.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
           <div className="relative group w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search roles or tags..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-3 focus:outline-none focus:border-indigo-500/50 transition-all text-sm" 
              />
           </div>
           
           <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 overflow-x-auto scrollbar-hide">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    filter === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 pb-20">
        {filteredJobs.length > 0 ? filteredJobs.map((job, i) => (
          <motion.div 
            key={job.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.05, 0.5) }}
            className={`glass p-8 rounded-[32px] group cursor-pointer hover:border-indigo-500/50 transition-all relative overflow-hidden ${
              job.recommended ? 'border-l-4 border-indigo-500 bg-indigo-500/[0.02]' : ''
            }`}
          >
            {job.recommended && (
              <div className="absolute top-0 left-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-br-lg uppercase tracking-widest">
                AI Precision Best Fit
              </div>
            )}
            
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform shadow-inner">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{job.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{job.cat}</span>
                       <span className="text-gray-600">•</span>
                       <span className="text-sm text-gray-400">Innovation Division</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-1.5"><MapPin size={16} /> {job.loc}</div>
                  <div className="flex items-center gap-1.5"><DollarSign size={16} /> {job.sal}</div>
                  <div className="flex items-center gap-1.5"><Clock size={16} /> {job.posted}</div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {job.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold border border-white/5 text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col lg:items-end justify-between min-w-[220px]">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <Star className={job.match > 90 ? "text-yellow-400" : "text-gray-400"} size={20} fill={job.match > 90 ? "currentColor" : "none"} />
                    <span className={`text-4xl font-black ${job.match > 90 ? "text-white" : "text-gray-400"}`}>{job.match}%</span>
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Skill Alignment Match</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => openApplyModal(job)} className="mt-6 lg:mt-0 px-6 py-3 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shrink-0 group/btn shadow-xl shadow-white/10">
                    Apply Internally
                    <CheckCircle2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button onClick={() => setSelectedJob(job)} className="mt-6 lg:mt-0 px-4 py-3 bg-white/5 text-gray-300 font-medium rounded-2xl hover:bg-white/6 transition-all">Preview</button>
                </div>
              </div>
            </div>
          </motion.div>
        )) : (
            <div className="text-center py-20 glass rounded-[32px]">
                <p className="text-gray-500">No roles found matching your criteria. Reset filters to see more.</p>
            </div>
        )}
      </div>
      {/* Apply Modal (client-only) */}
      {showModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-50 w-full max-w-3xl bg-[#0b1220] border border-white/[0.06] rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-xl font-bold">Practice Application — {selectedJob.title}</h3>
                <p className="text-sm text-gray-400">Prototype application you can edit and submit as practice.</p>
              </div>
              <div className="text-right">
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">Close</button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <div className="flex gap-2">
                <input value={applicantName} onChange={(e) => setApplicantName(e.target.value)} placeholder="Full name" className="flex-1 bg-white/5 border border-white/6 rounded-lg px-3 py-2" />
                <input value={applicantEmail} onChange={(e) => setApplicantEmail(e.target.value)} placeholder="Email" className="w-72 bg-white/5 border border-white/6 rounded-lg px-3 py-2" />
              </div>

              <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows={10} className="w-full bg-white/5 border border-white/6 rounded-lg p-3 text-sm" />

              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-gray-400">Company: Innovation Division • Location: {selectedJob.loc} • Salary: {selectedJob.sal}</div>
                <div className="flex gap-2">
                  <button onClick={() => { setCoverLetter(generateApplication(selectedJob)); setSubmitStatus(null); }} className="px-4 py-2 bg-white/5 text-gray-200 rounded-lg">Regenerate</button>
                  <button onClick={practiceSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Submit (Practice)</button>
                </div>
              </div>

              {submitStatus && <div className="text-sm text-green-400 font-medium">{submitStatus}</div>}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
