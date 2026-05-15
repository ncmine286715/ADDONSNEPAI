import { Calendar } from "lucide-react";

export function UpdatedBadge({ date }: { date: string }) {
  const today = new Date().toISOString().split("T")[0];
  if (date !== today) return null;
  return (
    <span className="inline-flex items-center gap-1 bg-lime border-2 border-ink px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0_0_var(--ink)]">
      <Calendar className="size-3" /> Hoje
    </span>
  );
}