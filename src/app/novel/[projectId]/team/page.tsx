"use client";

import { useEffect, useState, use } from "react";
import { Users, Plus } from "lucide-react";

export default function TeamPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/team`)
      .then((res) => res.json())
      .then((data) => {
        setMembers(data.members || []);
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
          <h1 className="text-3xl font-extrabold text-white">Manajemen Tim</h1>
          <p className="text-xs text-slate-400 mt-1">Kelola kolaborator, peran, dan izin akses penulisan proyek.</p>
        </div>

        <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Undang Kolaborator
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-slate-400 animate-pulse">Memuat tim...</div>
      ) : members.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">Belum ada anggota tim.</p>
          <p className="text-xs text-slate-500 mt-1">Undang kolaborator untuk mulai bekerja bersama.</p>
        </div>
      ) : (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="divide-y divide-slate-800">
            {members.map((m) => (
              <div key={m.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={m.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(m.user?.name || "")}`}
                    alt={m.user?.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-700"
                  />
                  <div>
                    <h3 className="font-bold text-white text-base">{m.user?.name}</h3>
                    <div className="text-xs text-slate-400">{m.user?.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold">
                    {m.role}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">
                    Bergabung {new Date(m.joinedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}