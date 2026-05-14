"use client";

import { SignalStrength } from "@/lib/types";

const config: Record<SignalStrength, {
  label: string;
  bg: string;
  text: string;
  dot: string;
  border: string;
  cardBorder: string;
  cardBg: string;
}> = {
  weak: {
    label: "Señal emergente",
    bg: "bg-slate-100",
    text: "text-slate-500",
    dot: "bg-slate-400",
    border: "border-slate-200",
    cardBorder: "border-l-slate-300",
    cardBg: "",
  },
  medium: {
    label: "Señal en alza",
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-400",
    border: "border-amber-200",
    cardBorder: "border-l-amber-400",
    cardBg: "",
  },
  strong: {
    label: "Señal crítica",
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-500",
    border: "border-red-200",
    cardBorder: "border-l-red-500",
    cardBg: "",
  },
};

export default function StrengthBadge({ strength }: { strength: SignalStrength }) {
  const c = config[strength];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${strength === "strong" ? "animate-ping" : strength === "medium" ? "animate-pulse" : ""}`} />
      {c.label}
    </span>
  );
}

export { config as strengthConfig };
