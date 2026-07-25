"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Loader2,
  Plus,
  RefreshCw,
  Power,
  ExternalLink,
} from "lucide-react";
import {
  createHotel,
  deactivateHotel,
  listHotelsForAdmin,
} from "@/lib/actions/hotel";
import { queryKeys } from "@/lib/query-keys";

export function HotelsAdminPanel() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const list = useQuery({
    queryKey: queryKeys.hotels.admin,
    queryFn: () => listHotelsForAdmin(),
  });

  const createMut = useMutation({
    mutationFn: async (raw: Record<string, unknown>) => {
      const result = await createHotel(raw);
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.hotels.admin });
      await qc.invalidateQueries({ queryKey: queryKeys.hotels.public });
      setShowForm(false);
      setFormError(null);
    },
    onError: (e: Error) => setFormError(e.message),
  });

  const deactivateMut = useMutation({
    mutationFn: async (id: string) => {
      const result = await deactivateHotel(id);
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.hotels.admin });
      await qc.invalidateQueries({ queryKey: queryKeys.hotels.public });
    },
  });

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    const fd = new FormData(e.currentTarget);
    createMut.mutate({
      name: String(fd.get("name") ?? ""),
      city: String(fd.get("city") ?? ""),
      country: String(fd.get("country") ?? "IN"),
      description: String(fd.get("description") ?? ""),
      address: String(fd.get("address") ?? ""),
      imageUrl: String(fd.get("imageUrl") ?? ""),
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
            Hotels
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Live list from the database — add a hotel without reloading the
            page.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => list.refetch()}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/10 px-3 text-xs font-medium text-stone-300 hover:bg-white/5"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${list.isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-amber-500 px-4 text-xs font-semibold text-stone-950 hover:bg-amber-400"
          >
            <Plus className="h-4 w-4" />
            {showForm ? "Close form" : "Add hotel"}
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={onCreate}
          className="grid gap-3 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-5 sm:grid-cols-2"
        >
          <h2 className="sm:col-span-2 text-sm font-semibold text-white">
            New hotel
          </h2>
          <label className="space-y-1 text-xs text-stone-400">
            Name *
            <input
              name="name"
              required
              minLength={2}
              placeholder="Grand Resort"
              className="brand-input h-10"
            />
          </label>
          <label className="space-y-1 text-xs text-stone-400">
            City *
            <input
              name="city"
              required
              placeholder="Gwaldam"
              className="brand-input h-10"
            />
          </label>
          <label className="space-y-1 text-xs text-stone-400">
            Country
            <input
              name="country"
              defaultValue="IN"
              className="brand-input h-10"
            />
          </label>
          <label className="space-y-1 text-xs text-stone-400">
            Address
            <input
              name="address"
              placeholder="Optional"
              className="brand-input h-10"
            />
          </label>
          <label className="sm:col-span-2 space-y-1 text-xs text-stone-400">
            Image URL
            <input
              name="imageUrl"
              placeholder="https://…"
              className="brand-input h-10"
            />
          </label>
          <label className="sm:col-span-2 space-y-1 text-xs text-stone-400">
            Description
            <textarea
              name="description"
              rows={2}
              className="brand-input min-h-[4rem] resize-y py-2"
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
                  <Plus className="h-4 w-4" /> Create hotel
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {list.isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl bg-stone-900"
            />
          ))}
        </div>
      )}

      {list.isError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-sm text-red-300">
          {(list.error as Error).message}
          <button
            type="button"
            onClick={() => list.refetch()}
            className="mt-3 block mx-auto text-amber-300 underline"
          >
            Retry
          </button>
        </div>
      )}

      {list.data && list.data.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/10 px-6 py-14 text-center">
          <Building2 className="mx-auto h-8 w-8 text-amber-400/70" />
          <p className="mt-3 text-white">No hotels yet</p>
          <p className="mt-1 text-sm text-stone-500">
            Click “Add hotel” to create the first property.
          </p>
        </div>
      )}

      {list.data && list.data.length > 0 && (
        <ul className="space-y-2">
          {list.data.map((h) => (
            <li
              key={h.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-white">{h.name}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      h.isActive
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-stone-700/50 text-stone-400"
                    }`}
                  >
                    {h.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-stone-500">
                  {h.city}
                  {h.country ? `, ${h.country}` : ""} · {h._count.rooms} rooms
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/hotels/${h.id}`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/10 px-3 text-xs text-stone-300 hover:bg-white/5"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Public
                </Link>
                <Link
                  href={`/admin/rooms?hotelId=${h.id}`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 text-xs font-medium text-amber-200 hover:bg-amber-500/20"
                >
                  Add rooms
                </Link>
                {h.isActive && (
                  <button
                    type="button"
                    disabled={deactivateMut.isPending}
                    onClick={() => {
                      if (confirm(`Deactivate “${h.name}”?`)) {
                        deactivateMut.mutate(h.id);
                      }
                    }}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/10 px-3 text-xs text-stone-400 hover:border-red-500/30 hover:text-red-300"
                  >
                    <Power className="h-3.5 w-3.5" />
                    Deactivate
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
