"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Mail, Compass, LogOut } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-[#090d16] text-white p-8 radial-bg">
      <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"}
            alt="Avatar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">{user?.name || "Sarah Vance"}</h1>
            <p className="text-xs text-slate-400">{user?.email || "sarah@novel.app"}</p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex gap-4">
          <Link
            href="/domains"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2"
          >
            <Compass className="w-4 h-4" /> Go to Domains
          </Link>
        </div>
      </div>
    </div>
  );
}
