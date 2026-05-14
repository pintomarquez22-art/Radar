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
      className={`flex flex-col items-center gap-0.5 rounded-xl transition-all ${
        size === "sm" ? "px-2 py-1" : "px-3 py-2"
      } ${
        voted
          ? "bg-radar-500 text-white shadow-md shadow-radar-500/30"
          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
      aria-label={voted ? "Quitar voto" : "Votar"}
    >
      <ChevronUp size={size === "sm" ? 14 : 18} strokeWidth={2.5} />
      <span className={`font-bold leading-none ${size === "sm" ? "text-xs" : "text-sm"}`}>{votes}</span>
    </button>
  );
}
