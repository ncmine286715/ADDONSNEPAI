import { Link } from "@tanstack/react-router";
import { Star, Download, Calendar, Heart, ArrowUpRight } from "lucide-react";
import type { Addon } from "@/lib/addons";
import { useFavorites } from "@/lib/favorites";
import { Tooltip } from "@/components/Tooltip";

export function AddonCardList({ addon }: { addon: Addon }) {
  const { isFav, toggle } = useFavorites();
  const fav = isFav(addon.id);

  return (
    <div className="brut p-3 flex gap-4 items-center group transition-all duration-200 hover:shadow-[6px_6px_0_0_var(--ink)] hover:-translate-y-0.5">
      <Link to="/addon/$id" params={{ id: addon.id }} className="shrink-0 relative">
        <img src={addon.image} alt={addon.title} className="size-16 object-cover rounded border border-ink transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-paper/90 border-2 border-ink rounded-full p-1">
            <ArrowUpRight className="size-4" />
          </div>
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <Link to="/addon/$id" params={{ id: addon.id }}>
          <h3 className="font-display text-xl tracking-tight group-hover:text-orange transition-colors">{addon.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-1">{addon.short}</p>
        <div className="flex gap-3 mt-1 text-xs">
          <span className="flex items-center gap-1"><Star className="size-3" /> {addon.rating.toFixed(1)}</span>
          <span className="flex items-center gap-1"><Download className="size-3" /> {addon.downloads.toLocaleString()}</span>
          <span className="flex items-center gap-1"><Calendar className="size-3" /> v{addon.version}</span>
        </div>
      </div>
      <Tooltip text={fav ? "Remover dos favoritos" : "Salvar nos favoritos"} position="left">
        <button onClick={() => toggle(addon.id)} className="shrink-0 size-9 rounded-md border-2 border-ink grid place-items-center transition hover:bg-secondary">
          <Heart className={`size-4 ${fav ? "fill-orange text-orange" : ""}`} />
        </button>
      </Tooltip>
    </div>
  );
}
