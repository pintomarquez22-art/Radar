"use client";

import { SignalStrength } from "@/lib/types";

const config: Record<SignalStrength, { label: string; color: string; dot: string }> = {
  weak:   { label: "Señal débil",   color: "text-gray-400 bg-gray-100 dark:bg-gray-800",   dot: "bg-gray-400" },
  medium: { label: "Señal media",   color: "text-amber-600 bg-amber-50 dark:bg-amber-950", dot: "bg-amber-500" },
  strong: { label: "Señal fuerte",  color: "text-red-600 bg-red-50 dark:bg-red-950",       dot: "bg-red-500" },
};

export default function StrengthBadge({ strength }: { strength: SignalStrength }) {
  const { label, color, dot } = config[strength];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse-slow`} />
      {label}
    </span>
  );
}
