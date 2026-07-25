/**
 * Stable TanStack Query keys.
 * Invalidate by family: queryClient.invalidateQueries({ queryKey: queryKeys.hotels.all })
 */
export const queryKeys = {
  hotels: {
    all: ["hotels"] as const,
    public: ["hotels", "public"] as const,
    admin: ["hotels", "admin"] as const,
    detail: (id: string) => ["hotels", "detail", id] as const,
  },
  rooms: {
    admin: ["rooms", "admin"] as const,
    byHotel: (hotelId: string) => ["rooms", "hotel", hotelId] as const,
  },
  bookings: {
    mine: ["bookings", "mine"] as const,
    all: ["bookings", "all"] as const,
  },
  users: {
    all: ["users", "admin"] as const,
  },
};
