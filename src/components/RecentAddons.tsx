import { Link } from "@tanstack/react-router";
import { Sparkles, Calendar } from "lucide-react";
import type { Addon } from "@/lib/addons";

export function RecentAddons({ addons }: { addons: Addon[] }) {
  return (
    <div className="brut p-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="size-5 text-orange" />
        <h2 className="font-display text-2xl tracking-tight">✨ Novidades</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {addons.map((a) => (
          <Link key={a.id} to="/addon/$id" params={{ id: a.id }} className="group">
            <img src={a.image} alt={a.title} className="w-full aspect-video object-cover rounded border-2 border-ink mb-2 group-hover:scale-105 transition" />
            <div className="font-bold text-sm truncate">{a.title}</div>
            <div className="text-xs flex items-center gap-1"><Calendar className="size-3" /> {new Date(a.date).toLocaleDateString()}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
