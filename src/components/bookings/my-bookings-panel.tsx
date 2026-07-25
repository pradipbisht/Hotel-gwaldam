"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Loader2, RefreshCw } from "lucide-react";
import { cancelBooking, listMyBookings } from "@/lib/actions/bookings";
import { queryKeys } from "@/lib/query-keys";

function fmtDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function MyBookingsPanel() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: queryKeys.bookings.mine,
    queryFn: () => listMyBookings(),
  });

  const cancelMut = useMutation({
    mutationFn: async (bookingId: string) => {
      const r = await cancelBooking({ bookingId });
      if (!r.ok) throw new Error(r.error);
      return r;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.bookings.mine });
      await qc.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });

  if (list.isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl border border-stone-200 bg-stone-100"
          />
        ))}
      </div>
    );
  }

  if (list.isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
        {(list.error as Error).message}
        <button
          type="button"
          onClick={() => list.refetch()}
          className="mt-2 block mx-auto text-amber-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const rows = list.data ?? [];

  if (rows.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
        <Calendar className="mx-auto h-8 w-8 text-amber-600/70" />
        <p className="mt-3 font-medium text-stone-900">No bookings yet</p>
        <p className="mt-1 text-sm text-stone-500">
          Browse hotels and reserve a mountain room.
        </p>
        <a
          href="/hotels"
          className="brand-btn-primary-light mt-5 inline-flex !text-xs"
        >
          Explore hotels
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => list.refetch()}
          className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-600 hover:border-amber-300"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${list.isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>
      <ul className="space-y-3">
        {rows.map((b) => (
          <li
            key={b.id}
            className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-stone-900">
                  {b.room.hotel.name} · {b.room.name}
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  {b.room.hotel.city} · {fmtDate(b.checkIn)} →{" "}
                  {fmtDate(b.checkOut)} · {b.guests} guest
                  {b.guests > 1 ? "s" : ""}
                </p>
                <p className="mt-2 text-sm font-medium text-amber-900">
                  ₹{(b.totalCents / 100).toLocaleString("en-IN")} ·{" "}
                  <span
                    className={
                      b.status === "CANCELLED"
                        ? "text-stone-400"
                        : b.status === "PENDING"
                          ? "text-amber-700"
                          : "text-emerald-700"
                    }
                  >
                    {b.status}
                  </span>
                </p>
              </div>
              {b.status !== "CANCELLED" && (
                <button
                  type="button"
                  disabled={cancelMut.isPending}
                  onClick={() => {
                    if (confirm("Cancel this reservation?")) {
                      cancelMut.mutate(b.id);
                    }
                  }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                >
                  {cancelMut.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : null}
                  Cancel
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
