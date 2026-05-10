import { Share2, Check } from "lucide-react";
import { useState } from "react";
import type { Addon } from "@/lib/addons";

export function ShareButton({ addon, variant = "icon" }: { addon: Addon; variant?: "icon" | "full" }) {
  const [copied, setCopied] = useState(false);

  const shareData = {
    title: `${addon.title} - Mine Addons News`,
    text: `${addon.short}\n\n⭐ Avaliação: ${addon.rating}/5\n📥 Downloads: ${addon.downloads.toLocaleString()}\n🏷️ Categoria: ${addon.category}`,
    url: `${window.location.origin}/addon/${addon.id}`,
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Erro ao compartilhar:", err);
      }
    } else {
      const shareText = `${shareData.title}\n\n${shareData.text}\n\n🔗 ${shareData.url}`;
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Versão só ícone (para cards)
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

  // Versão completa com texto (para página do add-on)
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
