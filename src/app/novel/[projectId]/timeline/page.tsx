"use client";

import { useEffect, useState, use } from "react";
import { Clock, Plus, Users } from "lucide-react";

export default function TimelinePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/timeline`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [projectId]);

  function parseCharacters(raw: string): string[] {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Linimasa Cerita</h1>
          <p className="text-xs text-slate-400 mt-1">Urutan kronologis peristiwa penting dalam narasi.</p>
        </div>

        <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Peristiwa
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-slate-400 animate-pulse">Memuat timeline...</div>
      ) : events.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center">
          <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">Belum ada timeline events.</p>
          <p className="text-xs text-slate-500 mt-1">Tambahkan event untuk melacak kronologi cerita.</p>
        </div>
      ) : (
        <div className="space-y-6 relative border-l-2 border-indigo-500/30 ml-4 pl-6">
          {events.map((ev) => {
            const chars = parseCharacters(ev.characters);
            return (
              <div key={ev.id} className="glass-panel p-6 rounded-3xl border border-slate-800 relative">
                <div className="absolute -left-9 top-6 w-5 h-5 rounded-full bg-indigo-600 border-4 border-[#090d16]" />
                <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold mb-2 flex-wrap gap-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {ev.timeString}
                  </span>
                  {ev.chapterRef && (
                    <span className="bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-500/20">
                      {ev.chapterRef}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{ev.title}</h3>
                <p className="text-xs text-slate-300 mb-4">{ev.description}</p>

                {chars.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>Terlibat: {chars.join(", ")}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}