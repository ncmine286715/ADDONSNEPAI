import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Download, Tag, Calendar, Play, Heart, ArrowUpRight, Loader2, Scale } from "lucide-react";
import type { Addon } from "@/lib/addons";
import { useFavorites } from "@/lib/favorites";
import { useReactions } from "@/lib/reactions";
import { useComparison } from "@/lib/comparison";
import { YouTubeModal } from "@/components/YouTubeModal";
import { ShareButton } from "@/components/ShareButton";
import { Tooltip } from "@/components/Tooltip";
import { ADDONS } from "@/lib/addons";

const isUpdatedToday = (dateStr: string) => {
  const today = new Date();
  const date = new Date(dateStr);
  return date.toDateString() === today.toDateString();
};

export function AddonCard({ addon, accent = "orange" }: { addon: Addon; accent?: "orange" | "lime" | "violet" }) {
  const { isFav, toggle } = useFavorites();
  const { react, getReactionCount } = useReactions();
  const { addToComparison, removeFromComparison, isInComparison, ids } = useComparison();
  const [tut, setTut] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fav = isFav(addon.id);
  const inComparison = isInComparison(addon.id);

  const accentClass =
    accent === "lime" ? "bg-lime" : accent === "violet" ? "bg-violet text-paper" : "bg-orange";

  const handleDownload = (e: React.MouseEvent<<HTMLAnchorElement>) => {
    e.stopPropagation();
    setIsDownloading(true);
    setTimeout(() => setIsDownloading(false), 1000);
  };

  const handleFav = () => toggle(addon.id);

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inComparison) {
      removeFromComparison(addon.id);
    } else {
      addToComparison(addon.id);
    }
  };

  const REACTIONS: Array<<"❤️" | "🔥" | "😍" | "💩"> = ["❤️", "🔥", "😍", "💩"];

  return (
    <>
      <article className="brut group relative overflow-hidden flex flex-col transition-all duration-200 hover:shadow-[8px_8px_0_0_var(--ink)] hover:-translate-y-1 bg-paper">
        <Link to="/addon/$id" params={{ id: addon.id }} className="block">
          <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-ink bg-ink">
            <img
              src={addon.image}
              alt={addon.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <span className="absolute top-2 left-2 md:top-3 md:left-3 brut-tag brut-tag-accent text-[8px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1">
              <Tag className="size-2.5 md:size-3" /> {addon.category}
            </span>
            <span className="absolute top-2 right-2 md:top-3 md:right-3 brut-tag bg-paper text-[8px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1">
              <Star className="size-2.5 md:size-3 fill-ink" /> {addon.rating.toFixed(1)}
            </span>
            {isUpdatedToday(addon.date) && (
              <span className="absolute bottom-2 left-2 md:bottom-3 md:left-3 brut-tag bg-orange text-[8px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 shadow-[2px_2px_0_0_var(--ink)]">
                Atualizado hoje
              </span>
            )}
            <span className="absolute bottom-2 right-2 md:bottom-3 md:right-3 size-7 md:size-9 rounded-full bg-paper border-2 border-ink grid place-items-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-[2px_2px_0_0_var(--ink)]">
              <ArrowUpRight className="size-3 md:size-4" />
            </span>
          </div>
        </Link>

        <div className="p-3 md:p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <Link to="/addon/$id" params={{ id: addon.id }} className="flex-1 min-w-0">
              <h3 className="font-display text-lg md:text-2xl leading-none tracking-tight group-hover:text-orange transition-colors truncate">
                {addon.title}
              </h3>
            </Link>
            <div className="flex gap-1 shrink-0">
              <Tooltip text={fav ? "Remover dos favoritos" : "Salvar nos favoritos"} position="top">
                <button
                  onClick={handleFav}
                  aria-label={fav ? "Remover dos favoritos" : "Salvar como favorito"}
                  aria-pressed={fav}
                  className={`shrink-0 size-8 md:size-9 rounded-md border-2 border-ink grid place-items-center transition shadow-[2px_2px_0_0_var(--ink)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${
                    fav ? "bg-orange" : "bg-paper hover:bg-secondary"
                  }`}
                >
                  <Heart className={`size-3.5 md:size-4 ${fav ? "fill-ink" : ""}`} strokeWidth={2.4} />
                </button>
              </Tooltip>
              <Tooltip text="Compartilhar" position="top">
                <div className="shadow-[2px_2px_0_0_var(--ink)] rounded-md">
                  <ShareButton addon={addon} />
                </div>
              </Tooltip>
            </div>
          </div>

          <Link
            to="/autor/$nome"
            params={{ nome: encodeURIComponent(addon.author) }}
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-orange transition mt-1.5 w-fit"
          >
            {addon.author}
          </Link>

          <p className="mt-2 text-xs md:text-sm text-muted-foreground line-clamp-2 min-h-[2rem] md:min-h-[2.5rem]">
            {addon.short}
          </p>

          <div className="mt-2 md:mt-3 flex items-center justify-between text-[10px] md:text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="size-2.5 md:size-3" /> v{addon.version}</span>
            <span className="flex items-center gap-1 font-bold text-ink">
              <Download className="size-2.5 md:size-3" /> {addon.downloads.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="px-3 pb-3 md:px-4 md:pb-4 flex flex-col gap-2">
          <div className="flex flex-wrap gap-1.5 justify-center">
            {REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => react(addon.id, emoji)}
                className={`flex items-center gap-1 px-2 py-1 rounded border-2 border-ink text-xs transition shadow-[2px_2px_0_0_var(--ink)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${
                  getReactionCount(addon.id, emoji) > 0 ? "bg-secondary" : "bg-paper hover:bg-secondary"
                }`}
                title={`Reagir com ${emoji}`}
              >
                <span className="text-sm leading-none">{emoji}</span>
                {getReactionCount(addon.id, emoji) > 0 && (
                  <span className="font-mono text-[10px] font-bold">{getReactionCount(addon.id, emoji)}</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Tooltip text={inComparison ? "Remover da comparação" : "Adicionar à comparação"} position="bottom" className="flex-1">
              <button
                onClick={handleCompare}
                className={`w-full py-1.5 rounded-md border-2 border-ink font-display text-xs uppercase transition shadow-[2px_2px_0_0_var(--ink)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${
                  inComparison ? "bg-orange" : "bg-paper hover:bg-secondary"
                }`}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <Scale className="size-3.5" />
                  {inComparison ? "Comparando ✓" : "Comparar"}
                </span>
              </button>
            </Tooltip>
          </div>
        </div>

        <div className="px-3 pb-3 md:px-4 md:pb-4 flex gap-2">
          <Tooltip text="Baixar arquivo" position="bottom" className="flex-1">
            <a
              href={addon.downloadUrl}
              target="_blank"
              rel="noreferrer"
              onClick={handleDownload}
              className={`relative flex-1 inline-flex items-center justify-center gap-2 py-2 md:py-2.5 rounded-md border-2 border-ink font-display text-sm md:text-base tracking-wide uppercase ${accentClass} overflow-hidden transition-all shadow-[4px_4px_0_0_var(--ink)] active:shadow-[2px_2px_0_0_var(--ink)] active:translate-x-[2px] active:translate-y-[2px]`}
            >
              {isDownloading ? (
                <Loader2 className="size-4 md:size-5 animate-spin" />
              ) : (
                <Download className="size-3.5 md:size-4" strokeWidth={3} />
              )}
              {isDownloading ? "Baixando..." : "Download"}
              {!isDownloading && (
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2.4s linear infinite",
                  }}
                />
              )}
            </a>
          </Tooltip>
          {addon.youtubeId && (
            <Tooltip text="Ver tutorial" position="bottom">
              <button
                onClick={() => setTut(true)}
                aria-label="Ver tutorial"
                className="size-9 md:size-11 shrink-0 grid place-items-center rounded-md border-2 border-ink bg-paper hover:bg-orange transition shadow-[4px_4px_0_0_var(--ink)] active:shadow-[2px_2px_0_0_var(--ink)] active:translate-x-[2px] active:translate-y-[2px]"
              >
                <Play className="size-3.5 md:size-4 fill-ink" />
              </button>
            </Tooltip>
          )}
        </div>
      </article>

      {tut && addon.youtubeId && <YouTubeModal id={addon.youtubeId} onClose={() => setTut(false)} />}

      {ids.length >= 2 && <ComparisonModal addons={ADDONS.filter(a => ids.includes(a.id))} onClose={() => {}} />}
    </>
  );
}