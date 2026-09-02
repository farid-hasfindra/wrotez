"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Send,
  HelpCircle,
  Network,
  Users,
  Compass,
} from "lucide-react";

export default function StoryIntelligencePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Halo! Saya adalah Story Assistant AI Anda. Tanyakan apa saja mengenai rahasia karakter, riwayat bab terdahulu, atau alur konflik cerita yang belum terselesaikan.",
    },
  ]);
  const [question, setQuestion] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQ = question;
    setMessages((prev) => [...prev, { sender: "user", text: userQ }]);
    setQuestion("");
    setLoadingAi(true);

    try {
      const res = await fetch("/api/intelligence/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, question: userQ }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "ai", text: data.answer || "No response generated." }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "ai", text: "Error retrieving story memory context." }]);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider">
          <Brain className="w-4 h-4 text-purple-600" /> Story Intelligence Engine
        </div>
        <h1 className="text-3xl font-black text-slate-900 mt-1">Story Brain & Memori Cerita</h1>
        <p className="text-xs text-slate-500 mt-1">
          Memori cerita RAG, radar kesehatan cerita, deteksi plot hole, dan asisten interaktif.
        </p>
      </div>

      {/* Story Health Radar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="canva-card p-6 rounded-3xl">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
            <span>KONSISTENSI NARASI</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">92%</div>
          <div className="text-[11px] text-slate-400 mt-1">Estimasi otomatis AI</div>
        </div>

        <div className="canva-card p-6 rounded-3xl">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
            <span>KONSISTENSI KARAKTER</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-700">88%</div>
          <div className="text-[11px] text-slate-400 mt-1">1 potensi kontradiksi sifat</div>
        </div>

        <div className="canva-card p-6 rounded-3xl">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
            <span>KONSISTENSI TIMELINE</span>
            <Compass className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-indigo-600">95%</div>
          <div className="text-[11px] text-slate-400 mt-1">Radar perjalanan aman</div>
        </div>

        <div className="canva-card p-6 rounded-3xl">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
            <span>KONFLIK BELUM SELESAI</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">3 Alur</div>
          <div className="text-[11px] text-slate-400 mt-1">Kunci Vault, Altar Sunstone</div>
        </div>
      </div>

      {/* Main Grid: RAG Chat Assistant & Plot Holes Detector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Story Assistant RAG Chatbot */}
        <div className="lg:col-span-2 canva-card p-6 rounded-3xl flex flex-col justify-between h-[580px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" /> Story Assistant Chatbot
              </h2>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                Context Retrieval (RAG) Aktif
              </span>
            </div>

            {/* Suggested Sample Queries */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                "Who knows Elena's secret?",
                "When did Marcus first meet John?",
                "List unresolved conflicts.",
                "Summarize Chapter 1-10.",
              ].map((sq, i) => (
                <button
                  key={i}
                  onClick={() => setQuestion(sq)}
                  className="text-[11px] font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors"
                >
                  {sq}
                </button>
              ))}
            </div>

            {/* Chat Messages Log */}
            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-2">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                    m.sender === "user"
                      ? "bg-purple-600 text-white ml-auto font-medium"
                      : "bg-slate-50 text-slate-800 border border-slate-200 font-medium"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {loadingAi && (
                <div className="p-3 rounded-xl bg-purple-50 text-purple-700 text-xs font-semibold flex items-center gap-2 w-fit">
                  <Sparkles className="w-4 h-4 text-purple-600 animate-spin" /> Membaca konteks memori novel...
                </div>
              )}
            </div>
          </div>

          {/* Question Input Form */}
          <form onSubmit={handleAsk} className="pt-4 border-t border-slate-100 flex gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Tanyakan mengenai lore, karakter, atau plot novel..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-purple-600"
            />
            <button
              type="submit"
              disabled={loadingAi}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2"
            >
              Tanya AI <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Plot Holes & Inconsistency Radar */}
        <div className="space-y-6">
          <div className="canva-card p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Potensi Isu Cerita
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900">Kontradiksi Karakter</span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">
                    Tinggi
                  </span>
                </div>
                <p className="text-slate-700 leading-normal">
                  Bab 5 menyebut Marcus takut air murni. Pada Bab 18, ia melompat ke laut tanpa ragu.
                </p>
                <div className="flex gap-2 pt-1">
                  <button className="px-2.5 py-1 rounded bg-purple-600 text-white text-[10px] font-bold">
                    Selesaikan
                  </button>
                  <button className="px-2.5 py-1 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">
                    Sengaja
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-900">Tabrakan Waktu Perjalanan</span>
                  <span className="text-[10px] bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded font-bold">
                    Sedang
                  </span>
                </div>
                <p className="text-slate-700 leading-normal">
                  Elena di Garrison jam 08:00 dan di Benteng Solitude jam 08:30 (Jarak tempuh: 4.5 jam).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
