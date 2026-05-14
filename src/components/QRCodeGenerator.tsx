import { useState } from "react";
import { QrCode, X } from "lucide-react";

export function QRCodeGenerator({ url, title }: { url: string; title: string }) {
  const [open, setOpen] = useState(false);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 border-ink bg-paper font-bold uppercase text-sm hover:bg-orange transition"
        style={{ boxShadow: "4px 4px 0 0 var(--ink)" }}
      >
        <QrCode className="size-4" /> QR Code
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] bg-ink/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative bg-paper border-[3px] border-ink rounded-lg p-6 max-w-sm w-full text-center"
            style={{ boxShadow: "12px 12px 0 0 var(--brand-orange)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 p-2 hover:bg-secondary rounded-full"
            >
              <X className="size-5" />
            </button>
            <h3 className="font-display text-xl mb-2">{title}</h3>
            <p className="text-xs text-muted-foreground mb-4">Escaneie para abrir no celular</p>
            <img src={qrUrl} alt="QR Code" className="mx-auto border-2 border-ink rounded-md" />
            <div className="mt-4 text-[10px] font-mono text-muted-foreground truncate">{url}</div>
          </div>
        </div>
      )}
    </>
  );
}
