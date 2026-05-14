"use client";

import { useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useStore } from "@/lib/store";
import SignalCard from "@/components/SignalCard";
import TagBadge from "@/components/TagBadge";
import { SignalType } from "@/lib/types";

const TYPE_FILTERS: { value: string; label: string }[] = [
  { value: "all",        label: "Todas" },
  { value: "foresight",  label: "Foresight" },
  { value: "technology", label: "Tecnología" },
  { value: "social",     label: "Social" },
  { value: "article",    label: "Artículos" },
];

export default function FeedPage() {
  const { state, dispatch } = useStore();
  const { signals, tags, searchQuery, activeType, activeTag } = state;

  const filtered = useMemo(() => {
    return signals.filter((s) => {
      const matchType = activeType === "all" || s.type === (activeType as SignalType);
      const matchTag  = activeTag === "all" || s.tags.some((t) => t.id === activeTag);
      const matchQ    = !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchTag && matchQ;
    });
  }, [signals, activeType, activeTag, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Main feed */}
        <div className="flex-1 min-w-0">
          {/* Search */}
          <div className="relative mb-5">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Buscar señales..."
              value={searchQuery}
              onChange={(e) => dispatch({ type: "SET_SEARCH", query: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-radar-500/40 placeholder:text-gray-400"
            />
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap gap-2 mb-5">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => dispatch({ type: "SET_TYPE_FILTER", value: f.value })}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeType === f.value
                    ? "bg-radar-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-xs text-gray-400 mb-4">
            {filtered.length} señal{filtered.length !== 1 ? "es" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* Cards */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <SlidersHorizontal size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">No hay señales que coincidan con los filtros.</p>
              </div>
            ) : (
              filtered.map((s) => <SignalCard key={s.id} signal={s} />)
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-60 flex-shrink-0">
          <div className="sticky top-20">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <SlidersHorizontal size={12} /> Filtrar por etiqueta
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => dispatch({ type: "SET_TAG_FILTER", value: "all" })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                  activeTag === "all"
                    ? "bg-gray-800 text-white border-gray-800 dark:bg-gray-100 dark:text-gray-900"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:opacity-80"
                }`}
              >
                Todas
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

            <div className="mt-6 p-4 rounded-xl bg-radar-50 dark:bg-radar-900/20 border border-radar-200 dark:border-radar-800">
              <p className="text-xs font-semibold text-radar-700 dark:text-radar-300 mb-1">¿Ves algo nuevo?</p>
              <p className="text-xs text-radar-600/70 dark:text-radar-400/70 mb-3">Comparte una señal con el equipo.</p>
              <a
                href="/signals/new"
                className="block text-center text-xs font-semibold px-3 py-2 rounded-lg bg-radar-500 text-white hover:bg-radar-600 transition-colors"
              >
                + Nueva señal
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
