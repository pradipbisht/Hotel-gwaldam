"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { createBooking } from "@/lib/actions/bookings";
import { queryKeys } from "@/lib/query-keys";

function defaultDates() {
  const inD = new Date();
  inD.setDate(inD.getDate() + 2);
  const outD = new Date();
  outD.setDate(outD.getDate() + 4);
  const f = (d: Date) => d.toISOString().slice(0, 10);
  return { checkIn: f(inD), checkOut: f(outD) };
}

export function CreateBookingForm({
  roomId,
  roomName,
  maxGuests,
  priceCents,
}: {
  roomId: string;
  roomName: string;
  maxGuests: number;
  priceCents: number;
}) {
  const router = useRouter();
  const qc = useQueryClient();
  const defaults = defaultDates();
  const [error, setError] = useState<string | null>(null);

  const mut = useMutation({
    mutationFn: async (raw: Record<string, unknown>) => {
      const result = await createBooking(raw);
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.bookings.mine });
      await qc.invalidateQueries({ queryKey: queryKeys.bookings.all });
      router.push("/bookings");
      router.refresh();
    },
    onError: (e: Error) => setError(e.message),
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    mut.mutate({
      roomId,
      checkIn: String(fd.get("checkIn")),
      checkOut: String(fd.get("checkOut")),
      guests: Number(fd.get("guests") || 1),
      notes: String(fd.get("notes") ?? ""),
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-2xl border border-stone-200 bg-stone-50/80 p-4"
    >
      <p className="text-sm font-medium text-stone-900">Book · {roomName}</p>
      <p className="text-xs text-stone-500">
        ₹{(priceCents / 100).toLocaleString("en-IN")} / night · max {maxGuests}{" "}
        guests
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-xs font-medium text-stone-600">
          Check-in
          <input
            name="checkIn"
            type="date"
            required
            defaultValue={defaults.checkIn}
            className="brand-input-light h-10"
          />
        </label>
        <label className="space-y-1 text-xs font-medium text-stone-600">
          Check-out
          <input
            name="checkOut"
            type="date"
            required
            defaultValue={defaults.checkOut}
            className="brand-input-light h-10"
          />
        </label>
      </div>
      <label className="block space-y-1 text-xs font-medium text-stone-600">
        Guests
        <input
          name="guests"
          type="number"
          min={1}
          max={maxGuests}
          defaultValue={1}
          required
          className="brand-input-light h-10"
        />
      </label>
      <label className="block space-y-1 text-xs font-medium text-stone-600">
        Notes (optional)
        <input
          name="notes"
          placeholder="Early breakfast, Yatra desk…"
          className="brand-input-light h-10"
        />
      </label>
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={mut.isPending}
        className="brand-btn-primary-light h-10 w-full"
      >
        {mut.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Booking…
          </>
        ) : (
          "Confirm booking"
        )}
      </button>
    </form>
  );
}
