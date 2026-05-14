"use client";

import Link from "next/link";
import { MessageCircle, ExternalLink } from "lucide-react";
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
    <article className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:border-radar-400 dark:hover:border-radar-600 hover:shadow-lg hover:shadow-radar-500/5 transition-all duration-200 animate-fade-in">
      <div className="flex gap-4">
        {/* Vote column */}
        <div className="flex-shrink-0 pt-1">
          <VoteButton signalId={signal.id} votes={signal.votes} voted={signal.userVoted} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <TypeIcon type={signal.type} showLabel />
            <StrengthBadge strength={signal.strength} />
            <span className="text-xs text-gray-400 ml-auto">{timeAgo}</span>
          </div>

          {/* Title */}
          <Link href={`/signals/${signal.id}`} className="block group-hover:text-radar-600 dark:group-hover:text-radar-400 transition-colors">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug mb-1.5">
              {signal.title}
            </h2>
          </Link>

          {/* Description */}
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {signal.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {signal.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} small />
            ))}
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-radar-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {signal.authorInitials}
              </div>
              <span className="text-xs text-gray-400">{signal.authorName}</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/signals/${signal.id}`}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-radar-500 transition-colors"
              >
                <MessageCircle size={13} />
                <span>{signal.comments.length}</span>
              </Link>

              {signal.url && (
                <a
                  href={signal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-gray-400 hover:text-radar-500 transition-colors"
                >
                  <ExternalLink size={13} />
                </a>
              )}

              {signal.source && (
                <span className="text-xs text-gray-400 italic">{signal.source}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
