"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Users,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  Compass,
  Search,
  Layout,
} from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  genre: string;
  language: string;
  targetWordCount: number;
  updatedAt: string;
  members: { user: { id: string; name: string; avatarUrl: string } }[];
  chapters: { id: string; title: string; wordCount: number; status: string }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domainType, setDomainType] = useState("NOVEL");
  const [genre, setGenre] = useState("Fantasy");
  const [language, setLanguage] = useState("Indonesian");
  const [targetWordCount, setTargetWordCount] = useState("80000");
  const [writingStyle, setWritingStyle] = useState("Orang Ketiga Serba Tahu");
  const [creating, setCreating] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          genre,
          language,
          targetWordCount: Number(targetWordCount),
          writingStyle,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setShowCreateModal(false);
        router.push(`/novel/${data.project.id}/overview`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/domains" className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" /> Beranda Breemous
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-xs font-medium text-slate-500">Daftar Proyek & Workspace</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mt-1">Kelola Proyek Karya</h1>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-purple-200 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Buat Proyek Baru
          </button>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="canva-card p-6 rounded-3xl animate-pulse h-64 bg-white" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="canva-card p-12 rounded-3xl border border-slate-200 text-center max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
              <Layout className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Mulai karya pertama Anda</h3>
            <p className="text-slate-500 text-sm mb-6">
              Buat proyek workspace pertama Anda di bidang pilihan (Novel, Riset, Skenario, Kode, atau Bisnis).
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold text-sm inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Buat Proyek Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((p) => {
              const currentWords = p.chapters.reduce((acc, c) => acc + c.wordCount, 0);
              const progressPct = Math.min(100, Math.round((currentWords / p.targetWordCount) * 100));

              return (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -4 }}
                  className="canva-card rounded-3xl p-6 border border-slate-200 hover:border-purple-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                        Bidang: Novel • {p.genre}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {new Date(p.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2">{p.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-6">{p.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-slate-500">Progress Karya</span>
                        <span className="text-purple-700">
                          {currentWords.toLocaleString()} / {p.targetWordCount.toLocaleString()} kata ({progressPct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-indigo-600"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mb-4">
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-purple-600" /> {p.chapters.length} Bab / Seksi
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-indigo-600" /> {p.members.length} Kolaborator
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/novel/${p.id}/overview`}
                      className="w-full py-3 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      Buka Workspace Proyek <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create New Project Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white p-7 rounded-3xl shadow-2xl border border-slate-100 relative"
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-black text-slate-900 mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" /> Buat Proyek Workspace Baru
              </h2>
              <p className="text-xs text-slate-500 mb-6">Pilih bidang karya dan atur parameter proyek Anda.</p>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Bidang Karya (Domain)
                  </label>
                  <select
                    value={domainType}
                    onChange={(e) => setDomainType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-purple-600"
                  >
                    <option value="NOVEL">Novel & Sastra (Tersedia)</option>
                    <option value="RESEARCH" disabled>Riset Akademik (Coming Soon 🔒)</option>
                    <option value="SCREENPLAY" disabled>Skenario & Film (Coming Soon 🔒)</option>
                    <option value="CODING" disabled>Rekayasa Kode (Coming Soon 🔒)</option>
                    <option value="BUSINESS" disabled>Bisnis & Strategi (Coming Soon 🔒)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Judul Proyek *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="misal: Kerajaan Terakhir Arken"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Deskripsi / Ringkasan
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ringkasan atau premis proyek karya..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Kategori / Genre
                    </label>
                    <input
                      type="text"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      placeholder="Fantasy / General"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Bahasa
                    </label>
                    <input
                      type="text"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      placeholder="Indonesian / English"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {creating ? "Membuat Proyek..." : "Buat Workspace Proyek"} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
