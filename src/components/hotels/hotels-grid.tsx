"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Mountain, MapPin, BedDouble, RefreshCw, ArrowUpRight } from "lucide-react";
import { listPublicHotels } from "@/lib/actions/hotel";
import { queryKeys } from "@/lib/query-keys";

function formatFromPrice(
  rooms: { priceCents: number; currency: string }[],
): string | null {
  if (!rooms.length) return null;
  const min = Math.min(...rooms.map((r) => r.priceCents));
  const currency = rooms[0]?.currency ?? "INR";
  const amount = (min / 100).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
  if (currency === "INR") return `From ₹${amount} / night`;
  return `From ${currency} ${amount} / night`;
}

function HotelsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-3xl border border-stone-200 bg-white"
        >
          <div className="h-40 bg-stone-200" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-2/3 rounded bg-stone-200" />
            <div className="h-3 w-1/2 rounded bg-stone-100" />
            <div className="h-3 w-1/3 rounded bg-stone-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HotelsGrid() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: queryKeys.hotels.public,
    queryFn: () => listPublicHotels(),
  });

  if (isLoading) return <HotelsSkeleton />;

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-12 text-center">
        <p className="text-sm text-red-700">
          {(error as Error)?.message ?? "Could not load hotels."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="brand-btn-primary-light mt-4"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </button>
      </div>
    );
  }

  const hotels = data ?? [];

  if (hotels.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
        <Mountain className="mx-auto h-8 w-8 text-amber-600/70" />
        <p className="mt-4 text-base font-medium text-stone-900">No hotels yet</p>
        <p className="mt-1 text-sm text-stone-500">
          An admin can add properties in the CMS. Run seed for demo data.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="brand-btn-ghost-light mt-5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-stone-500">
          {hotels.length} active{" "}
          {hotels.length === 1 ? "property" : "properties"}
          {isFetching ? " · updating…" : null}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:border-amber-300 hover:text-amber-900 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel) => {
          const priceLabel = formatFromPrice(hotel.rooms);
          return (
            <Link
              key={hotel.id}
              href={`/hotels/${hotel.id}`}
              className="group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
            >
              <div className="relative h-40 overflow-hidden bg-stone-100">
                {hotel.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={hotel.imageUrl}
                    alt={hotel.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-stone-100">
                    <Mountain className="h-10 w-10 text-amber-600/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 to-transparent" />
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-medium text-stone-800 shadow-sm">
                  <MapPin className="h-3 w-3 text-amber-700" />
                  {hotel.city}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold tracking-tight text-stone-900">
                    {hotel.name}
                  </h2>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-stone-400 transition group-hover:text-amber-600" />
                </div>
                {hotel.description ? (
                  <p className="mt-1 line-clamp-2 text-sm text-stone-500">
                    {hotel.description}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-stone-500">
                  <span className="inline-flex items-center gap-1">
                    <BedDouble className="h-3.5 w-3.5 text-amber-700" />
                    {hotel.rooms.length}{" "}
                    {hotel.rooms.length === 1 ? "room" : "rooms"}
                  </span>
                  {priceLabel ? (
                    <span className="font-semibold text-amber-900">
                      {priceLabel}
                    </span>
                  ) : (
                    <span className="text-stone-400">Pricing soon</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
