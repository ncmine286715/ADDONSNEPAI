import { Link } from "@tanstack/react-router";
import { Dice6 } from "lucide-react";
import { getRandomAddon } from "@/lib/stats";

export function RandomAddon() {
  const random = getRandomAddon();
  
  return (
    <Link
      to="/addon/$id"
      params={{ id: random.id }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 border-ink bg-paper font-display text-sm uppercase tracking-tight hover:bg-orange transition"
    >
      <Dice6 className="size-4" /> Surpreenda-me
    </Link>
  );
}
