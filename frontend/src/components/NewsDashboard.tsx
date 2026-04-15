"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  ExternalLink, 
  Clock, 
  Newspaper, 
  ArrowRight, 
  RefreshCw,
  Sparkles,
  Search
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export default function NewsDashboard() {
  const { t } = useLanguage();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [localNews, setLocalNews] = useState<NewsArticle[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", url: "", image: "", source: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState<string>("all");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [trustedOnly, setTrustedOnly] = useState<boolean>(false);

  const fetchNews = async () => {
    try {
      setRefreshing(true);
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL as string) || "http://localhost:8000";
      const qParts: string[] = [];
      if (category && category !== "all") qParts.push(`category=${encodeURIComponent(category)}`);
      if (trustedOnly) qParts.push(`trusted=true`);
      const q = qParts.length ? `?${qParts.join("&")}` : "";
      const response = await fetch(`${base}/api/news${q}`);
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Failed to fetch news: ${response.status} ${response.statusText} ${text}`);
      }
      const data = await response.json();
      setNews(data);
      setError(false);
      setErrorMessage(null);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(true);
      setErrorMessage((err as any)?.message ? String((err as any).message) : String(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // load any saved local news
    try {
      const saved = localStorage.getItem("localNews");
      if (saved) setLocalNews(JSON.parse(saved));
    } catch (e) {
      console.warn("Failed to load local news", e);
    }

    // polling for live updates every 30 seconds
    const iv = setInterval(() => {
      fetchNews();
    }, 30000);

    return () => clearInterval(iv);
  }, []);

  // refetch when category or trusted toggle changes
  useEffect(() => {
    fetchNews();
  }, [category, trustedOnly]);

  const handleAddNews = () => {
    const newItem: NewsArticle = {
      title: form.title || "(No title)",
      description: form.description || "",
      url: form.url || "#",
      image: form.image || undefined,
      publishedAt: new Date().toISOString(),
      source: { name: form.source || "Local" },
    };

    const updated = [newItem, ...localNews];
    setLocalNews(updated);
    try {
      localStorage.setItem("localNews", JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to save local news", e);
    }

    // reset and close
    setForm({ title: "", description: "", url: "", image: "", source: "" });
    setShowAdd(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 60) return `${diffMins}${t("minutes_ago")}`;
    if (diffHours < 24) return `${diffHours}${t("hours_ago")}`;
    return date.toLocaleDateString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Globe size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black flex items-center gap-2">
              {t("ai_news_hub")}
              <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] text-green-400 font-bold uppercase tracking-widest">
                {t("live")}
              </span>
            </h2>
            <p className="text-gray-500 text-xs font-medium">{t("latest_intel")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-400 font-bold">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-gray-800 text-sm rounded p-2">
            <option value="all">All</option>
            <option value="ai">AI</option>
            <option value="technology">Technology</option>
          </select>
          {lastUpdated && (
            <div className="text-xs text-gray-400 ml-3">Last: {new Date(lastUpdated).toLocaleTimeString()}</div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-400 font-bold">Trusted only</label>
          <input type="checkbox" checked={trustedOnly} onChange={(e) => setTrustedOnly(e.target.checked)} className="w-4 h-4" />
        </div>
        <button 
          onClick={fetchNews}
          disabled={refreshing}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-gray-400 hover:text-white group"
        >
          <RefreshCw size={16} className={`${refreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-[32px] h-[360px] animate-pulse overflow-hidden">
              <div className="h-48 bg-white/5" />
              <div className="p-6 space-y-4">
                <div className="h-4 bg-white/10 rounded-full w-3/4" />
                <div className="h-3 bg-white/5 rounded-full w-full" />
                <div className="h-3 bg-white/5 rounded-full w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="glass p-12 rounded-[32px] text-center space-y-4 border-red-500/10">
          <Newspaper className="mx-auto text-gray-600" size={48} />
          <p className="text-gray-400 font-medium">Unable to synchronize latest intelligence.</p>
          {errorMessage && (
            <pre className="text-xs text-red-300 bg-black/20 p-3 rounded mt-2 overflow-x-auto">{errorMessage}</pre>
          )}
          <button onClick={fetchNews} className="text-indigo-400 font-bold text-sm hover:underline flex items-center gap-2 mx-auto">
            <RefreshCw size={14} /> Retry Connection
          </button>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {[...localNews, ...news].map((article, i) => (
              <motion.div
                key={article.url + article.publishedAt}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="glass rounded-[32px] overflow-hidden flex flex-col group border border-white/5 hover:border-indigo-500/20 transition-all duration-500 shadow-xl hover:shadow-indigo-500/5"
              >
                <div className="relative h-44 overflow-hidden">
                  {article.image ? (
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 to-black flex items-center justify-center">
                      <Sparkles size={32} className="text-indigo-500/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                      {article.source.name}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">
                      <Clock size={12} className="text-indigo-400" />
                      {formatTime(article.publishedAt)}
                    </div>
                    <h3 className="text-lg font-black leading-tight text-white group-hover:text-indigo-300 transition-colors line-clamp-2 mb-3">
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-sm italic font-medium line-clamp-2 leading-relaxed">
                      {article.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-black uppercase tracking-tighter text-indigo-400 flex items-center gap-2 group/link"
                    >
                      {t("read_full_report")}
                      <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </a>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-600 transition-colors group-hover:text-white">
                      <ExternalLink size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      
      <div className="flex justify-center pt-4">
        <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
           <Search size={10} /> AI-Powered Intelligence Filtering Active
        </p>
      </div>
      {/* Add news button + modal */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => setShowAdd(true)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold"
        >
          Add News
        </button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-lg bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Add News Item</h3>
            <div className="space-y-3">
              <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full p-2 bg-gray-800 rounded" />
              <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-2 bg-gray-800 rounded" />
              <input placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="w-full p-2 bg-gray-800 rounded" />
              <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full p-2 bg-gray-800 rounded" />
              <input placeholder="Source name" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="w-full p-2 bg-gray-800 rounded" />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded bg-white/5">Cancel</button>
              <button onClick={handleAddNews} className="px-4 py-2 rounded bg-indigo-600 text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
