import { useReactions, type ReactionType } from "@/hooks/useReactions";

const REACTIONS: ReactionType[] = ["❤️", "🔥", "😍", "💩"];

export function ReactionBar({ addonId }: { addonId: string }) {
  const { counts, userReaction, react } = useReactions(addonId);

  return (
    <div className="flex items-center gap-1">
      {REACTIONS.map((r) => (
        <button
          key={r}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); react(r); }}
          className={`flex items-center gap-1 px-1.5 py-1 rounded border-2 border-ink text-xs transition shadow-[2px_2px_0_0_var(--ink)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${
            userReaction === r ? "bg-orange" : "bg-paper hover:bg-secondary"
          }`}
          title={r}
        >
          <span className="text-sm leading-none">{r}</span>
          <span className="font-mono text-[10px] font-bold">{counts[r] || 0}</span>
        </button>
      ))}
    </div>
  );
}