import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

// ─── In-App Browser Detection ────────────────────────────────────────────────

/** Apps cujos navegadores internos quebram sites modernos */
const IAB_PATTERN =
  /Instagram|FBAN|FBAV|FB_IAB|musical_ly|TikTok|BytedanceWebview|ByteLocale|Snapchat|Twitter|LinkedInApp|Pinterest|reddit\/|MicroMessenger|Line\/|KAKAOTALK|Naver/i;

function detectInAppBrowser(): {
  detected: boolean;
  app: string;
  isAndroid: boolean;
  isIOS: boolean;
} {
  if (typeof navigator === "undefined")
    return { detected: false, app: "", isAndroid: false, isIOS: false };

  const ua = navigator.userAgent;
  const detected = IAB_PATTERN.test(ua);

  let app = "navegador do app";
  if (/Instagram/i.test(ua)) app = "Instagram";
  else if (/FBAN|FBAV|FB_IAB/i.test(ua)) app = "Facebook";
  else if (/musical_ly|TikTok|BytedanceWebview|ByteLocale/i.test(ua)) app = "TikTok";
  else if (/Snapchat/i.test(ua)) app = "Snapchat";
  else if (/Twitter/i.test(ua)) app = "Twitter / X";
  else if (/LinkedInApp/i.test(ua)) app = "LinkedIn";
  else if (/Pinterest/i.test(ua)) app = "Pinterest";

  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);

  return { detected, app, isAndroid, isIOS };
}

/** Tenta abrir no Chrome externo via intent:// (Android only) */
function tryOpenInChrome() {
  const url = window.location.href;
  const host = window.location.host;
  const path = window.location.pathname + window.location.search + window.location.hash;

  // Tenta Chrome primeiro, depois qualquer browser externo
  const intentUrl = `intent://${host}${path}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
  window.location.href = intentUrl;
}

// ─── Banner Component ─────────────────────────────────────────────────────────

function InAppBrowserBanner() {
  const [info, setInfo] = useState<ReturnType<typeof detectInAppBrowser> | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const result = detectInAppBrowser();
    if (result.detected) {
      setInfo(result);

      // Android: tenta redirect automático silencioso após 300ms
      if (result.isAndroid) {
        const timer = setTimeout(() => {
          tryOpenInChrome();
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  if (!info?.detected || dismissed) return null;

  const handleOpenExternal = () => {
    if (info.isAndroid) {
      setRedirecting(true);
      tryOpenInChrome();
      // Se falhar (intent não suportado), mostra instrução manual após 1s
      setTimeout(() => setRedirecting(false), 1500);
    }
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
        padding: "0",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          background: "#fff",
          borderRadius: "20px 20px 0 0",
          padding: "28px 24px 36px",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        {/* Ícone / emoji do app */}
        <div style={{ fontSize: 48, marginBottom: 8 }}>
          {info.app === "TikTok" ? "🎵"
            : info.app === "Instagram" ? "📸"
            : info.app === "Facebook" ? "📘"
            : info.app === "Snapchat" ? "👻"
            : info.app === "Twitter / X" ? "🐦"
            : "📱"}
        </div>

        <p style={{ fontSize: 13, color: "#888", marginBottom: 4, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
          Navegador interno detectado
        </p>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 10px", color: "#111", lineHeight: 1.2 }}>
          Abrir no navegador<br />externo?
        </h2>
        <p style={{ fontSize: 14, color: "#555", margin: "0 0 24px", lineHeight: 1.5 }}>
          O navegador do <strong>{info.app}</strong> pode travar o site.
          {info.isIOS
            ? " Toque nos três pontinhos (···) no canto superior direito e escolha \"Abrir no Safari\" ou \"Abrir no navegador\"."
            : " Clique no botão abaixo para abrir no Chrome."}
        </p>

        {/* iOS: instrução visual com seta */}
        {info.isIOS && (
          <div
            style={{
              background: "#fff8e6",
              border: "2px dashed #f90",
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 20,
              textAlign: "left",
              fontSize: 14,
              color: "#333",
              lineHeight: 1.6,
            }}
          >
            <span style={{ fontSize: 20 }}>☝️</span>{" "}
            <strong>Como abrir:</strong><br />
            Toque em{" "}
            <span style={{ background: "#eee", borderRadius: 6, padding: "1px 6px", fontWeight: 700 }}>···</span>
            {" "}ou{" "}
            <span style={{ background: "#eee", borderRadius: 6, padding: "1px 6px", fontWeight: 700 }}>⋮</span>
            {" "}no canto superior direito → <strong>"Abrir no Safari"</strong> (ou Chrome, Firefox...)
          </div>
        )}

        {/* Android: botão de ação */}
        {info.isAndroid && (
          <button
            onClick={handleOpenExternal}
            disabled={redirecting}
            style={{
              width: "100%",
              padding: "16px",
              background: redirecting ? "#aaa" : "#111",
              color: "#fff",
              border: "none",
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 0.5,
              marginBottom: 12,
              cursor: redirecting ? "default" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {redirecting ? "Abrindo…" : "🌐 Abrir no Chrome"}
          </button>
        )}

        <button
          onClick={() => setDismissed(true)}
          style={{
            background: "none",
            border: "none",
            color: "#999",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            padding: "8px 16px",
          }}
        >
          Continuar mesmo assim
        </button>
      </div>
    </div>
  );
}

// ─── Route components ─────────────────────────────────────────────────────────

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        {/* Banner de detecção de navegador interno — renderiza apenas no cliente */}
        <InAppBrowserBanner />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
