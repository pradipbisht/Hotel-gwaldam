"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getSafeNextPath } from "@/lib/auth/safe-redirect";
import { AUTH_ROUTES, ROLES } from "@/lib/auth/constant";
import { AuthCard, AuthError, AuthField } from "./auth-card";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await authClient.signIn.email({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setLoading(false);
      const msg = (error.message ?? "").toLowerCase();
      if (msg.includes("fetch") || msg.includes("network") || msg.includes("failed")) {
        setError(
          "Could not reach auth server. Is the app running and /auth route OK?",
        );
        return;
      }
      if (msg.includes("verif")) {
        setError(
          "Please verify your email first. Use Register → verify OTP, or open /verify-email.",
        );
        return;
      }
      if (process.env.NODE_ENV === "development" && error.message) {
        setError(error.message);
        return;
      }
      setError("Invalid email or password");
      return;
    }

    // Route by role: admins go straight to /admin (skip guest /dashboard card)
    const { data: sessionData } = await authClient.getSession();
    const role = (sessionData?.user as { role?: string } | undefined)?.role;
    const next = searchParams.get("next");

    if (next) {
      router.push(getSafeNextPath(next));
    } else if (String(role ?? "").toUpperCase() === ROLES.ADMIN) {
      router.push(AUTH_ROUTES.admin);
    } else {
      router.push(AUTH_ROUTES.dashboard);
    }
    router.refresh();
    setLoading(false);
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to Grand Resort · Gwaldam"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthField id="email" label="Email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="brand-input-light h-11"
          />
        </AuthField>

        <AuthField id="password" label="Password">
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="brand-input-light h-11"
          />
        </AuthField>

        <AuthError message={error} />

        <button
          type="submit"
          disabled={loading}
          className="brand-btn-primary-light mt-1 h-11 w-full disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <div className="flex flex-col items-center gap-2 pt-1 text-sm">
          <Link
            href={AUTH_ROUTES.forgotPassword}
            className="text-stone-500 transition hover:text-amber-800"
          >
            Forgot password?
          </Link>
          <p className="text-stone-500">
            New guest?{" "}
            <Link
              href={AUTH_ROUTES.register}
              className="font-semibold text-amber-800 transition hover:text-amber-950"
            >
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
}
