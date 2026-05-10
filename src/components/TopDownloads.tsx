import { Link } from "@tanstack/react-router";
import { TrendingUp, Download } from "lucide-react";
import type { Addon } from "@/lib/addons";

export function TopDownloads({ addons }: { addons: Addon[] }) {
  return (
    <div className="brut p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="size-5 text-orange" />
        <h2 className="font-display text-2xl tracking-tight">📥 Mais Baixados</h2>
      </div>
      <div className="space-y-2">
        {addons.map((a, i) => (
          <Link key={a.id} to="/addon/$id" params={{ id: a.id }} className="flex items-center gap-3 p-2 hover:bg-secondary rounded-md transition">
            <span className="font-display text-2xl w-8 text-orange">#{i+1}</span>
            <img src={a.image} alt={a.title} className="size-10 object-cover rounded border border-ink" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">{a.title}</div>
              <div className="text-xs flex items-center gap-2">
                <Download className="size-3" /> {a.downloads.toLocaleString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
