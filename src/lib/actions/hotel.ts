"use server";

import { requireAdminSession } from "../auth/session";
import { ActionResult } from "./types";
import { createHotelSchema, updateHotelSchema } from "../validators/hotel";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";

function toError<T>(e: unknown): ActionResult<T> {
  if (e instanceof Error) {
    return {
      ok: false,
      error: e.message,
      code: e.name,
    };
  }

  console.error(e);

  return {
    ok: false,
    error: "Something went wrong",
  };
}

export async function createHotel(
  raw: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdminSession();
    const parsed = createHotelSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const data = parsed.data;
    const hotel = await prisma.hotel.create({
      data: {
        name: data.name,
        description: data.description || null,
        city: data.city,
        country: data.country,
        address: data.address || null,
        imageUrl: data.imageUrl || null,
        isActive: data.isActive ?? true,
      },
      select: { id: true },
    });

    revalidatePath("/admin/hotels");
    revalidatePath("/hotels");
    return { ok: true, data: hotel };
  } catch (e) {
    return toError(e);
  }
}

export async function updateHotel(raw: unknown): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const parsed = updateHotelSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const { id, ...rest } = parsed.data;
    await prisma.hotel.update({
      where: { id },
      data: {
        ...rest,
        description: rest.description === "" ? null : rest.description,
        address: rest.address === "" ? null : rest.address,
        imageUrl: rest.imageUrl === "" ? null : rest.imageUrl,
      },
    });
    revalidatePath("/admin/hotels");
    revalidatePath("/hotels/[id]");
    revalidatePath("/hotels");
    return { ok: true };
  } catch (e) {
    return toError(e);
  }
}

export async function deactivateHotel(id: string): Promise<ActionResult> {
  try {
    await requireAdminSession();
    await prisma.hotel.update({
      where: { id },
      data: { isActive: false },
    });
    revalidatePath("/admin/hotels");
    revalidatePath("/hotels");
    return { ok: true };
  } catch (e) {
    return toError(e);
  }
}

export async function listHotelsForAdmin() {
  await requireAdminSession();
  return prisma.hotel.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { rooms: true } } },
  });
}

/** Public read — no session. Safe for useQuery on the client. */
export async function listPublicHotels() {
  return prisma.hotel.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: {
      rooms: {
        where: { isActive: true },
        select: { id: true, priceCents: true, currency: true, capacity: true },
      },
    },
  });
}

/** Public hotel detail — no session. */
export async function getPublicHotel(id: string) {
  return prisma.hotel.findFirst({
    where: { id, isActive: true },
    include: {
      rooms: {
        where: { isActive: true },
        orderBy: { priceCents: "asc" },
      },
    },
  });
}
