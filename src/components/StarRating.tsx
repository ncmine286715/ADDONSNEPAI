import { useState } from "react";
import { Star, Send } from "lucide-react";
import { useRatings } from "@/hooks/useRatings";

export function StarRating({ addonId }: { addonId: string }) {
  const { ratings, average, count, add, userRating } = useRatings(addonId);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleRate = (stars: number) => {
    add(stars, comment || undefined);
    setSubmitted(true);
    setComment("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="brut p-6 md:p-8 mb-8 bg-secondary">
      <h2 className="font-display text-3xl md:text-4xl mb-4 flex items-center gap-3">
        <span className="size-10 rounded-md bg-orange border-2 border-ink grid place-items-center">
          <Star className="size-5 fill-ink" />
        </span>
        Avaliações
      </h2>

      <div className="flex items-center gap-3 mb-4">
        <span className="font-display text-5xl">{average.toFixed(1)}</span>
        <div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`size-5 ${s <= Math.round(average) ? "fill-orange text-orange" : "text-muted-foreground"}`}
              />
            ))}
          </div>
          <div className="text-xs text-muted-foreground">{count} avaliação{count !== 1 ? "es" : ""}</div>
        </div>
      </div>

      {userRating === 0 ? (
        <div className="space-y-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                onClick={() => handleRate(s)}
                className="size-10 rounded-md border-2 border-ink grid place-items-center bg-paper hover:bg-orange transition"
              >
                <Star
                  className={`size-5 transition ${
                    s <= (hover || userRating) ? "fill-orange text-orange" : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comentário opcional (máx. 300 caracteres)"
            maxLength={300}
            rows={2}
            className="w-full px-3 py-2 rounded-md bg-input border-2 border-ink text-sm resize-none"
          />
        </div>
      ) : (
        <div className="brut-tag bg-lime">
          <Star className="size-3 fill-ink" /> Você avaliou com {userRating} estrela{userRating !== 1 ? "s" : ""}!
        </div>
      )}

      {submitted && (
        <div className="mt-3 text-sm font-bold text-emerald-600 flex items-center gap-1">
          <Send className="size-4" /> Avaliação enviada!
        </div>
      )}

      {ratings.length > 0 && (
        <div className="mt-5 space-y-2">
          {ratings.slice().reverse().slice(0, 5).map((r) => (
            <div key={r.id} className="brut bg-paper p-2 flex items-start gap-2">
              <div className="flex gap-0.5 shrink-0">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`size-3 ${s <= r.stars ? "fill-orange text-orange" : "text-muted-foreground"}`} />
                ))}
              </div>
              <div className="text-xs text-muted-foreground">{r.comment || "Sem comentário"}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
