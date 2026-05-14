"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useStore } from "@/lib/store";
import VoteButton from "@/components/VoteButton";
import TagBadge from "@/components/TagBadge";
import StrengthBadge from "@/components/StrengthBadge";
import TypeIcon from "@/components/TypeIcon";
import CommentSection from "@/components/CommentSection";

export default function SignalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { state } = useStore();
  const signal = state.signals.find((s) => s.id === id);

  if (!signal) return notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Volver al feed
      </Link>

      <article>
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <TypeIcon type={signal.type} showLabel />
          <StrengthBadge strength={signal.strength} />
          <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
            <Calendar size={11} />
            {format(new Date(signal.createdAt), "d MMM yyyy", { locale: es })}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 leading-tight mb-4">
          {signal.title}
        </h1>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {signal.tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>

        {/* Description */}
        <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
          {signal.description}
        </p>

        {/* Source */}
        {(signal.source || signal.url) && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 mb-6">
            <div className="flex-1">
              {signal.source && (
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Fuente: {signal.source}</p>
              )}
            </div>
            {signal.url && (
              <a
                href={signal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-radar-500 hover:text-radar-600 font-medium"
              >
                Ver fuente <ExternalLink size={12} />
              </a>
            )}
          </div>
        )}

        {/* Author + Vote */}
        <div className="flex items-center justify-between mb-8 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-radar-500 flex items-center justify-center text-white text-xs font-bold">
              {signal.authorInitials}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{signal.authorName}</p>
              <p className="text-xs text-gray-400">Añadió esta señal</p>
            </div>
          </div>
          <VoteButton signalId={signal.id} votes={signal.votes} voted={signal.userVoted} size="md" />
        </div>

        {/* Comments */}
        <CommentSection signalId={signal.id} comments={signal.comments} />
      </article>
    </div>
  );
}
