"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Calendar, Eye, Zap, Landmark, Link2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useStore } from "@/lib/store";
import VoteButton from "@/components/VoteButton";
import TagBadge from "@/components/TagBadge";
import StrengthBadge from "@/components/StrengthBadge";
import TypeIcon from "@/components/TypeIcon";
import CommentSection from "@/components/CommentSection";

function Section({ icon, label, color, children }: {
  icon: React.ReactNode;
  label: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border p-4 mb-4 ${color}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider opacity-70">{label}</span>
      </div>
      {children}
    </div>
  );
}

export default function SignalDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { state } = useStore();
  const signal = state.signals.find((s) => s.id === id);

  if (!signal) return notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft size={14} /> Volver al feed
      </Link>

      <article>
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <TypeIcon type={signal.type} showLabel />
          <StrengthBadge strength={signal.strength} />
          <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
            <Calendar size={11} />
            {format(new Date(signal.createdAt), "d MMM yyyy", { locale: es })}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-3">
          {signal.title}
        </h1>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {signal.tags.map((tag) => <TagBadge key={tag.id} tag={tag} />)}
        </div>

        {/* 1. Sources */}
        <Section
          icon={<Link2 size={14} className="text-gray-500" />}
          label="Fuente / Evidencia"
          color="border-gray-200 bg-gray-50"
        >
          <ul className="space-y-1">
            {signal.sources.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-gray-400">·</span>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1">
                    {s.label} <ExternalLink size={11} />
                  </a>
                ) : (
                  <span>{s.label}</span>
                )}
              </li>
            ))}
          </ul>
        </Section>

        {/* 2. Observation */}
        <Section
          icon={<Eye size={14} className="text-blue-500" />}
          label="Observación"
          color="border-blue-100 bg-blue-50"
        >
          <p className="text-sm text-blue-900 leading-relaxed">{signal.observation}</p>
        </Section>

        {/* 3. Why signal */}
        <Section
          icon={<Zap size={14} className="text-violet-500" />}
          label="¿Por qué es una señal?"
          color="border-violet-100 bg-violet-50"
        >
          <p className="text-sm text-violet-900 leading-relaxed">{signal.whySignal}</p>
        </Section>

        {/* 4. Implication */}
        <Section
          icon={<Landmark size={14} className="text-amber-600" />}
          label="Implicación para el banco"
          color="border-amber-200 bg-amber-50"
        >
          <p className="text-sm text-amber-900 leading-relaxed">{signal.implication}</p>
        </Section>

        {/* Author + Vote */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
              {signal.authorInitials}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{signal.authorName}</p>
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
