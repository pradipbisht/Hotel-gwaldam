import { Hero } from "@/components/ux/hero/hero";
import { PublicShell } from "@/components/ux/public-shell";
import { HomeSections } from "@/components/ux/sections/home-sections";
import { getServerSession } from "@/lib/auth/session";
import { isAdmin } from "@/lib/security/permissions";

export default async function Home() {
  // Public homepage must render even if auth/DB env is misconfigured on Vercel.
  let showAdminLink = false;
  let userLabel: string | null = null;
  try {
    const session = await getServerSession();
    showAdminLink = isAdmin(session?.user?.role as string | undefined);
    userLabel = session?.user?.name || session?.user?.email || null;
  } catch {
    // ignore — still show the marketing page
  }

  return (
    <PublicShell showAdminLink={showAdminLink} userLabel={userLabel}>
      <Hero />
      <HomeSections />
    </PublicShell>
  );
}
