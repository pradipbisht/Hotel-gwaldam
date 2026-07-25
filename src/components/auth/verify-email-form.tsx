"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { AUTH_ROUTES } from "@/lib/auth/constant";
import { AuthCard, AuthError, AuthField, AuthSuccess } from "./auth-card";

const RESEND_COOLDOWN_SEC = 30;

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const justSent = searchParams.get("sent") === "1";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(
    justSent ? "We sent a 6-digit code to your email." : null,
  );
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(justSent ? RESEND_COOLDOWN_SEC : 0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await authClient.emailOtp.verifyEmail({
      email: email.trim().toLowerCase(),
      otp: otp.trim(),
    });
    setLoading(false);

    if (error) {
      setError(error.message ?? "Invalid or expired code");
      return;
    }

    setMessage("Email verified. You can sign in now.");
    router.push(
      `${AUTH_ROUTES.login}?verified=1&email=${encodeURIComponent(email.trim().toLowerCase())}`,
    );
    router.refresh();
  }

  async function onResend() {
    if (resendIn > 0 || !email) return;
    setError(null);
    setMessage(null);

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: email.trim().toLowerCase(),
      type: "email-verification",
    });

    if (error) {
      setError(error.message ?? "Could not resend code");
      return;
    }

    setMessage("If the account exists, a new code was sent.");
    setResendIn(RESEND_COOLDOWN_SEC);
  }

  return (
    <AuthCard
      title="Verify email"
      subtitle="Enter the 6-digit code to activate your account"
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

        <AuthField id="otp" label="Verification code">
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

        <AuthError message={error} />
        <AuthSuccess message={message} />

        <button
          type="submit"
          disabled={loading}
          className="brand-btn-primary-light h-11 w-full disabled:opacity-60"
        >
          {loading ? "Verifying…" : "Verify email"}
        </button>

        <button
          type="button"
          disabled={resendIn > 0 || !email}
          onClick={onResend}
          className="brand-btn-ghost-light h-11 w-full disabled:opacity-50"
        >
          {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
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
