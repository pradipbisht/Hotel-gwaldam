import { PublicShell } from "@/components/ux/public-shell";
import { getServerSession } from "@/lib/auth/session";
import { isAdmin } from "@/lib/security/permissions";

/** Light auth pages under public navbar. */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const showAdminLink = isAdmin(session?.user?.role as string | undefined);
  const userLabel = session?.user?.name || session?.user?.email || null;

  return (
    <PublicShell showAdminLink={showAdminLink} userLabel={userLabel}>
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-stone-50 px-4 pt-28 pb-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.08),_transparent_55%)]" />
        <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center">
          {children}
        </div>
      </div>
    </PublicShell>
  );
}
