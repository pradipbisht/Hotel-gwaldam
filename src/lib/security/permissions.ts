import { ROLES } from "../auth/constant";

export function isAdmin(role?: string | null) {
  if (!role) return false;
  // Normalize — Better Auth / Prisma may return slightly different casings
  return String(role).toUpperCase() === ROLES.ADMIN;
}

export const permissions = {
  canAccessAdminPanel: (role?: string | null) => isAdmin(role),
  canManageHotels: (role?: string | null) => isAdmin(role),
  canManageOwnBooking: (p: {
    role?: string | null;
    bookingUserId: string;
    actorUserId: string;
  }) => isAdmin(p.role) || p.bookingUserId === p.actorUserId,
};
