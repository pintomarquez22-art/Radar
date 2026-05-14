"use client";

import Link from "next/link";
import { MessageCircle, Link2 } from "lucide-react";
import { Signal } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import TagBadge from "./TagBadge";
import VoteButton from "./VoteButton";
import StrengthBadge from "./StrengthBadge";
import TypeIcon from "./TypeIcon";

export default function SignalCard({ signal }: { signal: Signal }) {
  const timeAgo = formatDistanceToNow(new Date(signal.createdAt), { addSuffix: true, locale: es });

  return (
    <article className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200">
      <div className="flex gap-4">
        {/* Vote */}
        <div className="flex-shrink-0 pt-1">
          <VoteButton signalId={signal.id} votes={signal.votes} voted={signal.userVoted} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <TypeIcon type={signal.type} showLabel />
            <StrengthBadge strength={signal.strength} />
            <span className="text-xs text-gray-400 ml-auto">{timeAgo}</span>
          </div>

          {/* Title */}
          <Link href={`/signals/${signal.id}`}>
            <h2 className="text-base font-semibold text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
              {signal.title}
            </h2>
          </Link>

          {/* Observation preview */}
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {signal.observation}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {signal.tags.map((tag) => <TagBadge key={tag.id} tag={tag} small />)}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {signal.authorInitials}
              </div>
              <span className="text-xs text-gray-400">{signal.authorName}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-400">
              <Link href={`/signals/${signal.id}`} className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                <MessageCircle size={13} />
                <span>{signal.comments.length}</span>
              </Link>
              <span className="flex items-center gap-1">
                <Link2 size={12} />
                <span>{signal.sources.length} fuente{signal.sources.length !== 1 ? "s" : ""}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
