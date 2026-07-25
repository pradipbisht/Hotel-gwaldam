"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import {
  requireSession,
  requireAdminSession,
} from "@/lib/auth/session";
import { permissions } from "@/lib/security/permissions";
import {
  createBookingSchema,
  cancelBookingSchema,
} from "@/lib/validators/booking";
import { datesOverlap, nightsBetween } from "@/lib/bookings/overlap";
import type { ActionResult } from "@/lib/actions/types";
import { AuthError } from "@/lib/security/errors";

function toError(e: unknown): ActionResult {
  if (e instanceof AuthError) {
    return { ok: false, error: e.message, code: e.code };
  }
  console.error(e);
  return { ok: false, error: "Something went wrong" };
}

export async function createBooking(
  raw: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireSession();
    const parsed = createBookingSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const { roomId, checkIn, checkOut, guests, notes } = parsed.data;

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        isActive: true,
        hotel: { isActive: true },
      },
    });
    if (!room) return { ok: false, error: "Room not available" };
    if (guests > room.capacity) {
      return { ok: false, error: `Max capacity is ${room.capacity}` };
    }

    const nights = nightsBetween(checkIn, checkOut);
    if (nights < 1) {
      return { ok: false, error: "Stay must be at least 1 night" };
    }

    const existing = await prisma.booking.findMany({
      where: {
        roomId,
        status: { not: "CANCELLED" },
      },
      select: { checkIn: true, checkOut: true },
    });

    const conflict = existing.some((b) =>
      datesOverlap(checkIn, checkOut, b.checkIn, b.checkOut),
    );
    if (conflict) {
      return { ok: false, error: "Room already booked for those dates" };
    }

    const totalCents = nights * room.priceCents;

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        roomId,
        checkIn,
        checkOut,
        guests,
        notes: notes || null,
        totalCents,
        currency: room.currency,
        status: "CONFIRMED",
      },
      select: { id: true },
    });

    revalidatePath("/bookings");
    revalidatePath("/admin/bookings");
    return { ok: true, data: booking };
  } catch (e) {
    return toError(e) as ActionResult<{ id: string }>;
  }
}

export async function cancelBooking(raw: unknown): Promise<ActionResult> {
  try {
    const session = await requireSession();
    const parsed = cancelBookingSchema.safeParse(raw);
    if (!parsed.success) {
      return { ok: false, error: "Invalid booking" };
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parsed.data.bookingId },
    });
    if (!booking) return { ok: false, error: "Booking not found" };

    const allowed = permissions.canManageOwnBooking({
      role: session.user.role as string | undefined,
      bookingUserId: booking.userId,
      actorUserId: session.user.id,
    });
    if (!allowed) {
      throw new AuthError("FORBIDDEN", "You cannot cancel this booking");
    }

    if (booking.status === "CANCELLED") {
      return { ok: false, error: "Already cancelled" };
    }

    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CANCELLED" },
    });

    revalidatePath("/bookings");
    revalidatePath("/admin/bookings");
    return { ok: true };
  } catch (e) {
    return toError(e);
  }
}

export async function listMyBookings() {
  const session = await requireSession();
  return prisma.booking.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      room: {
        include: {
          hotel: { select: { id: true, name: true, city: true } },
        },
      },
    },
  });
}

export async function listAllBookings() {
  await requireAdminSession();
  return prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      room: {
        include: { hotel: { select: { id: true, name: true } } },
      },
    },
  });
}
