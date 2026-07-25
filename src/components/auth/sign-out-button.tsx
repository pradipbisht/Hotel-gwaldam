"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { AUTH_ROUTES } from "@/lib/auth/constant";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  async function onSignOut() {
    setLoading(true);
    await authClient.signOut();
    queryClient.clear(); // wipe previous user's cached data
    router.push(AUTH_ROUTES.login);
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={loading}
      onClick={onSignOut}
    >
      {loading ? "Signing out..." : "Sign out"}
    </Button>
  );
}
