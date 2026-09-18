"use client";

import { useEffect, useState, use } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { motion } from "framer-motion";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  Quote,
  Undo,
  Redo,
  Clock,
  History,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  User,
} from "lucide-react";

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "baru saja";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export default function NovelEditorPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [chapterId, setChapterId] = useState<string>("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterStatus, setChapterStatus] = useState("DRAFT");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [showHistory, setShowHistory] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [chapterLoaded, setChapterLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Placeholder.configure({
        placeholder: "Write your novel chapter here...",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setSaveStatus("unsaved");
      triggerAutoSave(editor.getHTML());
    },
  });

  // Auto Save Debounce
  let saveTimer: NodeJS.Timeout | undefined;
  const triggerAutoSave = (htmlContent: string) => {
    setSaveStatus("saving");
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      try {
        if (chapterId) {
          await fetch(`/api/chapters/${chapterId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: htmlContent,
              title: chapterTitle,
              status: chapterStatus,
            }),
          });
        }
        setSaveStatus("saved");
      } catch {
        setSaveStatus("unsaved");
      }
    }, 1500);
  };

  // Load current user + chapter
  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((res) => res.json()),
      fetch(`/api/projects/${projectId}`).then((res) => res.json()),
    ])
      .then(([userRes, projectRes]) => {
        setCurrentUser(userRes.user || null);

        const proj = projectRes.project;
        const ch = proj?.chapters?.[0];
        if (ch) {
          setChapterId(ch.id);
          setChapterTitle(ch.title);
          setChapterStatus(ch.status || "DRAFT");
          if (editor && ch.content) {
            editor.commands.setContent(ch.content);
          }
          // Load versions + comments for this chapter
          Promise.all([
            fetch(`/api/chapters/${ch.id}/versions`).then((r) => r.json()),
            fetch(`/api/chapters/${ch.id}/comments`).then((r) => r.json()),
          ]).then(([verRes, comRes]) => {
            setVersions(verRes.versions || []);
            setComments(comRes.comments || []);
          });
        }
        setChapterLoaded(true);
      })
      .catch((err) => {
        console.error(err);
        setChapterLoaded(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, editor]);

  const textContent = editor?.getText() || "";
  const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
  const charCount = textContent.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !chapterId) return;
    try {
      const res = await fetch(`/api/chapters/${chapterId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment, selectedText: "" }),
      });
      const data = await res.json();
      if (res.ok && data.comment) {
        setComments([data.comment, ...comments]);
        setNewComment("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-100">
      {/* Editor Top Bar Controls */}
      <div className="canva-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 sticky top-20 z-20 bg-[#0f172a] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <input
            type="text"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            placeholder="Judul Bab..."
            className="bg-transparent font-bold text-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-b border-purple-500 w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={chapterStatus}
            onChange={(e) => {
              setChapterStatus(e.target.value);
              triggerAutoSave(editor?.getHTML() || "");
            }}
            className="bg-slate-900 border border-slate-700 text-xs font-bold text-purple-400 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="DRAFT">Draft</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <div className="text-xs text-slate-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 font-semibold">
            {saveStatus === "saved" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            {saveStatus === "saving" && <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />}
            {saveStatus === "unsaved" && <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
            <span className="capitalize">{saveStatus}</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <button
            onClick={() => {
              setShowHistory(!showHistory);
              setShowComments(false);
            }}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
              showHistory
                ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-900/40"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <History className="w-4 h-4" /> History
          </button>

          <button
            onClick={() => {
              setShowComments(!showComments);
              setShowHistory(false);
            }}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
              showComments
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-900/40"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Comments ({comments.filter((c) => !c.resolved).length})
          </button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      {editor && (
        <div className="canva-card px-4 py-2.5 rounded-xl flex items-center gap-1 flex-wrap bg-[#0f172a] border border-slate-800">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
              editor.isActive("bold") ? "bg-purple-600 text-white hover:bg-purple-700" : ""
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
              editor.isActive("italic") ? "bg-purple-600 text-white hover:bg-purple-700" : ""
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-800 mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
              editor.isActive("heading", { level: 1 }) ? "bg-purple-600 text-white hover:bg-purple-700" : ""
            }`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
              editor.isActive("heading", { level: 2 }) ? "bg-purple-600 text-white hover:bg-purple-700" : ""
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-800 mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
              editor.isActive("bulletList") ? "bg-purple-600 text-white hover:bg-purple-700" : ""
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
              editor.isActive("blockquote") ? "bg-purple-600 text-white hover:bg-purple-700" : ""
            }`}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-800 mx-1" />
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className={`space-y-4 ${showHistory || showComments ? "lg:col-span-3" : "lg:col-span-4"}`}>
          {!chapterId && chapterLoaded ? (
            <div className="canva-card p-12 rounded-3xl text-center text-slate-400 bg-[#0f172a] border border-slate-800">
              <p className="font-semibold text-white">Proyek ini belum memiliki bab.</p>
              <p className="text-xs mt-1">Buat bab baru di halaman Chapters untuk mulai menulis.</p>
            </div>
          ) : (
            <>
              <div className="canva-card p-8 md:p-12 rounded-3xl shadow-xl min-h-[500px] bg-[#0f172a] border border-slate-800">
                <EditorContent editor={editor} className="prose-editor-dark focus:outline-none min-h-[400px]" />
              </div>

              <div className="canva-card px-6 py-3 rounded-2xl flex flex-wrap items-center justify-between text-xs text-slate-400 font-medium bg-[#0f172a] border border-slate-800">
                <div className="flex items-center gap-6">
                  <span>
                    Kata: <strong className="text-white">{wordCount.toLocaleString()}</strong>
                  </span>
                  <span>
                    Karakter: <strong className="text-white">{charCount.toLocaleString()}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-400" /> Waktu baca:{" "}
                    <strong className="text-white">~{readingTimeMinutes} mnt</strong>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Version History Drawer */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 canva-card p-5 rounded-2xl space-y-4 bg-[#0f172a] border border-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-purple-400" /> Riwayat Versi
              </h3>
              <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {versions.length === 0 ? (
                <div className="text-xs text-slate-400 italic text-center py-6">
                  Belum ada versi tersimpan.
                  <p className="mt-1">Versi akan otomatis dibuat saat Anda menyimpan perubahan.</p>
                </div>
              ) : (
                versions.map((vh) => (
                  <div key={vh.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-purple-400">v{vh.version}</span>
                      <span className="text-slate-500 text-[10px]">{timeAgo(vh.createdAt)}</span>
                    </div>
                    <div className="text-slate-200 font-semibold">
                      {vh.wordCount?.toLocaleString() || 0} kata
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(vh.createdAt).toLocaleString("id-ID")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Comments Sidebar Drawer */}
        {showComments && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 canva-card p-5 rounded-2xl space-y-4 bg-[#0f172a] border border-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" /> Komentar
              </h3>
              <button onClick={() => setShowComments(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <div className="text-xs text-slate-400 italic text-center py-6">
                  Belum ada komentar.
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
                    {c.selectedText && (
                      <div className="text-[11px] italic text-purple-300 bg-purple-950/60 p-1.5 rounded border border-purple-800/40">
                        "{c.selectedText}"
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {c.user?.name?.charAt(0).toUpperCase() || <User className="w-3 h-3" />}
                      </div>
                      <div className="font-bold text-white">{c.user?.name}</div>
                    </div>
                    <p className="text-slate-300">{c.content}</p>
                    <div className="text-[10px] text-slate-500">{timeAgo(c.createdAt)}</div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="pt-2 border-t border-slate-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={currentUser ? "Tambah komentar..." : "Login dulu untuk komentar"}
                  disabled={!currentUser || !chapterId}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || !chapterId}
                  className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold disabled:opacity-50 shadow-md shadow-purple-900/40"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}