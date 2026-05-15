import { X, Scale, Star, TrendingUp, Calendar, User, Tag, Download } from "lucide-react";
import type { Addon } from "@/lib/addons";

interface Props {
  addons: Addon[];
  onClose: () => void;
}

export function ComparisonModal({ addons, onClose }: Props) {
  if (addons.length < 2) return null;
  const [a, b] = [addons[0], addons[1]];

  const Row = ({ label, aVal, bVal }: { label: string; aVal: React.ReactNode; bVal: React.ReactNode }) => (
    <div className="grid grid-cols-[1fr_1fr] gap-3 md:gap-6 border-b-2 border-ink/10 py-3">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground col-span-2 mb-1">{label}</div>
      <div className="text-sm md:text-base font-medium">{aVal}</div>
      <div className="text-sm md:text-base font-medium">{bVal}</div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-ink/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-paper border-2 border-ink shadow-[8px_8px_0_0_var(--ink)] rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 md:p-5 border-b-2 border-ink bg-secondary/30 sticky top-0 z-10">
          <div className="flex items-center gap-2 font-display text-lg md:text-2xl">
            <Scale className="size-5 md:size-6 text-orange" /> Comparar
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-destructive/10 rounded border-2 border-ink transition"
            aria-label="Fechar"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-4 md:p-6">
          <div className="grid grid-cols-2 gap-3 md:gap-5 mb-5">
            {[a, b].map((addon, idx) => (
              <div
                key={addon.id}
                className={`brut p-3 border-2 border-ink ${idx === 0 ? "bg-orange/10" : "bg-lime/10"} shadow-[3px_3px_0_0_var(--ink)]`}
              >
                <div className="aspect-video bg-secondary border-2 border-ink mb-3 overflow-hidden">
                  <img src={addon.image} alt={addon.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-display text-base md:text-xl leading-tight">{addon.title}</h3>
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <Row label="Autor" aVal={<span className="flex items-center gap-1.5"><User className="size-3.5" /> {a.author}</span>} bVal={<span className="flex items-center gap-1.5"><User className="size-3.5" /> {b.author}</span>} />
            <Row label="Categoria" aVal={<span className="flex items-center gap-1.5"><Tag className="size-3.5" /> {a.category}</span>} bVal={<span className="flex items-center gap-1.5"><Tag className="size-3.5" /> {b.category}</span>} />
            <Row label="Avaliação" aVal={<span className="flex items-center gap-1.5"><Star className="size-3.5 fill-orange text-orange" /> {a.rating.toFixed(1)}</span>} bVal={<span className="flex items-center gap-1.5"><Star className="size-3.5 fill-orange text-orange" /> {b.rating.toFixed(1)}</span>} />
            <Row label="Downloads" aVal={<span className="flex items-center gap-1.5"><TrendingUp className="size-3.5" /> {a.downloads.toLocaleString()}</span>} bVal={<span className="flex items-center gap-1.5"><TrendingUp className="size-3.5" /> {b.downloads.toLocaleString()}</span>} />
            <Row label="Data" aVal={<span className="flex items-center gap-1.5"><Calendar className="size-3.5" /> {a.date}</span>} bVal={<span className="flex items-center gap-1.5"><Calendar className="size-3.5" /> {b.date}</span>} />
            <Row label="Descrição" aVal={<span className="text-muted-foreground text-xs md:text-sm leading-relaxed">{a.short}</span>} bVal={<span className="text-muted-foreground text-xs md:text-sm leading-relaxed">{b.short}</span>} />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={a.downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange border-2 border-ink font-bold uppercase text-xs md:text-sm tracking-wider shadow-[3px_3px_0_0_var(--ink)] hover:shadow-[1px_1px_0_0_var(--ink)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <Download className="size-4" /> Baixar {a.title}
            </a>
            <a
              href={b.downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-lime border-2 border-ink font-bold uppercase text-xs md:text-sm tracking-wider shadow-[3px_3px_0_0_var(--ink)] hover:shadow-[1px_1px_0_0_var(--ink)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <Download className="size-4" /> Baixar {b.title}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}