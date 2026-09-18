"use client";

import { useEffect, useState, use } from "react";
import {
  Zap,
  TrendingUp,
  Clock,
  ChevronRight,
  AlertTriangle,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function ContributionPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [memberScores, setMemberScores] = useState<any[]>([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/contributions?projectId=${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.memberScores) {
          setMemberScores(data.memberScores);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [projectId]);

  if (loading) {
    return <div className="p-8 text-slate-500 animate-pulse">Menghitung matriks inteligensi kontribusi...</div>;
  }

  if (memberScores.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-slate-100">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Zap className="w-4 h-4 text-purple-400" /> AI Contribution Engine
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Inteligensi Kontribusi</h1>
        <div className="p-12 canva-card rounded-3xl text-center text-slate-400 bg-[#0f172a] border border-slate-800">
          <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="font-semibold text-white">Belum ada data kontribusi untuk proyek ini.</p>
          <p className="text-xs mt-1">Tambahkan kolaborator dan mulai menulis untuk melihat analisis kontribusi AI.</p>
        </div>
      </div>
    );
  }

  const activeScore = memberScores[selectedUserIndex]?.scoreResult;

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-slate-100">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-purple-400" /> AI Contribution Engine
          </div>
          <h1 className="text-3xl font-black text-white mt-1">Inteligensi Kontribusi</h1>
          <p className="text-xs text-slate-400 mt-1">
            Estimasi kontribusi terbaca AI mengevaluasi volume, dampak narasi, asal-usul ide, dan pengaruh turunan.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-purple-950/60 border border-purple-800/40 text-purple-300 text-xs font-bold flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-purple-400" />
          <span>Estimasi AI berdasarkan grafik delta manuskrip</span>
        </div>
      </div>

      {/* Collaborator Leaderboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {memberScores.map((m, idx) => {
          const isSelected = idx === selectedUserIndex;
          const score = m.scoreResult?.totalScore || 0;

          return (
            <div
              key={m.user.id || idx}
              onClick={() => setSelectedUserIndex(idx)}
              className={`cursor-pointer p-6 rounded-3xl transition-all duration-300 bg-[#0f172a] ${
                isSelected
                  ? "border-2 border-purple-500 shadow-xl shadow-purple-900/40"
                  : "canva-card border border-slate-800 hover:border-purple-500/50"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <img
                  src={m.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(m.user.name)}`}
                  alt={m.user.name}
                  className="w-12 h-12 rounded-2xl border-2 border-purple-500/40 object-cover"
                />
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 block uppercase">{m.role}</span>
                  <span className="text-2xl font-black text-purple-400">{score}</span>
                </div>
              </div>

              <h3 className="font-bold text-white text-base">{m.user.name}</h3>
              <p className="text-xs text-slate-400 mt-1">Skor Kontribusi AI</p>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Explainable Score Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 6-Factor Score Breakdown */}
        <div className="lg:col-span-2 canva-card p-8 rounded-3xl space-y-6 bg-[#0f172a] border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Rincian Skor AI Terjelaskan
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                Faktor Utama {activeScore?.userName}
              </h2>
            </div>
            <div className="text-3xl font-black text-purple-300 bg-purple-950/60 px-4 py-2 rounded-2xl border border-purple-800/40">
              {activeScore?.totalScore || 0} / 100
            </div>
          </div>

          {/* Factor Bars */}
          <div className="space-y-4">
            <FactorBar label="1. Volume Kontribusi (Kata & Bab)" value={activeScore?.volumeScore || 0} max={25} color="bg-purple-500" textColor="text-purple-400" />
            <FactorBar label="2. Kualitas Penulisan (Kedalaman & Substansi)" value={activeScore?.writingScore || 0} max={20} color="bg-indigo-500" textColor="text-indigo-400" />
            <FactorBar label="3. Kontribusi Ide (Konsep & Asal-usul)" value={activeScore?.ideaScore || 0} max={15} color="bg-pink-500" textColor="text-pink-400" />
            <FactorBar label="4. Dampak Narasi (Plot Twist & Konflik)" value={activeScore?.narrativeImpactScore || 0} max={15} color="bg-amber-500" textColor="text-amber-400" />
            <FactorBar label="5. Pengaruh Turunan (Downstream Influence)" value={activeScore?.downstreamInfluenceScore || 0} max={15} color="bg-emerald-500" textColor="text-emerald-400" />
            <FactorBar label="6. Kontribusi Struktural (Pacing & Reorganisasi)" value={activeScore?.structuralScore || 0} max={10} color="bg-cyan-500" textColor="text-cyan-400" />
          </div>

          {/* Why this score explanations box */}
          {activeScore?.explanations && activeScore.explanations.length > 0 && (
            <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-800/40 space-y-3">
              <h4 className="font-bold text-purple-300 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> Mengapa skor ini diberikan?
              </h4>
              <ul className="space-y-2">
                {activeScore.explanations.map((exp: string, idx: number) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Counterfactual Impact Analysis */}
        <div className="space-y-6">
          <div className="canva-card p-6 rounded-3xl space-y-4 bg-[#0f172a] border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" /> Analisis Dampak Kontrafaktual
            </div>
            <h3 className="font-bold text-white text-lg">Apa yang terjadi jika kontribusi ini tidak ada?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeScore?.downstreamImpactAssessment?.summary || "Belum ada analisis kontrafaktual yang cukup."}
            </p>

            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs space-y-1">
              <div className="font-bold text-amber-300 uppercase tracking-wider text-[10px]">
                Estimasi Pengaruh Turunan
              </div>
              <div className="text-xl font-black text-amber-400">
                {activeScore?.downstreamImpactAssessment?.level || "N/A"}
              </div>
            </div>

            {activeScore?.downstreamImpactAssessment?.affectedElements?.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300">Elemen Cerita Yang Terpengaruh:</div>
                <div className="space-y-1">
                  {activeScore.downstreamImpactAssessment.affectedElements.map((el: string, idx: number) => (
                    <div key={idx} className="text-xs font-medium text-purple-300 bg-purple-950/60 p-2 rounded-lg border border-purple-800/40">
                      • {el}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FactorBar({
  label,
  value,
  max,
  color,
  textColor,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  textColor: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs font-bold mb-1">
        <span className="text-slate-300">{label}</span>
        <span className={textColor}>
          {value} / {max}
        </span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}