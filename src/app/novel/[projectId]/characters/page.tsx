"use client";

import { useEffect, useState, use } from "react";
import { Users, Plus, ShieldCheck, AlertCircle, Heart, Sparkles } from "lucide-react";

export default function CharactersPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [characters, setCharacters] = useState([
    {
      id: "1",
      name: "Marcus Vance",
      role: "Protagonist",
      status: "ALIVE",
      description: "High Commander of the Citadel Garrison. Bound by honor yet torn between duty and the truth of the Sunstone.",
      secrets: "Holds the lost key to the Vault of Arken.",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    },
    {
      id: "2",
      name: "Elena Arken",
      role: "Protagonist",
      status: "ALIVE",
      description: "Mysterious archivist with ancient bloodline abilities. Wields starlight thread magic.",
      secrets: "Is the last legitimate bloodline heir of Arken.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
    {
      id: "3",
      name: "Commander Daniel",
      role: "Supporting",
      status: "ALIVE",
      description: "Veteran leader of the Obsidian Garrison. Master swordsman.",
      secrets: "Former member of the Syndicate council.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    },
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Characters</h1>
          <p className="text-xs text-slate-400 mt-1">Manage character profiles, secrets, and relationships.</p>
        </div>

        <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Character
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {characters.map((ch) => (
          <div key={ch.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-4">
              <img src={ch.avatarUrl} alt={ch.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700" />
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase">
                  {ch.role}
                </span>
                <h3 className="font-bold text-white text-lg mt-1">{ch.name}</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{ch.description}</p>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <span className="text-amber-400 font-semibold block text-[10px] uppercase">Secret Trait:</span>
              <span className="text-slate-300">{ch.secrets}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
