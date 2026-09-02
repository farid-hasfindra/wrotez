"use client";

import { useState } from "react";
import { Clock, Plus, AlertCircle, Calendar, MapPin, Users } from "lucide-react";

export default function TimelinePage() {
  const [events] = useState([
    {
      id: "1",
      title: "Unsealing of the Vault",
      time: "Night of Twin Moons - 02:00 AM",
      chapter: "Chapter 2",
      description: "John touches the Sunstone inside the sealed underground vault.",
      characters: ["John", "Marcus"],
    },
    {
      id: "2",
      title: "Confrontation on the Ramparts",
      time: "Night of Twin Moons - 03:30 AM",
      chapter: "Chapter 1",
      description: "Elena reveals the Altar awakening to Commander Marcus.",
      characters: ["Marcus", "Elena"],
    },
    {
      id: "3",
      title: "Arrival of the Obsidian Fleet",
      time: "Dawn - 06:00 AM",
      chapter: "Chapter 4",
      description: "Black airships breach the cloud sea rim.",
      characters: ["Daniel", "Marcus"],
    },
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Story Timeline</h1>
          <p className="text-xs text-slate-400 mt-1">Chronological sequence of key narrative events.</p>
        </div>

        <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Timeline Event
        </button>
      </div>

      {/* Timeline Sequence */}
      <div className="space-y-6 relative border-l-2 border-indigo-500/30 ml-4 pl-6">
        {events.map((ev, idx) => (
          <div key={ev.id} className="glass-panel p-6 rounded-3xl border border-slate-800 relative">
            <div className="absolute -left-9 top-6 w-5 h-5 rounded-full bg-indigo-600 border-4 border-[#090d16]" />
            <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold mb-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {ev.time}
              </span>
              <span className="bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-500/20">
                {ev.chapter}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{ev.title}</h3>
            <p className="text-xs text-slate-300 mb-4">{ev.description}</p>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Involved: {ev.characters.join(", ")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
