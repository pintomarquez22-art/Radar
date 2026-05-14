"use client";

import { ChevronUp } from "lucide-react";
import { useStore } from "@/lib/store";

interface Props {
  signalId: string;
  votes: number;
  voted: boolean;
  size?: "sm" | "md";
}

export default function VoteButton({ signalId, votes, voted, size = "md" }: Props) {
  const { dispatch } = useStore();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: "VOTE", signalId });
      }}
      title={voted ? "Quitar voto" : "Esta señal importa"}
      className={`flex flex-col items-center gap-0.5 rounded-xl transition-all duration-150 active:scale-95 ${
        size === "sm" ? "px-2 py-1.5" : "px-3 py-2.5"
      } ${
        voted
          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105"
          : "bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-500 hover:shadow-md"
      }`}
    >
      <ChevronUp size={size === "sm" ? 14 : 18} strokeWidth={2.5} />
      <span className={`font-black leading-none tabular-nums ${size === "sm" ? "text-xs" : "text-sm"}`}>{votes}</span>
    </button>
  );
}
