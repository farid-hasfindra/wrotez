"use client";

import { useEffect, useState, use } from "react";
import { MapPin, Plus } from "lucide-react";

export default function WorldBuildingPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/worldbuilding`)
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.entries || []);
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
          <h1 className="text-3xl font-extrabold text-white">Wiki Dunia Cerita</h1>
          <p className="text-xs text-slate-400 mt-1">Basis pengetahuan untuk lokasi, sistem sihir, sejarah, dan faksi.</p>
        </div>

        <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Entri
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-slate-400 animate-pulse">Memuat worldbuilding...</div>
      ) : entries.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center">
          <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">Belum ada worldbuilding entries.</p>
          <p className="text-xs text-slate-500 mt-1">Tambahkan lokasi, kerajaan, atau sistem dunia cerita.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {entries.map((item) => (
            <div key={item.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase">
                {item.category}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{item.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
              {item.history && (
                <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-800">Sejarah: {item.history}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}