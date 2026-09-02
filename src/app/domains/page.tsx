"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Home,
  Folder,
  Brain,
  Sparkles,
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
  Layout,
  Users,
  Clock,
  ChevronRight,
  Compass,
} from "lucide-react";

export default function DomainSelectionPage() {
  const router = useRouter();
  const [lockedDomainModal, setLockedDomainModal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const sidebarItems = [
    { icon: Plus, label: "Buat", action: () => router.push("/dashboard") },
    { icon: Home, label: "Beranda", active: true },
    { icon: Folder, label: "Proyek", action: () => router.push("/dashboard") },
    { icon: Brain, label: "Story Brain", action: () => router.push("/novel/cmtg3a2320004rpexxfhcao3t/intelligence") },
    { icon: Users, label: "Tim", action: () => router.push("/novel/cmtg3a2320004rpexxfhcao3t/team") },
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

  const recentProjects = [
    {
      id: "cmtg3a2320004rpexxfhcao3t",
      title: "The Last Kingdom of Arken",
      domainLabel: "Bidang: Novel & Sastra",
      words: "17,750 / 80,000 kata",
      progress: 22,
      updated: "5 menit lalu",
      members: [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      ],
    },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex">
      {/* Left Narrow Canva-Style Sidebar */}
      <aside className="w-20 bg-white border-r border-slate-200 flex flex-col justify-between py-5 items-center shrink-0 z-30 shadow-sm">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-purple-200">
            B
          </div>

          <div className="space-y-4">
            {sidebarItems.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-[10px] font-semibold transition-all ${
                    item.active
                      ? "bg-purple-100 text-purple-700 font-bold"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
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
          className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-[10px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </aside>

      {/* Main Canva-Style Workspace Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header / Announcement Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 text-sm">Breemous</span>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              <Sparkles className="w-3.5 h-3.5" /> AI-Native Collaborative Creation Platform
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-bold text-xs shadow-sm hover:brightness-105 flex items-center gap-1.5"
            >
              ★ Coba Breemous Pro
            </button>

            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
              alt="Sarah"
              className="w-8 h-8 rounded-full border-2 border-purple-200 object-cover cursor-pointer"
              onClick={() => router.push("/profile")}
            />
          </div>
        </header>

        {/* Canva Hero Pastel Banner */}
        <div className="canva-banner-bg px-8 py-14 border-b border-slate-200/80 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
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
                className="w-full bg-white border-2 border-purple-300 focus:border-purple-600 rounded-full pl-12 pr-6 py-3 text-sm text-slate-800 shadow-md shadow-purple-100 focus:outline-none transition-all placeholder:text-slate-400"
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
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center border border-white text-[10px]">
                          <Lock className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-700 mt-2 flex items-center gap-1">
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
            <h2 className="text-2xl font-bold text-slate-900">Lanjutkan karya Anda</h2>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
            >
              Lihat semua proyek <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentProjects.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -4 }}
                onClick={() => router.push(`/novel/${p.id}/overview`)}
                className="canva-card rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                {/* Visual Cover Banner */}
                <div className="h-36 bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 p-5 flex flex-col justify-between text-white relative">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold tracking-wider">
                      {p.domainLabel}
                    </span>
                    <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded">
                      Live Sync
                    </span>
                  </div>
                  <h3 className="font-extrabold text-xl line-clamp-1">{p.title}</h3>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                      <span>Progress Karya</span>
                      <span className="text-purple-700">{p.words}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-600"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex -space-x-2">
                      {p.members.map((m, idx) => (
                        <img
                          key={idx}
                          src={m}
                          alt="member"
                          className="w-7 h-7 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {p.updated}
                    </span>
                  </div>

                  <button className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2">
                    Buka Workspace Proyek <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Locked Domain Modal */}
      <AnimatePresence>
        {lockedDomainModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white p-7 rounded-3xl shadow-2xl border border-slate-100 text-center relative"
            >
              <button
                onClick={() => setLockedDomainModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-3xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto mb-4 shadow-sm">
                <Lock className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">{lockedDomainModal}</h3>
              <p className="text-sm font-semibold text-amber-700 mb-2">
                Fitur bidang ini masih dalam tahap pengembangan.
              </p>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Saat ini kami sedang memfokuskan pengembangan modul terbaik untuk bidang Novel & Sastra, dan akan segera menghadirkan modul {lockedDomainModal}.
              </p>

              <button
                onClick={() => setLockedDomainModal(null)}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors"
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
