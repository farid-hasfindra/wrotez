"use client";

import { useState } from "react";
import { Network, Plus, GitMerge, CheckCircle } from "lucide-react";

export default function PlotPage() {
  const [plots] = useState([
    {
      id: "1",
      title: "The Siege of Arken Citadel",
      type: "MAIN_PLOT",
      status: "IN_PROGRESS",
      points: [
        { title: "Discovery of the Sunstone", chapter: "Chapter 1" },
        { title: "Garrison Mobilization", chapter: "Chapter 2" },
        { title: "Airship Armada Siege", chapter: "Chapter 4" },
      ],
    },
    {
      id: "2",
      title: "Elena's Bloodline Pact",
      type: "SUBPLOT",
      status: "IN_PROGRESS",
      points: [
        { title: "Starlight Thread Secret", chapter: "Chapter 1" },
        { title: "Blood Sacrifice Ritual", chapter: "Chapter 3" },
      ],
    },
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Plot Flow & Subplots</h1>
          <p className="text-xs text-slate-400 mt-1">Structure main story arcs and character subplots.</p>
        </div>

        <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Plot Point
        </button>
      </div>

      <div className="space-y-6">
        {plots.map((p) => (
          <div key={p.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase">
                {p.type}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">{p.status}</span>
            </div>

            <h3 className="text-xl font-bold text-white">{p.title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {p.points.map((pt, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-white">{pt.title}</div>
                  <div className="text-slate-400 text-[10px]">{pt.chapter}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
