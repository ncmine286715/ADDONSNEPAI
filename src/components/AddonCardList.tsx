import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Download, Calendar, Heart, ArrowUpRight, Scale, Tag, Play } from "lucide-react";
import type { Addon } from "@/lib/addons";
import { useFavorites } from "@/lib/favorites";
import { useReactions } from "@/lib/reactions";
import { useComparison } from "@/lib/comparison";
import { Tooltip } from "@/components/Tooltip";
import { ShareButton } from "@/components/ShareButton";
import { YouTubeModal } from "@/components/YouTubeModal";

const isUpdatedToday = (dateStr: string) => {
  const today = new Date();
  const date = new Date(dateStr);
  return date.toDateString() === today.toDateString();
};

type ReactionKey = "heart" | "fire" | "smile" | "poop";

const reactionEmoji: Record<ReactionKey, string> = {
  heart: "❤️",
  fire: "🔥",
  smile: "😍",
  poop: "💩",
};

export function AddonCardList({ addon }: { addon: Addon }) {
  const { isFav, toggle } = useFavorites();
  const { react, getReactionCount } = useReactions();
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const [tut, setTut] = useState(false);
  const fav = isFav(addon.id);
  const inComparison = isInComparison(addon.id);

  const REACTIONS: ReactionKey[] = ["heart", "fire", "smile", "poop"];

  return (
    <>
      <div className="brut p-3 flex gap-3 md:gap-4 items-start group transition-all duration-200 hover:shadow-[6px_6px_0_0_var(--ink)] hover:-translate-y-0.5 bg-paper">
        <Link to="/addon/$id" params={{ id: addon.id }} className="shrink-0 relative">
          <div className="size-20 md:size-24 relative overflow-hidden border-2 border-ink">
            <img
              src={addon.image}
              alt={addon.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {isUpdatedToday(addon.date) && (
              <span className="absolute top-1 left-1 bg-orange border border-ink text-[8px] font-bold uppercase px-1 py-0.5 shadow-[1px_1px_0_0_var(--ink)]">
                Hoje
              </span>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-ink/20">
              <div className="bg-paper/90 border-2 border-ink rounded-full p-1 shadow-[2px_2px_0_0_var(--ink)]">
                <ArrowUpRight className="size-4" />
              </div>
            </div>
          </div>
        </Link>

        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link to="/addon/$id" params={{ id: addon.id }}>
                <h3 className="font-display text-lg md:text-xl tracking-tight group-hover:text-orange transition-colors truncate">
                  {addon.title}
                </h3>
              </Link>
              <Link
                to="/autor/$nome"
                params={{ nome: encodeURIComponent(addon.author) }}
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-orange transition"
              >
                {addon.author}
              </Link>
            </div>
            <div className="flex gap-1 shrink-0">
              <Tooltip text={fav ? "Remover dos favoritos" : "Salvar nos favoritos"} position="top">
                <button
                  onClick={() => toggle(addon.id)}
                  className={`size-8 rounded-md border-2 border-ink grid place-items-center transition shadow-[2px_2px_0_0_var(--ink)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${
                    fav ? "bg-orange" : "bg-paper hover:bg-secondary"
                  }`}
                >
                  <Heart className={`size-3.5 ${fav ? "fill-ink" : ""}`} strokeWidth={2.4} />
                </button>
              </Tooltip>
              <Tooltip text="Compartilhar" position="top">
                <div className="shadow-[2px_2px_0_0_var(--ink)] rounded-md">
                  <ShareButton addon={addon} />
                </div>
              </Tooltip>
            </div>
          </div>

          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{addon.short}</p>

          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[10px] md:text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1"><Tag className="size-3" /> {addon.category}</span>
            <span className="flex items-center gap-1"><Star className="size-3 fill-orange text-orange" /> {addon.rating.toFixed(1)}</span>
            <span className="flex items-center gap-1"><Download className="size-3" /> {addon.downloads.toLocaleString()}</span>
            <span className="flex items-center gap-1"><Calendar className="size-3" /> v{addon.version}</span>
          </div>

          <div className="flex items-center justify-between mt-1">
            <div className="flex flex-wrap gap-1">
              {REACTIONS.map((emojiKey) => (
                <button
                  key={emojiKey}
                  onClick={() => react(addon.id, emojiKey)}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded border-2 border-ink text-[10px] transition shadow-[1px_1px_0_0_var(--ink)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] ${
                    getReactionCount(addon.id, emojiKey) > 0 ? "bg-secondary" : "bg-paper hover:bg-secondary"
                  }`}
                >
                  <span>{reactionEmoji[emojiKey]}</span>
                  {getReactionCount(addon.id, emojiKey) > 0 && (
                    <span className="font-mono font-bold">{getReactionCount(addon.id, emojiKey)}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <Tooltip text={inComparison ? "Remover comparação" : "Comparar"} position="top">
                <button
                  onClick={() => inComparison ? removeFromComparison(addon.id) : addToComparison(addon.id)}
                  className={`size-8 rounded-md border-2 border-ink grid place-items-center transition shadow-[2px_2px_0_0_var(--ink)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${
                    inComparison ? "bg-orange" : "bg-paper hover:bg-secondary"
                  }`}
                >
                  <Scale className="size-3.5" />
                </button>
              </Tooltip>
              <Tooltip text="Baixar" position="top">
                <a
                  href={addon.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="size-8 rounded-md border-2 border-ink bg-orange grid place-items-center shadow-[2px_2px_0_0_var(--ink)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                >
                  <Download className="size-3.5" strokeWidth={3} />
                </a>
              </Tooltip>
              {addon.youtubeId && (
                <Tooltip text="Tutorial" position="top">
                  <button
                    onClick={() => setTut(true)}
                    className="size-8 rounded-md border-2 border-ink bg-paper grid place-items-center hover:bg-secondary shadow-[2px_2px_0_0_var(--ink)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    <Play className="size-3.5 fill-ink" />
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>

      {tut && addon.youtubeId && <YouTubeModal id={addon.youtubeId} onClose={() => setTut(false)} />}
    </>
  );
}
