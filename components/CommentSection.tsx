"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Send } from "lucide-react";
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

  return (
    <section className="mt-6">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        Discusión ({comments.length})
      </h3>

      {/* Comment list */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 && (
          <p className="text-sm text-gray-400 italic">Sin comentarios aún. Sé el primero en interpretar esta señal.</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-radar-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {c.authorInitials}
            </div>
            <div className="flex-1 bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{c.authorName}</span>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: es })}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* New comment form */}
      <div className="bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Añadir interpretación</p>
        <input
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-2 px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-radar-500/40"
        />
        <div className="flex gap-2">
          <textarea
            rows={2}
            placeholder="¿Qué implicaciones tiene esta señal?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) submit(); }}
            className="flex-1 px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-radar-500/40 resize-none"
          />
          <button
            onClick={submit}
            disabled={!text.trim() || !name.trim()}
            className="self-end px-3 py-2 rounded-lg bg-radar-500 text-white hover:bg-radar-600 disabled:opacity-40 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
