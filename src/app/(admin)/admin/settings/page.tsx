import Link from "next/link";
import { getServerSession } from "@/lib/auth/session";

export default async function AdminSettingsPage() {
  const session = await getServerSession();
  const user = session!.user;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.16em] text-amber-400/90 uppercase">
          System
        </p>
        <h1 className="mt-1 font-serif text-2xl font-medium text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Resort profile snapshot for the signed-in staff account.
        </p>
      </div>

      <div className="space-y-3 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6">
        <Row label="Name" value={user.name} />
        <Row label="Email" value={user.email} />
        <Row label="Role" value={String(user.role ?? "ADMIN")} />
        <Row
          label="Email verified"
          value={user.emailVerified ? "Yes" : "No"}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/" className="brand-btn-ghost">
          View public site
        </Link>
        <Link href="/admin" className="brand-btn-primary">
          Dashboard
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.04] py-2.5 last:border-0">
      <span className="text-sm text-stone-500">{label}</span>
      <span className="text-sm font-medium text-stone-100">{value}</span>
    </div>
  );
}
