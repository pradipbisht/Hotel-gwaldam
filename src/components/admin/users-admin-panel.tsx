"use client";

import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Users } from "lucide-react";
import { listUsersForAdmin } from "@/lib/actions/user";
import { queryKeys } from "@/lib/query-keys";

export function UsersAdminPanel() {
  const list = useQuery({
    queryKey: queryKeys.users.all,
    queryFn: () => listUsersForAdmin(),
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-amber-400/90 uppercase">
            People
          </p>
          <h1 className="mt-1 font-serif text-2xl font-medium text-white">
            Users
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Live list of registered guests &amp; staff (read-only for now).
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
            <div
              key={i}
              className="h-14 animate-pulse rounded-2xl bg-stone-900"
            />
          ))}
        </div>
      )}

      {list.isError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-sm text-red-300">
          {(list.error as Error).message}
        </div>
      )}

      {list.data && list.data.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/10 px-6 py-14 text-center">
          <Users className="mx-auto h-8 w-8 text-amber-400/70" />
          <p className="mt-3 text-white">No users found</p>
        </div>
      )}

      {list.data && list.data.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/[0.06] bg-white/[0.03] text-[11px] tracking-wider text-stone-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                  Verified
                </th>
              </tr>
            </thead>
            <tbody>
              {list.data.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {u.name}
                  </td>
                  <td className="px-4 py-3 text-stone-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        u.role === "ADMIN"
                          ? "bg-amber-500/15 text-amber-300"
                          : "bg-stone-700/40 text-stone-300"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-stone-500 sm:table-cell">
                    {u.emailVerified ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {list.data && (
        <p className="text-xs text-stone-600">
          {list.data.length} user{list.data.length === 1 ? "" : "s"} · data via
          TanStack Query + listUsersForAdmin
        </p>
      )}
    </div>
  );
}
