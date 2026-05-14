import { Link } from "@tanstack/react-router";
import { ThumbsUp, TrendingUp } from "lucide-react";
import { ADDONS } from "@/lib/addons";
import { getTopLiked } from "@/hooks/useLikes";

export function TopLikedAddons() {
  const top = getTopLiked(ADDONS, 5);

  if (top.length === 0) return null;

  return (
    <div className="brut p-4">
      <div className="flex items-center gap-2 mb-4">
        <ThumbsUp className="size-5 text-orange" />
        <h2 className="font-display text-2xl tracking-tight">👍 Mais Curtidos da Semana</h2>
      </div>
      <div className="space-y-2">
        {top.map((a, i) => (
          <Link key={a.id} to="/addon/$id" params={{ id: a.id }} className="flex items-center gap-3 p-2 hover:bg-secondary rounded-md transition">
            <span className="font-display text-2xl w-8 text-orange">#{i + 1}</span>
            <img src={a.image} alt={a.title} className="size-10 object-cover rounded border border-ink" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">{a.title}</div>
              <div className="text-xs flex items-center gap-2">
                <ThumbsUp className="size-3" /> {a._likes ?? 0} curtidas
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
