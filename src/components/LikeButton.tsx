import { ThumbsUp } from "lucide-react";
import { useLikes } from "@/hooks/useLikes";
import { Tooltip } from "@/components/Tooltip";

export function LikeButton({ addonId, variant = "icon" }: { addonId: string; variant?: "icon" | "full" }) {
  const { liked, count, toggle } = useLikes(addonId);

  if (variant === "icon") {
    return (
      <Tooltip text={liked ? "Descurtir" : "Curtir"} position="top">
        <button
          onClick={toggle}
          className={`shrink-0 size-9 rounded-md border-2 border-ink grid place-items-center transition ${
            liked ? "bg-orange" : "bg-paper hover:bg-secondary"
          }`}
        >
          <ThumbsUp className={`size-4 ${liked ? "fill-ink" : ""}`} strokeWidth={2.4} />
        </button>
      </Tooltip>
    );
  }

  return (
    <Tooltip text={liked ? "Descurtir" : "Curtir"} position="bottom">
      <button
        onClick={toggle}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 border-ink font-bold uppercase text-sm transition ${
          liked ? "bg-orange brut-press" : "bg-paper hover:bg-secondary"
        }`}
        style={liked ? { boxShadow: "4px 4px 0 0 var(--ink)" } : {}}
      >
        <ThumbsUp className={`size-4 ${liked ? "fill-ink" : ""}`} strokeWidth={2.4} />
        {liked ? "Curtido" : "Curtir"} ({count})
      </button>
    </Tooltip>
  );
}
