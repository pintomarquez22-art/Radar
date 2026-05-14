"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { useStore } from "@/lib/store";
import { SignalType, SignalStrength } from "@/lib/types";
import TagBadge from "@/components/TagBadge";

const TYPES: { value: SignalType; label: string }[] = [
  { value: "foresight",  label: "Foresight" },
  { value: "technology", label: "Tecnología" },
  { value: "social",     label: "Tendencia social" },
  { value: "article",    label: "Artículo / noticia" },
];

const STRENGTHS: { value: SignalStrength; label: string; desc: string }[] = [
  { value: "weak",   label: "Débil",   desc: "Emergente, pocas evidencias" },
  { value: "medium", label: "Media",   desc: "Confirmada en varios contextos" },
  { value: "strong", label: "Fuerte",  desc: "Ampliamente documentada" },
];

export default function NewSignalPage() {
  const { state, dispatch } = useStore();
  const router = useRouter();

  const [title, setTitle]         = useState("");
  const [description, setDesc]    = useState("");
  const [url, setUrl]             = useState("");
  const [source, setSource]       = useState("");
  const [type, setType]           = useState<SignalType>("foresight");
  const [strength, setStrength]   = useState<SignalStrength>("medium");
  const [selectedTags, setTags]   = useState<string[]>([]);
  const [authorName, setAuthor]   = useState("");

  const toggleTag = (id: string) =>
    setTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  const canSubmit = title.trim() && description.trim() && authorName.trim();

  const submit = () => {
    if (!canSubmit) return;
    const tags = state.tags.filter((t) => selectedTags.includes(t.id));
    dispatch({
      type: "ADD_SIGNAL",
      signal: {
        title: title.trim(),
        description: description.trim(),
        url: url.trim() || undefined,
        source: source.trim() || undefined,
        type,
        strength,
        tags,
        authorName: authorName.trim(),
        authorInitials: authorName.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
      },
    });
    router.push("/");
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Volver al feed
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Nueva señal</h1>
      <p className="text-sm text-gray-400 mb-8">Comparte una señal con el equipo de foresight.</p>

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className="label">Título *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Describe la señal en una frase clara"
            className="input"
          />
        </div>

        {/* Description */}
        <div>
          <label className="label">Descripción *</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="¿Qué observas? ¿Por qué es relevante para el futuro?"
            className="input resize-none"
          />
        </div>

        {/* Type + Strength */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Tipo</label>
            <select value={type} onChange={(e) => setType(e.target.value as SignalType)} className="input">
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Intensidad</label>
            <select value={strength} onChange={(e) => setStrength(e.target.value as SignalStrength)} className="input">
              {STRENGTHS.map((s) => <option key={s.value} value={s.value}>{s.label} — {s.desc}</option>)}
            </select>
          </div>
        </div>

        {/* Source */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Fuente</label>
            <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="MIT TR, Reuters…" className="input" />
          </div>
          <div>
            <label className="label">URL</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className="input" />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="label">Etiquetas</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {state.tags.map((tag) => (
              <TagBadge
                key={tag.id}
                tag={tag}
                small
                active={selectedTags.includes(tag.id)}
                onClick={() => toggleTag(tag.id)}
              />
            ))}
          </div>
        </div>

        {/* Author */}
        <div>
          <label className="label">Tu nombre *</label>
          <input
            value={authorName}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Nombre Apellido"
            className="input"
          />
        </div>

        {/* Submit */}
        <button
          onClick={submit}
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-radar-500 hover:bg-radar-600 text-white font-semibold text-sm disabled:opacity-40 transition-colors shadow-md shadow-radar-500/20"
        >
          <Send size={15} />
          Publicar señal
        </button>
      </div>
    </div>
  );
}
