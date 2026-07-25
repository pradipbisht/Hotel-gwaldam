import type { Currency, Hotel } from "../types";

export const CURRENCIES: Record<
  Currency,
  { symbol: string; label: string }
> = {
  INR: { symbol: "₹", label: "Indian Rupee" },
  USD: { symbol: "$", label: "US Dollar" },
  EUR: { symbol: "€", label: "Euro" },
  GBP: { symbol: "£", label: "British Pound" },
};

/**
 * Hero carousel — Himalayan mountain landscapes (4K-wide Unsplash).
 * w=3840 & q=90 for sharp full-bleed hero on large screens.
 * Subject: high peaks, ridgelines, alpine light — Gwaldam / Garhwal Himalaya vibe.
 */
export const HERO_HIMALAYA_IMAGES: string[] = [
  // Snow peaks / dramatic ridgeline
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=3840&q=90",
  // Alpine mountain massif
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=3840&q=90",
  // Snow-capped summit under clear sky
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=3840&q=90",
  // High Himalaya ranges (India / Nepal region feel)
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=3840&q=90",
  // Mountain valley & ridgelines
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=3840&q=90",
  // Golden-hour peaks
  "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=3840&q=90",
];

/** Flagship property — Grand Resort, Gwaldam (Garhwal Himalaya). */
export const HOTELS: Hotel[] = [
  {
    id: "grand-gwaldam",
    name: "Grand Resort",
    city: "Gwaldam",
    rating: 4.96,
    images: HERO_HIMALAYA_IMAGES,
  },
];
