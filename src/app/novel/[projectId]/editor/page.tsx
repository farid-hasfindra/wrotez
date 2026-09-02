"use client";

import { useEffect, useState, use } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  Quote,
  Undo,
  Redo,
  Save,
  Clock,
  History,
  MessageSquare,
  Users,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
} from "lucide-react";

export default function NovelEditorPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [chapterId, setChapterId] = useState<string>("");
  const [chapterTitle, setChapterTitle] = useState("Chapter 1: The Whispering Towers");
  const [chapterStatus, setChapterStatus] = useState("COMPLETED");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [showHistory, setShowHistory] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Initial Content for Tiptap
  const initialContent = `<p>The wind over the Citadel of Arken did not merely blow; it whispered in ancient dialects forgotten by mortal men. High Commander Marcus stood upon the obsidian ramparts, his gloved fingers tracing the sigils carved into the basalt guardrail. Below him, cloudbanks stretched like a silver ocean under the twin moons of Aethelgard.</p><p>"They say the Sun Altar stirs tonight," a quiet voice spoke from the shadow of the archway. Elena stepped into the moonlight, her dark cape shimmering with enchanted starlight thread.</p><p>Marcus did not turn. "The Altar has slept for three centuries, Elena. What makes tonight any different?"</p><p>"The bloodline," she replied softly. "Someone opened the Vault of Arken."</p>`;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Placeholder.configure({
        placeholder: "Write your novel chapter here...",
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      setSaveStatus("unsaved");
      triggerAutoSave(editor.getHTML());
    },
  });

  // Auto Save Debounce
  let saveTimer: NodeJS.Timeout;
  const triggerAutoSave = (htmlContent: string) => {
    setSaveStatus("saving");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      try {
        if (chapterId) {
          await fetch(`/api/chapters/${chapterId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: htmlContent, title: chapterTitle, status: chapterStatus }),
          });
        }
        setSaveStatus("saved");
      } catch {
        setSaveStatus("unsaved");
      }
    }, 1500);
  };

  useEffect(() => {
    fetch(`/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        const proj = data.projects?.find((p: any) => p.id === projectId) || data.projects?.[0];
        const ch = proj?.chapters?.[0];
        if (ch) {
          setChapterId(ch.id);
          setChapterTitle(ch.title);
          setChapterStatus(ch.status || "COMPLETED");
          if (editor && ch.content) {
            editor.commands.setContent(ch.content);
          }
        }
      });
  }, [projectId, editor]);

  // Word count & reading time calculation
  const textContent = editor?.getText() || "";
  const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
  const charCount = textContent.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Sample version history diffs
  const versionHistory = [
    {
      version: 3,
      user: "Sarah Vance",
      time: "10 mins ago",
      diff: "+ Added Elena's starlight cape dialogue & vault reference.",
      words: 3850,
    },
    {
      version: 2,
      user: "Daniel Sterling",
      time: "2 hours ago",
      diff: "- Removed redundant rampart description.\n+ Expanded Marcus's opening internal monologue.",
      words: 3720,
    },
    {
      version: 1,
      user: "Andi Pratama",
      time: "Yesterday",
      diff: "Initial chapter draft created.",
      words: 3100,
    },
  ];

  // Comments state
  const [comments, setComments] = useState([
    {
      id: "1",
      user: "Daniel Sterling",
      text: "@Sarah Should we introduce the Sunstone earlier in this paragraph?",
      selectedText: "The Altar has slept for three centuries",
      resolved: false,
    },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: Date.now().toString(),
        user: "Sarah Vance",
        text: newComment,
        selectedText: "Vault of Arken",
        resolved: false,
      },
    ]);
    setNewComment("");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Editor Top Bar Controls */}
      <div className="canva-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 sticky top-20 z-20">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <input
            type="text"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            className="bg-transparent font-bold text-xl text-slate-900 focus:outline-none focus:border-b border-purple-600 w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Chapter Status */}
          <select
            value={chapterStatus}
            onChange={(e) => {
              setChapterStatus(e.target.value);
              triggerAutoSave(editor?.getHTML() || "");
            }}
            className="bg-slate-50 border border-slate-200 text-xs font-bold text-purple-700 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="DRAFT">Draft</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* Save Status Badge */}
          <div className="text-xs text-slate-600 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-semibold">
            {saveStatus === "saved" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            {saveStatus === "saving" && <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-spin" />}
            {saveStatus === "unsaved" && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
            <span className="capitalize">{saveStatus}</span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* History Drawer Toggle */}
          <button
            onClick={() => {
              setShowHistory(!showHistory);
              setShowComments(false);
            }}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
              showHistory
                ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:text-purple-700 hover:bg-purple-50"
            }`}
          >
            <History className="w-4 h-4" /> History
          </button>

          {/* Comments Toggle */}
          <button
            onClick={() => {
              setShowComments(!showComments);
              setShowHistory(false);
            }}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
              showComments
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Comments ({comments.filter((c) => !c.resolved).length})
          </button>
        </div>
      </div>

      {/* Editor Formatting Toolbar */}
      {editor && (
        <div className="canva-card px-4 py-2.5 rounded-xl flex items-center gap-1 flex-wrap">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-lg text-slate-600 hover:text-purple-700 hover:bg-purple-50 ${
              editor.isActive("bold") ? "bg-purple-600 text-white hover:bg-purple-700" : ""
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-lg text-slate-600 hover:text-purple-700 hover:bg-purple-50 ${
              editor.isActive("italic") ? "bg-purple-600 text-white hover:bg-purple-700" : ""
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded-lg text-slate-600 hover:text-purple-700 hover:bg-purple-50 ${
              editor.isActive("heading", { level: 1 }) ? "bg-purple-600 text-white hover:bg-purple-700" : ""
            }`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded-lg text-slate-600 hover:text-purple-700 hover:bg-purple-50 ${
              editor.isActive("heading", { level: 2 }) ? "bg-purple-600 text-white hover:bg-purple-700" : ""
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-lg text-slate-600 hover:text-purple-700 hover:bg-purple-50 ${
              editor.isActive("bulletList") ? "bg-purple-600 text-white hover:bg-purple-700" : ""
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded-lg text-slate-600 hover:text-purple-700 hover:bg-purple-50 ${
              editor.isActive("blockquote") ? "bg-purple-600 text-white hover:bg-purple-700" : ""
            }`}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 rounded-lg text-slate-600 hover:text-purple-700 hover:bg-purple-50"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 rounded-lg text-slate-600 hover:text-purple-700 hover:bg-purple-50"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor Body Grid & Drawers */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Main Text Editor Workspace */}
        <div className={`space-y-4 ${showHistory || showComments ? "lg:col-span-3" : "lg:col-span-4"}`}>
          {/* Realtime Collaborator Presence Banner */}
          <div className="canva-card px-4 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-purple-700">Sarah Vance</span> sedang menulis paragraf 3...
            </div>
            <div className="text-slate-400">Workspace Realtime Sinkron</div>
          </div>

          <div className="canva-card p-8 md:p-12 rounded-3xl shadow-sm min-h-[500px]">
            <EditorContent editor={editor} className="prose-editor-light focus:outline-none min-h-[400px]" />
          </div>

          {/* Writing Stats Footer */}
          <div className="canva-card px-6 py-3 rounded-2xl flex flex-wrap items-center justify-between text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-6">
              <span>
                Kata: <strong className="text-slate-900">{wordCount.toLocaleString()}</strong>
              </span>
              <span>
                Karakter: <strong className="text-slate-900">{charCount.toLocaleString()}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-600" /> Waktu baca:{" "}
                <strong className="text-slate-900">~{readingTimeMinutes} mnt</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Version History Drawer */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 canva-card p-5 rounded-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-purple-600" /> Riwayat Versi
              </h3>
              <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {versionHistory.map((vh, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-purple-700">v{vh.version}</span>
                    <span className="text-slate-400 text-[10px]">{vh.time}</span>
                  </div>
                  <div className="text-slate-700 font-semibold">{vh.user}</div>
                  <div className="text-[11px] font-mono text-slate-600 bg-white p-2 rounded border border-slate-200 whitespace-pre-wrap">
                    {vh.diff}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Comments Sidebar Drawer */}
        {showComments && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 canva-card p-5 rounded-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" /> Komentar
              </h3>
              <button onClick={() => setShowComments(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {comments.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="text-[11px] italic text-purple-700 bg-purple-100 p-1.5 rounded border border-purple-200">
                    &quot;{c.selectedText}&quot;
                  </div>
                  <div className="font-bold text-slate-900">{c.user}</div>
                  <p className="text-slate-700">{c.text}</p>
                </div>
              ))}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="pt-2 border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tambah komentar (@mention)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                />
                <button type="submit" className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold">
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
