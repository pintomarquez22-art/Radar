"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, ExternalLink, ThumbsUp,
  MessageSquare, ChevronRight, Train, TreePine,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Signal } from "@/lib/types";

const INFRA_TAG_IDS = ["t13", "t14", "t15", "t16", "t11"];

const SIGNAL_GRADIENTS: Record<string, string> = {
  s9:  "from-[#051525] via-[#072a4a] to-[#041020]",
  s10: "from-[#051a0a] via-[#083a14] to-[#041008]",
  s11: "from-[#0d0520] via-[#1a0a40] to-[#080318]",
  s12: "from-[#200a02] via-[#3a1205] to-[#180801]",
  s13: "from-[#041a06] via-[#083a10] to-[#031204]",
  s14: "from-[#030d20] via-[#051a40] to-[#020a18]",
};

const TYPE_CONFIG: Record<string, { label: string; cls: string }> = {
  foresight:  { label: "Foresight",  cls: "bg-violet-500/20 text-violet-300 border border-violet-500/30" },
  technology: { label: "Tecnología", cls: "bg-sky-500/20 text-sky-300 border border-sky-500/30" },
  social:     { label: "Social",     cls: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" },
  article:    { label: "Artículo",   cls: "bg-amber-500/20 text-amber-300 border border-amber-500/30" },
};

const STRENGTH_CONFIG = {
  strong: { label: "Crítica",   dot: "bg-red-400",   text: "text-red-400",   ring: "ring-red-500/30",   cls: "bg-red-500/15 text-red-300 border border-red-500/30" },
  medium: { label: "En alza",   dot: "bg-amber-400", text: "text-amber-400", ring: "ring-amber-500/30", cls: "bg-amber-500/15 text-amber-300 border border-amber-500/30" },
  weak:   { label: "Emergente", dot: "bg-slate-400", text: "text-slate-400", ring: "ring-slate-500/30", cls: "bg-slate-500/15 text-slate-300 border border-slate-500/30" },
};

// ─── Cover Slide ────────────────────────────────────────────────────────────

function RadarSVG() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" aria-hidden>
      {/* Concentric rings */}
      {[180, 130, 80, 30].map((r) => (
        <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="white" strokeWidth="0.5" />
      ))}
      {/* Cross hairs */}
      <line x1="20" y1="200" x2="380" y2="200" stroke="white" strokeWidth="0.3" />
      <line x1="200" y1="20" x2="200" y2="380" stroke="white" strokeWidth="0.3" />
      {/* Diagonal faint lines */}
      <line x1="72" y1="72" x2="328" y2="328" stroke="white" strokeWidth="0.2" />
      <line x1="328" y1="72" x2="72" y2="328" stroke="white" strokeWidth="0.2" />
      {/* Sweep line */}
      <g className="animate-radar-spin">
        <line x1="200" y1="200" x2="200" y2="20" stroke="#0ea5e9" strokeWidth="1.5" />
        <path d="M200,200 L200,20 A180,180 0 0,1 235,25 Z" fill="url(#sweep)" />
      </g>
      {/* Blip dots */}
      <circle cx="265" cy="140" r="3" fill="#0ea5e9" className="animate-radar-glow" />
      <circle cx="130" cy="250" r="2.5" fill="#0ea5e9" className="animate-radar-glow" style={{ animationDelay: "0.8s" }} />
      <circle cx="300" cy="220" r="2" fill="#0ea5e9" className="animate-radar-glow" style={{ animationDelay: "1.6s" }} />
      <circle cx="155" cy="120" r="2" fill="#0ea5e9" className="animate-radar-glow" style={{ animationDelay: "2.4s" }} />
      <defs>
        <radialGradient id="sweep" cx="0%" cy="0%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function StatCard({ value, label, delay = 0 }: { value: number | string; label: string; delay?: number }) {
  return (
    <div
      className="animate-count-up flex flex-col items-center px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <span className="text-4xl font-black text-white tabular-nums">{value}</span>
      <span className="text-xs text-white/40 mt-1 uppercase tracking-wider font-medium">{label}</span>
    </div>
  );
}

function CoverSlide({ signals, onStart }: { signals: Signal[]; onStart: () => void }) {
  const strong = signals.filter((s) => s.strength === "strong").length;
  const votes = signals.reduce((sum, s) => sum + s.votes, 0);
  const comments = signals.reduce((sum, s) => sum + s.comments.length, 0);

  return (
    <div
      className="relative h-full bg-[#060912] overflow-hidden flex flex-col items-center justify-center px-8"
      style={{
        backgroundImage: "radial-gradient(circle at 60% 50%, rgba(14,165,233,0.06) 0%, transparent 60%)",
      }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Radar graphic */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[520px] h-[520px] opacity-[0.12] pointer-events-none">
        <RadarSVG />
      </div>

      {/* Glow blob */}
      <div className="absolute right-32 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-radar-500/8 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full">
        {/* Labels */}
        <div className="flex items-center gap-2 mb-6">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Train size={11} /> Transporte
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <TreePine size={11} /> Espacios Públicos
          </span>
        </div>

        {/* Main title */}
        <h1 className="text-[clamp(3rem,8vw,6rem)] font-black leading-none tracking-tight mb-2">
          <span className="bg-gradient-to-r from-white via-blue-100 to-radar-400 bg-clip-text text-transparent">
            INFRAESTRUCTURA
          </span>
        </h1>
        <div className="flex items-baseline gap-4 mb-6">
          <span className="text-5xl font-black text-radar-500">2026</span>
          <span className="text-white/30 text-sm font-medium tracking-wider">Señales & tendencias</span>
        </div>

        <p className="text-white/50 text-base leading-relaxed mb-10 max-w-lg">
          Un repaso por las señales más relevantes en movilidad urbana y espacio público
          que están redefiniendo la infraestructura de nuestras ciudades.
        </p>

        {/* Stats */}
        <div className="flex gap-3 mb-10 flex-wrap">
          <StatCard value={signals.length} label="Señales" delay={0} />
          <StatCard value={strong}         label="Críticas" delay={80} />
          <StatCard value={votes}          label="Votos" delay={160} />
          <StatCard value={comments}       label="Comentarios" delay={240} />
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <button
            onClick={onStart}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-radar-500 hover:bg-radar-400 text-white text-sm font-bold transition-all shadow-lg shadow-radar-500/25 hover:shadow-radar-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            Comenzar presentación <ArrowRight size={15} />
          </button>
          <span className="text-white/25 text-xs font-medium">← → para navegar</span>
        </div>
      </div>
    </div>
  );
}

// ─── Signal Slide ────────────────────────────────────────────────────────────

function SignalSlide({ signal, index, total }: { signal: Signal; index: number; total: number }) {
  const gradient = SIGNAL_GRADIENTS[signal.id] ?? "from-[#060912] to-[#060912]";
  const strength = STRENGTH_CONFIG[signal.strength];
  const type = TYPE_CONFIG[signal.type];

  return (
    <div className="h-full flex">

      {/* Left — Image / visual */}
      <div className={`relative w-[42%] flex-shrink-0 bg-gradient-to-br ${gradient} overflow-hidden`}>

        {/* Background image */}
        {signal.imageUrl && (
          <>
            <img
              src={signal.imageUrl}
              alt={signal.title}
              className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60" />
          </>
        )}

        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Glow */}
        <div className="absolute inset-0 bg-radar-500/5 mix-blend-screen" />

        {/* Number — huge watermark */}
        <div className="absolute top-6 left-6 text-[10rem] font-black leading-none text-white/[0.05] select-none pointer-events-none">
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Strength badge */}
        <div className="absolute top-5 right-5">
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${strength.cls} backdrop-blur-md`}>
            <span className={`w-1.5 h-1.5 rounded-full ${strength.dot} animate-pulse`} />
            {strength.label}
          </span>
        </div>

        {/* Bottom content on image side */}
        <div className="absolute bottom-0 left-0 right-0 p-7">
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${type.cls} backdrop-blur-md`}>
              {type.label}
            </span>
            <span className="text-white/30 text-xs">señal {index + 1} de {total}</span>
          </div>
          <h2 className="text-xl font-black text-white leading-snug drop-shadow-lg">
            {signal.title}
          </h2>

          {/* Divider line accent */}
          <div className="mt-4 flex items-center gap-2">
            <div className="h-px flex-1 bg-white/10" />
            <div className={`w-8 h-px ${strength.dot}`} />
          </div>
        </div>
      </div>

      {/* Right — Content */}
      <div className="flex-1 bg-[#0a0e1a] flex flex-col overflow-hidden">

        {/* Right header */}
        <div className="px-7 pt-6 pb-4 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${strength.dot}`} />
            <span className={`text-xs font-bold ${strength.text} uppercase tracking-wider`}>
              {strength.label}
            </span>
            <span className="text-white/15 text-xs">·</span>
            <span className="text-white/30 text-xs">{type.label}</span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-7 py-5 space-y-3 scrollbar-thin">

          {/* Observation */}
          <section className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-4">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">
              Observación
            </p>
            <p className="text-sm text-white/75 leading-relaxed">{signal.observation}</p>
          </section>

          {/* Why signal */}
          <section className="rounded-xl bg-amber-500/[0.07] border border-amber-500/20 p-4">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">
              ⚡ ¿Por qué es señal?
            </p>
            <p className="text-sm text-amber-100/80 leading-relaxed">{signal.whySignal}</p>
          </section>

          {/* Implication */}
          <section className="rounded-xl bg-radar-500/[0.07] border border-radar-500/20 p-4">
            <p className="text-[10px] font-bold text-radar-400 uppercase tracking-widest mb-2">
              🎯 Implicación
            </p>
            <p className="text-sm text-radar-100/80 leading-relaxed">{signal.implication}</p>
          </section>

          {/* Sources */}
          <div>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">Fuentes</p>
            <div className="flex flex-wrap gap-1.5">
              {signal.sources.map((src, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/40">
                  {src.url ? (
                    <a href={src.url} target="_blank" rel="noopener noreferrer"
                      className="hover:text-white/80 flex items-center gap-1 transition-colors">
                      {src.label} <ExternalLink size={9} />
                    </a>
                  ) : src.label}
                </span>
              ))}
            </div>
          </div>

          {/* Comments */}
          {signal.comments.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <MessageSquare size={10} /> Equipo ({signal.comments.length})
              </p>
              <div className="space-y-2">
                {signal.comments.map((c) => (
                  <div key={c.id} className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-radar-400 to-violet-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[9px] font-bold">{c.authorInitials}</span>
                    </div>
                    <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2">
                      <p className="text-[10px] font-semibold text-white/50 mb-0.5">{c.authorName}</p>
                      <p className="text-xs text-white/60 leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right footer */}
        <div className="px-7 py-4 border-t border-white/5 flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-radar-400 to-violet-500 flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">{signal.authorInitials}</span>
            </div>
            <span className="text-xs text-white/30">{signal.authorName}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/25">
            <span className="flex items-center gap-1"><ThumbsUp size={10} /> {signal.votes}</span>
            <Link href={`/signals/${signal.id}`}
              className="flex items-center gap-1 hover:text-white/60 transition-colors">
              Ver en Radar <ExternalLink size={10} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Navigation Bar ──────────────────────────────────────────────────────────

function NavBar({
  slide, total, onSlide,
}: {
  slide: number; total: number; onSlide: (i: number) => void;
}) {
  const isFirst = slide === -1;
  const isLast  = slide === total - 1;

  return (
    <div className="flex-shrink-0 flex items-center justify-between px-6 h-14 bg-[#060912] border-t border-white/[0.07]">
      {/* Prev */}
      <button
        onClick={() => onSlide(slide - 1)}
        disabled={isFirst}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
      >
        <ArrowLeft size={13} /> Anterior
      </button>

      {/* Dots */}
      <div className="flex items-center gap-1.5">
        {/* Cover dot */}
        <button
          onClick={() => onSlide(-1)}
          className={`rounded-full transition-all duration-300 ${
            slide === -1
              ? "w-6 h-1.5 bg-radar-500"
              : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
          }`}
          aria-label="Portada"
        />
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onSlide(i)}
            className={`rounded-full transition-all duration-300 ${
              slide === i
                ? "w-6 h-1.5 bg-radar-500"
                : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Señal ${i + 1}`}
          />
        ))}
      </div>

      {/* Next */}
      <button
        onClick={() => onSlide(slide + 1)}
        disabled={isLast}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-radar-500/20 text-radar-300 hover:bg-radar-500/30 border border-radar-500/20 hover:border-radar-500/40 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
      >
        {isFirst ? "Comenzar" : "Siguiente"} <ArrowRight size={13} />
      </button>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function InfraestructuraPage() {
  const { state } = useStore();
  const [slide, setSlide] = useState(-1);     // -1 = cover
  const [visible, setVisible] = useState(true);
  const [animDir, setAnimDir] = useState<"right" | "left">("right");

  const signals = useMemo(
    () => state.signals.filter((s) => s.tags.some((t) => INFRA_TAG_IDS.includes(t.id))),
    [state.signals]
  );

  const navigateTo = useCallback((next: number) => {
    if (next < -1 || next >= signals.length) return;
    setAnimDir(next > slide ? "right" : "left");
    setVisible(false);
    setTimeout(() => {
      setSlide(next);
      setVisible(true);
    }, 180);
  }, [slide, signals.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown")  navigateTo(slide + 1);
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")    navigateTo(slide - 1);
      if (e.key === "Home")                                  navigateTo(-1);
      if (e.key === "End")                                   navigateTo(signals.length - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigateTo, slide, signals.length]);

  const animClass = visible
    ? animDir === "right" ? "animate-slide-in-right" : "animate-slide-in-left"
    : "";

  return (
    <div
      className="flex flex-col bg-[#060912] overflow-hidden"
      style={{ height: "calc(100vh - 56px)" }}
    >
      {/* Slides area */}
      <div className="flex-1 overflow-hidden relative">
        <div
          key={slide}
          className={`absolute inset-0 ${animClass}`}
          style={{ opacity: visible ? 1 : 0, transition: "opacity 180ms ease" }}
        >
          {slide === -1 ? (
            <CoverSlide signals={signals} onStart={() => navigateTo(0)} />
          ) : (
            <SignalSlide
              signal={signals[slide]}
              index={slide}
              total={signals.length}
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <NavBar slide={slide} total={signals.length} onSlide={navigateTo} />
    </div>
  );
}
