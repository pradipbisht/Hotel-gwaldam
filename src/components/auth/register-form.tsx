"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { AUTH_ROUTES } from "@/lib/auth/constant";
import { AuthCard, AuthError, AuthField } from "./auth-card";

/**
 * Register flow:
 * 1. signUp.email (creates USER, role locked server-side)
 * 2. sendVerificationOtp (email-verification)
 * 3. redirect → /verify-email?email=...
 * 4. user enters OTP → emailVerified
 * 5. sign in → /dashboard
 */
export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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

    const { error: signUpError } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message ?? "Could not create account");
      return;
    }

    // Trigger email OTP (dev: printed in server terminal if Resend not set)
    const { error: otpError } = await authClient.emailOtp.sendVerificationOtp({
      email: email.trim().toLowerCase(),
      type: "email-verification",
    });

    setLoading(false);

    if (otpError) {
      // Account exists — still send user to verify so they can resend
      router.push(
        `${AUTH_ROUTES.verifyEmail}?email=${encodeURIComponent(email.trim().toLowerCase())}&sent=0`,
      );
      return;
    }

    router.push(
      `${AUTH_ROUTES.verifyEmail}?email=${encodeURIComponent(email.trim().toLowerCase())}&sent=1`,
    );
    router.refresh();
  }

  return (
    <AuthCard
      title="Join Grand Resort"
      subtitle="Create your guest account · Gwaldam Himalaya"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthField id="name" label="Full name">
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="brand-input-light h-11"
          />
        </AuthField>

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

        <p className="text-[11px] leading-relaxed text-stone-500">
          After registering you will enter a 6-digit code sent to your email
          (in dev it may appear in the server terminal).
        </p>

        <button
          type="submit"
          disabled={loading}
          className="brand-btn-primary-light h-11 w-full disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="text-center text-sm text-stone-500">
          Already have an account?{" "}
          <Link
            href={AUTH_ROUTES.login}
            className="font-semibold text-amber-800 transition hover:text-amber-950"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
