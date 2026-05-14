"use client";

import { useMemo } from "react";
import { Search, SlidersHorizontal, Flame, TrendingUp } from "lucide-react";
import { useStore } from "@/lib/store";
import SignalCard from "@/components/SignalCard";
import TagBadge from "@/components/TagBadge";
import { SignalType } from "@/lib/types";

const TYPE_FILTERS: { value: string; label: string; emoji: string }[] = [
  { value: "all",        label: "Todas",      emoji: "·" },
  { value: "foresight",  label: "Foresight",  emoji: "🔭" },
  { value: "technology", label: "Tecnología", emoji: "⚙️" },
  { value: "social",     label: "Social",     emoji: "🌍" },
  { value: "article",    label: "Artículos",  emoji: "📰" },
];

export default function FeedPage() {
  const { state, dispatch } = useStore();
  const { signals, tags, searchQuery, activeType, activeTag } = state;

  const filtered = useMemo(() => {
    return signals.filter((s) => {
      const matchType = activeType === "all" || s.type === (activeType as SignalType);
      const matchTag  = activeTag === "all" || s.tags.some((t) => t.id === activeTag);
      const matchQ    = !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.observation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchTag && matchQ;
    });
  }, [signals, activeType, activeTag, searchQuery]);

  const topVoted  = useMemo(() => [...signals].sort((a, b) => b.votes - a.votes)[0], [signals]);
  const strongCount = signals.filter((s) => s.strength === "strong").length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Main feed */}
        <div className="flex-1 min-w-0">

          {/* Stats bar */}
          <div className="flex gap-3 mb-5">
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100">
              <Flame size={15} className="text-red-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-red-400 leading-none">Señales críticas</p>
                <p className="text-lg font-black text-red-600 leading-tight">{strongCount}</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-100">
              <TrendingUp size={15} className="text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-blue-400 leading-none">Total señales</p>
                <p className="text-lg font-black text-blue-600 leading-tight">{signals.length}</p>
              </div>
            </div>
            {topVoted && (
              <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-100 min-w-0">
                <span className="text-lg flex-shrink-0">⬆</span>
                <div className="min-w-0">
                  <p className="text-xs text-amber-500 leading-none">{topVoted.votes} votos</p>
                  <p className="text-xs font-bold text-amber-800 leading-tight truncate">{topVoted.title.split(" ").slice(0, 5).join(" ")}…</p>
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Buscar señales..."
              value={searchQuery}
              onChange={(e) => dispatch({ type: "SET_SEARCH", query: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400/30 placeholder:text-gray-400 shadow-sm"
            />
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap gap-2 mb-5">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => dispatch({ type: "SET_TYPE_FILTER", value: f.value })}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeType === f.value
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-800"
                }`}
              >
                {f.emoji} {f.label}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-xs text-gray-400 mb-4 font-medium">
            {filtered.length} señal{filtered.length !== 1 ? "es" : ""}
            {activeType !== "all" || activeTag !== "all" || searchQuery ? " · filtradas" : ""}
          </p>

          {/* Cards */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <SlidersHorizontal size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No hay señales con estos filtros.</p>
              </div>
            ) : (
              filtered.map((s) => <SignalCard key={s.id} signal={s} />)
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-60 flex-shrink-0">
          <div className="sticky top-20 space-y-5">

            {/* CTA */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 p-5 text-white shadow-lg shadow-blue-500/20">
              <p className="text-base font-black mb-1">¿Ves algo nuevo?</p>
              <p className="text-xs text-blue-100 mb-4 leading-relaxed">El equipo necesita tus ojos. Una señal a tiempo vale más que un informe tarde.</p>
              <a
                href="/signals/new"
                className="block text-center text-sm font-bold px-4 py-2.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
              >
                + Añadir señal
              </a>
            </div>

            {/* Leyenda de intensidad */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Intensidad de señal</p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-1 h-8 rounded-full bg-red-500" />
                  <div>
                    <p className="text-xs font-bold text-red-600">Crítica</p>
                    <p className="text-xs text-gray-400">Actuar ahora</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-1 h-8 rounded-full bg-amber-400" />
                  <div>
                    <p className="text-xs font-bold text-amber-600">En alza</p>
                    <p className="text-xs text-gray-400">Vigilar de cerca</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-1 h-8 rounded-full bg-slate-300" />
                  <div>
                    <p className="text-xs font-bold text-slate-500">Emergente</p>
                    <p className="text-xs text-gray-400">En el radar</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tag filters */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <SlidersHorizontal size={11} /> Temas
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => dispatch({ type: "SET_TAG_FILTER", value: "all" })}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
                    activeTag === "all"
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  Todos
                </button>
                {tags.map((tag) => (
                  <TagBadge
                    key={tag.id}
                    tag={tag}
                    small
                    active={activeTag === tag.id}
                    onClick={() => dispatch({ type: "SET_TAG_FILTER", value: activeTag === tag.id ? "all" : tag.id })}
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
