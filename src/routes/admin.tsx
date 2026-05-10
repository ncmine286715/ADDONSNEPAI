import { useMemo, useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Copy, Download as DownloadIcon, Plus, Trash2, CheckCircle2, AlertCircle,
  Hash, Type, Tag as TagIcon, GitBranch, User, Calendar, Star, TrendingUp,
  Image as ImageIcon, Link as LinkIcon, FileText, Youtube, Wrench, Eye,
  FileSpreadsheet, Sparkles, Loader2, Send, Bell, BellOff, ChevronDown,
  ChevronUp, Settings, Zap, Globe, CheckCheck, X,
} from "lucide-react";
import { Header } from "@/components/Header";
import { AddonSchema, type Addon } from "@/lib/addons";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel — Mine Addons News" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

// ─── Types ─────────────────────────────────────────────────────────────────────

type Draft = {
  id: string; title: string; category: string; version: string;
  rating: string; downloads: string; date: string;
  image: string; tagsRaw: string; short: string; description: string;
  downloadUrl: string; author: string; youtubeId: string;
};

type ToastMsg = { id: number; type: "ok" | "err" | "info"; text: string };

// ─── Constants ─────────────────────────────────────────────────────────────────

const DISCORD_KEY      = "admin_discord_webhook";
const DISCORD_SITE_KEY = "admin_discord_site_url";

const empty: Draft = {
  id: "", title: "", category: "ncmine", version: "1.0.0",
  rating: "5", downloads: "0",
  date: new Date().toISOString().slice(0, 10),
  image: "", tagsRaw: "", short: "", description: "",
  downloadUrl: "", author: "", youtubeId: "",
};

// ─── Helpers ────────────────────────────────────────────────────────────────────

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function draftToAddon(d: Draft): { ok: true; data: Addon } | { ok: false; errors: Record<string, string> } {
  const candidate = {
    id: d.id || slugify(d.title),
    title: d.title, category: d.category, version: d.version,
    rating: Number(d.rating), downloads: Number(d.downloads), date: d.date,
    image: d.image,
    tags: d.tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
    short: d.short, description: d.description,
    downloadUrl: d.downloadUrl, author: d.author,
    ...(d.youtubeId ? { youtubeId: d.youtubeId } : {}),
  };
  const parsed = AddonSchema.safeParse(candidate);
  if (parsed.success) return { ok: true, data: parsed.data };
  const errors: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const k = String(issue.path[0] ?? "_");
    if (!errors[k]) errors[k] = issue.message;
  }
  return { ok: false, errors };
}

function csvEscape(v: unknown) {
  const s = v === null || v === undefined ? "" : Array.isArray(v) ? v.join("|") : String(v);
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCSV(items: Addon[]) {
  const cols = ["id","title","category","version","rating","downloads","date","author","image","downloadUrl","youtubeId","tags","short","description"] as const;
  const head = cols.join(",");
  const rows = items.map((a) =>
    cols.map((c) => csvEscape((a as unknown as Record<string, unknown>)[c])).join(",")
  );
  return [head, ...rows].join("\n");
}

function downloadFile(content: string, name: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

// ─── Free URL Extractor (sem API) ──────────────────────────────────────────────
//
//  Estratégia:
//  1. Tenta buscar a página via proxies CORS gratuitos (sem custo nenhum)
//  2. Faz parse do HTML com DOMParser
//  3. Extrai meta Open Graph (og:title, og:image, og:description) → funciona em
//     praticamente todos os sites modernos (MCPEDL, ModBay, Planet Minecraft, etc.)
//  4. Complementa com seletores específicos para author, download, tags, versão
// ──────────────────────────────────────────────────────────────────────────────

const CORS_PROXIES = [
  (u: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
  (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
  (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
];

async function fetchHtml(targetUrl: string): Promise<string> {
  for (const proxy of CORS_PROXIES) {
    try {
      const res = await fetch(proxy(targetUrl), { signal: AbortSignal.timeout(10000) });
      if (!res.ok) continue;
      const json = await res.json().catch(() => null);
      // allorigins & codetabs retornam { contents: "..." }
      if (json?.contents) return json.contents as string;
      // corsproxy retorna texto direto
      return await res.text();
    } catch {
      // tenta próximo proxy
    }
  }
  throw new Error("Todos os proxies falharam. Tente novamente ou preencha manualmente.");
}

function getMeta(doc: Document, ...attrs: string[]): string {
  for (const attr of attrs) {
    const v =
      doc.querySelector(`meta[property="${attr}"]`)?.getAttribute("content") ||
      doc.querySelector(`meta[name="${attr}"]`)?.getAttribute("content") ||
      "";
    if (v.trim()) return v.trim();
  }
  return "";
}

function getText(doc: Document, ...selectors: string[]): string {
  for (const sel of selectors) {
    const el = doc.querySelector(sel);
    if (el?.textContent?.trim()) return el.textContent.trim();
  }
  return "";
}

function getAttr(doc: Document, attr: string, ...selectors: string[]): string {
  for (const sel of selectors) {
    const el = doc.querySelector(sel);
    const v  = el?.getAttribute(attr)?.trim();
    if (v) return v;
  }
  return "";
}

/** Detecta YouTube embed na página e extrai o ID */
function findYouTubeId(doc: Document): string {
  const iframes = Array.from(doc.querySelectorAll("iframe[src*='youtube']"));
  for (const iframe of iframes) {
    const src = iframe.getAttribute("src") ?? "";
    const m   = src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
  }
  const links = Array.from(doc.querySelectorAll("a[href*='youtube.com/watch'], a[href*='youtu.be']"));
  for (const a of links) {
    const href = a.getAttribute("href") ?? "";
    const m1   = href.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    const m2   = href.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (m1) return m1[1];
    if (m2) return m2[1];
  }
  return "";
}

/** Tenta encontrar o URL de download mais provável na página */
function findDownloadUrl(doc: Document, pageUrl: string): string {
  // Seletores específicos dos sites mais populares
  const priority = [
    // MCPEDL
    'a.download-btn[href]',
    'a[href*="mcpedl.com/download"]',
    'a[href*="dl.mcpedl.com"]',
    // ModBay
    'a[href*="modbay.org/get"]',
    // Genérico — botões/links com palavras-chave de download
    'a[href*="mediafire"]',
    'a[href*="drive.google"]',
    'a[href*="terabox"]',
    'a[href*="linkvertise"]',
    'a[href*="loot.link"]',
    'a[href*=".mcaddon"]',
    'a[href*=".mcpack"]',
    'a[href*=".zip"]',
    // Textos de botão genéricos
    'a[class*="download"]',
    'a[id*="download"]',
    'button[class*="download"]',
  ];

  for (const sel of priority) {
    const el   = doc.querySelector(sel);
    const href = el?.getAttribute("href") ?? "";
    if (href && !href.startsWith("#")) {
      try { return new URL(href, pageUrl).href; } catch { return href; }
    }
  }

  // Busca por texto do link como fallback
  const allLinks = Array.from(doc.querySelectorAll("a[href]"));
  for (const a of allLinks) {
    const text = a.textContent?.toLowerCase() ?? "";
    if (/\b(download|baixar|baixe|get|descargar)\b/.test(text)) {
      const href = a.getAttribute("href") ?? "";
      if (href && !href.startsWith("#") && !href.startsWith("javascript")) {
        try { return new URL(href, pageUrl).href; } catch { return href; }
      }
    }
  }

  return "";
}

/** Heurística para detectar categoria pelo título e tags */
function guessCategory(title: string, tags: string, desc: string): string {
  const text = `${title} ${tags} ${desc}`.toLowerCase();
  if (/shader|iluminação|illumination|luz|light|sombra|shadow/.test(text)) return "shaders";
  if (/textura|texture|pack|resource|hd|32x|64x|128x/.test(text)) return "texturas";
  if (/mob|criatura|creature|animal|boss|monster/.test(text)) return "mobs";
  if (/mapa|map|adventure|puzzle|city|cidade|sobreviv/.test(text)) return "mapas";
  if (/pvp|guerra|war|combat|weapon|arma/.test(text)) return "pvp";
  if (/decor|furniture|móvel|casa|house|construção|build/.test(text)) return "decoracao";
  if (/utilit|util|hud|ui|interface|inv|inventory/.test(text)) return "utilitarios";
  if (/ncmine/.test(text)) return "ncmine";
  return "utilitarios";
}

async function extractAddonFromUrl(url: string): Promise<Partial<Draft>> {
  const html = await fetchHtml(url);
  const doc  = new DOMParser().parseFromString(html, "text/html");

  // ── Open Graph (funciona na maioria dos sites) ──
  const title  = getMeta(doc, "og:title", "twitter:title") ||
                 doc.title.replace(/[-|–].+$/, "").trim();
  const image  = getMeta(doc, "og:image", "twitter:image", "og:image:secure_url");
  const short  = getMeta(doc, "og:description", "twitter:description", "description")
                   .slice(0, 140);

  // ── Seletores específicos por site ──
  const author =
    getText(doc,
      // MCPEDL
      ".author-name", ".creator a", ".post-author a", ".author a",
      // Planet Minecraft
      ".memberName", ".user-name",
      // ModBay
      ".addon-author", ".by-author",
      // Genérico
      '[rel="author"]', ".author", ".username", ".user",
    ) ||
    getMeta(doc, "author", "article:author");

  const version =
    getText(doc,
      ".version", ".addon-version", ".post-version",
      '[class*="version"]', '[data-version]',
    ).replace(/[^0-9.]/g, "") || "1.0.0";

  // Tags: combina og:keywords, meta keywords e elementos com classe tag
  const metaKeywords = getMeta(doc, "keywords", "og:keywords");
  const pageTags = Array.from(
    doc.querySelectorAll(".tag, .tag-label, .label, [class*='tag'] a, .tags a")
  ).map((el) => el.textContent?.trim() ?? "").filter(Boolean);

  const tagsRaw = [...new Set([
    ...metaKeywords.split(/[,;]+/).map((t) => t.trim()).filter(Boolean),
    ...pageTags,
  ])].slice(0, 8).join(", ");

  // Descrição completa: tenta o corpo principal do post
  const description =
    getText(doc,
      ".post-content", ".entry-content", ".content", ".description",
      "article .body", ".addon-description", ".post-body",
    ) || short;

  const downloadUrl = findDownloadUrl(doc, url);
  const youtubeId   = findYouTubeId(doc);
  const category    = guessCategory(title, tagsRaw, short);

  // Garante versão com pelo menos x.y.z
  const cleanVersion = /^\d+\.\d+/.test(version) ? version : "1.0.0";

  const result: Partial<Draft> = {};
  if (title)        result.title       = title;
  if (author)       result.author      = author;
  if (cleanVersion) result.version     = cleanVersion;
  if (short)        result.short       = short;
  if (description)  result.description = description;
  if (tagsRaw)      result.tagsRaw     = tagsRaw;
  if (image)        result.image       = image;
  if (downloadUrl)  result.downloadUrl = downloadUrl;
  if (category)     result.category    = category;
  if (youtubeId)    result.youtubeId   = youtubeId;
  if (title)        result.id          = slugify(title);

  return result;
}

// ─── Discord Publisher ──────────────────────────────────────────────────────────

async function publishToDiscord(webhookUrl: string, addon: Addon, siteUrl: string) {
  const addonUrl = `${siteUrl}/addon/${addon.id}`;
  const payload  = {
    username: "Mine Addons News",
    embeds: [{
      title:       `🎮 ${addon.title}`,
      description: addon.short || addon.description?.slice(0, 200),
      url:         addonUrl,
      color:       0xF97316,
      thumbnail:   { url: addon.image },
      fields: [
        { name: "👤 Autor",     value: addon.author || "—",                          inline: true },
        { name: "📁 Categoria", value: addon.category || "—",                        inline: true },
        { name: "🔖 Versão",    value: `v${addon.version}`,                          inline: true },
        { name: "⬇️ Downloads", value: addon.downloads.toLocaleString("pt-BR"),      inline: true },
        { name: "⭐ Avaliação", value: `${addon.rating.toFixed(1)} / 5`,             inline: true },
        { name: "📅 Data",      value: new Date(addon.date).toLocaleDateString("pt-BR"), inline: true },
        ...(addon.tags?.length
          ? [{ name: "🏷️ Tags", value: addon.tags.join(" · "), inline: false }]
          : []),
      ],
      footer:    { text: "Mine Addons News" },
      timestamp: new Date().toISOString(),
    }],
    components: [{
      type: 1,
      components: [{
        type: 2, style: 5, label: "Ver Add-on",
        emoji: { name: "🔗" }, url: addonUrl,
      }],
    }],
  };

  const res = await fetch(webhookUrl, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Discord recusou: ${res.status} — ${body}`);
  }
}

// ─── Toast system ───────────────────────────────────────────────────────────────

function useToasts() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const counter = useRef(0);
  const push = (type: ToastMsg["type"], text: string) => {
    const id = ++counter.current;
    setToasts((p) => [...p, { id, type, text }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  };
  return { toasts, ok: (t: string) => push("ok", t), err: (t: string) => push("err", t), info: (t: string) => push("info", t) };
}

function Toasts({ toasts }: { toasts: ToastMsg[] }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-2 max-w-xs w-full">
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-center gap-2 px-4 py-3 rounded-md border-2 border-ink text-sm font-bold shadow-[4px_4px_0_0_var(--ink)] animate-fade-up ${
          t.type === "ok" ? "bg-lime" : t.type === "err" ? "bg-destructive text-paper" : "bg-paper"
        }`}>
          {t.type === "ok"  ? <CheckCheck className="size-4 shrink-0" />
           : t.type === "err" ? <X className="size-4 shrink-0" />
           : <Zap className="size-4 shrink-0" />}
          <span className="line-clamp-2">{t.text}</span>
        </div>
      ))}
    </div>
  );
}

// ─── URL Extractor Component ────────────────────────────────────────────────────

function UrlExtractor({ onExtracted, onError }: {
  onExtracted: (data: Partial<Draft>) => void;
  onError: (msg: string) => void;
}) {
  const [url,     setUrl]     = useState("");
  const [loading, setLoading] = useState(false);
  const [status,  setStatus]  = useState("");

  const handle = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true);
    setStatus("Buscando página...");
    try {
      setStatus("Lendo HTML e extraindo dados...");
      const data = await extractAddonFromUrl(trimmed);
      onExtracted(data);
      setUrl("");
      setStatus("");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro desconhecido";
      onError(msg);
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 rounded-md border-2 border-violet bg-violet/5 mb-1">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="size-3.5 text-violet" />
        <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-violet">
          Preencher automaticamente por URL
        </span>
        <span className="brut-tag text-[9px] bg-lime ml-auto">GRÁTIS · sem API</span>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handle()}
            placeholder="Cole o link: MCPEDL, ModBay, Planet Minecraft..."
            className="w-full h-10 pl-8 pr-3 rounded-md bg-input border-2 border-ink text-sm outline-none focus:bg-paper"
            disabled={loading}
          />
        </div>
        <button
          onClick={handle}
          disabled={loading || !url.trim()}
          className="inline-flex items-center gap-2 px-4 h-10 rounded-md bg-violet text-paper border-2 border-ink font-bold text-xs uppercase tracking-wider brut-press disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          style={{ boxShadow: "3px 3px 0 0 var(--ink)" }}
        >
          {loading
            ? <><Loader2 className="size-3.5 animate-spin" /> Extraindo</>
            : <><Sparkles className="size-3.5" /> Extrair</>}
        </button>
      </div>
      {status && (
        <p className="mt-1.5 text-[10px] text-muted-foreground flex items-center gap-1 animate-pulse">
          <Loader2 className="size-3 animate-spin" /> {status}
        </p>
      )}
    </div>
  );
}

// ─── Discord Panel ──────────────────────────────────────────────────────────────

function DiscordPanel({ webhook, setWebhook, siteUrl, setSiteUrl, onTest }: {
  webhook: string; setWebhook: (v: string) => void;
  siteUrl: string; setSiteUrl: (v: string) => void;
  onTest: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="brut mb-6 overflow-hidden">
      <button onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-paper hover:bg-secondary transition">
        <div className="flex items-center gap-2 flex-wrap">
          <Settings className="size-4" />
          <span className="font-bold text-sm uppercase tracking-wider">Discord</span>
          {webhook
            ? <span className="brut-tag brut-tag-lime text-[9px] flex items-center gap-1"><Bell className="size-3" /> Webhook ativo</span>
            : <span className="brut-tag text-[9px] flex items-center gap-1"><BellOff className="size-3" /> Sem webhook</span>}
        </div>
        {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </button>
      {open && (
        <div className="border-t-2 border-ink px-5 py-4 bg-secondary/30 space-y-3">
          <p className="text-xs text-muted-foreground">
            Canal Discord → <strong>Editar canal → Integrações → Webhooks → Novo Webhook</strong> → copiar URL.
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest font-mono font-bold flex items-center gap-1.5">
                <Bell className="size-3" /> URL do Webhook
              </span>
              <input type="url" value={webhook}
                onChange={(e) => { setWebhook(e.target.value); localStorage.setItem(DISCORD_KEY, e.target.value); }}
                placeholder="https://discord.com/api/webhooks/..."
                className="mt-1 w-full h-10 px-3 rounded-md bg-input border-2 border-ink text-sm outline-none focus:bg-paper" />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest font-mono font-bold flex items-center gap-1.5">
                <Globe className="size-3" /> URL do Site
              </span>
              <input type="url" value={siteUrl}
                onChange={(e) => { setSiteUrl(e.target.value); localStorage.setItem(DISCORD_SITE_KEY, e.target.value); }}
                placeholder="https://mineaddonsnews.com"
                className="mt-1 w-full h-10 px-3 rounded-md bg-input border-2 border-ink text-sm outline-none focus:bg-paper" />
            </label>
          </div>
          <button onClick={onTest} disabled={!webhook}
            className="inline-flex items-center gap-2 px-4 h-9 rounded-md bg-paper border-2 border-ink text-xs font-bold uppercase tracking-wider brut-press disabled:opacity-40">
            <Send className="size-3.5" /> Testar webhook
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Admin ──────────────────────────────────────────────────────────────────────

function Admin() {
  const [list,       setList]       = useState<Draft[]>([{ ...empty }]);
  const [output,     setOutput]     = useState("");
  const [csvOut,     setCsvOut]     = useState("");
  const [webhook,    setWebhook]    = useState("");
  const [siteUrl,    setSiteUrl]    = useState(SITE_URL || "");
  const [publishing, setPublishing] = useState<number | null>(null);
  const { toasts, ok, err, info }   = useToasts();

  useEffect(() => {
    setWebhook(localStorage.getItem(DISCORD_KEY)      ?? "");
    setSiteUrl(localStorage.getItem(DISCORD_SITE_KEY) ?? SITE_URL ?? "");
  }, []);

  const validations = useMemo(() => list.map(draftToAddon), [list]);

  const dupes = useMemo(() => {
    const seen = new Map<string, number[]>();
    validations.forEach((v, i) => {
      if (v.ok) { const arr = seen.get(v.data.id) ?? []; arr.push(i); seen.set(v.data.id, arr); }
    });
    const conflicts = new Set<number>();
    seen.forEach((idxs) => { if (idxs.length > 1) idxs.forEach((i) => conflicts.add(i)); });
    return conflicts;
  }, [validations]);

  const allValid = validations.every((v) => v.ok) && dupes.size === 0;

  const update = (i: number, patch: Partial<Draft>) =>
    setList((prev) => prev.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));

  const applyExtracted = (i: number, data: Partial<Draft>) => {
    const filled = Object.keys(data).filter((k) => (data as Record<string, string>)[k]);
    update(i, data);
    info(`✨ ${filled.length} campo(s) preenchidos!`);
  };

  const cleaned = (): Addon[] => validations.map((v) => (v as { ok: true; data: Addon }).data);

  const testDiscord = async () => {
    if (!webhook) return;
    try {
      const res = await fetch(webhook, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "Mine Addons News", content: "✅ **Webhook funcionando!** Mine Addons News conectado." }),
      });
      res.ok ? ok("Mensagem de teste enviada!") : err(`Discord: ${res.status}`);
    } catch { err("Não foi possível conectar ao Discord."); }
  };

  const publishOne = async (i: number) => {
    const v = validations[i];
    if (!v.ok || !webhook) return;
    setPublishing(i);
    try { await publishToDiscord(webhook, v.data, siteUrl); ok(`"${v.data.title}" publicado!`); }
    catch (e) { err(e instanceof Error ? e.message : "Erro ao publicar."); }
    finally { setPublishing(null); }
  };

  const publishAll = async () => {
    if (!webhook || !allValid) return;
    setPublishing(-1);
    let sent = 0;
    for (const addon of cleaned()) {
      try {
        await publishToDiscord(webhook, addon, siteUrl);
        sent++;
        await new Promise((r) => setTimeout(r, 1100)); // evita rate limit
      } catch { err(`Erro ao publicar "${addon.title}"`); }
    }
    setPublishing(null);
    ok(`${sent}/${cleaned().length} publicado(s) no Discord!`);
  };

  return (
    <>
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-10">

        <div className="flex items-center gap-3 mb-2">
          <span className="size-12 grid place-items-center bg-orange border-2 border-ink rounded-md" style={{ boxShadow: "4px 4px 0 0 var(--ink)" }}>
            <Wrench className="size-6" />
          </span>
          <h1 className="font-display text-5xl md:text-6xl tracking-tighter">PAINEL</h1>
        </div>
        <p className="text-muted-foreground mb-6 flex items-center gap-2">
          <FileText className="size-4" /> Preencha, valide e cole o JSON em{" "}
          <code className="bg-secondary px-1.5 py-0.5 rounded border border-ink">src/data/addons.json</code>.
        </p>

        <DiscordPanel webhook={webhook} setWebhook={setWebhook}
          siteUrl={siteUrl} setSiteUrl={setSiteUrl} onTest={testDiscord} />

        {/* Status */}
        <div className={`brut px-4 py-3 mb-6 flex items-center gap-3 ${allValid ? "bg-lime" : "bg-paper"}`}>
          {allValid
            ? <><CheckCircle2 className="size-5" /><span className="font-bold">Tudo válido</span></>
            : <><AlertCircle className="size-5 text-destructive" /><span className="text-destructive font-bold">Corrija os erros antes de gerar</span></>}
          <span className="ml-auto text-xs font-mono">{list.length} add-on{list.length > 1 ? "s" : ""}</span>
        </div>

        {/* Cards */}
        <div className="space-y-5">
          {list.map((a, i) => {
            const v      = validations[i];
            const errors = v.ok ? {} : v.errors;
            const isDupe = dupes.has(i);
            return (
              <div key={i} className={`brut p-5 space-y-3 ${isDupe ? "bg-destructive/10" : ""}`}>

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display text-2xl">#{i + 1}</span>
                    {v.ok && !isDupe && <span className="brut-tag brut-tag-lime"><CheckCircle2 className="size-3" /> Válido</span>}
                    {isDupe && <span className="brut-tag bg-destructive text-paper"><AlertCircle className="size-3" /> ID duplicado</span>}
                    {!v.ok && <span className="brut-tag bg-destructive text-paper"><AlertCircle className="size-3" /> {Object.keys(errors).length} erro(s)</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {v.ok && !isDupe && webhook && (
                      <button onClick={() => publishOne(i)}
                        disabled={publishing !== null}
                        className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md bg-paper border-2 border-ink text-xs font-bold uppercase brut-press disabled:opacity-40"
                        title="Publicar este no Discord">
                        {publishing === i ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                        Discord
                      </button>
                    )}
                    {list.length > 1 && (
                      <button onClick={() => setList((p) => p.filter((_, x) => x !== i))}
                        className="text-destructive hover:text-red-600 p-1.5">
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Extrator de URL (grátis) */}
                <UrlExtractor
                  onExtracted={(data) => applyExtracted(i, data)}
                  onError={(msg) => err(msg)}
                />

                <div className="grid md:grid-cols-2 gap-3">
                  <Field icon={<Type />} label="Título" value={a.title}
                    onChange={(v) => update(i, { title: v, id: a.id || slugify(v) })} error={errors.title} />
                  <Field icon={<Hash />} label="ID (slug)" value={a.id}
                    onChange={(v) => update(i, { id: v })}
                    error={errors.id || (isDupe ? "ID já usado" : undefined)} />
                  <Field icon={<TagIcon />} label="Categoria" value={a.category}
                    onChange={(v) => update(i, { category: v })} error={errors.category}
                    hint="ncmine, shaders, mobs, texturas, mapas..." />
                  <Field icon={<GitBranch />} label="Versão" value={a.version}
                    onChange={(v) => update(i, { version: v })} error={errors.version} />
                  <Field icon={<User />} label="Autor" value={a.author}
                    onChange={(v) => update(i, { author: v })} error={errors.author} />
                  <Field icon={<Calendar />} label="Data" type="date" value={a.date}
                    onChange={(v) => update(i, { date: v })} error={errors.date} />
                  <Field icon={<Star />} label="Avaliação (0-5)" type="number" value={a.rating}
                    onChange={(v) => update(i, { rating: v })} error={errors.rating} />
                  <Field icon={<TrendingUp />} label="Downloads" type="number" value={a.downloads}
                    onChange={(v) => update(i, { downloads: v })} error={errors.downloads} />
                  <Field icon={<ImageIcon />} label="URL da imagem" value={a.image}
                    onChange={(v) => update(i, { image: v })} error={errors.image} className="md:col-span-2" />
                  <Field icon={<LinkIcon />} label="URL de download" value={a.downloadUrl}
                    onChange={(v) => update(i, { downloadUrl: v })} error={errors.downloadUrl} className="md:col-span-2" />
                  <Field icon={<Youtube />} label="ID do YouTube (opcional)" value={a.youtubeId}
                    onChange={(v) => update(i, { youtubeId: v })} error={errors.youtubeId}
                    hint="Ex: dQw4w9WgXcQ" className="md:col-span-2" />
                  <Field icon={<TagIcon />} label="Tags (vírgula)" value={a.tagsRaw}
                    onChange={(v) => update(i, { tagsRaw: v })} error={errors.tags} className="md:col-span-2" />
                  <Field icon={<FileText />} label="Resumo (até 140)" value={a.short}
                    onChange={(v) => update(i, { short: v })} error={errors.short} className="md:col-span-2" />
                  <TextArea icon={<FileText />} label="Descrição completa" value={a.description}
                    onChange={(v) => update(i, { description: v })} error={errors.description} />
                </div>

                {a.image && (
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-mono font-bold">Preview</span>
                    <img src={a.image} alt="preview"
                      className="mt-1 h-20 w-auto rounded-md border-2 border-ink object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => setList((p) => [...p, { ...empty }])}
            className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-paper border-2 border-ink font-bold uppercase tracking-wider text-sm brut-press">
            <Plus className="size-4" /> Adicionar
          </button>
          <button onClick={() => { if (allValid) setOutput(JSON.stringify(cleaned(), null, 2)); }}
            disabled={!allValid}
            className="inline-flex items-center gap-2 px-6 h-11 rounded-md bg-orange border-2 border-ink font-bold uppercase tracking-wider text-sm brut-press disabled:opacity-40"
            style={{ boxShadow: "4px 4px 0 0 var(--ink)" }}>
            <Eye className="size-4" /> Gerar JSON
          </button>
          <button onClick={() => { if (allValid) setCsvOut(toCSV(cleaned())); }}
            disabled={!allValid}
            className="inline-flex items-center gap-2 px-6 h-11 rounded-md bg-lime border-2 border-ink font-bold uppercase tracking-wider text-sm brut-press disabled:opacity-40"
            style={{ boxShadow: "4px 4px 0 0 var(--ink)" }}>
            <FileSpreadsheet className="size-4" /> Gerar CSV
          </button>
          {webhook && (
            <button onClick={publishAll} disabled={!allValid || publishing !== null}
              className="inline-flex items-center gap-2 px-6 h-11 rounded-md bg-violet text-paper border-2 border-ink font-bold uppercase tracking-wider text-sm brut-press disabled:opacity-40"
              style={{ boxShadow: "4px 4px 0 0 var(--ink)" }}>
              {publishing === -1
                ? <><Loader2 className="size-4 animate-spin" /> Publicando...</>
                : <><Send className="size-4" /> Publicar tudo no Discord</>}
            </button>
          )}
        </div>

        {output && (
          <Preview title="JSON" content={output}
            onCopy={() => { navigator.clipboard.writeText(output); ok("JSON copiado!"); }}
            onDownload={() => downloadFile(output, "addons.json", "application/json")} />
        )}
        {csvOut && (
          <Preview title="CSV" content={csvOut}
            onCopy={() => { navigator.clipboard.writeText(csvOut); ok("CSV copiado!"); }}
            onDownload={() => downloadFile(csvOut, "addons.csv", "text/csv;charset=utf-8")} />
        )}
      </div>

      <Toasts toasts={toasts} />
    </>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function Preview({ title, content, onCopy, onDownload }: {
  title: string; content: string; onCopy: () => void; onDownload: () => void;
}) {
  return (
    <div className="mt-8 brut p-5">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="font-display text-2xl flex items-center gap-2"><Eye className="size-5" /> PREVIEW {title}</div>
        <div className="flex gap-2">
          <button onClick={onCopy}
            className="inline-flex items-center gap-2 px-3 h-9 rounded-md border-2 border-ink bg-paper text-xs font-bold uppercase brut-press">
            <Copy className="size-3.5" /> Copiar
          </button>
          <button onClick={onDownload}
            className="inline-flex items-center gap-2 px-3 h-9 rounded-md border-2 border-ink bg-orange text-xs font-bold uppercase brut-press">
            <DownloadIcon className="size-3.5" /> Baixar
          </button>
        </div>
      </div>
      <pre className="text-xs font-mono bg-ink text-paper rounded-md p-4 overflow-auto max-h-[500px] border-2 border-ink">
        <code>{content}</code>
      </pre>
    </div>
  );
}

type FieldProps = {
  icon: React.ReactNode; label: string; value: string;
  onChange: (v: string) => void;
  type?: string; className?: string; hint?: string; error?: string;
};

function Field({ icon, label, value, onChange, type = "text", className = "", hint, error }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono font-bold">
        <span className="size-3 [&>svg]:size-3">{icon}</span>{label}
      </span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className={`mt-1 w-full h-10 px-3 rounded-md bg-input border-2 outline-none text-sm transition ${
          error ? "border-destructive" : "border-ink focus:bg-paper"
        }`} />
      {error
        ? <span className="text-[10px] text-destructive mt-1 flex items-center gap-1"><AlertCircle className="size-3" /> {error}</span>
        : hint && <span className="text-[10px] text-muted-foreground/80">{hint}</span>}
    </label>
  );
}

function TextArea({ icon, label, value, onChange, error }: {
  icon: React.ReactNode; label: string; value: string;
  onChange: (v: string) => void; error?: string;
}) {
  return (
    <label className="block md:col-span-2">
      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono font-bold">
        <span className="size-3 [&>svg]:size-3">{icon}</span>{label}
      </span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4}
        className={`mt-1 w-full px-3 py-2 rounded-md bg-input border-2 outline-none text-sm ${
          error ? "border-destructive" : "border-ink focus:bg-paper"
        }`} />
      {error && <span className="text-[10px] text-destructive mt-1 flex items-center gap-1"><AlertCircle className="size-3" /> {error}</span>}
    </label>
  );
}
