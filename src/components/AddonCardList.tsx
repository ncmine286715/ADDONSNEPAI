import { Link } from "@tanstack/react-router";
import { Star, Download, Tag, Calendar, Heart } from "lucide-react";
import type { Addon } from "@/lib/addons";
import { useFavorites } from "@/lib/favorites";

export function AddonCardList({ addon }: { addon: Addon }) {
  const { isFav, toggle } = useFavorites();
  const fav = isFav(addon.id);

  return (
    <div className="brut p-3 flex gap-4 items-center">
      <Link to="/addon/$id" params={{ id: addon.id }} className="shrink-0">
        <img src={addon.image} alt={addon.title} className="size-16 object-cover rounded border border-ink" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to="/addon/$id" params={{ id: addon.id }}>
          <h3 className="font-display text-xl tracking-tight hover:text-orange">{addon.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-1">{addon.short}</p>
        <div className="flex gap-3 mt-1 text-xs">
          <span className="flex items-center gap-1"><Star className="size-3" /> {addon.rating.toFixed(1)}</span>
          <span className="flex items-center gap-1"><Download className="size-3" /> {addon.downloads.toLocaleString()}</span>
          <span className="flex items-center gap-1"><Calendar className="size-3" /> v{addon.version}</span>
        </div>
      </div>
      <button onClick={() => toggle(addon.id)} className="shrink-0 size-9 rounded-md border-2 border-ink grid place-items-center">
        <Heart className={`size-4 ${fav ? "fill-orange text-orange" : ""}`} />
      </button>
    </div>
  );
}
