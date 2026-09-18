"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Edit3,
  Users,
  Brain,
  GitBranch,
  Network,
  Clock,
  Sparkles,
  MapPin,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Compass,
  Zap,
} from "lucide-react";

export default function NovelWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.project) setProject(data.project);
      })
      .catch((err) => console.error(err));

    fetch(`/api/projects/${projectId}/team`)
      .then((res) => res.json())
      .then((data) => {
        setMembers(data.members || []);
      })
      .catch((err) => console.error(err));
  }, [projectId]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const navGroups = [
    {
      group: "UTAMA",
      items: [
        { label: "Ringkasan", href: `/novel/${projectId}/overview`, icon: LayoutDashboard },
      ],
    },
    {
      group: "PENULISAN",
      items: [
        { label: "Bab Novel", href: `/novel/${projectId}/chapters`, icon: BookOpen },
        { label: "Editor Teks", href: `/novel/${projectId}/editor`, icon: Edit3 },
      ],
    },
    {
      group: "CERITA",
      items: [
        { label: "Karakter", href: `/novel/${projectId}/characters`, icon: Users },
        { label: "Wiki Dunia", href: `/novel/${projectId}/worldbuilding`, icon: MapPin },
        { label: "Linimasa", href: `/novel/${projectId}/timeline`, icon: Clock },
        { label: "Alur Cerita", href: `/novel/${projectId}/plot`, icon: Network },
      ],
    },
    {
      group: "KECERDASAN BUATAN",
      items: [
        { label: "Ide", href: `/novel/${projectId}/ideas`, icon: GitBranch },
        { label: "Kontribusi", href: `/novel/${projectId}/contribution`, icon: Zap },
        { label: "Story Brain", href: `/novel/${projectId}/intelligence`, icon: Brain },
      ],
    },
    {
      group: "MANAJEMEN",
      items: [
        { label: "Tim", href: `/novel/${projectId}/team`, icon: Users },
        { label: "Pengaturan", href: `/novel/${projectId}/settings`, icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#0c101d] border-r border-slate-800/80 flex flex-col justify-between z-40 relative shrink-0 shadow-lg"
      >
        <div>
          {/* Header Branding */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between h-16">
            {!collapsed && (
              <Link href="/domains" className="flex items-center gap-3">
                <img src="/logo-wreetfy.png" alt="Wreetfy Logo" className="h-8 w-auto object-contain drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                <span className="font-extrabold text-base text-white">
                  Wreetfy
                </span>
              </Link>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mx-auto"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navGroups.map((group, idx) => (
              <div key={idx}>
                {!collapsed && (
                  <div className="px-3 text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-2">
                    {group.group}
                  </div>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    const IconComp = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all relative group ${
                          isActive
                            ? "bg-purple-950/70 text-purple-300 font-bold border border-purple-800/40 shadow-sm"
                            : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                        }`}
                      >
                        <IconComp className={`w-4 h-4 shrink-0 ${isActive ? "text-purple-400" : "text-slate-500 group-hover:text-purple-400"}`} />
                        {!collapsed && <span>{item.label}</span>}
                        {collapsed && (
                          <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 border border-slate-700 text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            {item.label}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer / Back to Domains */}
        <div className="p-3 border-t border-slate-800/80">
          <Link
            href="/domains"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-purple-300 hover:bg-purple-950/40 transition-colors"
          >
            <Compass className="w-4 h-4 text-purple-400" />
            {!collapsed && <span>Pilih Domain</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#090d16]">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0c101d]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xs font-medium text-slate-500 shrink-0">Ruang Kerja /</span>
            <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 text-[10px] font-bold border border-purple-800/40 shrink-0">
              Bidang: {project?.genre || "Novel"}
            </span>
            <span className="text-xs text-slate-600 shrink-0">/</span>
            <span className="text-sm font-bold text-white truncate">
              {project?.title || "Memuat..."}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 text-[10px] font-bold shrink-0">
              Sinkron Langsung
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex -space-x-2">
              {members.length > 0 ? (
                members.slice(0, 4).map((m) => (
                  <img
                    key={m.id}
                    src={m.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(m.user?.name || "")}`}
                    alt={m.user?.name}
                    className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover"
                    title={`${m.user?.name} (${m.role})`}
                  />
                ))
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-900" />
              )}
            </div>

            <div className="h-4 w-px bg-slate-800" />

            <div className="flex items-center gap-2 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800/40 text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>Story Brain Aktif</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 bg-[#090d16]">{children}</main>
      </div>
    </div>
  );
}