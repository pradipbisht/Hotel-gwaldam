"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCw } from "lucide-react";
import { cancelBooking, listAllBookings } from "@/lib/actions/bookings";
import { queryKeys } from "@/lib/query-keys";

function fmtDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BookingsAdminPanel() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: queryKeys.bookings.all,
    queryFn: () => listAllBookings(),
  });

  const cancelMut = useMutation({
    mutationFn: async (bookingId: string) => {
      const r = await cancelBooking({ bookingId });
      if (!r.ok) throw new Error(r.error);
      return r;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.bookings.all });
      await qc.invalidateQueries({ queryKey: queryKeys.bookings.mine });
    },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-amber-400/90 uppercase">
            Operations
          </p>
          <h1 className="mt-1 font-serif text-2xl font-medium text-white">
            All bookings
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Live list — cancel any reservation as admin.
          </p>
        </div>
        <button
          type="button"
          onClick={() => list.refetch()}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/10 px-3 text-xs text-stone-300 hover:bg-white/5"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${list.isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {list.isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-stone-900" />
          ))}
        </div>
      )}

      {list.data && list.data.length === 0 && (
        <p className="rounded-2xl border border-dashed border-white/10 py-12 text-center text-sm text-stone-500">
          No bookings yet.
        </p>
      )}

      {list.data && list.data.length > 0 && (
        <ul className="space-y-2">
          {list.data.map((b) => (
            <li
              key={b.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-white">
                  {b.user.name} · {b.user.email}
                </p>
                <p className="mt-0.5 text-sm text-stone-500">
                  {b.room.hotel.name} · {b.room.name} · {fmtDate(b.checkIn)} →{" "}
                  {fmtDate(b.checkOut)} · {b.status} · ₹
                  {(b.totalCents / 100).toLocaleString("en-IN")}
                </p>
              </div>
              {b.status !== "CANCELLED" && (
                <button
                  type="button"
                  disabled={cancelMut.isPending}
                  onClick={() => {
                    if (confirm("Cancel this booking?")) {
                      cancelMut.mutate(b.id);
                    }
                  }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-red-500/30 px-3 text-xs text-red-300 hover:bg-red-500/10"
                >
                  {cancelMut.isPending && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  Cancel
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
