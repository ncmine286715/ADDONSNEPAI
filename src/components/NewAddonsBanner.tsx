import { Link } from "@tanstack/react-router";
import { X, Sparkles } from "lucide-react";
import { useNewAddons } from "@/hooks/useNewAddons";
import { useState, useEffect } from "react";

export function NewAddonsBanner() {
  const { count, newAddons, markVisited } = useNewAddons();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (count > 0) setVisible(true);
    markVisited();
  }, [count, markVisited]);

  if (!visible || count === 0) return null;

  return (
    <div className="w-full px-4 py-3 bg-lime border-b-2 border-ink animate-fade-up">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm md:text-base font-bold">
          <Sparkles className="size-4 md:size-5 text-orange" />
          <span className="font-display">
            {count} novo{count > 1 ? "s" : ""} add-on{count > 1 ? "s" : ""} desde sua última visita!
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mr-2">
            {newAddons.slice(0, 3).map((a) => (
              <Link
                key={a.id}
                to="/addon/$id"
                params={{ id: a.id }}
                onClick={() => setVisible(false)}
                className="shrink-0 px-2 py-1 bg-paper border-2 border-ink text-xs font-bold truncate max-w-[200px] hover:bg-secondary transition shadow-[2px_2px_0_0_var(--ink)]"
              >
                {a.title}
              </Link>
            ))}
          </div>
          <button onClick={() => setVisible(false)} className="p-1 hover:bg-ink/10 rounded border-2 border-ink shrink-0">
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}