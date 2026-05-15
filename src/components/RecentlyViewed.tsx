import { Link } from "@tanstack/react-router";
import { Eye, X } from "lucide-react";
import { useViewHistory } from "@/hooks/useViewHistory";

export function RecentlyViewed() {
  const { history, clearHistory } = useViewHistory();
  if (history.length === 0) return null;

  return (
    <section className="w-full px-4 py-6 md:py-10 border-b-2 border-ink bg-secondary/20 animate-fade-up">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Eye className="size-5 text-orange" />
            <h2 className="font-display text-xl md:text-2xl tracking-tight">Vistos recentemente</h2>
          </div>
          <button
            onClick={clearHistory}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-destructive hover:underline"
          >
            <X className="size-3" /> Limpar
          </button>
        </div>
        <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
          {history.map((addon) => (
            <Link
              key={addon.id}
              to="/addon/$id"
              params={{ id: addon.id }}
              className="shrink-0 w-44 md:w-56 group"
            >
              <div className="brut bg-paper border-2 border-ink p-2 md:p-3 shadow-[4px_4px_0_0_var(--ink)] hover:shadow-[6px_6px_0_0_var(--ink)] hover:-translate-y-1 transition-all duration-200">
                <div className="aspect-video bg-secondary border-2 border-ink mb-2 overflow-hidden relative">
                  <img
                    src={addon.image}
                    alt={addon.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-display text-sm md:text-base leading-tight truncate">{addon.title}</h3>
                <p className="text-[10px] text-muted-foreground mt-1 truncate">{addon.author}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}