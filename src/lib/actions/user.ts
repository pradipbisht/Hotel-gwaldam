"use server";

/**
 * Admin user management (list / soft flags) — NOT required for Phase 2–6.
 *
 * Auth signup/login/password already lives in Better Auth (`auth.ts`).
 * Use this file later for:
 *  - list users (admin)
 *  - promote role (careful; prefer SQL/seed for first admin)
 *
 * Until `/admin/users` is real UI, you can leave functions unimplemented.
 */

import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/session";

/** List app users for admin panel (read-only for now). */
export async function listUsersForAdmin() {
  await requireAdminSession();
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
    },
  });
}
