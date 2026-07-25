/**
 * Single source of truth for product branding.
 * Import from here instead of hardcoding names across the app.
 */
export const BRAND = {
  name: "Grand Resort",
  shortName: "Grand",
  tagline: "Gwaldam · Himalaya",
  location: "Gwaldam",
  region: "Garhwal Himalaya, Uttarakhand",
  country: "IN",
  description:
    "Grand Resort in the Himalayan mountains of Gwaldam — alpine views, Sattvik dining, and refined mountain hospitality.",
  metaTitle: "Grand Resort · Gwaldam Himalaya",
} as const;

export type Brand = typeof BRAND;
