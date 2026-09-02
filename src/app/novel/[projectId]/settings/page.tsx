"use client";

import { Settings, Save, Trash2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Project Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Configure novel parameters, target word count, and writing style.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Novel Title
          </label>
          <input
            type="text"
            defaultValue="The Last Kingdom of Arken"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Genre
            </label>
            <input
              type="text"
              defaultValue="Fantasy"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Target Word Count
            </label>
            <input
              type="number"
              defaultValue={80000}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
          <button className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400 font-semibold text-xs flex items-center gap-2 hover:bg-rose-900/60">
            <Trash2 className="w-4 h-4" /> Delete Project
          </button>
        </div>
      </div>
    </div>
  );
}
