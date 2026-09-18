"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  BookOpen,
  Users,
  Brain,
  GitBranch,
  FileText,
  ShieldCheck,
  ArrowRight,
  Zap,
  Network,
  Compass,
  FlaskConical,
  Code2,
  Clapperboard,
  Briefcase,
} from "lucide-react";

export default function LandingPage() {
  const domains = [
    { title: "Novel & Sastra", desc: "Editor bab kolaboratif, grafik hubungan karakter, dan memori cerita.", icon: BookOpen, status: "TERSEDIA" },
    { title: "Riset Akademik", desc: "Sintesis literatur, pembuatan makalah kolaboratif, dan pemetaan sitasi.", icon: FlaskConical, status: "COMING SOON" },
    { title: "Skenario & Film", desc: "Editor format naskah standar, pemetaan adegan, dan inteligensi karakter.", icon: Clapperboard, status: "COMING SOON" },
    { title: "Rekayasa Kode", desc: "Dokumentasi spesifikasi sistem, lacak atribusi ide, dan memori kode.", icon: Code2, status: "COMING SOON" },
    { title: "Bisnis & Strategi", desc: "Narasi pitch deck kolaboratif, whitepaper, dan skor kontribusi tim.", icon: Briefcase, status: "COMING SOON" },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-purple-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#090d16]/85 backdrop-blur-md border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo-wreetfy.png" alt="Wreetfy Logo" className="h-10 w-auto object-contain drop-shadow-[0_0_12px_rgba(14,165,233,0.5)]" />
            <span className="font-black text-2xl tracking-tight text-white">
              Wreetfy
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-bold text-slate-300 hover:text-white transition-colors px-4 py-2"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-purple-900/40 transition-all flex items-center gap-2"
            >
              Daftar Gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 max-w-7xl mx-auto text-center canva-banner-bg border-b border-slate-800/80">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-8">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI-Native Collaborative Creation Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight max-w-5xl mx-auto leading-tight">
            Create Together.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400">
              Understand Every Contribution.
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Sistem operasi kolaboratif multi-bidang berbasis AI. Buat novel, riset akademik, skenario film, spesifikasi kode, dan dokumen bisnis bersama tim dengan inteligensi kontribusi transparan.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-xl shadow-purple-900/50 transition-all flex items-center justify-center gap-3 text-base"
            >
              Mulai Buat Karya <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/domains"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 text-slate-200 hover:text-white hover:bg-slate-800 font-bold border border-slate-700/80 shadow-md transition-all flex items-center justify-center gap-3 text-base"
            >
              <Compass className="w-5 h-5 text-purple-400" /> Jelajahi Workspace Domain
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Multi-Domain Creative Fields Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Dukungan Multi-Bidang</span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-2">
            Satu Platform Untuk Berbagai Bidang Karya
          </h2>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto text-sm font-medium">
            Pilih domain karya Anda. Setiap bidang dilengkapi dengan memori AI, pelacakan kontribusi, dan grafik hubungan khusus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {domains.map((d, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="canva-card p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-950/60 text-purple-400 border border-purple-800/40 flex items-center justify-center mb-4">
                  <d.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-100 text-base mb-2">{d.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{d.desc}</p>
              </div>
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full w-fit ${
                d.status === "TERSEDIA" ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800/40" : "bg-slate-800/70 text-slate-400 border border-slate-700/40"
              }`}>
                {d.status}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500 font-medium bg-[#090d16]">
        <p>© 2026 Wreetfy — AI-Native Collaborative Creation SaaS Platform.</p>
      </footer>
    </div>
  );
}