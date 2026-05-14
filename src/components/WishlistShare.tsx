import { useState } from "react";
import { Share2, Copy, Check, Gift } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { useWishlistUrl } from "@/hooks/useWishlistHash";
import { showToast } from "@/hooks/useToast";

export function WishlistShare() {
  const { ids } = useFavorites();
  const url = useWishlistUrl(Array.from(ids));
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!url) {
      showToast("warning", "Adicione favoritos primeiro!");
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    showToast("success", "Link da lista de desejos copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="brut p-4">
      <div className="flex items-center gap-2 mb-3">
        <Gift className="size-5 text-orange" />
        <h3 className="font-display text-xl">Lista de Desejos</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Compartilhe seus favoritos com amigos via link público.
      </p>
      <button
        onClick={handleCopy}
        disabled={!url}
        className={`w-full inline-flex items-center justify-center gap-2 px-4 h-10 rounded-md border-2 border-ink font-bold uppercase text-xs transition ${
          copied ? "bg-lime" : "bg-paper hover:bg-orange"
        } disabled:opacity-40`}
        style={url ? { boxShadow: "4px 4px 0 0 var(--ink)" } : {}}
      >
        {copied ? <><Check className="size-4" /> Copiado!</> : <><Share2 className="size-4" /> Copiar link público</>}
      </button>
      {ids.size > 0 && (
        <div className="mt-2 text-[10px] font-mono text-muted-foreground truncate">{url}</div>
      )}
    </div>
  );
}
