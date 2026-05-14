"use client";

import Link from "next/link";
import { MessageCircle, Link2, ArrowRight } from "lucide-react";
import { Signal } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import TagBadge from "./TagBadge";
import VoteButton from "./VoteButton";
import StrengthBadge, { strengthConfig } from "./StrengthBadge";
import TypeIcon from "./TypeIcon";

export default function SignalCard({ signal }: { signal: Signal }) {
  const timeAgo = formatDistanceToNow(new Date(signal.createdAt), { addSuffix: true, locale: es });
  const sc = strengthConfig[signal.strength];

  return (
    <article className={`group bg-white border border-gray-200 border-l-4 ${sc.cardBorder} rounded-2xl p-5 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-200`}>
      <div className="flex gap-4">
        {/* Vote */}
        <div className="flex-shrink-0 pt-1">
          <VoteButton signalId={signal.id} votes={signal.votes} voted={signal.userVoted} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <TypeIcon type={signal.type} showLabel />
            <StrengthBadge strength={signal.strength} />
            <span className="text-xs text-gray-400 ml-auto">{timeAgo}</span>
          </div>

          {/* Title */}
          <Link href={`/signals/${signal.id}`}>
            <h2 className="text-[15px] font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
              {signal.title}
            </h2>
          </Link>

          {/* Observation */}
          <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
            {signal.observation}
          </p>

          {/* Implication teaser */}
          <div className="flex items-start gap-1.5 mb-3 p-2.5 rounded-lg bg-amber-50 border border-amber-100">
            <span className="text-amber-500 text-xs mt-0.5 flex-shrink-0">↳</span>
            <p className="text-xs text-amber-800 line-clamp-2 leading-relaxed">
              <span className="font-semibold">Banco:</span> {signal.implication}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {signal.tags.map((tag) => <TagBadge key={tag.id} tag={tag} small />)}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                {signal.authorInitials}
              </div>
              <span className="text-xs text-gray-400">{signal.authorName}</span>
            </div>

            <div className="flex items-center gap-3">
              <Link href={`/signals/${signal.id}`} className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors">
                <MessageCircle size={13} />
                <span>{signal.comments.length} {signal.comments.length === 0 ? "· sé el primero" : ""}</span>
              </Link>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Link2 size={12} />
                <span>{signal.sources.length}</span>
              </span>
              <Link href={`/signals/${signal.id}`} className="flex items-center gap-0.5 text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors opacity-0 group-hover:opacity-100">
                Ver <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
