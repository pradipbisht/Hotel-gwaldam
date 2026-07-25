import type { ReactNode } from "react";
import { Logo } from "@/components/brand/logo";

/** Light-theme auth card for public site. */
export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full">
      <div className="mb-7 flex flex-col items-center text-center">
        <Logo variant="mark" size="lg" className="mb-4" />
        <h1 className="font-serif text-2xl font-medium tracking-tight text-stone-900">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1.5 text-sm text-stone-500">{subtitle}</p>
        ) : null}
      </div>

      <div className="w-full rounded-3xl border border-stone-200 bg-white p-6 shadow-lg shadow-stone-200/60 sm:p-8">
        {children}
      </div>
    </div>
  );
}

export function AuthField({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium tracking-wide text-stone-600"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
      role="alert"
    >
      {message}
    </p>
  );
}

export function AuthSuccess({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
      role="status"
    >
      {message}
    </p>
  );
}
