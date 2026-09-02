"use client";

import { useState } from "react";
import { Users, Plus, Shield, Mail, UserCheck } from "lucide-react";

export default function TeamPage() {
  const [members] = useState([
    { name: "Sarah Vance", email: "sarah@novel.app", role: "OWNER", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
    { name: "Daniel Sterling", email: "daniel@novel.app", role: "CO_AUTHOR", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
    { name: "Andi Pratama", email: "andi@novel.app", role: "CO_AUTHOR", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
    { name: "Michael Ross", email: "michael@novel.app", role: "EDITOR", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Team Management</h1>
          <p className="text-xs text-slate-400 mt-1">Manage project collaborators, roles, and write access permissions.</p>
        </div>

        <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Invite Collaborator
        </button>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="divide-y divide-slate-800">
          {members.map((m, idx) => (
            <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-700" />
                <div>
                  <h3 className="font-bold text-white text-base">{m.name}</h3>
                  <div className="text-xs text-slate-400">{m.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold">
                  {m.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
