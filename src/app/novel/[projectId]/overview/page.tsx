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

export default function OverviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [projectData, setProjectData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.projects?.find((p: any) => p.id === projectId) || data.projects?.[0];
        setProjectData(found);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [projectId]);

  if (loading) {
    return <div className="p-8 text-slate-500 animate-pulse">Memuat ringkasan novel...</div>;
  }

  const title = projectData?.title || "The Last Kingdom of Arken";
  const chapters = projectData?.chapters || [];
  const totalWords = chapters.reduce((acc: number, c: any) => acc + (c.wordCount || 0), 0) || 17750;
  const targetWords = projectData?.targetWordCount || 80000;
  const progressPct = Math.min(100, Math.round((totalWords / targetWords) * 100));

  const recentActivity = [
    { user: "Sarah Vance", action: "mengedit Bab 3: The Sunstone Awakening", time: "5 menit lalu" },
    { user: "Daniel Sterling", action: "menambahkan Relasi Karakter: Marcus & Elena (Sekutu)", time: "1 jam lalu" },
    { user: "Andi Pratama", action: "membuat Ide: Konsep Benteng Langit Tenggelam", time: "3 jam lalu" },
    { user: "Michael Ross", action: "mereview versi Bab 4 dan menyetujui status", time: "5 jam lalu" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title Banner */}
      <div className="canva-banner-bg p-8 rounded-3xl border border-purple-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
            {projectData?.genre || "Fantasy"} • {projectData?.language || "English"}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mt-3">{title}</h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl">
            {projectData?.description || "An epic high-fantasy saga exploring ancient sky-fortresses, forgotten sacred vows, and the struggle for the Sun Altar."}
          </p>
        </div>

        <Link
          href={`/novel/${projectId}/editor`}
          className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Edit3 className="w-4 h-4" /> Buka Editor Bab
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="canva-card p-6 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-3">
            <span>PROGRESS KATA</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{progressPct}%</div>
          <div className="text-xs text-slate-500 mt-1">{totalWords.toLocaleString()} / {targetWords.toLocaleString()} kata</div>
          <div className="h-2 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-purple-600" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <div className="canva-card p-6 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-3">
            <span>TOTAL BAB</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{chapters.length || 4}</div>
          <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 2 Selesai, 1 Dalam Review
          </div>
        </div>

        <div className="canva-card p-6 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-3">
            <span>TIM AKTIF</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">4 Anggota</div>
          <div className="text-xs text-slate-500 mt-1">Sarah, Daniel, Andi, Michael</div>
        </div>

        <div className="canva-card p-6 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-3">
            <span>KESEHATAN CERITA</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-purple-700">92%</div>
          <div className="text-xs text-slate-500 mt-1">Radar Konsistensi Aktif</div>
        </div>
      </div>

      {/* Chapters Preview & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chapters List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" /> Bab Terkini
            </h2>
            <Link
              href={`/novel/${projectId}/chapters`}
              className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
            >
              Lihat Semua Bab <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {chapters.length > 0 ? (
              chapters.map((ch: any) => (
                <div
                  key={ch.id}
                  className="canva-card p-5 rounded-2xl flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{ch.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>{ch.wordCount?.toLocaleString() || 0} kata</span>
                      <span>•</span>
                      <span className="text-purple-700 font-semibold">Status: {ch.status || "DRAFT"}</span>
                    </div>
                  </div>
                  <Link
                    href={`/novel/${projectId}/editor`}
                    className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white font-bold text-xs transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-6 text-slate-500 text-center canva-card rounded-2xl">Belum ada bab yang dibuat.</div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" /> Aktivitas Tim
          </h2>

          <div className="canva-card p-5 rounded-2xl space-y-4">
            {recentActivity.map((act, i) => (
              <div key={i} className="flex gap-3 text-xs border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                <div>
                  <div className="text-slate-700">
                    <span className="font-bold text-slate-900">{act.user}</span> {act.action}
                  </div>
                  <div className="text-slate-400 text-[10px] mt-0.5">{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
