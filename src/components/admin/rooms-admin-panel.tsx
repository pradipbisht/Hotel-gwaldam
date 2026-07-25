"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BedDouble, Loader2, Plus, RefreshCw, Power } from "lucide-react";
import { listHotelsForAdmin } from "@/lib/actions/hotel";
import {
  createRoom,
  deactivateRoom,
  listRoomsForAdmin,
} from "@/lib/actions/rooms";
import { queryKeys } from "@/lib/query-keys";

export function RoomsAdminPanel() {
  const qc = useQueryClient();
  const searchParams = useSearchParams();
  const preselectHotel = searchParams.get("hotelId") ?? "";

  const [showForm, setShowForm] = useState(!!preselectHotel);
  const [formError, setFormError] = useState<string | null>(null);
  const [hotelId, setHotelId] = useState(preselectHotel);

  const hotels = useQuery({
    queryKey: queryKeys.hotels.admin,
    queryFn: () => listHotelsForAdmin(),
  });

  const rooms = useQuery({
    queryKey: queryKeys.rooms.admin,
    queryFn: () => listRoomsForAdmin(),
  });

  const createMut = useMutation({
    mutationFn: async (raw: Record<string, unknown>) => {
      const result = await createRoom(raw);
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.rooms.admin });
      await qc.invalidateQueries({ queryKey: queryKeys.hotels.admin });
      await qc.invalidateQueries({ queryKey: queryKeys.hotels.public });
      setFormError(null);
      setShowForm(false);
    },
    onError: (e: Error) => setFormError(e.message),
  });

  const deactivateMut = useMutation({
    mutationFn: async (id: string) => {
      const result = await deactivateRoom(id);
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.rooms.admin });
      await qc.invalidateQueries({ queryKey: queryKeys.hotels.public });
    },
  });

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    const fd = new FormData(e.currentTarget);
    const priceInr = Number(fd.get("priceInr") || 0);
    const priceCents = Math.round(priceInr * 100);

    createMut.mutate({
      hotelId: String(fd.get("hotelId") ?? ""),
      name: String(fd.get("name") ?? ""),
      description: String(fd.get("description") ?? ""),
      capacity: Number(fd.get("capacity") || 2),
      priceCents,
      currency: "INR",
      isActive: true,
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-amber-400/90 uppercase">
            Inventory
          </p>
          <h1 className="mt-1 font-serif text-2xl font-medium text-white">
            Rooms
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Attach rooms to a hotel. Prices in ₹ — stored as integer cents.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => rooms.refetch()}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/10 px-3 text-xs text-stone-300 hover:bg-white/5"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${rooms.isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-amber-500 px-4 text-xs font-semibold text-stone-950 hover:bg-amber-400"
          >
            <Plus className="h-4 w-4" />
            {showForm ? "Close form" : "Add room"}
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={onCreate}
          className="grid gap-3 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-5 sm:grid-cols-2"
        >
          <h2 className="sm:col-span-2 text-sm font-semibold text-white">
            New room
          </h2>
          <label className="sm:col-span-2 space-y-1 text-xs text-stone-400">
            Hotel *
            <select
              name="hotelId"
              required
              value={hotelId}
              onChange={(e) => setHotelId(e.target.value)}
              className="brand-input h-10"
            >
              <option value="" className="bg-stone-900">
                Select hotel…
              </option>
              {(hotels.data ?? [])
                .filter((h) => h.isActive)
                .map((h) => (
                  <option key={h.id} value={h.id} className="bg-stone-900">
                    {h.name} · {h.city}
                  </option>
                ))}
            </select>
          </label>
          <label className="space-y-1 text-xs text-stone-400">
            Room name *
            <input
              name="name"
              required
              placeholder="Mountain Suite"
              className="brand-input h-10"
            />
          </label>
          <label className="space-y-1 text-xs text-stone-400">
            Capacity *
            <input
              name="capacity"
              type="number"
              min={1}
              max={20}
              defaultValue={2}
              required
              className="brand-input h-10"
            />
          </label>
          <label className="space-y-1 text-xs text-stone-400">
            Price per night (₹) *
            <input
              name="priceInr"
              type="number"
              min={0}
              step={1}
              required
              placeholder="8500"
              className="brand-input h-10"
            />
          </label>
          <label className="space-y-1 text-xs text-stone-400">
            Description
            <input
              name="description"
              placeholder="Optional"
              className="brand-input h-10"
            />
          </label>
          {formError && (
            <p className="sm:col-span-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {formError}
            </p>
          )}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={createMut.isPending}
              className="brand-btn-primary h-10 disabled:opacity-60"
            >
              {createMut.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Create room
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {rooms.isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-2xl bg-stone-900"
            />
          ))}
        </div>
      )}

      {rooms.data && rooms.data.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/10 px-6 py-14 text-center">
          <BedDouble className="mx-auto h-8 w-8 text-amber-400/70" />
          <p className="mt-3 text-white">No rooms yet</p>
          <p className="mt-1 text-sm text-stone-500">
            Create a hotel first, then add rooms here.
          </p>
        </div>
      )}

      {rooms.data && rooms.data.length > 0 && (
        <ul className="space-y-2">
          {rooms.data.map((r) => (
            <li
              key={r.id}
              className="flex flex-col gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-white">{r.name}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      r.isActive
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-stone-700/50 text-stone-400"
                    }`}
                  >
                    {r.isActive ? "Active" : "Off"}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-stone-500">
                  {r.hotel.name} · {r.hotel.city} · cap {r.capacity} · ₹
                  {(r.priceCents / 100).toLocaleString("en-IN")}/night
                </p>
              </div>
              {r.isActive && (
                <button
                  type="button"
                  disabled={deactivateMut.isPending}
                  onClick={() => {
                    if (confirm(`Deactivate “${r.name}”?`)) {
                      deactivateMut.mutate(r.id);
                    }
                  }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/10 px-3 text-xs text-stone-400 hover:border-red-500/30 hover:text-red-300"
                >
                  <Power className="h-3.5 w-3.5" />
                  Deactivate
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
