"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Settings, Save, Trash2, AlertCircle } from "lucide-react";

export default function SettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [targetWordCount, setTargetWordCount] = useState(80000);
  const [writingStyle, setWritingStyle] = useState("");

  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.project) {
          setProject(data.project);
          setTitle(data.project.title || "");
          setDescription(data.project.description || "");
          setGenre(data.project.genre || "");
          setLanguage(data.project.language || "");
          setTargetWordCount(data.project.targetWordCount || 80000);
          setWritingStyle(data.project.writingStyle || "");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [projectId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          genre,
          language,
          targetWordCount: Number(targetWordCount),
          writingStyle,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Perubahan berhasil disimpan." });
        setProject(data.project);
      } else {
        setMessage({ type: "error", text: data.error || "Gagal menyimpan perubahan." });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus proyek ini? Tindakan ini tidak dapat dibatalkan.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Gagal menghapus proyek." });
        setDeleting(false);
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-400 animate-pulse">Memuat pengaturan...</div>;
  }

  if (!project) {
    return <div className="p-8 text-slate-400">Proyek tidak ditemukan.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Pengaturan Proyek</h1>
        <p className="text-xs text-slate-400 mt-1">Konfigurasi parameter proyek, target jumlah kata, dan gaya penulisan.</p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-xl text-sm font-semibold flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border border-rose-500/30 text-rose-400"
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Judul Novel
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Deskripsi
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
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
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Bahasa
            </label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Target Jumlah Kata
            </label>
            <input
              type="number"
              value={targetWordCount}
              onChange={(e) => setTargetWordCount(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Gaya Penulisan
            </label>
            <input
              type="text"
              value={writingStyle}
              onChange={(e) => setWritingStyle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400 font-semibold text-xs flex items-center gap-2 hover:bg-rose-900/60 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" /> {deleting ? "Menghapus..." : "Hapus Proyek"}
          </button>
        </div>
      </form>
    </div>
  );
}