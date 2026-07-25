"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { AUTH_ROUTES } from "@/lib/auth/constant";
import { AuthCard, AuthError, AuthField } from "./auth-card";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await authClient.emailOtp.resetPassword({
      email: email.trim().toLowerCase(),
      otp: otp.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      setError(error.message ?? "Could not reset password");
      return;
    }

    router.push(`${AUTH_ROUTES.login}?reset=1`);
    router.refresh();
  }

  return (
    <AuthCard
      title="Reset password"
      subtitle="Enter the code from your email and choose a new password"
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

        <AuthField id="otp" label="Reset code">
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            minLength={6}
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            className="brand-input-light h-11 tracking-[0.35em] text-center text-lg font-semibold"
          />
        </AuthField>

        <AuthField id="password" label="New password">
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="brand-input-light h-11"
          />
        </AuthField>

        <AuthField id="confirm" label="Confirm password">
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat password"
            className="brand-input-light h-11"
          />
        </AuthField>

        <AuthError message={error} />

        <button
          type="submit"
          disabled={loading}
          className="brand-btn-primary-light h-11 w-full disabled:opacity-60"
        >
          {loading ? "Resetting…" : "Reset password"}
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
