import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-sm text-stone-400">Loading…</p>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
