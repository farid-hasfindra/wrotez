"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Home,
  Folder,
  Brain,
  Search,
  Lock,
  ArrowRight,
  X,
  LogOut,
  FlaskConical,
  Code2,
  Clapperboard,
  Briefcase,
  Feather,
  Users,
  Clock,
  ChevronRight,
  Compass,
} from "lucide-react";

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "baru saja";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export default function DomainSelectionPage() {
  const router = useRouter();
  const [lockedDomainModal, setLockedDomainModal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((res) => res.json()),
      fetch("/api/auth/me").then((res) => res.json()),
    ])
      .then(([projectsRes, userRes]) => {
        setRecentProjects(projectsRes.projects || []);
        setUser(userRes.user || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const sidebarItems = [
    { icon: Plus, label: "Buat", action: () => router.push("/dashboard") },
    { icon: Home, label: "Beranda", active: true },
    { icon: Folder, label: "Proyek", action: () => router.push("/dashboard") },
    { icon: Brain, label: "Story Brain", action: () => {
      if (recentProjects[0]) {
        router.push(`/novel/${recentProjects[0].id}/intelligence`);
      } else {
        router.push("/dashboard");
      }
    } },
    { icon: Users, label: "Tim", action: () => {
      if (recentProjects[0]) {
        router.push(`/novel/${recentProjects[0].id}/team`);
      } else {
        router.push("/dashboard");
      }
    } },
  ];

  const categoryIcons = [
    {
      id: "NOVEL",
      title: "Novel & Sastra",
      icon: BookOpen,
      status: "AVAILABLE",
      badge: "Tersedia",
      bg: "bg-purple-600 text-white shadow-md shadow-purple-200",
    },
    {
      id: "RESEARCH",
      title: "Riset Akademik",
      icon: FlaskConical,
      status: "COMING_SOON",
      bg: "bg-amber-500 text-white",
    },
    {
      id: "SCREENPLAY",
      title: "Skenario & Film",
      icon: Clapperboard,
      status: "COMING_SOON",
      bg: "bg-rose-500 text-white",
    },
    {
      id: "CODING",
      title: "Rekayasa Kode",
      icon: Code2,
      status: "COMING_SOON",
      bg: "bg-cyan-600 text-white",
    },
    {
      id: "BUSINESS",
      title: "Bisnis & Strategi",
      icon: Briefcase,
      status: "COMING_SOON",
      bg: "bg-emerald-600 text-white",
    },
    {
      id: "POETRY",
      title: "Dokumen & Catatan",
      icon: Feather,
      status: "COMING_SOON",
      bg: "bg-pink-500 text-white",
    },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      {/* Left Narrow Sidebar */}
      <aside className="w-20 bg-[#0c101d] border-r border-slate-800/80 flex flex-col justify-between py-5 items-center shrink-0 z-30 shadow-lg">
        <div className="flex flex-col items-center space-y-6">
          <Link
            href="/domains"
            className="w-12 h-12 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-center p-2 hover:border-purple-500/60 transition-all shadow-lg shadow-purple-950/40 hover:scale-105"
            title="Wreetfy"
          >
            <img
              src="/logo-wreetfy.png"
              alt="Wreetfy Logo"
              className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]"
            />
          </Link>

          <div className="space-y-4">
            {sidebarItems.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-[10px] font-semibold transition-all ${
                    item.active
                      ? "bg-purple-950/70 text-purple-300 font-bold border border-purple-800/40 shadow-sm"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                  }`}
                >
                  <IconComp className="w-5 h-5 mb-1" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-[10px] text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </aside>

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-[#0c101d]/90 backdrop-blur-md border-b border-slate-800/80 px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo-wreetfy.png"
              alt="Wreetfy Logo"
              className="h-9 w-auto object-contain drop-shadow-[0_0_10px_rgba(14,165,233,0.5)]"
            />
            <span className="font-black text-white text-xl tracking-tight">Wreetfy</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-md hover:brightness-110 flex items-center gap-1.5"
            >
              ★ Coba Wreetfy Pro
            </button>

            <img
              src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || "")}`}
              alt={user?.name || "Avatar"}
              className="w-8 h-8 rounded-full border-2 border-purple-500/40 object-cover cursor-pointer hover:border-purple-400 transition-colors"
              onClick={() => router.push("/profile")}
            />
          </div>
        </header>

        {/* Hero Dark Gradient Banner */}
        <div className="canva-banner-bg px-8 py-14 border-b border-slate-800/80 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Mau buat karya apa hari ini?
            </h1>

            {/* Central Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari proyek, riset, skenario, kode, atau ide karya..."
                className="w-full bg-[#0f172a] border-2 border-purple-500/40 focus:border-purple-400 rounded-full pl-12 pr-6 py-3 text-sm text-slate-100 shadow-xl shadow-black/40 focus:outline-none transition-all placeholder:text-slate-500"
              />
            </div>

            {/* Category Circles Carousel (Multi-Domain Creative Fields) */}
            <div className="flex items-center justify-center gap-6 pt-4 flex-wrap">
              {categoryIcons.map((cat) => {
                const IconComp = cat.icon;
                const isAvailable = cat.status === "AVAILABLE";

                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      if (isAvailable) router.push("/dashboard");
                      else setLockedDomainModal(cat.title);
                    }}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all transform group-hover:scale-110 relative ${cat.bg}`}
                    >
                      <IconComp className="w-6 h-6" />
                      {!isAvailable && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center border border-slate-700 text-[10px]">
                          <Lock className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white mt-2 flex items-center gap-1 transition-colors">
                      {cat.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* "Lanjutkan Karya Anda" Section */}
        <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Lanjutkan karya Anda</h2>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              Lihat semua proyek <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="canva-card rounded-2xl animate-pulse h-72 bg-[#0f172a]" />
              ))}
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="canva-card p-12 rounded-2xl text-center max-w-xl mx-auto border border-slate-800">
              <div className="w-16 h-16 rounded-3xl bg-purple-950/60 border border-purple-800/40 text-purple-400 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Belum ada proyek</h3>
              <p className="text-slate-400 text-sm mb-6">
                Buat proyek pertama Anda untuk mulai berkolaborasi.
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-purple-900/40 transition-colors"
              >
                <Plus className="w-4 h-4" /> Buat Proyek
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentProjects.slice(0, 6).map((p) => {
                const currentWords = (p.chapters || []).reduce(
                  (acc: number, c: any) => acc + (c.wordCount || 0),
                  0
                );
                const progressPct = Math.min(
                  100,
                  Math.round((currentWords / (p.targetWordCount || 80000)) * 100)
                );

                return (
                  <motion.div
                    key={p.id}
                    whileHover={{ y: -4 }}
                    onClick={() => router.push(`/novel/${p.id}/overview`)}
                    className="canva-card rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between border border-slate-800"
                  >
                    {/* Visual Cover Banner */}
                    <div className="h-36 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 p-5 flex flex-col justify-between text-white relative border-b border-slate-800">
                      <div className="flex justify-between items-start">
                        <span className="px-3 py-1 rounded-full bg-purple-900/40 backdrop-blur-md text-purple-300 text-[10px] font-bold tracking-wider border border-purple-700/40">
                          Bidang: {p.genre || "Novel"}
                        </span>
                        <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded">
                          {p.language || "ID"}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xl line-clamp-1 text-white">{p.title}</h3>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5">
                          <span>Progress Karya</span>
                          <span className="text-purple-400">
                            {currentWords.toLocaleString()} / {(p.targetWordCount || 80000).toLocaleString()} kata
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                        <div className="flex -space-x-2">
                          {(p.members || []).slice(0, 3).map((m: any, idx: number) => (
                            <img
                              key={idx}
                              src={m.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(m.user?.name || "")}`}
                              alt={m.user?.name}
                              className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover"
                            />
                          ))}
                          {(p.members?.length || 0) > 3 && (
                            <div className="w-7 h-7 rounded-full bg-purple-950 border-2 border-slate-900 text-purple-300 text-[10px] font-bold flex items-center justify-center">
                              +{p.members.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {timeAgo(p.updatedAt)}
                        </span>
                      </div>

                      <button className="w-full py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-600 text-purple-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-purple-800/40">
                        Buka Workspace Proyek <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Locked Domain Modal */}
      <AnimatePresence>
        {lockedDomainModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0f172a] p-7 rounded-3xl shadow-2xl border border-slate-800 text-center relative"
            >
              <button
                onClick={() => setLockedDomainModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-3xl bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400 mx-auto mb-4 shadow-sm">
                <Lock className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{lockedDomainModal}</h3>
              <p className="text-sm font-semibold text-amber-400 mb-2">
                Fitur bidang ini masih dalam tahap pengembangan.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Saat ini kami sedang memfokuskan pengembangan modul terbaik untuk bidang Novel & Sastra, dan akan segera menghadirkan modul {lockedDomainModal}.
              </p>

              <button
                onClick={() => setLockedDomainModal(null)}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition-colors"
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}