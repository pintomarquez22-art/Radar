"use client";

import { SignalType } from "@/lib/types";
import { Newspaper, Globe, Cpu, Telescope } from "lucide-react";

const config: Record<SignalType, { Icon: React.ElementType; label: string; color: string }> = {
  foresight:  { Icon: Telescope, label: "Foresight",   color: "text-purple-500" },
  article:    { Icon: Newspaper, label: "Artículo",    color: "text-blue-500" },
  social:     { Icon: Globe,     label: "Social",      color: "text-green-500" },
  technology: { Icon: Cpu,       label: "Tecnología",  color: "text-orange-500" },
};

export default function TypeIcon({ type, showLabel }: { type: SignalType; showLabel?: boolean }) {
  const { Icon, label, color } = config[type];
  return (
    <span className={`inline-flex items-center gap-1 ${color}`}>
      <Icon size={14} />
      {showLabel && <span className="text-xs font-medium">{label}</span>}
    </span>
  );
}
