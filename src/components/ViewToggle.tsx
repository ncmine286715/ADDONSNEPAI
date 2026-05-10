import { LayoutGrid, List } from "lucide-react";

export function ViewToggle({ view, onChange }: { view: "grid" | "list"; onChange: (v: "grid" | "list") => void }) {
  return (
    <div className="flex gap-1 border-2 border-ink rounded-md p-1 bg-paper">
      <button
        onClick={() => onChange("grid")}
        className={`size-8 rounded grid place-items-center transition ${view === "grid" ? "bg-orange" : "hover:bg-secondary"}`}
      >
        <LayoutGrid className="size-4" />
      </button>
      <button
        onClick={() => onChange("list")}
        className={`size-8 rounded grid place-items-center transition ${view === "list" ? "bg-orange" : "hover:bg-secondary"}`}
      >
        <List className="size-4" />
      </button>
    </div>
  );
}
