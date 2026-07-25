"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Home,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  User,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { AUTH_ROUTES } from "@/lib/auth/constant";
import { cn } from "@/lib/utils";

interface AdminNavbarProps {
  userName?: string | null;
  userEmail?: string | null;
}

export function AdminNavbar({
  userName = "Admin",
  userEmail = "admin@example.com",
}: AdminNavbarProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const initial = (userName || userEmail || "A").charAt(0).toUpperCase();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  async function onLogout() {
    setOpen(false);
    await authClient.signOut();
    queryClient.clear();
    router.push(AUTH_ROUTES.login);
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-[4.5rem] items-center justify-between gap-4 border-b border-white/[0.06] bg-stone-950/85 px-5 backdrop-blur-xl sm:px-8">
      <div className="relative w-full max-w-sm">
        <Search
          className="absolute top-1/2 left-3.5 -translate-y-1/2 text-stone-500"
          size={16}
          strokeWidth={1.75}
        />
        <input
          type="text"
          placeholder="Search…"
          className="h-10 w-full rounded-full border border-white/10 bg-white/[0.04] pr-4 pl-10 text-sm text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/15"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {/* Direct link to public home */}
        <Link
          href="/"
          className="hidden h-10 items-center gap-2 rounded-full border border-white/10 px-3.5 text-xs font-medium text-stone-300 transition hover:border-amber-500/30 hover:bg-white/5 hover:text-white sm:flex"
        >
          <Home size={15} className="text-amber-400" strokeWidth={1.75} />
          Home page
        </Link>

        <Link
          href="/admin/hotels"
          className="flex h-10 items-center gap-2 rounded-full bg-amber-500 px-3.5 text-xs font-semibold text-stone-950 transition hover:bg-amber-400"
        >
          <Plus size={16} strokeWidth={2} />
          <span className="hidden sm:inline">New hotel</span>
        </Link>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-stone-400 transition hover:bg-white/5 hover:text-white"
          aria-label="Notifications"
        >
          <Bell size={17} strokeWidth={1.75} />
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "flex items-center gap-2 rounded-full border py-1 pr-2.5 pl-1 transition",
              open
                ? "border-amber-500/40 bg-white/5"
                : "border-white/10 hover:bg-white/5",
            )}
            aria-expanded={open}
            aria-haspopup="menu"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-700 text-xs font-bold text-white">
              {initial}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-semibold leading-tight text-white">
                {userName || "Admin"}
              </p>
              <p className="max-w-[8rem] truncate text-[10px] text-stone-500">
                {userEmail}
              </p>
            </div>
            <ChevronDown
              size={14}
              className={cn(
                "text-stone-500 transition",
                open && "rotate-180 text-amber-300",
              )}
            />
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-stone-950/95 py-1.5 shadow-2xl backdrop-blur-xl"
            >
              <div className="border-b border-white/[0.06] px-3.5 py-2.5">
                <p className="truncate text-sm font-semibold text-white">
                  {userName}
                </p>
                <p className="truncate text-xs text-stone-500">{userEmail}</p>
                <p className="mt-1 text-[10px] font-semibold tracking-wider text-amber-400/90 uppercase">
                  Admin
                </p>
              </div>

              <Link
                href="/"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-stone-300 transition hover:bg-white/5 hover:text-white"
              >
                <Home size={16} className="text-amber-400" strokeWidth={1.75} />
                View home page
              </Link>
              <Link
                href="/admin"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-stone-300 transition hover:bg-white/5 hover:text-white"
              >
                <LayoutDashboard
                  size={16}
                  className="text-stone-500"
                  strokeWidth={1.75}
                />
                Admin dashboard
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-stone-300 transition hover:bg-white/5 hover:text-white"
              >
                <User size={16} className="text-stone-500" strokeWidth={1.75} />
                Profile
              </button>

              <div className="my-1 border-t border-white/[0.06]" />

              <button
                type="button"
                role="menuitem"
                onClick={onLogout}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut size={16} strokeWidth={1.75} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
