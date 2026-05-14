import { useState } from "react";
import { MessageSquare, Send, User, Calendar } from "lucide-react";
import { useComments } from "@/hooks/useComments";

export function CommentsSection({ addonId }: { addonId: string }) {
  const { comments, add } = useComments(addonId);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    add(name, text);
    setText("");
  };

  return (
    <section className="brut p-6 md:p-8 mb-8">
      <h2 className="font-display text-3xl md:text-4xl mb-5 flex items-center gap-3">
        <span className="size-10 rounded-md bg-lime border-2 border-ink grid place-items-center">
          <MessageSquare className="size-5" />
        </span>
        Comentários ({comments.length})
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-[10px] uppercase tracking-widest font-mono font-bold flex items-center gap-1">
              <User className="size-3" /> Nome
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              maxLength={30}
              className="mt-1 w-full h-10 px-3 rounded-md bg-input border-2 border-ink text-sm"
              required
            />
          </div>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest font-mono font-bold">Comentário</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="O que achou deste add-on?"
            maxLength={500}
            rows={3}
            className="mt-1 w-full px-3 py-2 rounded-md bg-input border-2 border-ink text-sm resize-none"
            required
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 h-10 rounded-md bg-orange border-2 border-ink font-bold uppercase text-sm brut-press"
          style={{ boxShadow: "4px 4px 0 0 var(--ink)" }}
        >
          <Send className="size-4" /> Enviar
        </button>
      </form>

      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            Nenhum comentário ainda. Seja o primeiro!
          </div>
        ) : (
          comments.slice().reverse().map((c) => (
            <div key={c.id} className="brut bg-paper p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm flex items-center gap-1">
                  <User className="size-3" /> {c.name}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3" />
                  {new Date(c.date).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <p className="text-sm text-foreground/85">{c.text}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
