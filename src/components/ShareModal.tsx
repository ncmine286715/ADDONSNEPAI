import { X, Copy, Share2, MessageCircle, Camera } from "lucide-react";
import { useState } from "react";
import type { Addon } from "@/lib/addons";

export function ShareModal({ addon, onClose }: { addon: Addon; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/addon/${addon.id}`;
  
  const shareText = `${addon.title}\n\n${addon.short}\n\n⭐ ${addon.rating}/5 | 📥 ${addon.downloads.toLocaleString()}\n\n🔗 ${url}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(addon.title)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${addon.title} - ${addon.short}`)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[200] bg-ink/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-md w-full bg-paper border-[3px] border-ink rounded-lg p-6" style={{ boxShadow: "12px 12px 0 0 var(--brand-orange)" }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-secondary rounded-full">
          <X className="size-5" />
        </button>

        <h3 className="font-display text-2xl mb-4">Compartilhar</h3>

        {/* Preview do card */}
        <div className="brut mb-4 p-3 flex gap-3">
          <img src={addon.image} alt={addon.title} className="size-16 object-cover rounded-md border border-ink" />
          <div className="flex-1 min-w-0">
            <div className="font-display text-sm font-bold truncate">{addon.title}</div>
            <div className="text-xs text-muted-foreground line-clamp-2 mt-1">{addon.short}</div>
            <div className="text-[10px] mt-1">⭐ {addon.rating}/5</div>
          </div>
        </div>

        <div className="space-y-2">
          <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 p-2 rounded-md border-2 border-ink bg-lime font-bold text-sm">
            {copied ? <><Check className="size-4" /> Link copiado!</> : <><Copy className="size-4" /> Copiar link</>}
          </button>
          
          <button onClick={shareWhatsApp} className="w-full flex items-center justify-center gap-2 p-2 rounded-md border-2 border-ink bg-green-500 text-white font-bold text-sm">
            <MessageCircle className="size-4" /> WhatsApp
          </button>
          
          <button onClick={shareTelegram} className="w-full flex items-center justify-center gap-2 p-2 rounded-md border-2 border-ink bg-blue-500 text-white font-bold text-sm">
            <Share2 className="size-4" /> Telegram
          </button>
          
          <button onClick={shareTwitter} className="w-full flex items-center justify-center gap-2 p-2 rounded-md border-2 border-ink bg-black text-white font-bold text-sm">
            <Camera className="size-4" /> Twitter/X
          </button>
        </div>
      </div>
    </div>
  );
}
