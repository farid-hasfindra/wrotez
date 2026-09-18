"use client";

import { useEffect, useState, use } from "react";
import { Users, Plus, ShieldCheck, AlertCircle, Heart, Sparkles } from "lucide-react";

export default function CharactersPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/characters`)
      .then((res) => res.json())
      .then((data) => {
        setCharacters(data.characters || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [projectId]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Karakter</h1>
          <p className="text-xs text-slate-400 mt-1">Kelola profil karakter, rahasia, dan hubungan antar tokoh.</p>
        </div>

        <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Karakter
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-slate-400 animate-pulse">Memuat karakter...</div>
      ) : characters.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">Belum ada karakter untuk proyek ini.</p>
          <p className="text-xs text-slate-500 mt-1">Tambahkan karakter pertama untuk mulai membangun dunia cerita.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {characters.map((ch) => (
            <div key={ch.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {ch.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase">
                    {ch.role}
                  </span>
                  <h3 className="font-bold text-white text-lg mt-1 truncate">{ch.name}</h3>
                  <span className="text-[10px] text-slate-500 uppercase">{ch.status}</span>
                </div>
              </div>

              {ch.description && (
                <p className="text-xs text-slate-300 leading-relaxed">{ch.description}</p>
              )}

              {ch.secrets && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <span className="text-amber-400 font-semibold block text-[10px] uppercase">Sifat Rahasia:</span>
                  <span className="text-slate-300">{ch.secrets}</span>
                </div>
              )}

              {ch.personality && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <span className="text-purple-400 font-semibold block text-[10px] uppercase">Kepribadian:</span>
                  <span className="text-slate-300">{ch.personality}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}