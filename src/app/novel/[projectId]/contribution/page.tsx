"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Brain,
  TrendingUp,
  Award,
  Clock,
  GitBranch,
  Layers,
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
      .catch((err) => console.error(err));
  }, [projectId]);

  if (loading) {
    return <div className="p-8 text-slate-500 animate-pulse">Menghitung matriks inteligensi kontribusi...</div>;
  }

  const activeScore = memberScores[selectedUserIndex]?.scoreResult || {
    totalScore: 87,
    userName: "Sarah Vance",
    volumeScore: 24,
    writingScore: 18,
    ideaScore: 14,
    narrativeImpactScore: 13,
    downstreamInfluenceScore: 10,
    structuralScore: 8,
    explanations: [
      "Menulis sekitar 13.150 kata di 3 bab utama manuskrip.",
      "Memperkenalkan 2 konsep cerita orisinal termasuk Rahasia Kerajaan Elena.",
      "Satu konsep memengaruhi 7 revisi bab berikutnya secara langsung.",
      "Mengembangkan arc karakter utama protagonis dan alur sumpah garrison.",
      "Melakukan revisi struktur utama pada Bab 1 & Bab 3.",
    ],
    downstreamImpactAssessment: {
      level: "Tinggi",
      summary: "Jika kontribusi Sarah tidak dimasukkan, arc naratif utama membutuhkan kerja ulang struktur secara masif.",
      affectedElements: ["Motivasi Antagonis Utama", "Klimaks Bab 12-18", "Plot Twist Pertengahan Buku"],
    },
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-purple-600" /> AI Contribution Engine
          </div>
          <h1 className="text-3xl font-black text-slate-900 mt-1">Inteligensi Kontribusi</h1>
          <p className="text-xs text-slate-500 mt-1">
            Estimasi kontribusi terbaca AI mengevaluasi volume, dampak narasi, asal-usul ide, dan pengaruh turunan.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-purple-600" />
          <span>Estimasi AI berdasarkan grafik delta manuskrip</span>
        </div>
      </div>

      {/* Collaborator Leaderboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {memberScores.map((m, idx) => {
          const isSelected = idx === selectedUserIndex;
          const score = m.scoreResult?.totalScore || 70;

          return (
            <motion.div
              key={m.user.id || idx}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedUserIndex(idx)}
              className={`cursor-pointer p-6 rounded-3xl transition-all duration-300 ${
                isSelected
                  ? "bg-white border-2 border-purple-600 shadow-md"
                  : "canva-card"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <img
                  src={m.user.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"}
                  alt={m.user.name}
                  className="w-12 h-12 rounded-2xl border-2 border-purple-200 object-cover"
                />
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 block uppercase">{m.role}</span>
                  <span className="text-2xl font-black text-purple-700">{score}</span>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-base">{m.user.name}</h3>
              <p className="text-xs text-slate-500 mt-1">Skor Kontribusi AI</p>
            </motion.div>
          );
        })}
      </div>

      {/* Deep-Dive Explainable Score Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 6-Factor Score Breakdown */}
        <div className="lg:col-span-2 canva-card p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                Rincian Skor AI Terjelaskan
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Faktor Utama {activeScore.userName}</h2>
            </div>
            <div className="text-3xl font-black text-purple-700 bg-purple-50 px-4 py-2 rounded-2xl border border-purple-200">
              {activeScore.totalScore} / 100
            </div>
          </div>

          {/* Factor Bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">1. Volume Kontribusi (Kata & Bab)</span>
                <span className="text-purple-700">{activeScore.volumeScore} / 25</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600" style={{ width: `${(activeScore.volumeScore / 25) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">2. Kualitas Penulisan (Kedalaman & Substansi)</span>
                <span className="text-indigo-700">{activeScore.writingScore} / 20</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600" style={{ width: `${(activeScore.writingScore / 20) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">3. Kontribusi Ide (Konsep & Asal-usul)</span>
                <span className="text-pink-700">{activeScore.ideaScore} / 15</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-pink-600" style={{ width: `${(activeScore.ideaScore / 15) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">4. Dampak Narasi (Plot Twist & Konflik)</span>
                <span className="text-amber-700">{activeScore.narrativeImpactScore} / 15</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${(activeScore.narrativeImpactScore / 15) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">5. Pengaruh Turunan (Downstream Influence)</span>
                <span className="text-emerald-700">{activeScore.downstreamInfluenceScore} / 15</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600" style={{ width: `${(activeScore.downstreamInfluenceScore / 15) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">6. Kontribusi Struktural (Pacing & Reorganisasi)</span>
                <span className="text-cyan-700">{activeScore.structuralScore} / 10</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-600" style={{ width: `${(activeScore.structuralScore / 10) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Why this score explanations box */}
          <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 space-y-3">
            <h4 className="font-bold text-purple-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" /> Mengapa skor ini diberikan?
            </h4>
            <ul className="space-y-2">
              {activeScore.explanations.map((exp: string, idx: number) => (
                <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>{exp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Counterfactual Impact Analysis */}
        <div className="space-y-6">
          <div className="canva-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" /> Analisis Dampak Kontrafaktual
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Apa yang terjadi jika kontribusi ini tidak ada?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeScore.downstreamImpactAssessment?.summary}
            </p>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
              <div className="font-bold text-amber-800 uppercase tracking-wider text-[10px]">
                Estimasi Pengaruh Turunan
              </div>
              <div className="text-xl font-black text-amber-900">
                {activeScore.downstreamImpactAssessment?.level || "Tinggi"}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">Elemen Cerita Yang Terpengaruh:</div>
              <div className="space-y-1">
                {activeScore.downstreamImpactAssessment?.affectedElements?.map((el: string, idx: number) => (
                  <div key={idx} className="text-xs font-medium text-purple-800 bg-purple-50 p-2 rounded-lg border border-purple-200">
                    • {el}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
