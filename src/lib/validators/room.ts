import { z } from "zod";

export const createRoomSchema = z.object({
  hotelId: z.string().cuid(),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  capacity: z.coerce.number().int().min(1).max(20),
  // UI can send dollars; convert to cents in the action OR accept cents only:
  priceCents: z.coerce.number().int().min(0).max(100_000_00),
  currency: z.string().length(3).default("INR"),
  isActive: z.boolean().optional().default(true),
});

export const updateRoomSchema = createRoomSchema.partial().extend({
  id: z.string().cuid(),
});
