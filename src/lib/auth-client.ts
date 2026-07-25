import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

/**
 * Must match server `basePath: "/auth"` and `src/app/auth/[...all]/route.ts`.
 * If this points at /api/auth while the route is /auth, every login fails.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  basePath: "/auth",
  plugins: [emailOTPClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
