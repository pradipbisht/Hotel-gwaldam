import { AUTH_ROUTES } from "@/lib/auth/constant";
import { getServerSession } from "@/lib/auth/session";
import { isAdmin } from "@/lib/security/permissions";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/layout";

/**
 * Admin route group: own shell (sidebar + admin navbar).
 * Public site navbar is never rendered here.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) redirect(AUTH_ROUTES.login);
  if (!isAdmin(session.user.role as string | undefined)) {
    redirect(AUTH_ROUTES.dashboard);
  }

  return (
    <AdminShell
      userName={session.user.name}
      userEmail={session.user.email}
    >
      {children}
    </AdminShell>
  );
}
