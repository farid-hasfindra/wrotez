"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Users,
  Clock,
  Edit3,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
  BookOpen,
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
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function OverviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [projectData, setProjectData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/projects/${projectId}`).then((res) => res.json()),
      fetch(`/api/projects/${projectId}/activity`).then((res) => res.json()),
    ])
      .then(([projectRes, activityRes]) => {
        if (projectRes.project) setProjectData(projectRes.project);
        if (activityRes.activities) setActivities(activityRes.activities);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [projectId]);

  if (loading) {
    return <div className="p-8 text-slate-500 animate-pulse">Memuat ringkasan novel...</div>;
  }

  if (!projectData) {
    return (
      <div className="p-8 text-slate-500">
        Proyek tidak ditemukan atau Anda tidak memiliki akses.
        <div className="mt-4">
          <Link href="/dashboard" className="text-purple-700 hover:underline font-bold">
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const chapters = projectData.chapters || [];
  const totalWords = chapters.reduce((acc: number, c: any) => acc + (c.wordCount || 0), 0);
  const targetWords = projectData.targetWordCount || 80000;
  const progressPct = Math.min(100, Math.round((totalWords / targetWords) * 100));
  const completedChapters = chapters.filter((c: any) => c.status === "COMPLETED").length;
  const inReviewChapters = chapters.filter((c: any) => c.status === "REVIEW").length;
  const memberCount = projectData.members?.length || 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-slate-100">
      {/* Title Banner */}
      <div className="canva-banner-bg p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-purple-950/70 text-purple-300 border border-purple-800/40 text-xs font-bold uppercase tracking-wider">
            {projectData.genre} • {projectData.language}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white mt-3">{projectData.title}</h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {projectData.description || "Belum ada deskripsi untuk proyek ini."}
          </p>
        </div>

        <Link
          href={`/novel/${projectId}/editor`}
          className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-900/40 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Edit3 className="w-4 h-4" /> Buka Editor Bab
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="canva-card p-6 rounded-2xl bg-[#0f172a] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-3">
            <span>PROGRESS KATA</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">{progressPct}%</div>
          <div className="text-xs text-slate-400 mt-1">{totalWords.toLocaleString()} / {targetWords.toLocaleString()} kata</div>
          <div className="h-2 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <div className="canva-card p-6 rounded-2xl bg-[#0f172a] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-3">
            <span>TOTAL BAB</span>
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{chapters.length}</div>
          <div className="text-xs text-emerald-400 font-bold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> {completedChapters} Selesai, {inReviewChapters} Review
          </div>
        </div>

        <div className="canva-card p-6 rounded-2xl bg-[#0f172a] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-3">
            <span>TIM AKTIF</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">{memberCount} Anggota</div>
          <div className="text-xs text-slate-400 mt-1">
            {projectData.members?.slice(0, 3).map((m: any) => m.user.name).join(", ")}
            {memberCount > 3 ? `, +${memberCount - 3}` : ""}
          </div>
        </div>

        <div className="canva-card p-6 rounded-2xl bg-[#0f172a] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-3">
            <span>KONTEN CERITA</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-purple-400">
            {projectData._count?.characters || 0}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Karakter • {projectData._count?.ideas || 0} Ide • {projectData._count?.worldbuilding || 0} Lore
          </div>
        </div>
      </div>

      {/* Chapters Preview & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chapters List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" /> Bab Terkini
            </h2>
            <Link
              href={`/novel/${projectId}/chapters`}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              Lihat Semua Bab <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {chapters.length > 0 ? (
              chapters.slice(0, 5).map((ch: any) => (
                <div
                  key={ch.id}
                  className="canva-card p-5 rounded-2xl flex items-center justify-between bg-[#0f172a] border border-slate-800"
                >
                  <div>
                    <h3 className="font-bold text-white text-base">{ch.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>{(ch.wordCount || 0).toLocaleString()} kata</span>
                      <span>•</span>
                      <span className="text-purple-400 font-semibold">Status: {ch.status || "DRAFT"}</span>
                    </div>
                  </div>
                  <Link
                    href={`/novel/${projectId}/editor`}
                    className="px-4 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-600 text-purple-300 hover:text-white font-bold text-xs transition-colors border border-purple-800/40"
                  >
                    Edit
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-6 text-slate-400 text-center canva-card rounded-2xl bg-[#0f172a] border border-slate-800">Belum ada bab yang dibuat.</div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Aktivitas Tim
          </h2>

          <div className="canva-card p-5 rounded-2xl space-y-4 bg-[#0f172a] border border-slate-800">
            {activities.length > 0 ? (
              activities.slice(0, 8).map((act: any) => (
                <div key={act.id} className="flex gap-3 text-xs border-b border-slate-800/80 pb-3 last:border-0 last:pb-0">
                  <img
                    src={act.user?.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"}
                    alt={act.user?.name}
                    className="w-8 h-8 rounded-full border border-slate-700 object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-300">
                      <span className="font-bold text-white">{act.user?.name}</span>{" "}
                      <span className="text-slate-400">{act.details}</span>
                    </div>
                    <div className="text-slate-500 text-[10px] mt-0.5">{timeAgo(act.createdAt)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 text-center py-4">Belum ada aktivitas.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}