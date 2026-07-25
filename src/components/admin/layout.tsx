import type { ReactNode } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminNavbar } from "./admin-navbar";

interface AdminShellProps {
  children: ReactNode;
  userName?: string | null;
  userEmail?: string | null;
}

/** Premium admin chrome — public navbar never mounts here. */
export default function AdminShell({
  children,
  userName,
  userEmail,
}: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-100">
      {/* subtle ambient glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_-10%,rgba(245,158,11,0.08),transparent)]" />
      <div className="relative flex">
        <AdminSidebar />
        <div className="ml-64 flex min-h-screen min-w-0 flex-1 flex-col">
          <AdminNavbar userName={userName} userEmail={userEmail} />
          <main className="flex-1 p-6 sm:p-8 lg:p-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
