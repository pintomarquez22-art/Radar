"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Train, TreePine, ArrowLeft, ArrowRight, ChevronRight,
  Maximize2, Minimize2, ExternalLink, MessageSquare, ThumbsUp,
  Zap, MapPin, Bus, Bike,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Signal } from "@/lib/types";
import StrengthBadge from "@/components/StrengthBadge";
import TypeIcon from "@/components/TypeIcon";

const INFRA_TAG_IDS = ["t13", "t14", "t15", "t16", "t11"];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  s9:  <Zap size={16} />,
  s10: <Bike size={16} />,
  s11: <Train size={16} />,
  s12: <Bus size={16} />,
  s13: <TreePine size={16} />,
  s14: <MapPin size={16} />,
};

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === current ? "w-6 bg-blue-500" : i < current ? "w-3 bg-blue-300" : "w-3 bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function StatPill({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className={`flex flex-col items-center px-5 py-3 rounded-xl border ${accent ?? "bg-white border-gray-200"}`}>
      <span className="text-2xl font-black text-gray-900">{value}</span>
      <span className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">{label}</span>
    </div>
  );
}

function SignalListItem({
  signal, active, index, onClick,
}: {
  signal: Signal; active: boolean; index: number; onClick: () => void;
}) {
  const icon = CATEGORY_ICONS[signal.id];
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-3 rounded-xl border transition-all duration-200 group ${
        active
          ? "bg-blue-50 border-blue-200 shadow-sm"
          : "bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
          active ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
        }`}>
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold leading-snug line-clamp-2 ${active ? "text-blue-900" : "text-gray-800"}`}>
            {signal.title}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <StrengthBadge strength={signal.strength} />
            <span className="text-xs text-gray-400">⬆ {signal.votes}</span>
          </div>
        </div>
        {active && <ChevronRight size={14} className="text-blue-400 flex-shrink-0 mt-1" />}
      </div>
    </button>
  );
}

function SignalDetail({ signal, index, total, onPrev, onNext, fullscreen }: {
  signal: Signal; index: number; total: number;
  onPrev: () => void; onNext: () => void; fullscreen: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TypeIcon type={signal.type} showLabel />
          <StrengthBadge strength={signal.strength} />
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="font-medium">{index + 1} / {total}</span>
          <ProgressBar current={index} total={total} />
        </div>
      </div>

      {/* Title */}
      <h2 className={`font-black text-gray-900 leading-tight mb-4 ${fullscreen ? "text-2xl" : "text-xl"}`}>
        {signal.title}
      </h2>

      {/* Image */}
      {signal.imageUrl && (
        <div className="rounded-xl overflow-hidden mb-5 flex-shrink-0" style={{ height: fullscreen ? 220 : 160 }}>
          <img
            src={signal.imageUrl}
            alt={signal.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">

        <section>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Observación</p>
          <p className="text-sm text-gray-700 leading-relaxed">{signal.observation}</p>
        </section>

        <section className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">¿Por qué es señal?</p>
          <p className="text-sm text-amber-900 leading-relaxed">{signal.whySignal}</p>
        </section>

        <section className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1.5">Implicación</p>
          <p className="text-sm text-blue-900 leading-relaxed">{signal.implication}</p>
        </section>

        {/* Sources */}
        <section>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Fuentes</p>
          <div className="flex flex-wrap gap-1.5">
            {signal.sources.map((src, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600"
              >
                {src.url ? (
                  <a href={src.url} target="_blank" rel="noopener noreferrer"
                    className="hover:text-blue-600 flex items-center gap-1">
                    {src.label} <ExternalLink size={10} />
                  </a>
                ) : src.label}
              </span>
            ))}
          </div>
        </section>

        {/* Comments */}
        {signal.comments.length > 0 && (
          <section>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MessageSquare size={11} /> Discusión del equipo
            </p>
            <div className="space-y-2">
              {signal.comments.map((c) => (
                <div key={c.id} className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{c.authorInitials}</span>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                    <p className="text-xs font-semibold text-gray-700 mb-0.5">{c.authorName}</p>
                    <p className="text-xs text-gray-600">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer meta */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{signal.authorInitials}</span>
            </div>
            <span className="text-xs text-gray-500">{signal.authorName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <ThumbsUp size={12} />
            <span className="font-semibold">{signal.votes} votos</span>
            <Link
              href={`/signals/${signal.id}`}
              className="ml-3 text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              Ver completo <ExternalLink size={10} />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 flex-shrink-0">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600
            bg-white border border-gray-200 hover:border-gray-400 hover:text-gray-900 transition-all
            disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={15} /> Anterior
        </button>
        <span className="text-xs text-gray-400 font-medium">← → para navegar</span>
        <button
          onClick={onNext}
          disabled={index === total - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white
            bg-blue-500 hover:bg-blue-600 transition-all shadow-sm
            disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Siguiente <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

export default function InfraestructuraPage() {
  const { state } = useStore();
  const [activeIdx, setActiveIdx] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const signals = useMemo(
    () => state.signals.filter((s) =>
      s.tags.some((t) => INFRA_TAG_IDS.includes(t.id))
    ),
    [state.signals]
  );

  const strongCount = signals.filter((s) => s.strength === "strong").length;
  const totalVotes = signals.reduce((sum, s) => sum + s.votes, 0);
  const totalComments = signals.reduce((sum, s) => sum + s.comments.length, 0);

  const current = signals[activeIdx];

  const prev = useCallback(() => setActiveIdx((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setActiveIdx((i) => Math.min(signals.length - 1, i + 1)), [signals.length]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
      if (e.key === "f" || e.key === "F") setFullscreen((v) => !v);
      if (e.key === "Escape") setFullscreen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  if (!current) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-gray-400">
        <p>No hay señales de infraestructura todavía.</p>
      </div>
    );
  }

  return (
    <div className={fullscreen
      ? "fixed inset-0 z-50 bg-white overflow-hidden flex flex-col"
      : "max-w-5xl mx-auto px-4 py-6"
    }>
      {/* Header */}
      <div className={`${fullscreen ? "px-8 pt-6 pb-4 border-b border-gray-100" : "mb-6"}`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                <Train size={12} /> Transporte
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                <TreePine size={12} /> Espacios Públicos
              </div>
            </div>
            <h1 className="text-2xl font-black text-gray-900">
              Infraestructura 2026
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Señales en movilidad y espacio público · {signals.length} señales activas
            </p>
          </div>

          <button
            onClick={() => setFullscreen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all"
            title="Alternar modo presentación (F)"
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            {fullscreen ? "Salir" : "Modo presentación"}
          </button>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mt-4">
          <StatPill label="Señales" value={signals.length} />
          <StatPill
            label="Críticas"
            value={strongCount}
            accent="bg-red-50 border-red-100"
          />
          <StatPill label="Votos totales" value={totalVotes} />
          <StatPill label="Comentarios" value={totalComments} />
        </div>
      </div>

      {/* Main layout */}
      <div className={`flex gap-5 ${fullscreen ? "flex-1 px-8 py-6 overflow-hidden" : "mt-2"} min-h-0`}>

        {/* Signal list */}
        <aside className={`flex-shrink-0 overflow-y-auto ${fullscreen ? "w-72" : "w-64 hidden md:block"}`}>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Señales · {signals.length}
          </p>
          <div className="space-y-2">
            {signals.map((s, i) => (
              <SignalListItem
                key={s.id}
                signal={s}
                index={i}
                active={i === activeIdx}
                onClick={() => setActiveIdx(i)}
              />
            ))}
          </div>
        </aside>

        {/* Detail panel */}
        <div className={`flex-1 min-w-0 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 ${
          fullscreen ? "overflow-hidden flex flex-col" : "min-h-[640px] flex flex-col"
        }`}>
          <SignalDetail
            signal={current}
            index={activeIdx}
            total={signals.length}
            onPrev={prev}
            onNext={next}
            fullscreen={fullscreen}
          />
        </div>
      </div>

      {/* Mobile nav (visible only on small screens outside fullscreen) */}
      {!fullscreen && (
        <div className="md:hidden mt-4 flex gap-2 overflow-x-auto pb-1">
          {signals.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveIdx(i)}
              className={`flex-shrink-0 w-8 h-8 rounded-full text-sm font-black transition-all ${
                i === activeIdx
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
