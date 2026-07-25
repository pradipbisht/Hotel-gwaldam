import { Suspense } from "react";
import { RoomsAdminPanel } from "@/components/admin/rooms-admin-panel";

export default function AdminRoomsPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-stone-500">Loading rooms panel…</p>
      }
    >
      <RoomsAdminPanel />
    </Suspense>
  );
}
