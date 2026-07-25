"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Crown,
  Compass,
  BedDouble,
  Flower2,
  Mountain,
} from "lucide-react";
import type { SearchFiltersState, Hotel, Currency } from "../types";
import { HOTELS, HERO_HIMALAYA_IMAGES } from "../data/hotels";
import { cn } from "@/lib/utils";

export interface HeroProps {
  filters?: SearchFiltersState;
  onFilterChange?: (updated: Partial<SearchFiltersState>) => void;
  onSearchSubmit?: () => void;
  currency?: Currency;
  onOpenTour?: (hotel: Hotel) => void;
}

function defaultDates() {
  const inDate = new Date();
  inDate.setDate(inDate.getDate() + 1);
  const outDate = new Date();
  outDate.setDate(outDate.getDate() + 3);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { checkIn: fmt(inDate), checkOut: fmt(outDate) };
}

export const Hero: React.FC<HeroProps> = ({
  filters: controlledFilters,
  onFilterChange,
  onSearchSubmit,
  onOpenTour,
}) => {
  const router = useRouter();
  const defaults = defaultDates();
  const [localFilters, setLocalFilters] = useState<SearchFiltersState>({
    checkIn: defaults.checkIn,
    checkOut: defaults.checkOut,
    roomType: "",
  });

  const filters = controlledFilters ?? localFilters;

  const updateFilters = (updated: Partial<SearchFiltersState>) => {
    if (onFilterChange) onFilterChange(updated);
    else setLocalFilters((prev) => ({ ...prev, ...updated }));
  };

  const hotel = HOTELS[0];
  const heroImages: string[] =
    hotel?.images?.length ? hotel.images : HERO_HIMALAYA_IMAGES;

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % heroImages.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPlaying, heroImages.length]);

  const handleSearch = () => {
    if (onSearchSubmit) {
      onSearchSubmit();
      return;
    }
    const params = new URLSearchParams();
    if (filters.checkIn) params.set("checkIn", filters.checkIn);
    if (filters.checkOut) params.set("checkOut", filters.checkOut);
    if (filters.roomType) params.set("roomType", filters.roomType);
    router.push(`/hotels?${params.toString()}`);
  };

  return (
    <section
      id="hero-carousel-section"
      className="relative flex min-h-[92vh] flex-col justify-end overflow-hidden bg-stone-950 pb-10 text-white sm:min-h-screen sm:pb-14"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((imgUrl: string, idx: number) => (
          <div
            key={idx}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1200ms] ease-out",
              idx === activeSlideIndex
                ? "z-10 opacity-100"
                : "pointer-events-none z-0 opacity-0",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl}
              alt={`Himalayan mountains near Gwaldam — Grand Resort ${idx + 1}`}
              className={cn(
                "h-full w-full object-cover object-center will-change-transform",
                idx === activeSlideIndex && "animate-brand-hero-zoom",
              )}
              fetchPriority={idx === 0 ? "high" : "low"}
              decoding="async"
            />
          </div>
        ))}
        {/* Modern layered scrim — cleaner than heavy dark */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-stone-950/70 via-stone-950/25 to-stone-950" />
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-stone-950/50 via-transparent to-stone-950/30" />
      </div>

      {/* Content */}
      <div className="relative z-30 mx-auto w-full max-w-6xl px-4 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            <span className="brand-chip">
              <Mountain className="h-3.5 w-3.5 text-amber-300" />
              Gwaldam · Garhwal Himalaya
            </span>
            <span className="brand-chip">
              <span className="text-amber-300">★ 4.96</span>
              <span className="text-stone-400">Guest rated</span>
            </span>
          </div>

          <h1 className="text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            <span className="block font-serif font-medium tracking-tight">
              Above the clouds.
            </span>
            <span className="mt-1 block bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400/90 bg-clip-text text-transparent">
              At home in Gwaldam.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-stone-300/90 sm:text-lg">
            Grand Resort — a refined mountain retreat with alpine views, Sattvik
            dining, and quiet Himalayan hospitality.
          </p>
        </div>

        {/* Search card */}
        <div className="mx-auto mt-10 max-w-4xl">
          <div className="brand-glass-strong rounded-[1.75rem] p-2 sm:p-2.5">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-stretch">
              <div className="rounded-2xl bg-white/[0.04] px-4 py-3 sm:col-span-5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] text-stone-400 uppercase">
                      <Calendar className="h-3 w-3 text-amber-400" />
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={filters.checkIn}
                      onChange={(e) =>
                        updateFilters({ checkIn: e.target.value })
                      }
                      className="w-full cursor-pointer bg-transparent text-sm font-medium text-white outline-none [color-scheme:dark]"
                    />
                  </div>
                  <div className="border-l border-white/10 pl-3">
                    <label className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] text-stone-400 uppercase">
                      <Calendar className="h-3 w-3 text-amber-400" />
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={filters.checkOut}
                      onChange={(e) =>
                        updateFilters({ checkOut: e.target.value })
                      }
                      className="w-full cursor-pointer bg-transparent text-sm font-medium text-white outline-none [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/[0.04] px-4 py-3 sm:col-span-4">
                <label className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] text-stone-400 uppercase">
                  <BedDouble className="h-3 w-3 text-amber-400" />
                  Room
                </label>
                <select
                  value={filters.roomType}
                  onChange={(e) => updateFilters({ roomType: e.target.value })}
                  className="w-full cursor-pointer truncate bg-transparent text-sm font-medium text-white outline-none"
                >
                  <option value="" className="bg-stone-900">
                    All mountain tiers
                  </option>
                  <option value="Mountain Suite" className="bg-stone-900">
                    Mountain Suite
                  </option>
                  <option value="Valley View Suite" className="bg-stone-900">
                    Valley View Suite
                  </option>
                  <option value="Pine Garden Suite" className="bg-stone-900">
                    Pine Garden Suite
                  </option>
                  <option value="Alpine Room" className="bg-stone-900">
                    Alpine Room
                  </option>
                </select>
              </div>

              <div className="sm:col-span-3 sm:flex sm:items-center">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="brand-btn-primary h-full w-full !rounded-2xl !py-3.5"
                >
                  <Search className="h-4 w-4" />
                  Explore
                </button>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-stone-400">
            <span className="inline-flex items-center gap-1.5">
              <Flower2 className="h-3.5 w-3.5 text-amber-400/90" />
              Sattvik dining
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-stone-600 sm:inline-block" />
            <span className="inline-flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-amber-400/90" />
              Trail access
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-stone-600 sm:inline-block" />
            <span className="inline-flex items-center gap-1.5">
              <Crown className="h-3.5 w-3.5 text-amber-400/90" />
              360° peaks
            </span>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="mt-10 flex items-center justify-between gap-3">
          {hotel ? (
            <button
              type="button"
              onClick={() => onOpenTour?.(hotel)}
              className="brand-btn-ghost !text-xs"
            >
              <Compass className="h-3.5 w-3.5 text-amber-300" />
              Virtual tour
            </button>
          ) : (
            <span />
          )}

          <div className="brand-glass flex items-center gap-2 rounded-full px-3 py-1.5">
            <button
              type="button"
              onClick={() =>
                setActiveSlideIndex(
                  (prev) => (prev - 1 + heroImages.length) % heroImages.length,
                )
              }
              className="rounded-full p-1 text-stone-400 transition hover:bg-white/10 hover:text-white"
              title="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5 px-1">
              {heroImages.map((_: string, i: number) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveSlideIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === activeSlideIndex
                      ? "w-6 bg-amber-400"
                      : "w-1.5 bg-white/30 hover:bg-white/50",
                  )}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setActiveSlideIndex((prev) => (prev + 1) % heroImages.length)
              }
              className="rounded-full p-1 text-stone-400 transition hover:bg-white/10 hover:text-white"
              title="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="mx-0.5 h-3 w-px bg-white/15" />
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="rounded-full p-1 text-stone-400 transition hover:bg-white/10 hover:text-amber-300"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

    </section>
  );
};
