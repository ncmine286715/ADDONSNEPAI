import { X } from "lucide-react";
import { useEffect } from "react";

export function YouTubeModal({ id, onClose }: { id: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-ink/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden border-[3px] border-ink bg-ink"
        style={{ boxShadow: "12px 12px 0 0 var(--brand-orange)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 size-11 rounded-full bg-orange border-[3px] border-ink grid place-items-center hover:rotate-90 transition-transform"
          aria-label="Fechar"
        >
          <X className="size-5 text-ink" strokeWidth={3} />
        </button>
        <iframe
          src={`https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`}
          title="Tutorial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
