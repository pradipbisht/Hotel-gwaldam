export type Currency = "INR" | "USD" | "EUR" | "GBP";

export interface Hotel {
  id: string;
  name: string;
  images: string[];
  city?: string;
  rating?: number;
}

export interface SearchFiltersState {
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests?: number;
}
