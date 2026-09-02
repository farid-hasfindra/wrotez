"use client";

import { useState, use } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const navGroups = [
    {
      group: "UTAMA",
      items: [
        { label: "Overview", href: `/novel/${projectId}/overview`, icon: LayoutDashboard },
      ],
    },
    {
      group: "PENULISAN",
      items: [
        { label: "Bab Novel", href: `/novel/${projectId}/chapters`, icon: BookOpen },
        { label: "Editor", href: `/novel/${projectId}/editor`, icon: Edit3 },
      ],
    },
    {
      group: "CERITA",
      items: [
        { label: "Karakter", href: `/novel/${projectId}/characters`, icon: Users },
        { label: "Worldbuilding", href: `/novel/${projectId}/worldbuilding`, icon: MapPin },
        { label: "Timeline", href: `/novel/${projectId}/timeline`, icon: Clock },
        { label: "Plot", href: `/novel/${projectId}/plot`, icon: Network },
      ],
    },
    {
      group: "INTELLIGENCE",
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white border-r border-slate-200 flex flex-col justify-between z-40 relative shrink-0 shadow-sm"
      >
        <div>
          {/* Header Branding */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between h-16">
            {!collapsed && (
              <Link href="/domains" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-purple-200 text-sm">
                  B
                </div>
                <span className="font-extrabold text-base text-slate-900">
                  Breemous
                </span>
              </Link>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors mx-auto"
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
                  <div className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2">
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
                            ? "bg-purple-100 text-purple-700 shadow-sm"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        <IconComp className={`w-4 h-4 shrink-0 ${isActive ? "text-purple-700" : "text-slate-400 group-hover:text-purple-600"}`} />
                        {!collapsed && <span>{item.label}</span>}
                        {collapsed && (
                          <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
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
        <div className="p-3 border-t border-slate-100">
          <Link
            href="/domains"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
          >
            <Compass className="w-4 h-4 text-purple-600" />
            {!collapsed && <span>Pilih Domain</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400">Workspace /</span>
            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-100">Bidang: Novel</span>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-sm font-bold text-slate-900">The Last Kingdom of Arken</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
              Live Sync
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                alt="Sarah"
                className="w-7 h-7 rounded-full border-2 border-white object-cover"
                title="Sarah Vance (Owner)"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                alt="Daniel"
                className="w-7 h-7 rounded-full border-2 border-white object-cover"
                title="Daniel Sterling (Co-Author)"
              />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
                alt="Andi"
                className="w-7 h-7 rounded-full border-2 border-white object-cover"
                title="Andi Pratama (Co-Author)"
              />
            </div>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full border border-purple-100 text-purple-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Story Brain Aktif</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
