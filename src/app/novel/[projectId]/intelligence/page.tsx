"use client";

import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Send,
  HelpCircle,
  Network,
  Users,
  Compass,
  Zap,
  RefreshCw,
  Search,
} from "lucide-react";

export default function StoryIntelligencePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [activeTab, setActiveTab] = useState<"BRAIN" | "IMPACT" | "CONSISTENCY">("BRAIN");
  
  // Story Brain State
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Halo! Saya adalah Story Assistant AI Anda. Tanyakan apa saja mengenai rahasia karakter, riwayat bab terdahulu, atau alur konflik cerita yang belum terselesaikan.",
    },
  ]);
  const [question, setQuestion] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  // Stats State
  const [projectStats, setProjectStats] = useState({
    words: 0,
    chapters: 0,
    characters: 0,
    events: 0,
  });

  // Impact Simulator State
  const [impactDesc, setImpactDesc] = useState("");
  const [loadingImpact, setLoadingImpact] = useState(false);
  const [impactResult, setImpactResult] = useState<any>(null);

  // Consistency State
  const [consistencyData, setConsistencyData] = useState<any>(null);
  const [loadingConsistency, setLoadingConsistency] = useState(false);
  const [consistencyFilter, setConsistencyFilter] = useState<"ALL" | "CHARACTER" | "TIMELINE" | "PLOT">("ALL");

  useEffect(() => {
    // Fetch stats
    fetch(`/api/projects/${projectId}`)
      .then(res => res.json())
      .then(data => {
        if (data.project) {
          setProjectStats({
            words: data.project.chapters?.reduce((acc: number, c: any) => acc + (c.content?.split(/\s+/).length || 0), 0) || 0,
            chapters: data.project.chapters?.length || 0,
            characters: data.project.characters?.length || 0,
            events: data.project.storyEvents?.length || 0,
          });
        }
      });
  }, [projectId]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQ = question;
    setMessages((prev) => [...prev, { sender: "user", text: userQ }]);
    setQuestion("");
    setLoadingAi(true);

    try {
      const res = await fetch("/api/intelligence/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, question: userQ }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "ai", text: data.answer || "No response generated." }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "ai", text: "Error retrieving story memory context." }]);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleRunImpactAnalysis = async () => {
    if (!impactDesc.trim()) return;
    setLoadingImpact(true);
    setImpactResult(null);

    try {
      const res = await fetch("/api/intelligence/impact-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, changeDescription: impactDesc }),
      });
      const data = await res.json();
      setImpactResult(data.impact);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingImpact(false);
    }
  };

  const handleRunConsistencyCheck = async () => {
    setLoadingConsistency(true);
    try {
      const res = await fetch(`/api/intelligence/consistency?projectId=${projectId}`);
      const data = await res.json();
      setConsistencyData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingConsistency(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-slate-100">
      {/* Header & Stats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <Brain className="w-4 h-4 text-purple-400" /> Story Intelligence Engine
            </div>
            <h1 className="text-3xl font-black text-white mt-1">Sistem Pemahaman Novel AI</h1>
            <p className="text-xs text-slate-400 mt-1">
              AI menganalisis keseluruhan cerita sebagai "Living Memory".
            </p>
          </div>
          
          <div className="flex gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-center px-4 border-r border-slate-800">
              <div className="text-xl font-black text-purple-400">{projectStats.words.toLocaleString()}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Kata</div>
            </div>
            <div className="text-center px-4 border-r border-slate-800">
              <div className="text-xl font-black text-indigo-400">{projectStats.chapters}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Bab</div>
            </div>
            <div className="text-center px-4 border-r border-slate-800">
              <div className="text-xl font-black text-emerald-400">{projectStats.characters}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Karakter</div>
            </div>
            <div className="text-center px-4">
              <div className="text-xl font-black text-amber-400">{projectStats.events}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Event</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-px">
          {[
            { id: "BRAIN", label: "Story Brain RAG", icon: Brain },
            { id: "IMPACT", label: "Impact Simulator", icon: Zap },
            { id: "CONSISTENCY", label: "Consistency Checker", icon: ShieldCheck },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? "border-purple-500 text-purple-400" 
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: STORY BRAIN */}
        {activeTab === "BRAIN" && (
          <motion.div
            key="brain"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Story Assistant RAG Chatbot */}
            <div className="lg:col-span-2 canva-card p-6 rounded-3xl flex flex-col justify-between h-[580px] bg-[#0f172a] border border-slate-800 shadow-xl">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <h2 className="font-bold text-white text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" /> Tanya AI Tentang Novel Ini
                  </h2>
                  <span className="text-xs font-bold text-purple-300 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800/40">
                    Living Memory Aktif
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    "Apakah sebelumnya karakter John pernah bertemu Elena?",
                    "Karakter mana saja yang sudah mati sejauh ini?",
                    "Siapa saja yang tahu rahasia identitas Elena?",
                    "Apa konflik yang belum diselesaikan dari bab 1?",
                  ].map((sq, i) => (
                    <button
                      key={i}
                      onClick={() => setQuestion(sq)}
                      className="text-[11px] font-semibold bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 px-3 py-1.5 rounded-lg border border-purple-800/40 transition-colors"
                    >
                      {sq}
                    </button>
                  ))}
                </div>

                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-2">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                        m.sender === "user"
                          ? "bg-purple-600 text-white ml-auto font-medium shadow-md shadow-purple-900/30"
                          : "bg-slate-900/90 text-slate-200 border border-slate-800 font-medium"
                      }`}
                    >
                      {m.text}
                    </div>
                  ))}
                  {loadingAi && (
                    <div className="p-3 rounded-xl bg-purple-950/60 text-purple-300 text-xs font-semibold flex items-center gap-2 w-fit border border-purple-800/40">
                      <Sparkles className="w-4 h-4 text-purple-400 animate-spin" /> Menganalisis graph cerita...
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleAsk} className="pt-4 border-t border-slate-800 flex gap-3">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Tanyakan mengenai lore, karakter, atau plot novel..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={loadingAi}
                  className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-900/40 disabled:opacity-50"
                >
                  Tanya AI <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Quick Info Sidebar */}
            <div className="space-y-6">
              <div className="canva-card p-6 rounded-3xl space-y-4 bg-[#0f172a] border border-slate-800">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-400" /> Story Understanding
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  AI secara otomatis memahami seluruh novel Anda. Setiap karakter yang dibuat, setiap bab yang ditulis, dan setiap plot yang disusun dimasukkan ke dalam memori grafis (RAG) untuk pemahaman cerita yang instan.
                </p>
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">AI Indexing Status</div>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-300">Character Graph</span>
                    <span className="text-emerald-400">Synced</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-300">Chapter Embeddings</span>
                    <span className="text-emerald-400">Synced</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-300">Plot Dependencies</span>
                    <span className="text-emerald-400">Synced</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: IMPACT SIMULATOR */}
        {activeTab === "IMPACT" && (
          <motion.div
            key="impact"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-5 space-y-6">
              <div className="canva-card p-6 rounded-3xl space-y-4 bg-[#0f172a] border border-slate-800">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" /> Simulasi Perubahan Ide
                </h3>
                <p className="text-xs text-slate-400">
                  Uji perubahan besar pada cerita sebelum Anda menuliskannya. AI akan mendeteksi efek berantainya pada karakter dan bab lain.
                </p>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-2">Deskripsikan Rencana Perubahan Anda:</label>
                    <textarea 
                      value={impactDesc}
                      onChange={e => setImpactDesc(e.target.value)}
                      placeholder="Contoh: Villain sebenarnya adalah mentor dari tokoh utama yang memalsukan kematiannya."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 h-32 resize-none"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setImpactDesc("Karakter protagonis ternyata adalah pengkhianat sejak awal.")} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded">Coba: Twist Protagonis</button>
                    <button onClick={() => setImpactDesc("Karakter Sarah mati di bab 12 saat penyerangan.")} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded">Coba: Kematian Karakter</button>
                  </div>

                  <button
                    onClick={handleRunImpactAnalysis}
                    disabled={loadingImpact || !impactDesc.trim()}
                    className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {loadingImpact ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    Analisis Dampak Cerita
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              {impactResult ? (
                <div className="canva-card p-8 rounded-3xl space-y-6 bg-[#0f172a] border border-slate-800 h-full">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${
                      impactResult.impactLevel === 'HIGH' ? 'bg-rose-500/20 text-rose-400' :
                      impactResult.impactLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">
                        Dampak {impactResult.impactLevel === 'HIGH' ? 'Signifikan' : impactResult.impactLevel === 'MEDIUM' ? 'Sedang' : 'Ringan'}
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">{impactResult.summary}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Elemen Terdampak</div>
                      
                      {impactResult.impactedCharacterRelationships?.length > 0 && (
                        <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-xl">
                          <div className="text-rose-400 font-bold text-xs mb-1">⚠ {impactResult.impactedCharacterRelationships.length} Hubungan Karakter</div>
                          <ul className="list-disc pl-4 text-[11px] text-slate-300 space-y-1">
                            {impactResult.impactedCharacterRelationships.map((item: string, i: number) => <li key={i}>{item}</li>)}
                          </ul>
                        </div>
                      )}

                      {impactResult.impactedChapters?.length > 0 && (
                        <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-xl">
                          <div className="text-amber-400 font-bold text-xs mb-1">⚠ {impactResult.impactedChapters.length} Bab Sebelumnya</div>
                          <ul className="list-disc pl-4 text-[11px] text-slate-300 space-y-1">
                            {impactResult.impactedChapters.map((item: string, i: number) => <li key={i}>{item}</li>)}
                          </ul>
                        </div>
                      )}
                      
                      {impactResult.impactedPlotPoints?.length > 0 && (
                        <div className="p-3 bg-indigo-950/30 border border-indigo-900/50 rounded-xl">
                          <div className="text-indigo-400 font-bold text-xs mb-1">⚠ {impactResult.impactedPlotPoints.length} Plot Point</div>
                          <ul className="list-disc pl-4 text-[11px] text-slate-300 space-y-1">
                            {impactResult.impactedPlotPoints.map((item: string, i: number) => <li key={i}>{item}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Story Arc Terdampak</div>
                        {impactResult.impactedArcs?.map((arc: string, i: number) => (
                          <div key={i} className="px-3 py-2 bg-slate-800/50 rounded-lg text-xs font-medium text-slate-200 border border-slate-700/50">
                            {arc}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 mt-4">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rekomendasi Revisi AI</div>
                        <ul className="space-y-2">
                          {impactResult.recommendations?.map((rec: string, i: number) => (
                            <li key={i} className="flex gap-2 text-xs text-slate-300">
                              <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="canva-card p-6 rounded-3xl border border-slate-800 border-dashed h-[500px] flex flex-col items-center justify-center text-center text-slate-500">
                  <Network className="w-16 h-16 mb-4 text-slate-700" />
                  <p className="font-bold text-slate-400">Belum Ada Analisis</p>
                  <p className="text-xs max-w-sm mt-2">Jalankan simulasi di sebelah kiri untuk melihat efek kupu-kupu (butterfly effect) dari perubahan ide cerita Anda.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 3: CONSISTENCY CHECKER */}
        {activeTab === "CONSISTENCY" && (
          <motion.div
            key="consistency"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {["ALL", "CHARACTER", "TIMELINE", "PLOT"].map((f) => (
                  <button 
                    key={f} 
                    onClick={() => setConsistencyFilter(f as any)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      consistencyFilter === f 
                        ? "bg-purple-600 text-white" 
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {f === "ALL" ? "Semua Isu" : f}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleRunConsistencyCheck}
                disabled={loadingConsistency}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {loadingConsistency ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                Pindai Seluruh Novel
              </button>
            </div>

            {consistencyData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {consistencyData.inconsistencies
                  ?.filter((i: any) => consistencyFilter === "ALL" || i.type === consistencyFilter)
                  .map((issue: any, idx: number) => (
                  <div key={idx} className={`p-6 rounded-3xl border bg-[#0f172a] space-y-4 ${
                    issue.severity === 'HIGH' ? 'border-rose-900/50' : 
                    issue.severity === 'MEDIUM' ? 'border-amber-900/50' : 'border-indigo-900/50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        issue.severity === 'HIGH' ? 'bg-rose-950/50 text-rose-400' : 
                        issue.severity === 'MEDIUM' ? 'bg-amber-950/50 text-amber-400' : 'bg-indigo-950/50 text-indigo-400'
                      }`}>
                        {issue.severity} RISK
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold bg-slate-900 px-2 py-0.5 rounded uppercase">
                        {issue.type}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base">{issue.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{issue.description}</p>
                    
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2 mt-4">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold border-b border-slate-800 pb-1">
                        <span>LOKASI A</span>
                        <span className="text-slate-300">{issue.locationA}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                        <span>LOKASI B</span>
                        <span className="text-slate-300">{issue.locationB}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold">
                        Buka & Selesaikan
                      </button>
                      <button className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold border border-slate-700">
                        Abaikan (Sengaja)
                      </button>
                    </div>
                  </div>
                ))}
                
                {consistencyData.inconsistencies?.filter((i: any) => consistencyFilter === "ALL" || i.type === consistencyFilter).length === 0 && (
                  <div className="col-span-full p-12 text-center text-slate-500">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-emerald-500/50" />
                    <p className="font-bold text-white">Tidak Ada Inkosistensi Ditemukan</p>
                    <p className="text-xs mt-1">Novel Anda bersih dari kontradiksi untuk kategori ini.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="canva-card p-12 rounded-3xl border border-slate-800 text-center text-slate-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-slate-700" />
                <h3 className="font-bold text-slate-300 text-lg">Pindai Novel Anda</h3>
                <p className="text-xs max-w-md mx-auto mt-2">
                  AI dapat mendeteksi kontradiksi karakter, plot hole, dan kesalahan timeline secara otomatis di sepanjang manuskrip novel Anda. Klik tombol "Pindai Seluruh Novel" di atas untuk memulai.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
