"use client";

import { Tag } from "@/lib/types";

interface Props {
  tag: Tag;
  small?: boolean;
  onClick?: () => void;
  active?: boolean;
}

export default function TagBadge({ tag, small, onClick, active }: Props) {
  const base = small
    ? "text-xs px-2 py-0.5 rounded-full font-medium"
    : "text-sm px-3 py-1 rounded-full font-medium";

  return (
    <span
      onClick={onClick}
      style={{
        backgroundColor: active ? tag.color : `${tag.color}22`,
        color: active ? "#fff" : tag.color,
        borderColor: `${tag.color}44`,
        cursor: onClick ? "pointer" : "default",
      }}
      className={`${base} border transition-all select-none ${onClick ? "hover:opacity-80" : ""}`}
    >
      {tag.name}
    </span>
  );
}
