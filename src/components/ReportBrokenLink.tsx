import { useState } from "react";
import { AlertTriangle, Send, Copy, Check } from "lucide-react";
import { showToast } from "@/hooks/useToast";

export function ReportBrokenLink({ addonTitle, addonId, downloadUrl }: { addonTitle: string; addonId: string; downloadUrl: string }) {
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  // Substitua pelo seu email no FormSubmit.co
  const FORMSUBMIT_EMAIL = "seu-email@exemplo.com";

  const reportText = `[REPORT] Link quebrado
Add-on: ${addonTitle}
ID: ${addonId}
URL: ${window.location.origin}/addon/${addonId}
Download: ${downloadUrl}
Data: ${new Date().toLocaleString("pt-BR")}
`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(reportText);
    setCopied(true);
    showToast("success", "Informação copiada! Cole no email ou WhatsApp do admin.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("_subject", `Link quebrado: ${addonTitle}`);
      formData.append("addon", addonTitle);
      formData.append("id", addonId);
      formData.append("url", `${window.location.origin}/addon/${addonId}`);
      formData.append("download", downloadUrl);

      await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`, {
        method: "POST",
        body: formData,
      });
      showToast("success", "Reporte enviado! Verificaremos em breve.");
    } catch {
      showToast("error", "Falha ao enviar. Use o botão de copiar.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="brut p-4 bg-destructive/5 border-destructive">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="size-5 text-destructive" />
        <h3 className="font-display text-lg">Link quebrado?</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Se o download não funcionar, reporte para que possamos corrigir.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 px-4 h-9 rounded-md bg-destructive text-paper border-2 border-destructive font-bold uppercase text-xs brut-press disabled:opacity-50"
        >
          {sending ? "Enviando..." : <><Send className="size-3.5" /> Reportar"}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-2 px-4 h-9 rounded-md border-2 border-ink font-bold uppercase text-xs transition ${
            copied ? "bg-lime" : "bg-paper hover:bg-secondary"
          }`}
        >
          {copied ? <><Check className="size-3.5" /> Copiado</> : <><Copy className="size-3.5" /> Copiar info</>}
        </button>
      </form>
    </div>
  );
}
