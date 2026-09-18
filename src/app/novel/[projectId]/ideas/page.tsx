"use client";

import { useEffect, useState, use } from "react";
import { GitBranch, Plus, Sparkles, FileText, X, ArrowRight, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function IdeasPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: "", description: "", category: "PLOT" });
  const [submitting, setSubmitting] = useState(false);

  const fetchIdeas = () => {
    setLoading(true);
    fetch(`/api/projects/${projectId}/ideas`)
      .then((res) => res.json())
      .then((data) => {
        setIdeas(data.ideas || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchIdeas();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.title || !newIdea.description) return;
    setSubmitting(true);
    
    try {
      await fetch(`/api/projects/${projectId}/ideas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIdea),
      });
      setIsModalOpen(false);
      setNewIdea({ title: "", description: "", category: "PLOT" });
      fetchIdeas();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Sistem Ide Kreatif</h1>
          <p className="text-xs text-slate-400 mt-1">Lacak penggagas, pengembangan co-author, dan implementasi bab.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-900/30 transition-all"
        >
          <Plus className="w-4 h-4" /> Usulkan Ide Baru
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-slate-400 animate-pulse">Memuat ide...</div>
      ) : ideas.length === 0 ? (
        <div className="canva-card p-12 rounded-3xl border border-slate-800 text-center bg-[#0f172a]">
          <GitBranch className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-bold">Belum ada ide yang diusulkan.</p>
          <p className="text-xs text-slate-500 mt-1">Ajukan ide pertama untuk karya kolaboratif ini.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {ideas.map((idea) => (
            <div key={idea.id} className="canva-card p-6 rounded-3xl border border-slate-800 space-y-5 bg-[#0f172a]">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
                      {idea.category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold tracking-wider">
                      {idea.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white">{idea.title}</h3>
                  {idea.description && (
                    <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">{idea.description}</p>
                  )}
                </div>
                
                <button className="shrink-0 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Tambahkan Pengembangan
                </button>
              </div>

              {/* Provenance Timeline */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Linimasa Provenance Ide
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-stretch relative">
                  {/* Origin */}
                  <div className="flex-1 p-4 rounded-xl bg-slate-950 border border-slate-800 z-10 relative">
                    <span className="text-indigo-400 font-bold block text-[10px] mb-2 uppercase tracking-wider">Tahap 1: Penggagas Asli</span>
                    <div className="flex items-center gap-3">
                      <img 
                        src={idea.author?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(idea.author?.name || 'User')}`} 
                        alt="Author" 
                        className="w-8 h-8 rounded-full border border-slate-700 object-cover" 
                      />
                      <div>
                        <div className="text-white font-bold text-xs">{idea.author?.name}</div>
                        <div className="text-slate-500 text-[10px]">
                          {new Date(idea.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center justify-center text-slate-700 shrink-0">
                    <ArrowRight className="w-5 h-5" />
                  </div>

                  {/* Development */}
                  <div className="flex-1 p-4 rounded-xl bg-slate-950 border border-slate-800 z-10 relative">
                    <span className="text-purple-400 font-bold block text-[10px] mb-2 uppercase tracking-wider">Tahap 2: Pengembangan Co-Author</span>
                    <div className="text-slate-300 text-xs font-medium">
                      {idea.developments?.length || 0} Kontribusi Diskusi
                    </div>
                    {idea.developments?.length > 0 && (
                      <div className="flex -space-x-2 mt-2">
                        {[1,2,3].slice(0, idea.developments.length).map((_, i) => (
                           <div key={i} className="w-6 h-6 rounded-full bg-purple-900 border border-slate-800" />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="hidden md:flex items-center justify-center text-slate-700 shrink-0">
                    <ArrowRight className="w-5 h-5" />
                  </div>

                  {/* Implementation */}
                  <div className="flex-1 p-4 rounded-xl bg-slate-950 border border-slate-800 z-10 relative opacity-50 border-dashed">
                    <span className="text-emerald-400 font-bold block text-[10px] mb-2 uppercase tracking-wider">Tahap 3: Implementasi Bab</span>
                    <div className="text-slate-500 text-xs italic">
                      Belum diadopsi ke dalam manuskrip cerita
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Idea Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" /> Usulkan Ide Baru
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Judul Ide</label>
                  <input 
                    type="text" 
                    value={newIdea.title}
                    onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                    placeholder="Contoh: Pengkhianatan di Kuil Cahaya"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Kategori</label>
                  <select 
                    value={newIdea.category}
                    onChange={(e) => setNewIdea({...newIdea, category: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none"
                  >
                    <option value="PLOT">Plot Utama</option>
                    <option value="SUBPLOT">Subplot Karakter</option>
                    <option value="WORLDBUILDING">Worldbuilding / Lore</option>
                    <option value="ITEM">Item & Artifact</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Deskripsi Detail</label>
                  <textarea 
                    value={newIdea.description}
                    onChange={(e) => setNewIdea({...newIdea, description: e.target.value})}
                    placeholder="Jelaskan secara detail ide yang Anda usulkan..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 h-32 resize-none"
                    required
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting || !newIdea.title || !newIdea.description}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? 'Menyimpan...' : <><Save className="w-4 h-4" /> Simpan Ide</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}