import { z } from "zod";

export const createHotelSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80).default("IN"),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || v === "" || /^https?:\/\//i.test(v), {
      message: "Image URL must start with http(s)://",
    }),
  isActive: z.boolean().optional().default(true),
});

export const updateHotelSchema = createHotelSchema.partial().extend({
  id: z.string().cuid(),
});

export type CreateHotelInput = z.infer<typeof createHotelSchema>;
