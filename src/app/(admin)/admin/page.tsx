import Link from "next/link";
import {
  Building2,
  BedDouble,
  CalendarCheck2,
  Users,
  ArrowUpRight,
  Home,
  Mountain,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { getServerSession } from "@/lib/auth/session";
import { BRAND } from "@/lib/brand";

const sections = [
  {
    title: "Inventory",
    description: "Properties and room stock",
    items: [
      {
        title: "Hotels",
        description: "Properties & visibility",
        href: "/admin/hotels",
        icon: Building2,
      },
      {
        title: "Rooms",
        description: "Tiers, capacity & pricing",
        href: "/admin/rooms",
        icon: BedDouble,
      },
    ],
  },
  {
    title: "Operations",
    description: "Guests and reservations",
    items: [
      {
        title: "Bookings",
        description: "Reservations & cancellations",
        href: "/admin/bookings",
        icon: CalendarCheck2,
      },
      {
        title: "Users",
        description: "Guests & staff accounts",
        href: "/admin/users",
        icon: Users,
      },
    ],
  },
];

export default async function AdminPage() {
  const session = await getServerSession();
  const user = session!.user;
  const first = user.name?.split(" ")[0] || "Admin";

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-gradient-to-br from-stone-900/90 via-[#12100e] to-amber-950/20 p-8 sm:p-10">
        <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-amber-600/5 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.2em] text-amber-400/90 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              {BRAND.name} · Staff
            </p>
            <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-white sm:text-4xl">
              Welcome back, {first}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-stone-400">
              Signed in as{" "}
              <span className="text-stone-200">{user.email}</span>. Manage
              hotels, rooms, and bookings for {BRAND.location}.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 text-sm font-medium text-stone-100 transition hover:border-amber-500/30 hover:bg-white/[0.07]"
          >
            <Home size={16} className="text-amber-400" />
            Open website
          </Link>
        </div>

        <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Location", value: BRAND.location, icon: Mountain },
            { label: "Status", value: "Operational", icon: TrendingUp },
            { label: "Currency", value: "INR (₹)", icon: Sparkles },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3.5 backdrop-blur-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
                  <Icon size={17} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-stone-500 uppercase">
                    {s.label}
                  </p>
                  <p className="text-sm font-medium text-white">{s.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {sections.map((section) => (
        <section key={section.title} className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-white">
              {section.title}
            </h2>
            <p className="mt-0.5 text-sm text-stone-500">{section.description}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-amber-500/25 hover:bg-white/[0.04]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-amber-500/10 text-amber-300">
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-semibold text-white">
                        {item.title}
                      </h3>
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 text-stone-600 transition group-hover:text-amber-400"
                      />
                    </div>
                    <p className="mt-0.5 text-sm text-stone-500">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
