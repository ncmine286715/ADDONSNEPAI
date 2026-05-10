import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Download, Tag, Calendar, Play, Heart, ArrowUpRight, Share2 } from "lucide-react";
import type { Addon } from "@/lib/addons";
import { useFavorites } from "@/lib/favorites";
import { YouTubeModal } from "@/components/YouTubeModal";
import { ShareButton } from "@/components/ShareButton";

export function AddonCard({ addon, accent = "orange" }: { addon: Addon; accent?: "orange" | "lime" | "violet" }) {
  const { isFav, toggle } = useFavorites();
  const [tut, setTut] = useState(false);
  const fav = isFav(addon.id);

  const accentClass =
    accent === "lime" ? "bg-lime" : accent === "violet" ? "bg-violet text-paper" : "bg-orange";

  return (
    <>
      <article className="brut brut-hover group relative overflow-hidden flex flex-col">
        <Link to="/addon/$id" params={{ id: addon.id }} className="block">
          <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-ink bg-ink">
            <img
              src={addon.image}
              alt={addon.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <span className="absolute top-3 left-3 brut-tag brut-tag-accent">
              <Tag className="size-3" /> {addon.category}
            </span>
            <span className="absolute top-3 right-3 brut-tag bg-paper">
              <Star className="size-3 fill-ink" /> {addon.rating.toFixed(1)}
            </span>
            <span className="absolute bottom-3 right-3 size-9 rounded-full bg-paper border-2 border-ink grid place-items-center opacity-0 group-hover:opacity-100 transition">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </Link>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <Link to="/addon/$id" params={{ id: addon.id }} className="flex-1">
              <h3 className="font-display text-2xl leading-none tracking-tight group-hover:text-orange transition-colors">
                {addon.title}
              </h3>
            </Link>
            <div className="flex gap-1">
              <button
                onClick={() => toggle(addon.id)}
                aria-label={fav ? "Remover dos favoritos" : "Salvar como favorito"}
                aria-pressed={fav}
                className={`shrink-0 size-9 rounded-md border-2 border-ink grid place-items-center transition ${
                  fav ? "bg-orange" : "bg-paper hover:bg-secondary"
                }`}
              >
                <Heart className={`size-4 ${fav ? "fill-ink" : ""}`} strokeWidth={2.4} />
              </button>
              <ShareButton addon={addon} />
            </div>
          </div>

          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {addon.short}
          </p>

          <div className="mt-3 flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="size-3" /> v{addon.version}</span>
            <span className="flex items-center gap-1 font-bold text-ink">
              <Download className="size-3" /> {addon.downloads.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="px-4 pb-4 flex gap-2">
          <a
            href={addon.downloadUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`relative flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-md border-2 border-ink font-display text-base tracking-wide uppercase ${accentClass} brut-press overflow-hidden`}
            style={{ boxShadow: "4px 4px 0 0 var(--ink)" }}
          >
            <Download className="size-4" strokeWidth={3} />
            Download
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                backgroundSize: "200% 100%",
                animation: "shimmer 2.4s linear infinite",
              }}
            />
          </a>
          {addon.youtubeId && (
            <button
              onClick={() => setTut(true)}
              aria-label="Ver tutorial"
              className="size-11 shrink-0 grid place-items-center rounded-md border-2 border-ink bg-paper brut-press hover:bg-orange transition"
              style={{ boxShadow: "4px 4px 0 0 var(--ink)" }}
            >
              <Play className="size-4 fill-ink" />
            </button>
          )}
        </div>
      </article>

      {tut && addon.youtubeId && <YouTubeModal id={addon.youtubeId} onClose={() => setTut(false)} />}
    </>
  );
}
