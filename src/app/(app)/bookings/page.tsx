import Link from "next/link";
import { MyBookingsPanel } from "@/components/bookings/my-bookings-panel";

export default function BookingsPage() {
  return (
    <div className="min-h-[70vh] px-4 pt-6 pb-20 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-amber-800 uppercase">
              Guest
            </p>
            <h1 className="mt-1 font-serif text-3xl font-medium text-stone-900">
              My bookings
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Live list — cancel without reloading the whole app.
            </p>
          </div>
          <Link href="/hotels" className="brand-btn-ghost-light">
            Browse hotels
          </Link>
        </div>
        <MyBookingsPanel />
      </div>
    </div>
  );
}
