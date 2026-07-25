import { z } from "zod";

export const createBookingSchema = z
  .object({
    roomId: z.string().cuid(),
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
    guests: z.coerce.number().int().min(1).max(20).default(1),
    notes: z.string().trim().max(500).optional().or(z.literal("")),
  })
  .refine((d) => d.checkOut > d.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

export const cancelBookingSchema = z.object({
  bookingId: z.string().cuid(),
});
