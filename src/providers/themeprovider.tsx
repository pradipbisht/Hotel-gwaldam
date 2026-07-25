import { ReactNode } from "react";

interface FixedWidthProviderProps {
  children: ReactNode;
}

export default function FixedWidthProvider({
  children,
}: FixedWidthProviderProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
