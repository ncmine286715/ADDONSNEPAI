import { useMemo, useState } from "react";
import { useTikTokBrowser } from "@/hooks/useTikTokBrowser";
import { showToast } from "@/hooks/useToast";

function copyToClipboard(text: string) {
  if (typeof window === "undefined") return Promise.resolve(false);

  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => {
      // fallback legacy
      try {
        const el = document.createElement("textarea");
        el.value = text;
        el.style.cssText = "position:fixed;opacity:0;top:0;left:0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        return true;
      } catch {
        return false;
      }
    });
}

export function TikTokBlocker() {
  const info = useTikTokBrowser();
  const [dismissed, setDismissed] = useState(false);

  const isBlocked = info.detected && !dismissed;

  const intentUrl = useMemo(() => {
    if (!isBlocked) return "";
    // build inside click handler to avoid recompute; still fine.
    // We'll import dynamically pattern-free: simplest is local string build.
    // For intent we re-use the helper via local construction:
    const url = info.url || "";
    const safe = url.replace(/^https?:\/\//, "");
    if (info.isIOS) {
      return `x-web-search://?q=${encodeURIComponent(url)}`;
    }
    return `intent://${safe}#Intent;scheme=https;package=com.android.chrome;end`;
  }, [info.isIOS, info.url, isBlocked]);

  if (!isBlocked) return null;

  const app = info.app;
  const emoji =
    app === "TikTok" ? "🎵" : app === "Instagram" ? "📸" : app === "Facebook" ? "📘" : "📱";

  const copyLabel = "Copiar link";
  const openLabel = "Abrir no navegador";

  const handleCopy = async () => {
    const ok = await copyToClipboard(info.url);
    if (ok) showToast("success", "Link copiado.");
    else showToast("error", "Falha ao copiar. Tente manualmente.");
  };

  const handleOpen = () => {
    try {
      // Tentativa automática
      if (intentUrl) {
        window.location.href = intentUrl;
        return;
      }
    } catch {
      // ignore
    }
    // fallback: abre o link normal
    window.open(info.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.82)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: 16,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Bloqueio de navegador interno"
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          background: "#fff",
          borderRadius: 20,
          border: "2px solid #111",
          boxShadow: "10px 10px 0 0 #111",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "18px 16px 8px", textAlign: "center" }}>
          <div style={{ fontSize: 42, lineHeight: 1, marginBottom: 6 }}>{emoji}</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#111", margin: 0 }}>
            Bloqueamos o navegador interno
          </h2>
          <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0", lineHeight: 1.5 }}>
            Você está abrindo o site pelo <strong>{app}</strong>. Para usar downloads, favoritos e detalhes corretamente,
            abra em um navegador externo.
          </p>
        </div>

        <div
          style={{
            padding: "0 16px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              background: "#f5f5f5",
              border: "2px solid #111",
              borderRadius: 12,
              padding: "10px 12px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                flex: 1,
                fontSize: 11,
                color: "#555",
                fontFamily: "monospace",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={info.url}
            >
              {info.url}
            </span>

            <button
              onClick={handleCopy}
              style={{
                flexShrink: 0,
                padding: "10px 14px",
                background: "#111",
                color: "#fff",
                border: "2px solid #111",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 900,
                cursor: "pointer",
                boxShadow: "3px 3px 0 0 #111",
              }}
            >
              {copyLabel}
            </button>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={handleOpen}
              style={{
                flex: 1,
                minWidth: 220,
                padding: "12px 14px",
                background: "#f97316",
                color: "#111",
                border: "2px solid #111",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 1000,
                cursor: "pointer",
                boxShadow: "4px 4px 0 0 #111",
              }}
            >
              {openLabel}
            </button>

            <button
              onClick={() => setDismissed(true)}
              style={{
                flex: 1,
                minWidth: 180,
                padding: "12px 14px",
                background: "transparent",
                color: "#666",
                border: "2px solid #e5e5e5",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 900,
                cursor: "pointer",
              }}
              title="Você pode tentar mesmo assim (pode quebrar recursos)."
            >
              Continuar assim mesmo
            </button>
          </div>

          <div
            style={{
              background: "#111",
              color: "#fff",
              borderRadius: 14,
              padding: 12,
              border: "2px solid #111",
            }}
          >
            <div style={{ fontWeight: 1000, marginBottom: 6, fontSize: 12, letterSpacing: 0.4 }}>
              Atalho rápido
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.5, color: "#f5f5f5" }}>
              Copie o link e cole na barra de endereços do navegador externo (Safari/Chrome).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
