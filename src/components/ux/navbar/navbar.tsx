"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarCheck, Menu, X, ShieldCheck } from "lucide-react";
import { AUTH_ROUTES } from "@/lib/auth/constant";
import { BRAND } from "@/lib/brand";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

export interface NavbarProps {
  showAdminLink?: boolean;
  userLabel?: string | null;
  onScrollToSection?: (id: string) => void;
  currentCurrency?: unknown;
  onCurrencyChange?: unknown;
  savedCount?: number;
  bookingsCount?: number;
  onOpenSaved?: () => void;
  onOpenBookings?: () => void;
  onOpenAdmin?: () => void;
  onOpenChatbot?: () => void;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (window.location.pathname !== "/") {
    window.location.href = `/#${id}`;
  }
}

const NAV_ITEMS: { label: string; href?: string; sectionId?: string }[] = [
  { label: "Hotels", href: "/hotels" },
  { label: "Rooms", sectionId: "rooms" },
  { label: "Dining", sectionId: "dining-and-spa" },
  { label: "Guide", sectionId: "mussoorie-guide" },
];

/**
 * Light-first public navbar.
 * On homepage at top of hero: transparent + light text.
 * Scrolled or other pages: solid white bar + dark text.
 */
export const Navbar: React.FC<NavbarProps> = ({
  showAdminLink = false,
  userLabel,
  onScrollToSection,
  onOpenBookings,
  onOpenAdmin,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === "/";
  /** Dark chrome only when floating over the home hero */
  const overHero = isHome && !isScrolled && !mobileOpen;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const goSection = (id: string) => {
    if (onScrollToSection) onScrollToSection(id);
    else scrollToId(id);
    setMobileOpen(false);
  };

  const goBookings = () => {
    if (onOpenBookings) onOpenBookings();
    else if (userLabel) router.push("/bookings");
    else router.push(`${AUTH_ROUTES.login}?next=/bookings`);
    setMobileOpen(false);
  };

  const goAdmin = () => {
    if (onOpenAdmin) onOpenAdmin();
    else router.push(AUTH_ROUTES.admin);
    setMobileOpen(false);
  };

  const goHome = () => {
    if (pathname === "/") goSection("hero-carousel-section");
    else router.push("/");
    setMobileOpen(false);
  };

  const linkClass = (active?: boolean) =>
    cn(
      "rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
      overHero
        ? active
          ? "bg-white/15 text-white"
          : "text-stone-200 hover:bg-white/10 hover:text-white"
        : active
          ? "bg-stone-100 text-stone-900"
          : "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
    );

  return (
    <header
      id="main-navbar"
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        overHero
          ? "border-b border-transparent bg-gradient-to-b from-stone-950/70 to-transparent"
          : "border-b border-stone-200/80 bg-white/90 shadow-sm shadow-stone-200/40 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:h-[4.25rem] sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={goHome}
          className="shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40"
          aria-label={BRAND.name}
        >
          <Logo size="md" light={!overHero} />
        </button>

        <nav
          className="mx-2 hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex"
          aria-label="Primary"
        >
          {NAV_ITEMS.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className={linkClass(pathname.startsWith(item.href))}
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                type="button"
                onClick={() => goSection(item.sectionId!)}
                className={linkClass()}
              >
                {item.label}
              </button>
            ),
          )}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {showAdminLink && (
            <button
              type="button"
              onClick={goAdmin}
              className={cn(
                "hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition sm:inline-flex",
                overHero
                  ? "border-amber-400/30 bg-amber-500/15 text-amber-100 hover:bg-amber-500/25"
                  : "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100",
              )}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin
            </button>
          )}

          <button
            type="button"
            onClick={goBookings}
            className="hidden items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-500 sm:inline-flex"
          >
            <CalendarCheck className="h-3.5 w-3.5" />
            Bookings
          </button>

          {userLabel ? (
            <Link
              href={showAdminLink ? AUTH_ROUTES.admin : AUTH_ROUTES.dashboard}
              className={cn(
                "hidden max-w-[9rem] truncate rounded-lg border px-3 py-2 text-xs font-medium transition md:inline-block",
                overHero
                  ? "border-white/20 text-stone-100 hover:bg-white/10"
                  : "border-stone-200 text-stone-700 hover:bg-stone-50",
              )}
              title={userLabel}
            >
              {userLabel.split(" ")[0]}
            </Link>
          ) : (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Link
                href={AUTH_ROUTES.login}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs font-semibold transition",
                  overHero
                    ? "text-stone-100 hover:bg-white/10"
                    : "text-stone-700 hover:bg-stone-100",
                )}
              >
                Sign in
              </Link>
              <Link
                href={AUTH_ROUTES.register}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs font-semibold transition",
                  overHero
                    ? "border-white/25 text-white hover:bg-white/10"
                    : "border-stone-300 text-stone-800 hover:bg-stone-50",
                )}
              >
                Register
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-lg border transition lg:hidden",
              overHero
                ? "border-white/20 text-white hover:bg-white/10"
                : "border-stone-200 text-stone-800 hover:bg-stone-50",
            )}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-stone-200 bg-white px-4 py-4 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-0.5" aria-label="Mobile">
            {NAV_ITEMS.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => goSection(item.sectionId!)}
                  className="rounded-xl px-3 py-3 text-left text-sm font-medium text-stone-700 hover:bg-stone-50"
                >
                  {item.label}
                </button>
              ),
            )}
          </nav>

          <div className="mt-3 space-y-2 border-t border-stone-100 pt-3">
            <button
              type="button"
              onClick={goBookings}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-2.5 text-sm font-semibold text-white"
            >
              <CalendarCheck className="h-4 w-4" />
              Bookings
            </button>
            {showAdminLink && (
              <button
                type="button"
                onClick={goAdmin}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 py-2.5 text-sm font-semibold text-amber-900"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin panel
              </button>
            )}
            {userLabel ? (
              <Link
                href={showAdminLink ? AUTH_ROUTES.admin : AUTH_ROUTES.dashboard}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl border border-stone-200 py-2.5 text-center text-sm font-medium text-stone-700"
              >
                Account · {userLabel.split(" ")[0]}
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={AUTH_ROUTES.login}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-stone-200 py-2.5 text-center text-sm font-semibold text-stone-800"
                >
                  Sign in
                </Link>
                <Link
                  href={AUTH_ROUTES.register}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-stone-900 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
