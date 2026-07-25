import { AUTH_ROUTES } from "./constant";

export function getSafeNextPath(next: string | null | undefined) {
  if (!next) return AUTH_ROUTES.dashboard;
  // Only allow same-origin relative paths (block open redirects)
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("://")) {
    return AUTH_ROUTES.dashboard;
  }
  return next;
}
