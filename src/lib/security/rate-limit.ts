type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/**
 * Good for learning / single server. Use Redis on multi-instance prod.
 * Auth API endpoints are also rate-limited in `src/lib/auth.ts` via Better Auth.
 */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true as const };
  }

  if (b.count >= limit) {
    return {
      ok: false as const,
      retryAfterSec: Math.ceil((b.resetAt - now) / 1000),
    };
  }

  b.count += 1;
  return { ok: true as const };
}

/** Suggested windows for app-level actions (server actions, etc.) */
export const RATE_LIMITS = {
  login: { limit: 5, windowMs: 15 * 60 * 1000 },
  otpSend: { limit: 3, windowMs: 10 * 60 * 1000 },
  otpVerify: { limit: 5, windowMs: 10 * 60 * 1000 },
} as const;
