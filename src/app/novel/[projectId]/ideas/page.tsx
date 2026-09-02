"use client";

import { useState } from "react";
import { GitBranch, Plus, Sparkles, User, FileText, ArrowRight } from "lucide-react";

export default function IdeasPage() {
  const [ideas] = useState([
    {
      id: "1",
      title: "Submerged Sky Fortress Concept",
      category: "WORLDBUILDING",
      status: "IMPLEMENTED",
      creator: "Andi Pratama (Jan 3)",
      developers: ["Sarah Vance (Jan 5)", "Daniel Sterling (Jan 8)"],
      implementation: "Chapter 1 & Chapter 4",
      expandedInto: ["Chapter 12 Rampart Siege", "Chapter 17 Sky Dock"],
    },
    {
      id: "2",
      title: "Elena's Royal Heir Secrets",
      category: "CHARACTER",
      status: "IN_DEVELOPMENT",
      creator: "Sarah Vance (Jan 10)",
      developers: ["Michael Ross (Jan 12)"],
      implementation: "Chapter 3 (Starlight Thread Ritual)",
      expandedInto: ["Chapter 14 Climax"],
    },
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Idea Provenance System</h1>
          <p className="text-xs text-slate-400 mt-1">Trace original creators, co-author developments, and chapter implementations.</p>
        </div>

        <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Propose New Idea
        </button>
      </div>

      <div className="space-y-6">
        {ideas.map((idea) => (
          <div key={idea.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase">
                {idea.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                {idea.status}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white">{idea.title}</h3>

            {/* Provenance Timeline */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-3">
              <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                Idea Provenance Timeline
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-indigo-400 font-bold block text-[10px]">ORIGINAL CREATOR</span>
                  <span className="text-white font-semibold">{idea.creator}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-purple-400 font-bold block text-[10px]">DEVELOPERS</span>
                  <span className="text-slate-300">{idea.developers.join(", ")}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-pink-400 font-bold block text-[10px]">IMPLEMENTATION</span>
                  <span className="text-slate-300">{idea.implementation}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-emerald-400 font-bold block text-[10px]">EXPANDED INTO</span>
                  <span className="text-slate-300">{idea.expandedInto.join(", ")}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
