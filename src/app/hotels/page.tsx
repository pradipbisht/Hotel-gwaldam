import Link from "next/link";
import { PublicShell } from "@/components/ux/public-shell";
import { HotelsGrid } from "@/components/hotels/hotels-grid";
import { getServerSession } from "@/lib/auth/session";
import { isAdmin } from "@/lib/security/permissions";

export default async function HotelsPage() {
  const session = await getServerSession();
  const showAdminLink = isAdmin(session?.user?.role as string | undefined);
  const userLabel = session?.user?.name || session?.user?.email || null;

  return (
    <PublicShell showAdminLink={showAdminLink} userLabel={userLabel}>
      <div className="min-h-screen bg-stone-50 pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-amber-800 uppercase">
                Stay
              </p>
              <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
                Hotels & mountain stays
              </h1>
              <p className="mt-2 max-w-xl text-sm text-stone-600">
                Live inventory from the database — updates without a full page
                reload.
              </p>
            </div>
            <Link href="/" className="brand-btn-ghost-light">
              ← Home
            </Link>
          </div>

          <div className="mt-10">
            <HotelsGrid />
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
