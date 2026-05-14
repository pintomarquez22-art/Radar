"use client";

import { useMemo } from "react";
import Link from "next/link";
import { TrendingUp, Tag as TagIcon, Zap } from "lucide-react";
import { useStore } from "@/lib/store";
import { SignalType } from "@/lib/types";
import TagBadge from "@/components/TagBadge";
import TypeIcon from "@/components/TypeIcon";
import StrengthBadge from "@/components/StrengthBadge";

export default function TrendsPage() {
  const { state } = useStore();
  const { signals, tags } = state;

  const tagStats = useMemo(() => {
    return tags
      .map((tag) => {
        const matching = signals.filter((s) => s.tags.some((t) => t.id === tag.id));
        const totalVotes = matching.reduce((sum, s) => sum + s.votes, 0);
        const strongCount = matching.filter((s) => s.strength === "strong").length;
        return { tag, count: matching.length, totalVotes, strongCount, signals: matching };
      })
      .filter((t) => t.count > 0)
      .sort((a, b) => b.totalVotes - a.totalVotes);
  }, [signals, tags]);

  const typeStats = useMemo(() => {
    const types: SignalType[] = ["foresight", "technology", "social", "article"];
    return types.map((type) => {
      const matching = signals.filter((s) => s.type === type);
      return { type, count: matching.length, totalVotes: matching.reduce((s, r) => s + r.votes, 0) };
    }).filter((t) => t.count > 0);
  }, [signals]);

  const topSignals = useMemo(
    () => [...signals].sort((a, b) => b.votes - a.votes).slice(0, 5),
    [signals]
  );

  const recentSignals = useMemo(
    () => [...signals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [signals]
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp size={24} className="text-radar-500" />
          Tendencias
        </h1>
        <p className="text-sm text-gray-400 mt-1">Vista agregada de las señales del equipo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Tag heatmap */}
        <div className="lg:col-span-2 space-y-6">

          {/* Top tags */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <TagIcon size={13} /> Temas con más actividad
            </h2>
            <div className="space-y-3">
              {tagStats.map(({ tag, count, totalVotes, strongCount }) => {
                const maxVotes = tagStats[0]?.totalVotes || 1;
                const pct = Math.round((totalVotes / maxVotes) * 100);
                return (
                  <div key={tag.id}>
                    <div className="flex items-center justify-between mb-1">
                      <TagBadge tag={tag} small />
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        {strongCount > 0 && (
                          <span className="text-red-500 font-medium">{strongCount} fuerte{strongCount !== 1 ? "s" : ""}</span>
                        )}
                        <span>{count} señal{count !== 1 ? "es" : ""}</span>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">{totalVotes} votos</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: tag.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Top voted signals */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Zap size={13} /> Señales más valoradas
            </h2>
            <div className="space-y-3">
              {topSignals.map((s, i) => (
                <Link
                  key={s.id}
                  href={`/signals/${s.id}`}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <span className="text-2xl font-black text-gray-200 dark:text-gray-700 w-8 text-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <TypeIcon type={s.type} showLabel />
                      <StrengthBadge strength={s.strength} />
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-radar-600 dark:group-hover:text-radar-400 line-clamp-2 transition-colors">
                      {s.title}
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-sm font-bold text-radar-500">{s.votes}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Type breakdown */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Por tipo
            </h2>
            <div className="space-y-2">
              {typeStats.map(({ type, count, totalVotes }) => (
                <div key={type} className="flex items-center justify-between py-1">
                  <TypeIcon type={type} showLabel />
                  <div className="text-xs text-gray-400 flex gap-3">
                    <span>{count} señales</span>
                    <span className="font-semibold text-gray-600 dark:text-gray-300">{totalVotes} v</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="bg-gradient-to-br from-radar-500 to-radar-700 rounded-2xl p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-radar-200 mb-4">Resumen</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-black">{signals.length}</p>
                <p className="text-xs text-radar-200 mt-0.5">Señales</p>
              </div>
              <div>
                <p className="text-3xl font-black">{signals.reduce((s, r) => s + r.votes, 0)}</p>
                <p className="text-xs text-radar-200 mt-0.5">Votos totales</p>
              </div>
              <div>
                <p className="text-3xl font-black">{signals.reduce((s, r) => s + r.comments.length, 0)}</p>
                <p className="text-xs text-radar-200 mt-0.5">Comentarios</p>
              </div>
              <div>
                <p className="text-3xl font-black">{signals.filter((s) => s.strength === "strong").length}</p>
                <p className="text-xs text-radar-200 mt-0.5">Señales fuertes</p>
              </div>
            </div>
          </section>

          {/* Recent */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Más recientes
            </h2>
            <div className="space-y-2">
              {recentSignals.map((s) => (
                <Link
                  key={s.id}
                  href={`/signals/${s.id}`}
                  className="block text-sm text-gray-700 dark:text-gray-300 hover:text-radar-500 transition-colors line-clamp-2 py-1 border-b border-gray-50 dark:border-gray-800 last:border-0"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
