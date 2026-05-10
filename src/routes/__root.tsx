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

// ─── In-App Browser Detection ─────────────────────────────────────────────────

const IAB_PATTERN =
  /Instagram|FBAN|FBAV|FB_IAB|musical_ly|TikTok|BytedanceWebview|ByteLocale|Snapchat|Twitter|LinkedInApp|Pinterest|reddit\/|MicroMessenger|Line\/|KAKAOTALK|Naver/i;

type AppName =
  | "TikTok" | "Instagram" | "Facebook" | "Snapchat"
  | "Twitter / X" | "LinkedIn" | "Pinterest" | string;

function detectInAppBrowser(): {
  detected: boolean;
  app: AppName;
  isIOS: boolean;
} {
  if (typeof navigator === "undefined")
    return { detected: false, app: "", isIOS: false };

  const ua = navigator.userAgent;
  const detected = IAB_PATTERN.test(ua);

  let app: AppName = "este app";
  if (/Instagram/i.test(ua))                               app = "Instagram";
  else if (/FBAN|FBAV|FB_IAB/i.test(ua))                  app = "Facebook";
  else if (/musical_ly|TikTok|BytedanceWebview/i.test(ua)) app = "TikTok";
  else if (/Snapchat/i.test(ua))                           app = "Snapchat";
  else if (/Twitter/i.test(ua))                            app = "Twitter / X";
  else if (/LinkedInApp/i.test(ua))                        app = "LinkedIn";
  else if (/Pinterest/i.test(ua))                          app = "Pinterest";

  const isIOS = /iPhone|iPad|iPod/i.test(ua);

  return { detected, app, isIOS };
}

const APP_EMOJI: Record<string, string> = {
  TikTok: "🎵",
  Instagram: "📸",
  Facebook: "📘",
  Snapchat: "👻",
  "Twitter / X": "🐦",
  LinkedIn: "💼",
  Pinterest: "📌",
};

// ─── Step-by-step instructions (specific per app + platform) ─────────────────

function Steps({ app, isIOS }: { app: string; isIOS: boolean }) {
  const menuHint =
    app === "TikTok"
      ? isIOS
        ? 'Toque em "Compartilhar" → "Abrir no Safari"'
        : 'Toque nos 3 pontos (⋮) → "Abrir no navegador"'
      : app === "Instagram"
      ? isIOS
        ? 'Toque nos 3 pontos (···) → "Abrir no Safari"'
        : 'Toque nos 3 pontos (⋮) → "Abrir no Chrome"'
      : app === "Facebook"
      ? isIOS
        ? 'Toque em "Mais" → "Abrir no Safari"'
        : 'Toque nos 3 pontos (⋮) → "Abrir no Chrome"'
      : isIOS
      ? 'Procure "Abrir no Safari" ou "Abrir no navegador"'
      : 'Procure "Abrir no Chrome" ou "Abrir no navegador"';

  const browser = isIOS ? "Safari" : "Chrome";

  const steps = [
    { n: "1", text: <><strong>Copie o link</strong> usando o botão acima</> },
    { n: "2", text: <>Abra o <strong>{browser}</strong> (ou qualquer navegador externo)</> },
    { n: "3", text: <>Cole o link na barra de endereço e acesse</> },
    { n: "💡", text: <><strong>Atalho:</strong> {menuHint}</>, tip: true },
  ];

  return (
    <ol style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
      {steps.map((s) => (
        <li
          key={s.n}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            background: s.tip ? "#fff8e6" : "#f5f5f5",
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 13,
            color: "#333",
            lineHeight: 1.5,
            border: s.tip ? "1.5px dashed #f90" : "none",
          }}
        >
          <span
            style={{
              minWidth: 26,
              height: 26,
              borderRadius: "50%",
              background: s.tip ? "#f90" : "#111",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 11,
              flexShrink: 0,
            }}
          >
            {s.n}
          </span>
          <span style={{ paddingTop: 2 }}>{s.text}</span>
        </li>
      ))}
    </ol>
  );
}

// ─── Banner ───────────────────────────────────────────────────────────────────

function InAppBrowserBanner() {
  const [info, setInfo] = useState<ReturnType<typeof detectInAppBrowser> | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
    const result = detectInAppBrowser();
    if (result.detected) setInfo(result);
  }, []);

  if (!info?.detected || dismissed) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback legacy
      const el = document.createElement("textarea");
      el.value = url;
      el.style.cssText = "position:fixed;opacity:0;top:0;left:0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const emoji = APP_EMOJI[info.app] ?? "📱";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.72)",
        display: "flex",
        alignItems: "flex-end",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          background: "#fff",
          borderRadius: "20px 20px 0 0",
          padding: "20px 18px 36px",
          maxHeight: "92dvh",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        {/* drag handle */}
        <div style={{ width: 40, height: 4, background: "#e0e0e0", borderRadius: 99, margin: "0 auto 18px" }} />

        {/* header */}
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 42, lineHeight: 1, marginBottom: 6 }}>{emoji}</div>
          <h2 style={{ fontSize: 19, fontWeight: 800, color: "#111", margin: "0 0 6px", lineHeight: 1.25 }}>
            Abra no seu navegador<br />para usar o site completo
          </h2>
          <p style={{ fontSize: 13, color: "#777", margin: 0, lineHeight: 1.5 }}>
            O navegador interno do <strong>{info.app}</strong> limita o funcionamento do site.
          </p>
        </div>

        {/* URL box + copy */}
        <div
          style={{
            background: "#f5f5f5",
            border: "2px solid #111",
            borderRadius: 12,
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
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
          >
            {url}
          </span>
          <button
            onClick={handleCopy}
            style={{
              flexShrink: 0,
              padding: "8px 14px",
              background: copied ? "#16a34a" : "#111",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
              transition: "background 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {copied ? "✓ Copiado!" : "Copiar link"}
          </button>
        </div>

        {/* steps */}
        <Steps app={info.app} isIOS={info.isIOS} />

        {/* dismiss */}
        <button
          onClick={() => setDismissed(true)}
          style={{
            display: "block",
            width: "100%",
            marginTop: 14,
            padding: "12px",
            background: "none",
            border: "1.5px solid #e0e0e0",
            borderRadius: 10,
            color: "#aaa",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Continuar no {info.app} mesmo assim
        </button>
      </div>
    </div>
  );
}

// ─── Route boilerplate ────────────────────────────────────────────────────────

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
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
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
    links: [{ rel: "stylesheet", href: appCss }],
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
