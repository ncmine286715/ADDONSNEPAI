import { X, Scale, Star, TrendingUp, Calendar, User, Tag } from "lucide-react";
import type { Addon } from "@/lib/addons";

interface CompareModalProps {
  addons: Addon[];
  onClose: () => void;
  onClear: () => void;
}

export function CompareModal({ addons, onClose, onClear }: CompareModalProps) {
  if (addons.length !== 2) return null;
  const [a, b] = addons;

  const Row = ({ label, aVal, bVal }: { label: string; aVal: React.ReactNode; bVal: React.ReactNode }) => (
    <div className="grid grid-cols-[1fr_1fr] gap-4 border-b-2 border-ink/10 py-2">
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground col-span-2">{label}</div>
      <div className="text-sm font-medium">{aVal}</div>
      <div className="text-sm font-medium">{bVal}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-paper border-2 border-ink shadow-[8px_8px_0_0_var(--ink)] rounded-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b-2 border-ink bg-secondary/30">
          <div className="flex items-center gap-2 font-display text-lg md:text-xl">
            <Scale className="size-5 text-orange" /> Comparar add-ons
          </div>
          <button onClick={onClose} className="p-1 hover:bg-destructive/10 rounded border-2 border-ink">
            <X className="size-4" />
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[a, b].map((addon, idx) => (
              <div key={addon.id} className={`brut p-3 border-2 border-ink ${idx === 0 ? "bg-orange/10" : "bg-lime/10"}`}>
                <div className="aspect-video bg-secondary border-2 border-ink mb-2 rounded-sm overflow-hidden">
                  {/* @ts-ignore */}
                  {addon.image ? <img src={addon.image} alt={addon.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Sem imagem</div>}
                </div>
                <h3 className="font-display text-base md:text-lg leading-tight">{addon.title}</h3>
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <Row label="Autor" aVal={<span className="flex items-center gap-1"><User className="size-3" /> {a.author}</span>} bVal={<span className="flex items-center gap-1"><User className="size-3" /> {b.author}</span>} />
            <Row label="Categoria" aVal={<span className="flex items-center gap-1"><Tag className="size-3" /> {a.category}</span>} bVal={<span className="flex items-center gap-1"><Tag className="size-3" /> {b.category}</span>} />
            <Row label="Avaliação" aVal={<span className="flex items-center gap-1"><Star className="size-3 fill-orange text-orange" /> {a.rating}</span>} bVal={<span className="flex items-center gap-1"><Star className="size-3 fill-orange text-orange" /> {b.rating}</span>} />
            <Row label="Downloads" aVal={<span className="flex items-center gap-1"><TrendingUp className="size-3" /> {a.downloads.toLocaleString()}</span>} bVal={<span className="flex items-center gap-1"><TrendingUp className="size-3" /> {b.downloads.toLocaleString()}</span>} />
            <Row label="Data" aVal={<span className="flex items-center gap-1"><Calendar className="size-3" /> {a.date}</span>} bVal={<span className="flex items-center gap-1"><Calendar className="size-3" /> {b.date}</span>} />
            <Row label="Descrição" aVal={a.short} bVal={b.short} />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => { onClear(); onClose(); }} className="px-4 py-2 border-2 border-ink bg-paper text-xs font-bold uppercase tracking-wider hover:bg-secondary shadow-[2px_2px_0_0_var(--ink)]">
              Limpar seleção
            </button>
            <button onClick={onClose} className="px-4 py-2 border-2 border-ink bg-ink text-paper text-xs font-bold uppercase tracking-wider hover:bg-ink/90 shadow-[2px_2px_0_0_var(--ink)]">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}