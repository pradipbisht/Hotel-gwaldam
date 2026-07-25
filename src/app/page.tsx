import { Hero } from "@/components/ux/hero/hero";
import { PublicShell } from "@/components/ux/public-shell";
import { HomeSections } from "@/components/ux/sections/home-sections";
import { getServerSession } from "@/lib/auth/session";
import { isAdmin } from "@/lib/security/permissions";

export default async function Home() {
  const session = await getServerSession();
  const showAdminLink = isAdmin(session?.user?.role as string | undefined);
  const userLabel = session?.user?.name || session?.user?.email || null;

  return (
    <PublicShell showAdminLink={showAdminLink} userLabel={userLabel}>
      <Hero />
      <HomeSections />
    </PublicShell>
  );
}
