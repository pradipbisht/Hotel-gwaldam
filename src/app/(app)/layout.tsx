import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { AUTH_ROUTES } from "@/lib/auth/constant";
import { PublicShell } from "@/components/ux/public-shell";
import { isAdmin } from "@/lib/security/permissions";

/** Logged-in guest area — public navbar + session required. */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) redirect(AUTH_ROUTES.login);
  if (!session.user.emailVerified) redirect(AUTH_ROUTES.verifyEmail);

  const showAdminLink = isAdmin(session.user.role as string | undefined);
  const userLabel = session.user.name || session.user.email;

  return (
    <PublicShell showAdminLink={showAdminLink} userLabel={userLabel}>
      <div className="pt-20">{children}</div>
    </PublicShell>
  );
}
