"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "../auth/session";
import prisma from "../prisma";
import { createRoomSchema, updateRoomSchema } from "../validators/room";
import { ActionResult } from "./types";

function toError<T>(e: unknown): ActionResult<T> {
  if (e instanceof Error) {
    return {
      ok: false,
      error: e.message,
      code: e.name,
    };
  }
  console.error(e);
  return { ok: false, error: "Something went wrong" };
}

export async function createRoom(
  raw: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdminSession();

    const parsed = createRoomSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const data = parsed.data;
    const hotel = await prisma.hotel.findUnique({
      where: { id: data.hotelId },
    });
    if (!hotel) return { ok: false, error: "Hotel not found" };

    const room = await prisma.room.create({
      data: {
        hotelId: data.hotelId,
        name: data.name,
        description: data.description || null,
        capacity: data.capacity,
        priceCents: data.priceCents,
        currency: data.currency,
        isActive: data.isActive ?? true,
      },
      select: { id: true },
    });

    revalidatePath(`/admin/hotels/${data.hotelId}`);
    revalidatePath(`/hotels/${data.hotelId}`);
    revalidatePath("/admin/rooms");
    revalidatePath("/hotels");
    return { ok: true, data: room };
  } catch (e) {
    return toError(e);
  }
}

export async function updateRoom(raw: unknown): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const parsed = updateRoomSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Invalid Input",
      };
    }

    const { id, ...rest } = parsed.data;
    const room = await prisma.room.update({
      where: { id },
      data: {
        ...rest,
        description: rest.description === "" ? null : rest.description || null,
      },
    });

    revalidatePath(`/admin/hotels/${room.hotelId}`);
    revalidatePath(`/hotels/${room.hotelId}`);
    revalidatePath("/admin/rooms");
    return { ok: true };
  } catch (e) {
    return toError(e);
  }
}

/** Admin: all rooms with hotel name. */
export async function listRoomsForAdmin() {
  await requireAdminSession();
  return prisma.room.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      hotel: { select: { id: true, name: true, city: true } },
    },
  });
}

export async function deactivateRoom(id: string): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const room = await prisma.room.update({
      where: { id },
      data: { isActive: false },
    });
    revalidatePath(`/admin/hotels/${room.hotelId}`);
    revalidatePath(`/hotels/${room.hotelId}`);
    revalidatePath("/admin/rooms");
    return { ok: true };
  } catch (e) {
    return toError(e);
  }
}
