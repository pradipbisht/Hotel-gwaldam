"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  BedDouble,
  CalendarCheck2,
  Users,
  Settings,
  LogOut,
  Home,
  ExternalLink,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { AUTH_ROUTES } from "@/lib/auth/constant";
import { Logo } from "@/components/brand/logo";
import { BRAND } from "@/lib/brand";

const mainMenu = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Hotels", href: "/admin/hotels", icon: Building2 },
  { title: "Rooms", href: "/admin/rooms", icon: BedDouble },
  { title: "Bookings", href: "/admin/bookings", icon: CalendarCheck2 },
];

const manageMenu = [
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  async function onLogout() {
    await authClient.signOut();
    queryClient.clear();
    router.push(AUTH_ROUTES.login);
    router.refresh();
  }

  function NavLink({
    href,
    title,
    icon: Icon,
  }: {
    href: string;
    title: string;
    icon: typeof Home;
  }) {
    const active =
      href === "/admin"
        ? pathname === "/admin"
        : pathname === href || pathname.startsWith(`${href}/`);

    return (
      <Link
        href={href}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
          active
            ? "bg-gradient-to-r from-amber-500/20 to-amber-600/5 text-amber-50 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.28)]"
            : "text-stone-400 hover:bg-white/[0.04] hover:text-stone-100",
        )}
      >
        <Icon
          size={18}
          strokeWidth={1.75}
          className={cn(
            active ? "text-amber-300" : "text-stone-500 group-hover:text-stone-400",
          )}
        />
        {title}
      </Link>
    );
  }

  return (
    <aside className="fixed top-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-white/[0.06] bg-gradient-to-b from-stone-950 via-stone-950 to-stone-900/90 text-stone-100">
      <div className="flex h-[4.5rem] items-center border-b border-white/[0.06] px-5">
        <Logo size="md" />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.18em] text-stone-600 uppercase">
          Overview
        </p>
        <nav className="space-y-0.5">
          {mainMenu.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <p className="mt-7 mb-2 px-3 text-[10px] font-semibold tracking-[0.18em] text-stone-600 uppercase">
          Manage
        </p>
        <nav className="space-y-0.5">
          {manageMenu.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <p className="mt-7 mb-2 px-3 text-[10px] font-semibold tracking-[0.18em] text-stone-600 uppercase">
          Site
        </p>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-400 transition hover:bg-white/[0.04] hover:text-amber-200"
        >
          <Home size={18} strokeWidth={1.75} className="text-amber-400" />
          View website
          <ExternalLink size={12} className="ml-auto text-stone-600" />
        </Link>
      </div>

      <div className="border-t border-white/[0.06] p-3">
        <p className="mb-2 px-3 text-[10px] text-stone-600">{BRAND.name} CMS</p>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={18} strokeWidth={1.75} />
          Log out
        </button>
      </div>
    </aside>
  );
}
