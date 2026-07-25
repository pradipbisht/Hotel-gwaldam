"use client";

import type { ReactNode } from "react";
import { Navbar } from "./navbar/navbar";

interface PublicShellProps {
  children: ReactNode;
  showAdminLink?: boolean;
  userLabel?: string | null;
}

/**
 * Public site chrome — light theme.
 * Admin CMS stays dark (separate shell).
 */
export function PublicShell({
  children,
  showAdminLink = false,
  userLabel = null,
}: PublicShellProps) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-amber-200/60 selection:text-stone-900">
      <Navbar showAdminLink={showAdminLink} userLabel={userLabel} />
      {children}
    </div>
  );
}
