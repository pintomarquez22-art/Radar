"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Plus, Trash2, Eye, Zap, Landmark, Link2, ImagePlus, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { SignalType, SignalStrength, Source } from "@/lib/types";
import TagBadge from "@/components/TagBadge";

const TYPES: { value: SignalType; label: string }[] = [
  { value: "foresight",  label: "Foresight" },
  { value: "technology", label: "Tecnología" },
  { value: "social",     label: "Tendencia social" },
  { value: "article",    label: "Artículo / noticia" },
];

const STRENGTHS: { value: SignalStrength; label: string; desc: string }[] = [
  { value: "weak",   label: "Débil",  desc: "Emergente, pocas evidencias" },
  { value: "medium", label: "Media",  desc: "Confirmada en varios contextos" },
  { value: "strong", label: "Fuerte", desc: "Ampliamente documentada" },
];

function FieldBlock({ icon, label, color, children }: {
  icon: React.ReactNode; label: string; color: string; children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider opacity-60">{label}</span>
      </div>
      {children}
    </div>
  );
}

export default function NewSignalPage() {
  const { state, dispatch } = useStore();
  const router = useRouter();

  const [title, setTitle]           = useState("");
  const [sources, setSources]       = useState<Source[]>([{ label: "", url: "" }]);
  const [imageUrl, setImageUrl]     = useState("");
  const [observation, setObs]       = useState("");
  const [whySignal, setWhy]         = useState("");
  const [implication, setImpl]      = useState("");
  const [type, setType]             = useState<SignalType>("foresight");
  const [strength, setStrength]     = useState<SignalStrength>("medium");
  const [selectedTags, setTags]     = useState<string[]>([]);
  const [authorName, setAuthor]     = useState("");

  const addSource = () => setSources((s) => [...s, { label: "", url: "" }]);
  const removeSource = (i: number) => setSources((s) => s.filter((_, idx) => idx !== i));
  const updateSource = (i: number, field: keyof Source, val: string) =>
    setSources((s) => s.map((src, idx) => idx === i ? { ...src, [field]: val } : src));

  const toggleTag = (id: string) =>
    setTags((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);

  const canSubmit = title.trim() && observation.trim() && whySignal.trim() && implication.trim() && authorName.trim() && sources[0].label.trim();

  const submit = () => {
    if (!canSubmit) return;
    dispatch({
      type: "ADD_SIGNAL",
      signal: {
        title: title.trim(),
        sources: sources.filter((s) => s.label.trim()).map((s) => ({ label: s.label.trim(), url: s.url?.trim() || undefined })),
        observation: observation.trim(),
        whySignal: whySignal.trim(),
        implication: implication.trim(),
        imageUrl: imageUrl.trim() || undefined,
        type,
        strength,
        tags: state.tags.filter((t) => selectedTags.includes(t.id)),
        authorName: authorName.trim(),
        authorInitials: authorName.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
      },
    });
    router.push("/");
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft size={14} /> Volver al feed
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Nueva señal</h1>
      <p className="text-sm text-gray-400 mb-8">Documenta una señal de cambio para el equipo.</p>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="label">Nombre de la señal *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder='Ej: "Pagos biométricos por proximidad en escuelas públicas"'
            className="input" />
        </div>

        {/* Image */}
        <div>
          <label className="label flex items-center gap-1.5"><ImagePlus size={14} /> Imagen (opcional)</label>
          {imageUrl ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200">
              <img src={imageUrl} alt="preview" className="w-full h-40 object-cover" />
              <button
                onClick={() => setImageUrl("")}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Pega una URL de imagen (https://...)"
                className="input"
              />
              <div className="relative">
                <label className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 cursor-pointer transition-colors">
                  <ImagePlus size={16} /> O sube una foto desde tu dispositivo
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => setImageUrl(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>
            </div>
          )}
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

        {/* Sources */}
        <FieldBlock icon={<Link2 size={14} className="text-gray-500" />} label="Fuente / Evidencia *" color="border-gray-200 bg-gray-50">
          <div className="space-y-2">
            {sources.map((s, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <input value={s.label} onChange={(e) => updateSource(i, "label", e.target.value)}
                    placeholder="Nombre de la fuente (ej: Nature Medicine, 2026)"
                    className="input text-xs py-1.5" />
                  <input value={s.url || ""} onChange={(e) => updateSource(i, "url", e.target.value)}
                    placeholder="URL (opcional)"
                    className="input text-xs py-1.5" />
                </div>
                {sources.length > 1 && (
                  <button onClick={() => removeSource(i)} className="self-start mt-1 p-1.5 text-red-400 hover:text-red-600">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
            <button onClick={addSource} className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 mt-1">
              <Plus size={13} /> Añadir otra fuente
            </button>
          </div>
        </FieldBlock>

        {/* Observation */}
        <FieldBlock icon={<Eye size={14} className="text-blue-500" />} label="Observación *" color="border-blue-100 bg-blue-50">
          <textarea rows={3} value={observation} onChange={(e) => setObs(e.target.value)}
            placeholder="¿Qué está ocurriendo? Descripción concreta del hecho observado."
            className="w-full px-3 py-2 rounded-lg text-sm border border-blue-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400/40 resize-none" />
        </FieldBlock>

        {/* Why signal */}
        <FieldBlock icon={<Zap size={14} className="text-violet-500" />} label="¿Por qué es una señal? *" color="border-violet-100 bg-violet-50">
          <textarea rows={3} value={whySignal} onChange={(e) => setWhy(e.target.value)}
            placeholder="¿Qué tiene de futuro o de ruptura con el presente?"
            className="w-full px-3 py-2 rounded-lg text-sm border border-violet-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400/40 resize-none" />
        </FieldBlock>

        {/* Implication */}
        <FieldBlock icon={<Landmark size={14} className="text-amber-600" />} label="Implicación para el banco *" color="border-amber-200 bg-amber-50">
          <textarea rows={3} value={implication} onChange={(e) => setImpl(e.target.value)}
            placeholder='"Si esto se vuelve masivo, entonces el banco deberá…"'
            className="w-full px-3 py-2 rounded-lg text-sm border border-amber-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400/40 resize-none" />
        </FieldBlock>

        {/* Tags */}
        <div>
          <label className="label">Etiquetas</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {state.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} small active={selectedTags.includes(tag.id)} onClick={() => toggleTag(tag.id)} />
            ))}
          </div>
        </div>

        {/* Author */}
        <div>
          <label className="label">Tu nombre *</label>
          <input value={authorName} onChange={(e) => setAuthor(e.target.value)} placeholder="Nombre Apellido" className="input" />
        </div>

        <button onClick={submit} disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm disabled:opacity-40 transition-colors shadow-md">
          <Send size={15} /> Publicar señal
        </button>
      </div>
    </div>
  );
}
