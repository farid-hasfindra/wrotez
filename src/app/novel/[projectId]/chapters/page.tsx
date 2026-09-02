"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { BookOpen, Plus, Edit3, CheckCircle2, Clock, FileText, ArrowRight } from "lucide-react";

export default function ChaptersPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [chapters, setChapters] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.projects?.find((p: any) => p.id === projectId) || data.projects?.[0];
        setChapters(found?.chapters || []);
      })
      .catch((err) => console.error(err));
  }, [projectId]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Chapters</h1>
          <p className="text-xs text-slate-400 mt-1">Manage, outline, and track manuscript chapters.</p>
        </div>

        <Link
          href={`/novel/${projectId}/editor`}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Chapter
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {chapters.map((ch, idx) => (
          <div
            key={ch.id || idx}
            className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-indigo-500/40 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold flex items-center justify-center text-sm">
                {idx + 1}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{ch.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-indigo-400" /> {ch.wordCount?.toLocaleString() || 0} words
                  </span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-medium">
                    {ch.status || "DRAFT"}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href={`/novel/${projectId}/editor`}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-semibold text-xs transition-colors flex items-center gap-2"
            >
              Open in Editor <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
