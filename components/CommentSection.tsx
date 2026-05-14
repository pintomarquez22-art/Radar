"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Send, MessageCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { Comment } from "@/lib/types";

export default function CommentSection({ signalId, comments }: { signalId: string; comments: Comment[] }) {
  const { dispatch } = useStore();
  const [text, setText] = useState("");
  const [name, setName] = useState("");

  const submit = () => {
    if (!text.trim() || !name.trim()) return;
    dispatch({
      type: "ADD_COMMENT",
      signalId,
      comment: {
        authorName: name.trim(),
        authorInitials: name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
        content: text.trim(),
        createdAt: new Date().toISOString(),
      },
    });
    setText("");
  };

  const colors = ["from-blue-400 to-blue-600", "from-violet-400 to-violet-600", "from-emerald-400 to-emerald-600", "from-amber-400 to-amber-600", "from-pink-400 to-pink-600"];

  return (
    <section className="mt-8">
      <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-5">
        <MessageCircle size={15} className="text-blue-500" />
        Discusión del equipo
        {comments.length > 0 && (
          <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">{comments.length}</span>
        )}
      </h3>

      {/* Comments */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 && (
          <div className="text-center py-8 rounded-2xl border-2 border-dashed border-gray-200">
            <MessageCircle size={28} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-medium text-gray-400">Sin interpretaciones todavía</p>
            <p className="text-xs text-gray-300 mt-1">Sé el primero en analizar esta señal</p>
          </div>
        )}
        {comments.map((c, i) => (
          <div key={c.id} className="flex gap-3">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
              {c.authorInitials}
            </div>
            <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-bold text-gray-900">{c.authorName}</span>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: es })}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-gradient-to-br from-blue-50 to-violet-50 border border-blue-100 rounded-2xl p-4">
        <p className="text-sm font-bold text-gray-700 mb-3">💬 Añade tu interpretación</p>
        <input
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-2 px-3 py-2 rounded-xl text-sm border border-blue-100 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
        />
        <div className="flex gap-2">
          <textarea
            rows={2}
            placeholder="¿Qué implicaciones ves? ¿Conecta con otra señal? ¿Matizarías algo?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) submit(); }}
            className="flex-1 px-3 py-2 rounded-xl text-sm border border-blue-100 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400/30 resize-none"
          />
          <button
            onClick={submit}
            disabled={!text.trim() || !name.trim()}
            className="self-end px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-30 transition-all active:scale-95 shadow-md shadow-blue-500/20"
          >
            <Send size={15} />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">⌘ + Enter para enviar</p>
      </div>
    </section>
  );
}
