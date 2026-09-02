"use client";

import { useState } from "react";
import { MapPin, Plus, Shield, Sparkles, BookOpen } from "lucide-react";

export default function WorldBuildingPage() {
  const [entries] = useState([
    {
      id: "1",
      name: "Kingdom of Arken",
      category: "Kingdoms",
      description: "An ancient high-elevation realm suspended above cloud seas, protected by obsidian ramparts and sun-fire magic.",
      history: "Founded 800 years ago after the Great Dragon Wars.",
    },
    {
      id: "2",
      name: "The Sun Altar",
      category: "Magic System",
      description: "A monumental golden nexus capable of generating forcefields around the citadel when activated by the Sunstone.",
      history: "Forged by the First Sun Architect in the First Era.",
    },
    {
      id: "3",
      name: "Obsidian Syndicate",
      category: "Organizations",
      description: "A rogue coalition of airship armadas seeking to harvest Aetherial cores from Arken.",
      history: "Formed 50 years ago by exiled garrison lords.",
    },
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Worldbuilding Wiki</h1>
          <p className="text-xs text-slate-400 mt-1">Knowledge base for locations, magic systems, history, and factions.</p>
        </div>

        <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Knowledge Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {entries.map((item) => (
          <div key={item.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase">
              {item.category}
            </span>
            <h3 className="text-xl font-bold text-white mt-1">{item.name}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
            <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-800">History: {item.history}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
