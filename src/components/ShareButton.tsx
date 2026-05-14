import { Share2, Check } from "lucide-react";
import { useState } from "react";
import type { Addon } from "@/lib/addons";
import { showToast } from "@/hooks/useToast";

function haptic() {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(50);
  }
}

export function ShareButton({ addon, variant = "icon" }: { addon: Addon; variant?: "icon" | "full" }) {
  const [copied, setCopied] = useState(false);

  const shareData = {
    title: `${addon.title} - Mine Addons News`,
    text: `${addon.short}\n\n⭐ Avaliação: ${addon.rating}/5\n📥 Downloads: ${addon.downloads.toLocaleString()}\n🏷️ Categoria: ${addon.category}`,
    url: `${window.location.origin}/addon/${addon.id}`,
  };

  const handleShare = async () => {
    haptic();
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast("success", "Link compartilhado!");
      } catch (err) {
        console.log("Erro ao compartilhar:", err);
      }
    } else {
      const shareText = `${shareData.title}\n\n${shareData.text}\n\n🔗 ${shareData.url}`;
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      showToast("success", "Link copiado para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleShare}
        className={`shrink-0 size-9 rounded-md border-2 border-ink grid place-items-center transition hover:bg-orange ${
          copied ? "bg-lime" : "bg-paper"
        }`}
        aria-label="Compartilhar add-on"
      >
        {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 border-ink bg-paper font-bold uppercase tracking-wider text-sm brut-press hover:bg-orange transition-all"
      style={{ boxShadow: "4px 4px 0 0 var(--ink)" }}
      aria-label="Compartilhar add-on"
    >
      {copied ? (
        <>
          <Check className="size-4" /> Copiado!
        </>
      ) : (
        <>
          <Share2 className="size-4" /> Compartilhar
        </>
      )}
    </button>
  );
}
