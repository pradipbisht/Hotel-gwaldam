import Link from "next/link";

export function AdminPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-1 text-sm text-stone-500">{description}</p>
        </div>
        <Link
          href="/admin"
          className="text-xs font-medium text-amber-400/90 transition hover:text-amber-300"
        >
          ← Dashboard
        </Link>
      </div>
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
        <p className="text-sm text-stone-500">
          This module is ready for data wiring — UI shell is live for testing.
        </p>
      </div>
    </div>
  );
}
