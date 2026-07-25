import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/auth/session";
import { isAdmin } from "@/lib/security/permissions";
import { AUTH_ROUTES } from "@/lib/auth/constant";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function DashboardPage() {
  const session = await getServerSession();
  const user = session!.user;
  const role = user.role as string | undefined;

  if (isAdmin(role)) {
    redirect(AUTH_ROUTES.admin);
  }

  return (
    <div className="min-h-[70vh] px-4 py-16">
      <div className="mx-auto max-w-lg rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-amber-800 uppercase">
          Guest account
        </p>
        <h1 className="mt-2 font-serif text-2xl font-medium text-stone-900">
          Welcome, {user.name?.split(" ")[0] || "Guest"}
        </h1>
        <p className="mt-1 text-sm text-stone-500">{user.email}</p>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between border-b border-stone-100 pb-2">
            <dt className="text-stone-500">Role</dt>
            <dd className="font-medium text-stone-800">{role ?? "USER"}</dd>
          </div>
          <div className="flex justify-between border-b border-stone-100 pb-2">
            <dt className="text-stone-500">Email verified</dt>
            <dd className="font-medium text-stone-800">
              {user.emailVerified ? "Yes" : "No"}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="brand-btn-primary-light">
            Back to home
          </Link>
          <Link href="/bookings" className="brand-btn-ghost-light">
            My bookings
          </Link>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
