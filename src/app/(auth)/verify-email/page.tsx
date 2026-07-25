import { Suspense } from "react";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-sm text-stone-400">Loading…</p>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
