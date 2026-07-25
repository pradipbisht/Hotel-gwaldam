"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { AUTH_ROUTES } from "@/lib/auth/constant";
import { AuthCard, AuthField } from "./auth-card";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Generic success path — no account enumeration
    await authClient.emailOtp.requestPasswordReset({
      email: email.trim().toLowerCase(),
    });

    setLoading(false);
    router.push(
      `${AUTH_ROUTES.resetPassword}?email=${encodeURIComponent(email.trim().toLowerCase())}`,
    );
  }

  return (
    <AuthCard
      title="Forgot password"
      subtitle="We'll send a reset code if that email is registered"
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

        <button
          type="submit"
          disabled={loading}
          className="brand-btn-primary-light h-11 w-full disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send reset code"}
        </button>

        <p className="text-center text-sm text-stone-500">
          <Link
            href={AUTH_ROUTES.login}
            className="text-amber-800 transition hover:text-amber-950"
          >
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
