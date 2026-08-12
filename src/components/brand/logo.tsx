import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

type LogoProps = {
  /** icon | full wordmark */
  variant?: "mark" | "full";
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Invert for light surfaces */
  light?: boolean;
};

const sizes = {
  sm: { box: "h-9 w-9", text: "text-sm", sub: "text-[11px]", icon: "text-xs" },
  md: { box: "h-10 w-10", text: "text-[15px]", sub: "text-xs", icon: "text-sm" },
  lg: { box: "h-12 w-12", text: "text-lg", sub: "text-xs", icon: "text-base" },
};

/**
 * Grand Resort mark — monogram "G" in a refined gold stone badge.
 */
export function Logo({
  variant = "full",
  size = "md",
  className,
  light = false,
}: LogoProps) {
  const s = sizes[size];

  const mark = (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-2xl",
        "bg-gradient-to-br from-amber-300 via-amber-500 to-amber-800",
        "shadow-[0_4px_20px_rgba(180,83,9,0.35)] ring-1 ring-amber-200/30",
        s.box,
      )}
      aria-hidden
    >
      <span
        className={cn(
          "font-serif font-semibold tracking-tight text-stone-950",
          s.icon,
        )}
      >
        G
      </span>
      <span className="absolute inset-[2px] rounded-[0.85rem] ring-1 ring-white/20" />
    </span>
  );

  if (variant === "mark") {
    return (
      <span className={cn("inline-flex", className)} title={BRAND.name}>
        {mark}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {mark}
      <span className="min-w-0 text-left leading-none">
        <span
          className={cn(
            "block font-semibold tracking-[0.12em] uppercase",
            light ? "text-stone-900" : "text-white",
            s.text,
          )}
        >
          {BRAND.shortName}
        </span>
        <span
          className={cn(
            "mt-1 block font-medium tracking-[0.1em] uppercase",
            light ? "text-amber-800/80" : "text-amber-200/75",
            s.sub,
          )}
        >
          {BRAND.tagline}
        </span>
      </span>
    </span>
  );
}
