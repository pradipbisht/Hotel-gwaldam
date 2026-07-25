import Link from "next/link";
import {
  Flower2,
  Utensils,
  CheckCircle2,
  Clock,
  MapPin,
  Mountain,
  Star,
  Quote,
  Sparkles,
  BedDouble,
  Compass,
  Award,
} from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Logo } from "@/components/brand/logo";

const ROOM_TIERS = [
  {
    name: "Presidential Mountain Peak Suite",
    price: "₹22,000",
    guests: 4,
    blurb: "Panoramic ridgelines, private deck, butler-ready.",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Executive Himalayan Valley Suite",
    price: "₹15,000",
    guests: 4,
    blurb: "Valley glass, marble bath, Pahadi tea service.",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Deluxe Pine Garden Suite",
    price: "₹9,500",
    guests: 3,
    blurb: "Garden lawns, tea veranda, mountain breeze.",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Standard Alpine Pilgrim Room",
    price: "₹6,500",
    guests: 2,
    blurb: "Clean, cozy sanctuary for Yatra travelers.",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=85",
  },
];

const DINING_ITEMS = [
  {
    title: "Garhwali Sattvik Thali",
    desc: "Kafuli, Chainsoo, Jhangore Kheer & Gahat Daal in Desi Ghee",
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "No Onion / Garlic Option",
    desc: "Jain & pure Sattvik prep for Kedarnath & Badrinath pilgrims",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Early Morning Yatra Pack",
    desc: "Fruits, nuts & warm tea flasks from 4:30 AM",
    image:
      "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Organic Mountain Teas",
    desc: "Rhododendron tea, Tulsi elixir & local honey",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=85",
  },
];

const FOOD_HERO =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85";

const REVIEWS = [
  {
    author: "Pandit Rameshwar Sharma",
    place: "Varanasi · Devotee",
    suite: "Peak Suite",
    text: "The 100% Pure Sattvik food was divine. Himalayan views from our suite were breathtaking — perfect before Kedarnath.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    featured: true,
  },
  {
    author: "Smt. Sunita & Rajesh Gupta",
    place: "Ahmedabad · Family",
    suite: "Valley Suite",
    text: "Yatra desk help was seamless. Extremely peaceful mountain nights at Gwaldam.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    featured: false,
  },
  {
    author: "Vikram & Radhika Oberoi",
    place: "New Delhi · Couple",
    suite: "Pine Garden",
    text: "Evening mist over the peaks, Garhwali tea on the deck — sheer paradise.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    featured: false,
  },
  {
    author: "Ananya Mehta",
    place: "Mumbai · Solo",
    suite: "Alpine Room",
    text: "Spotless room, warm staff, and the thali after a long drive was exactly what I needed.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    featured: false,
  },
  {
    author: "Col. S. Rathore",
    place: "Jaipur · Couple",
    suite: "Ridge Cabin",
    text: "Quiet lodge nights, crisp air, and transparent ₹ billing. Will return every Yatra season.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    featured: false,
  },
];

export function HomeSections() {
  const featured = REVIEWS.find((r) => r.featured)!;
  const rest = REVIEWS.filter((r) => !r.featured);

  return (
    <>
      <section
        id="rooms"
        className="scroll-mt-28 border-t border-stone-200 bg-white px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="brand-chip-light mx-auto">
              <BedDouble className="h-3.5 w-3.5 text-amber-700" />
              4 signature mountain tiers
            </div>
            <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
              Stay above the clouds
            </h2>
            <p className="mt-3 text-sm text-stone-600 sm:text-base">
              From presidential peak suites to pilgrim-friendly alpine rooms —
              every stay includes Sattvik dining and Himalayan quiet.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROOM_TIERS.map((t) => (
              <article
                key={t.name}
                className="group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
              >
                <div className="relative h-40 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-stone-900 shadow-sm">
                    {t.price}
                    <span className="font-normal text-stone-500"> / night</span>
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold leading-snug text-stone-900">
                    {t.name}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-stone-500">
                    {t.blurb}
                  </p>
                  <p className="mt-2 text-[11px] text-stone-400">
                    Up to {t.guests} guests
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/hotels" className="brand-btn-primary-light">
              View live inventory
            </Link>
          </div>
        </div>
      </section>

      <section
        id="dining-and-spa"
        className="scroll-mt-28 border-t border-stone-200 bg-stone-50 px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="mx-auto max-w-3xl text-center">
            <div className="brand-chip-light mx-auto">
              <Flower2 className="h-3.5 w-3.5 text-amber-700" />
              100% Pure Sattvik · Pilgrim dining
            </div>
            <h2 className="mt-4 font-serif text-3xl font-medium text-stone-900 sm:text-4xl">
              Sattvik Garhwali pure veg dining
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Crafted for devotees and mountain travelers — organic ingredients,
              pure Desi Ghee, Jain (no onion/garlic) on request.
            </p>
          </div>

          <div className="relative h-52 overflow-hidden rounded-[2rem] border border-stone-200 shadow-sm sm:h-64">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FOOD_HERO}
              alt="Warm dining atmosphere"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/50 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold text-white">
                <Utensils className="h-3.5 w-3.5" />
                Pure vegetarian kitchen
              </div>
              <p className="mt-3 max-w-md font-serif text-xl text-white sm:text-2xl">
                Authentic Pahadi thali &amp; devotional meals
              </p>
              <p className="mt-1 flex items-center gap-2 text-xs font-medium text-amber-100">
                <Clock className="h-4 w-4" />
                Early Yatra breakfast 5:00–10:30 AM
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DINING_ITEMS.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:border-amber-300 hover:shadow-md"
              >
                <div className="relative h-36">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                    {item.title}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-stone-500">
                    {item.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="mussoorie-guide"
        className="scroll-mt-28 border-t border-stone-200 bg-white px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="brand-chip-light">
                <Compass className="h-3.5 w-3.5 text-amber-700" />
                Mountain guide
              </div>
              <h2 className="mt-4 font-serif text-3xl font-medium text-stone-900">
                {BRAND.location} · Garhwal Himalaya
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                Base yourself in Gwaldam for alpine trails, sunrise viewpoints,
                and Char Dham transit guidance. Our desk helps with helipad
                corridors and early departures.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-stone-700">
                {[
                  "Ridge walks & village paths",
                  "Yatra desk for Kedarnath / Badrinath corridors",
                  "Transparent ₹ billing — no hidden resort tricks",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-600" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-stone-200 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85"
                alt="Himalayan peaks near Gwaldam"
                className="h-64 w-full object-cover sm:h-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <Mountain className="h-8 w-8 text-amber-300" />
                <p className="mt-2 font-serif text-xl text-white">
                  Sacred hospitality, modern calm
                </p>
                <Link
                  href="/hotels"
                  className="brand-btn-primary-light mt-4 !text-xs"
                >
                  Reserve a room
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="map-view"
        className="scroll-mt-28 border-t border-stone-200 bg-stone-50 px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl text-center">
          <div className="brand-chip-light mx-auto">
            <MapPin className="h-3.5 w-3.5 text-amber-700" />
            Location
          </div>
          <h2 className="mt-4 font-serif text-3xl font-medium text-stone-900">
            Gwaldam, Uttarakhand
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-stone-600">
            High in the Garhwal Himalaya — Chamoli district. Live rooms and
            rates on Hotels.
          </p>
        </div>
      </section>

      <section
        id="testimonials"
        className="scroll-mt-28 border-t border-stone-200 bg-white px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="brand-chip-light mx-auto">
              <Quote className="h-3.5 w-3.5 text-amber-700" />
              Verified guest voices
            </div>
            <h2 className="mt-4 font-serif text-3xl font-medium text-stone-900 sm:text-4xl">
              Loved by pilgrims &amp; travelers
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <blockquote className="flex flex-col justify-between rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-50/50 p-6 shadow-sm md:col-span-2 md:row-span-2 sm:p-8">
              <div>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-100/80 px-3 py-1 text-xs font-bold text-amber-900">
                    <Award className="h-3.5 w-3.5" />
                    {featured.suite}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-amber-500 text-amber-500"
                      />
                    ))}
                  </div>
                </div>
                <p className="font-serif text-lg leading-relaxed text-stone-800 italic sm:text-xl">
                  “{featured.text}”
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3 border-t border-amber-100 pt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured.avatar}
                  alt={featured.author}
                  className="h-11 w-11 rounded-full border-2 border-amber-300 object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    {featured.author}
                  </p>
                  <p className="text-xs text-amber-800/80">{featured.place}</p>
                </div>
              </div>
            </blockquote>

            {rest.map((r) => (
              <blockquote
                key={r.author}
                className="flex flex-col justify-between rounded-3xl border border-stone-200 bg-stone-50/50 p-5 transition hover:border-amber-200 hover:bg-white hover:shadow-sm"
              >
                <div>
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-amber-500 text-amber-500"
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-stone-600 italic">
                    “{r.text}”
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2.5 border-t border-stone-200 pt-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.avatar}
                    alt={r.author}
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-stone-200"
                  />
                  <div>
                    <p className="text-xs font-semibold text-stone-900">
                      {r.author}
                    </p>
                    <p className="text-[10px] text-stone-500">{r.place}</p>
                  </div>
                </div>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-200 bg-stone-100 px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 border-b border-stone-200 pb-12 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-5">
              <Logo light size="lg" />
              <p className="max-w-sm text-sm font-light leading-relaxed text-stone-600">
                Himalayan hospitality at Gwaldam — 4 luxury room tiers, 100%
                Pure Sattvik dining, and Yatra-friendly support.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
              <div>
                <p className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                  Explore
                </p>
                <ul className="mt-3 space-y-2 text-sm text-stone-600">
                  <li>
                    <Link href="/hotels" className="hover:text-amber-800">
                      Hotels
                    </Link>
                  </li>
                  <li>
                    <a href="#rooms" className="hover:text-amber-800">
                      Room tiers
                    </a>
                  </li>
                  <li>
                    <a href="#dining-and-spa" className="hover:text-amber-800">
                      Dining
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                  Account
                </p>
                <ul className="mt-3 space-y-2 text-sm text-stone-600">
                  <li>
                    <Link href="/login" className="hover:text-amber-800">
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="hover:text-amber-800">
                      Register
                    </Link>
                  </li>
                  <li>
                    <Link href="/bookings" className="hover:text-amber-800">
                      My bookings
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                  Staff
                </p>
                <ul className="mt-3 space-y-2 text-sm text-stone-600">
                  <li>
                    <Link href="/admin" className="hover:text-amber-800">
                      Admin CMS
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <p className="pt-8 text-center text-xs text-stone-500">
            © {new Date().getFullYear()} {BRAND.name} · Gwaldam · Uttarakhand
          </p>
        </div>
      </footer>
    </>
  );
}
