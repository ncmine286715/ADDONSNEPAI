// src/routes/admin.tsx
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from "firebase/auth";
import {
  Copy, Download as DownloadIcon, Plus, Trash2, CheckCircle2, AlertCircle,
  Hash, Type, Tag as TagIcon, GitBranch, User, Calendar, Star, TrendingUp,
  Image as ImageIcon, Link as LinkIcon, FileText, Youtube, Wrench, Eye,
  Settings, Loader2, Bot, Globe, Send, ShieldAlert,
} from "lucide-react";
import { Header } from "@/components/Header";

// ─── Firebase ───────────────────────────────────────────────────────────────────
const FB_CONFIG = {
  apiKey: "AIzaSyAKcFlRmCjuQ35hiGnlDmOPO1P4VdjGZqw",
  authDomain: "mineaddonsnews-web.firebaseapp.com",
  databaseURL: "https://mineaddonsnews-web-default-rtdb.firebaseio.com",
  projectId: "mineaddonsnews-web",
  storageBucket: "mineaddonsnews-web.firebasestorage.app",
  messagingSenderId: "877653857210",
  appId: "1:877653857210:web:13cbd8a9d58d611000c383",
  measurementId: "G-YG2BXTLYJJ",
};
const fbApp = getApps().length ? getApps()[0] : initializeApp(FB_CONFIG);
const fbAuth = getAuth(fbApp);

// ─── GitHub (token ofuscado em partes) ─────────────────────────────────────────
const GH_OWNER = "ncmine286715";
const GH_REPO = "ADDONSNEPAI";
const GH_PATH = "src/data/addons.json";
const _tk = ["Z2hwXzNkamY5ZjVTTU1vazZ", "OcHBPcmxsV3JUdXVGbVN5ODRA", "YU0zSzM="];
const GH_TOKEN = () => atob(_tk.join("").replace("@", ""));

// ─── NVIDIA NIM ─────────────────────────────────────────────────────────────────
const NV_BASE = "https://integrate.api.nvidia.com/v1";
const NV_MODEL = "nvidia/llama-3.1-nemotron-ultra-253b-v1";

// ─── CORS proxies fallback ───────────────────────────────────────────────────────
const PROXIES = [
  (u: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
  (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
];

const DISCORD_KEY = "admin_discord_webhook";
const DISCORD_SITE_KEY = "admin_discord_site_url";
const NV_KEY_LS = "admin_nv_key";

const empty = {
  id: "", title: "", category: "ncmine", version: "1.0.0",
  rating: "5", downloads: "0",
  date: new Date().toISOString().slice(0, 10),
  image: "", tagsRaw: "", short: "", description: "",
  downloadUrl: "", author: "", youtubeId: "",
};

// ─── Helpers ────────────────────────────────────────────────────────────────────
const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function draftToAddon(d: typeof empty) {
  const rating = Number(d.rating);
  const downloads = Number(d.downloads);
  const errors: Record<string, string> = {};
  if (!d.title) errors.title = "Obrigatório";
  if (!d.author) errors.author = "Obrigatório";
  if (!d.image) errors.image = "Obrigatório";
  if (!d.short) errors.short = "Obrigatório";
  if (!d.description) errors.description = "Obrigatório";
  if (!d.downloadUrl) errors.downloadUrl = "Obrigatório";
  if (!d.category) errors.category = "Obrigatório";
  if (isNaN(rating) || rating < 0 || rating > 5) errors.rating = "0 a 5";
  if (isNaN(downloads) || downloads < 0) errors.downloads = "≥ 0";
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: {
      id: d.id || slugify(d.title),
      title: d.title,
      category: d.category,
      version: d.version,
      rating,
      downloads,
      date: d.date,
      image: d.image,
      tags: d.tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
      short: d.short,
      description: d.description,
      downloadUrl: d.downloadUrl,
      author: d.author,
      ...(d.youtubeId ? { youtubeId: d.youtubeId } : {}),
    },
  };
}

// ─── GitHub API ──────────────────────────────────────────────────────────────────
async function ghGet() {
  const res = await fetch(
    `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_PATH}`,
    { headers: { Authorization: `token ${GH_TOKEN()}`, Accept: "application/vnd.github.v3+json" } }
  );
  if (!res.ok) throw new Error(`GitHub GET: ${res.status}`);
  const data = await res.json();
  return {
    content: JSON.parse(atob(data.content.replace(/\n/g, ""))),
    sha: data.sha,
  };
}

async function ghPush(content: any, sha: string, msg = "chore: atualiza addons.json via painel") {
  const res = await fetch(
    `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_PATH}`,
    {
      method: "PUT",
      headers: { Authorization: `token ${GH_TOKEN()}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: msg,
        content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
        sha,
      }),
    }
  );
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.message || `GitHub PUT: ${res.status}`);
  }
}

// ─── Extração: NVIDIA NIM ────────────────────────────────────────────────────────
async function extractViaNvidia(url: string, apiKey: string) {
  const res = await fetch(`${NV_BASE}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: NV_MODEL,
      max_tokens: 900,
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: "Você é um extrator de dados de addons de Minecraft. Retorne APENAS JSON válido, sem markdown, sem explicações, sem blocos de código.",
        },
        {
          role: "user",
          content: `Acesse esta URL e extraia as informações do addon: ${url}\n\nRetorne EXATAMENTE neste formato JSON (string vazia se não encontrar):\n{"title":"","author":"","version":"1.0.0","short":"","description":"","image":"","downloadUrl":"","tagsRaw":"","category":"ncmine","youtubeId":""}\n\ncategory deve ser um de: ncmine|shaders|texturas|mobs|mapas|pvp|decoracao|utilitarios\ntarasRaw: tags separadas por vírgula\nyoutubeId: só o ID de 11 chars`,
        },
      ],
    }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.detail || e.message || `NVIDIA API ${res.status}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  const s = text.indexOf("{"), e2 = text.lastIndexOf("}");
  if (s === -1 || e2 === -1) throw new Error("JSON não encontrado na resposta NVIDIA");
  return JSON.parse(text.slice(s, e2 + 1));
}

// ─── Extração: Proxy CORS ────────────────────────────────────────────────────────
async function extractViaProxy(url: string) {
  let html = "";
  for (const proxy of PROXIES) {
    try {
      const res = await fetch(proxy(url), { signal: AbortSignal.timeout(10000) });
      if (!res.ok) continue;
      const json = await res.json().catch(() => null);
      html = json?.contents ?? await res.text();
      if (html) break;
    } catch { /* next */ }
  }
  if (!html) throw new Error("Todos os proxies falharam. Use NVIDIA NIM ou preencha manualmente.");
  const doc = new DOMParser().parseFromString(html, "text/html");
  const gm = (...attrs: string[]) => {
    for (const a of attrs) {
      const v = doc.querySelector(`meta[property="${a}"]`)?.getAttribute("content")
        || doc.querySelector(`meta[name="${a}"]`)?.getAttribute("content") || "";
      if (v.trim()) return v.trim();
    }
    return "";
  };
  const title = gm("og:title", "twitter:title") || doc.title.replace(/[-|–].+$/, "").trim();
  const image = gm("og:image", "twitter:image");
  const short = gm("og:description", "twitter:description", "description").slice(0, 140);
  const author = doc.querySelector(".author-name,.creator a,.post-author a,[rel='author'],.author,.username")
    ?.textContent?.trim() || gm("author");
  const kw = gm("keywords", "og:keywords");
  const pageTags = Array.from(doc.querySelectorAll(".tag,.tag-label,.tags a"))
    .map(el => el.textContent?.trim() ?? "").filter(Boolean);
  const tagsRaw = [...new Set([...kw.split(/[,;]+/).map(t => t.trim()).filter(Boolean), ...pageTags])].slice(0, 8).join(", ");
  const description = doc.querySelector(".post-content,.entry-content,.content,.description,article .body")
    ?.textContent?.trim() || short;
  const dlSels = ['a[href*="mediafire"]', 'a[href*="drive.google"]', 'a[href*=".mcaddon"]', 'a[href*=".mcpack"]', 'a[class*="download"]'];
  let downloadUrl = "";
  for (const sel of dlSels) {
    const href = doc.querySelector(sel)?.getAttribute("href") ?? "";
    if (href && !href.startsWith("#")) {
      try { downloadUrl = new URL(href, url).href; } catch { downloadUrl = href; }
      break;
    }
  }
  let youtubeId = "";
  for (const iframe of doc.querySelectorAll("iframe[src*='youtube']")) {
    const m = (iframe.getAttribute("src") ?? "").match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (m) { youtubeId = m[1]; break; }
  }
  const r: any = {};
  if (title) r.title = title;
  if (author) r.author = author;
  if (short) r.short = short;
  if (description) r.description = description;
  if (tagsRaw) r.tagsRaw = tagsRaw;
  if (image) r.image = image;
  if (downloadUrl) r.downloadUrl = downloadUrl;
  if (youtubeId) r.youtubeId = youtubeId;
  if (title) r.id = slugify(title);
  return r;
}

// ─── Discord ──────────────────────────────────────────────────────────────────────
async function publishToDiscord(webhookUrl: string, addon: any, siteUrl: string) {
  const addonUrl = `${siteUrl}/addon/${addon.id}`;
  const res = await fetch(webhookUrl, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "Mine Addons News",
      embeds: [{
        title: `🎮 ${addon.title}`,
        description: addon.short || addon.description?.slice(0, 200),
        url: addonUrl, color: 0xF97316,
        thumbnail: { url: addon.image },
        fields: [
          { name: "👤 Autor", value: addon.author || "—", inline: true },
          { name: "📁 Categoria", value: addon.category || "—", inline: true },
          { name: "🔖 Versão", value: `v${addon.version}`, inline: true },
          { name: "⭐ Nota", value: `${Number(addon.rating).toFixed(1)}/5`, inline: true },
          { name: "📅 Data", value: new Date(addon.date).toLocaleDateString("pt-BR"), inline: true },
          ...(addon.tags?.length ? [{ name: "🏷️ Tags", value: addon.tags.join(" · ") }] : []),
        ],
        footer: { text: "Mine Addons News" },
        timestamp: new Date().toISOString(),
      }],
      components: [{ type: 1, components: [{ type: 2, style: 5, label: "Ver Add-on", emoji: { name: "🔗" }, url: addonUrl }] }],
    }),
  });
  if (!res.ok) throw new Error(`Discord: ${res.status}`);
}

// ─── Toast hook ───────────────────────────────────────────────────────────────────
function useToasts() {
  const [toasts, set] = useState<{ id: number; type: string; text: string }[]>([]);
  const n = useRef(0);
  const push = useCallback((type: string, text: string) => {
    const id = ++n.current;
    set(p => [...p, { id, type, text }]);
    setTimeout(() => set(p => p.filter(t => t.id !== id)), 4500);
  }, []);
  return { toasts, ok: (t: string) => push("ok", t), err: (t: string) => push("err", t), info: (t: string) => push("info", t) };
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────────
function UrlExtractor({ nvKey, onExtracted, onError }: { nvKey: string; onExtracted: (data: any) => void; onError: (msg: string) => void }) {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"nvidia" | "proxy">("nvidia");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState("");

  const handle = async () => {
    const t = url.trim(); if (!t) return;
    setBusy(true);
    try {
      let data;
      if (mode === "nvidia") {
        if (!nvKey) throw new Error("Configure a NVIDIA API Key nas ⚙️ Configurações.");
        setStep("Conectando ao NVIDIA NIM...");
        data = await extractViaNvidia(t, nvKey);
      } else {
        setStep("Buscando via proxy CORS gratuito...");
        data = await extractViaProxy(t);
      }
      onExtracted(data);
      setUrl(""); setStep("");
    } catch (e: any) {
      onError(e.message); setStep("");
    }
    setBusy(false);
  };

  return (
    <div className="bg-lime/10 border-2 border-ink p-4 mb-4">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Bot className="size-3.5" /> Preencher por URL
        </span>
        <div className="ml-auto flex gap-1.5">
          <button onClick={() => setMode("nvidia")} className={`px-2 py-1 text-[10px] font-bold uppercase border-2 border-ink rounded ${mode === "nvidia" ? "bg-ink text-orange" : "bg-paper"} brut-press`}>
            🟢 NVIDIA
          </button>
          <button onClick={() => setMode("proxy")} className={`px-2 py-1 text-[10px] font-bold uppercase border-2 border-ink rounded ${mode === "proxy" ? "bg-ink text-orange" : "bg-paper"} brut-press`}>
            🌐 Proxy
          </button>
        </div>
      </div>
      {mode === "nvidia" && !nvKey && (
        <div className="bg-yellow/10 border border-yellow/50 p-2 mb-2 text-xs">
          ⚠ Configure a NVIDIA API Key nas Configurações (grátis em{" "}
          <a href="https://build.nvidia.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">build.nvidia.com</a>).
        </div>
      )}
      {mode === "proxy" && (
        <p className="text-[10px] text-muted-foreground mb-2">Usa proxies públicos gratuitos — pode falhar em alguns sites.</p>
      )}
      <div className="flex gap-2">
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Cole o link: MCPEDL, ModBay..."
          className="flex-1 h-10 px-3 rounded-md bg-input border-2 border-ink text-sm" disabled={busy}
          onKeyDown={e => e.key === "Enter" && !busy && handle()} />
        <button onClick={handle} disabled={busy || !url.trim()}
          className={`px-4 h-10 bg-purple-600 text-white border-2 border-ink rounded-md font-bold uppercase text-xs brut-press ${busy || !url.trim() ? "opacity-50" : ""}`}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : "Extrair"}
        </button>
      </div>
      {step && <p className="text-xs text-purple-700 mt-2 animate-pulse">{step}</p>}
    </div>
  );
}

function SettingsPanel({ nvKey, setNvKey, webhook, setWebhook, siteUrl, setSiteUrl, onTestDiscord }: any) {
  const [open, setOpen] = useState(false);
  return (
    <div className="brut bg-paper p-4 mb-6">
      <button onClick={() => setOpen(p => !p)} className="w-full flex items-center gap-3 font-bold uppercase tracking-wider text-sm">
        <Settings className="size-5" /> Configurações <span className="ml-auto">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="mt-4 border-t-2 border-dashed border-ink pt-4 space-y-4">
          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Bot className="size-3.5" /> NVIDIA NIM API Key
            </label>
            <div className="flex gap-2 mt-1">
              <input type="password" value={nvKey} onChange={e => { setNvKey(e.target.value); localStorage.setItem(NV_KEY_LS, e.target.value); }}
                className="flex-1 h-10 px-3 rounded-md bg-input border-2 border-ink text-sm" placeholder="nvapi-..." />
              {nvKey && <span className="brut-tag brut-tag-lime text-[10px]">✓ Salva</span>}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Send className="size-3.5" /> Discord Webhook
              </label>
              <input type="url" value={webhook} onChange={e => { setWebhook(e.target.value); localStorage.setItem(DISCORD_KEY, e.target.value); }}
                className="w-full h-10 px-3 rounded-md bg-input border-2 border-ink text-sm mt-1" placeholder="https://discord.com/api/webhooks/..." />
            </div>
            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Globe className="size-3.5" /> URL do Site
              </label>
              <input type="url" value={siteUrl} onChange={e => { setSiteUrl(e.target.value); localStorage.setItem(DISCORD_SITE_KEY, e.target.value); }}
                className="w-full h-10 px-3 rounded-md bg-input border-2 border-ink text-sm mt-1" placeholder="https://mineaddonsnews.com" />
            </div>
          </div>
          {webhook && (
            <button onClick={onTestDiscord} className="inline-flex items-center gap-2 px-4 h-10 bg-[#5865F2] text-white border-2 border-ink rounded-md font-bold uppercase text-xs brut-press">
              <Send className="size-4" /> Testar Discord
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function GithubPanel({ onLoad, onPush, loading, hasSha }: any) {
  const [open, setOpen] = useState(false);
  return (
    <div className="brut bg-lime/10 p-4 mb-6">
      <button onClick={() => setOpen(p => !p)} className="w-full flex items-center gap-3 font-bold uppercase tracking-wider text-sm">
        <FileText className="size-5" /> GitHub — Editar addons.json
        <span className="ml-auto flex items-center gap-2">
          <span className="brut-tag bg-lime-light text-[10px]">{GH_OWNER}/{GH_REPO}</span>
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <div className="mt-4 border-t-2 border-dashed border-ink pt-4">
          <p className="text-xs text-muted-foreground mb-3">Fluxo: <strong>1</strong> Carregue → <strong>2</strong> Edite → <strong>3</strong> Salve.</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={onLoad} disabled={loading} className="inline-flex items-center gap-2 px-4 h-10 bg-paper border-2 border-ink rounded-md font-bold uppercase text-xs brut-press disabled:opacity-50">
              {loading ? <Loader2 className="size-4 animate-spin" /> : null} Carregar do GitHub
            </button>
            <button onClick={onPush} disabled={loading || !hasSha} className="inline-flex items-center gap-2 px-4 h-10 bg-lime border-2 border-ink rounded-md font-bold uppercase text-xs brut-press disabled:opacity-50" title={!hasSha ? "Carregue primeiro" : ""}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : null} Salvar no GitHub
            </button>
          </div>
          {!hasSha && <p className="text-[10px] text-muted-foreground mt-2">⚠ Carregue do GitHub antes de salvar.</p>}
        </div>
      )}
    </div>
  );
}

// ─── Login Screen (Tailwind version) ─────────────────────────────────────────────
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email || !pw) { setErr("Preencha e-mail e senha."); return; }
    setBusy(true); setErr("");
    try {
      await signInWithEmailAndPassword(fbAuth, email, pw);
    } catch (e: any) {
      const m: Record<string, string> = {
        "auth/invalid-credential": "E-mail ou senha incorretos.",
        "auth/user-not-found": "Usuário não encontrado.",
        "auth/wrong-password": "Senha incorreta.",
        "auth/too-many-requests": "Muitas tentativas. Aguarde um momento.",
        "auth/invalid-email": "E-mail inválido.",
      };
      setErr(m[e.code] || "Erro de autenticação. Tente novamente.");
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink">
      <div className="brut bg-paper p-10 max-w-sm w-full">
        <div className="flex items-center gap-3 mb-4">
          <ShieldAlert className="size-10 text-orange" />
          <h1 className="font-display text-3xl tracking-tighter uppercase">Painel Admin</h1>
        </div>
        <p className="text-xs text-muted-foreground mb-6">Mine Addons News — Firebase Authentication</p>
        <label className="text-[10px] font-mono font-bold uppercase tracking-widest">E-mail</label>
        <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }}
          className="w-full h-10 px-3 rounded-md bg-input border-2 border-ink text-sm mt-1 mb-3" placeholder="seu@email.com"
          onKeyDown={e => e.key === "Enter" && submit()} />
        <label className="text-[10px] font-mono font-bold uppercase tracking-widest">Senha</label>
        <input type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(""); }}
          className={`w-full h-10 px-3 rounded-md bg-input border-2 text-sm mt-1 mb-1 ${err ? "border-destructive" : "border-ink"}`}
          placeholder="••••••••••••" onKeyDown={e => e.key === "Enter" && submit()} />
        {err && <p className="text-[10px] text-destructive mt-1 flex items-center gap-1"><AlertCircle className="size-3" /> {err}</p>}
        <button onClick={submit} disabled={busy}
          className={`mt-4 w-full h-11 bg-ink text-orange border-2 border-ink rounded-md font-bold uppercase tracking-wider text-sm brut-press ${busy ? "opacity-60" : ""}`}
          style={{ boxShadow: "4px 4px 0 0 var(--ink)" }}>
          {busy ? "Verificando..." : "Entrar →"}
        </button>
        <p className="text-[10px] text-muted-foreground mt-4 text-center">Autenticado via Firebase · Somente usuários autorizados</p>
      </div>
    </div>
  );
}

// ─── Admin Principal ──────────────────────────────────────────────────────────────
function Admin() {
  const [user, setUser] = useState<any>(undefined);
  const [list, setList] = useState<typeof empty[]>([{ ...empty }]);
  const [output, setOutput] = useState("");
  const [csvOut, setCsvOut] = useState("");
  const [nvKey, setNvKey] = useState("");
  const [webhook, setWebhook] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [publishing, setPublishing] = useState<number | null>(null);
  const [ghLoading, setGhLoading] = useState(false);
  const [ghSha, setGhSha] = useState<string | null>(null);
  const { toasts, ok, err, info } = useToasts();

  useEffect(() => {
    const unsub = onAuthStateChanged(fbAuth, (u) => setUser(u ?? null));
    return () => unsub();
  }, []);

  useEffect(() => {
    setNvKey(localStorage.getItem(NV_KEY_LS) ?? "");
    setWebhook(localStorage.getItem(DISCORD_KEY) ?? "");
    setSiteUrl(localStorage.getItem(DISCORD_SITE_KEY) ?? "");
  }, []);

  const validations = useMemo(() => list.map(draftToAddon), [list]);
  const dupes = useMemo(() => {
    const seen = new Map<string, number[]>();
    validations.forEach((v, i) => {
      if (v.ok) {
        const arr = seen.get(v.data.id) ?? [];
        arr.push(i); seen.set(v.data.id, arr);
      }
    });
    const c = new Set<number>();
    seen.forEach(idxs => { if (idxs.length > 1) idxs.forEach(i => c.add(i)); });
    return c;
  }, [validations]);

  const allValid = validations.every(v => v.ok) && dupes.size === 0;
  const cleaned = () => validations.filter(v => v.ok).map(v => v.data);

  const update = (i: number, patch: Partial<typeof empty>) => {
    setList(prev => prev.map((a, idx) => idx === i ? { ...a, ...patch } : a));
  };

  const remove = (i: number) => {
    if (list.length > 1) setList(p => p.filter((_, x) => x !== i));
    else info("Precisa ter pelo menos 1 addon.");
  };

  const ghLoad = async () => {
    setGhLoading(true);
    try {
      const { content, sha } = await ghGet();
      setGhSha(sha);
      if (Array.isArray(content) && content.length) {
        setList(content.map((a: any) => ({
          id: a.id ?? "", title: a.title ?? "", category: a.category ?? "ncmine",
          version: a.version ?? "1.0.0", rating: String(a.rating ?? 5),
          downloads: String(a.downloads ?? 0), date: a.date ?? empty.date,
          image: a.image ?? "", tagsRaw: (a.tags ?? []).join(", "),
          short: a.short ?? "", description: a.description ?? "",
          downloadUrl: a.downloadUrl ?? "", author: a.author ?? "",
          youtubeId: a.youtubeId ?? "",
        })));
        ok(`${content.length} addon(s) carregado(s) do GitHub!`);
      } else {
        info("Repositório vazio ou sem addons.");
      }
    } catch (e: any) { err(e.message); }
    setGhLoading(false);
  };

  const ghPushAll = async () => {
    if (!allValid) { err("Corrija os erros antes de enviar."); return; }
    if (!ghSha) { err("Carregue do GitHub primeiro para obter o SHA."); return; }
    setGhLoading(true);
    try { await ghPush(cleaned(), ghSha); ok("✓ addons.json atualizado no GitHub!"); }
    catch (e: any) { err(e.message); }
    setGhLoading(false);
  };

  const publishOne = async (i: number) => {
    const v = validations[i]; if (!v.ok || !webhook) return;
    setPublishing(i);
    try { await publishToDiscord(webhook, v.data, siteUrl); ok(`"${v.data.title}" publicado!`); }
    catch (e: any) { err(e.message); }
    setPublishing(null);
  };

  const testDiscord = async () => {
    try {
      const r = await fetch(webhook, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "Mine Addons News", content: "✅ Webhook funcionando!" }),
      });
      r.ok ? ok("Teste enviado com sucesso!") : err(`Discord: ${r.status}`);
    } catch { err("Falha ao conectar ao Discord."); }
  };

  const generateJSON = () => {
    if (!allValid) return;
    setOutput(JSON.stringify(cleaned(), null, 2));
  };

  const generateCSV = () => {
    if (!allValid) return;
    const cols = ["id","title","category","version","rating","downloads","date","author","image","downloadUrl","youtubeId","tags","short","description"];
    const head = cols.join(",");
    const rows = cleaned().map((a: any) =>
      cols.map(c => {
        const v = a[c];
        const s = Array.isArray(v) ? v.join("|") : (v ?? "");
        if (/[",\n;]/.test(String(s))) return `"${String(s).replace(/"/g, '""')}"`;
        return s;
      }).join(",")
    );
    setCsvOut([head, ...rows].join("\n"));
  };

  const publishAll = async () => {
    if (!allValid || publishing !== null) return;
    setPublishing(-1);
    let sent = 0;
    for (const addon of cleaned()) {
      try {
        await publishToDiscord(webhook, addon, siteUrl);
        sent++;
        await new Promise(r => setTimeout(r, 1100));
      } catch { err(`Erro: ${addon.title}`); }
    }
    setPublishing(null);
    ok(`${sent}/${cleaned().length} publicado(s)!`);
  };

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <Loader2 className="size-8 text-orange animate-spin" />
        <p className="text-orange font-mono ml-3">Verificando autenticação...</p>
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  return (
    <>
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="size-12 grid place-items-center bg-orange border-2 border-ink rounded-md" style={{ boxShadow: "4px 4px 0 0 var(--ink)" }}>
            <Wrench className="size-6" />
          </span>
          <h1 className="font-display text-5xl md:text-6xl tracking-tighter">PAINEL ADMIN</h1>
        </div>
        <p className="text-muted-foreground mb-6 flex items-center gap-2">
          <FileText className="size-4" /> Gerencie addons, publique no Discord e sincronize com GitHub.
        </p>

        <SettingsPanel nvKey={nvKey} setNvKey={setNvKey} webhook={webhook} setWebhook={setWebhook} siteUrl={siteUrl} setSiteUrl={setSiteUrl} onTestDiscord={testDiscord} />
        <GithubPanel onLoad={ghLoad} onPush={ghPushAll} loading={ghLoading} hasSha={!!ghSha} />

        <div className={`brut px-4 py-3 mb-6 flex items-center gap-3 ${allValid ? "bg-lime" : "bg-paper"}`}>
          {allValid ? (
            <><CheckCircle2 className="size-5" /><span className="font-bold">Tudo válido</span></>
          ) : (
            <><AlertCircle className="size-5 text-destructive" /><span className="text-destructive font-bold">Corrija os erros antes de gerar</span></>
          )}
          <span className="ml-auto text-xs font-mono">{list.length} addons{list.length > 1 ? "s" : ""}</span>
        </div>

        <div className="space-y-5">
          {list.map((a, i) => {
            const v = validations[i];
            const errors = v.ok ? {} : v.errors;
            const isDupe = dupes.has(i);
            return (
              <div key={i} className={`brut p-5 space-y-3 ${isDupe ? "bg-destructive/10" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-2xl">#{i + 1}</span>
                    {v.ok && !isDupe && <span className="brut-tag brut-tag-lime"><CheckCircle2 className="size-3" /> Válido</span>}
                    {isDupe && <span className="brut-tag bg-destructive text-paper border-destructive"><AlertCircle className="size-3" /> ID duplicado</span>}
                    {!v.ok && <span className="brut-tag bg-destructive text-paper border-destructive"><AlertCircle className="size-3" /> {Object.keys(errors).length} erro(s)</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {v.ok && !isDupe && webhook && (
                      <button onClick={() => publishOne(i)} disabled={publishing !== null}
                        className="inline-flex items-center gap-1.5 px-2 h-8 bg-[#5865F2] text-white border-2 border-ink rounded-md font-bold text-[10px] uppercase brut-press disabled:opacity-50">
                        {publishing === i ? <Loader2 className="size-3 animate-spin" /> : <Send className="size-3" />} Discord
                      </button>
                    )}
                    {list.length > 1 && (
                      <button onClick={() => remove(i)} className="text-destructive hover:text-red-600 p-1.5"><Trash2 className="size-4" /></button>
                    )}
                  </div>
                </div>

                <UrlExtractor nvKey={nvKey} onExtracted={data => update(i, { ...data, id: data.title ? slugify(data.title) : a.id })} onError={msg => alert(msg)} />

                <div className="grid md:grid-cols-2 gap-3">
                  <Field icon={<Type />} label="Título" value={a.title} onChange={v => update(i, { title: v, id: a.id || slugify(v) })} error={errors.title} />
                  <Field icon={<Hash />} label="ID (slug)" value={a.id} onChange={v => update(i, { id: v })} error={errors.id || (isDupe ? "ID duplicado" : undefined)} />
                  <Field icon={<TagIcon />} label="Categoria" value={a.category} onChange={v => update(i, { category: v })} error={errors.category} hint="ncmine, shaders, mobs..." />
                  <Field icon={<GitBranch />} label="Versão" value={a.version} onChange={v => update(i, { version: v })} />
                  <Field icon={<User />} label="Autor" value={a.author} onChange={v => update(i, { author: v })} error={errors.author} />
                  <Field icon={<Calendar />} label="Data" type="date" value={a.date} onChange={v => update(i, { date: v })} />
                  <Field icon={<Star />} label="Avaliação (0-5)" type="number" value={a.rating} onChange={v => update(i, { rating: v })} error={errors.rating} />
                  <Field icon={<TrendingUp />} label="Downloads" type="number" value={a.downloads} onChange={v => update(i, { downloads: v })} error={errors.downloads} />
                  <Field icon={<ImageIcon />} label="URL da Imagem" value={a.image} onChange={v => update(i, { image: v })} error={errors.image} className="md:col-span-2" />
                  <Field icon={<LinkIcon />} label="URL de Download" value={a.downloadUrl} onChange={v => update(i, { downloadUrl: v })} error={errors.downloadUrl} className="md:col-span-2" />
                  <Field icon={<Youtube />} label="YouTube ID" value={a.youtubeId} onChange={v => update(i, { youtubeId: v })} hint="Ex: dQw4w9WgXcQ" className="md:col-span-2" />
                  <Field icon={<TagIcon />} label="Tags (vírgula)" value={a.tagsRaw} onChange={v => update(i, { tagsRaw: v })} className="md:col-span-2" />
                  <Field icon={<FileText />} label="Resumo (até 140)" value={a.short} onChange={v => update(i, { short: v })} error={errors.short} className="md:col-span-2" />
                  <TextArea icon={<FileText />} label="Descrição" value={a.description} onChange={v => update(i, { description: v })} error={errors.description} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => setList(p => [...p, { ...empty }])}
                  className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-paper border-2 border-ink font-bold uppercase tracking-wider text-sm brut-press">
            <Plus className="size-4" /> Adicionar
          </button>
          <button onClick={generateJSON} disabled={!allValid}
                  className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-orange border-2 border-ink font-bold uppercase tracking-wider text-sm brut-press disabled:opacity-40"
                  style={{ boxShadow: "4px 4px 0 0 var(--ink)" }}>
            <Eye className="size-4" /> Ver JSON
          </button>
          <button onClick={generateCSV} disabled={!allValid}
                  className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-lime border-2 border-ink font-bold uppercase tracking-wider text-sm brut-press disabled:opacity-40"
                  style={{ boxShadow: "4px 4px 0 0 var(--ink)" }}>
            <FileText className="size-4" /> Ver CSV
          </button>
          {webhook && (
            <button onClick={publishAll} disabled={!allValid || publishing !== null}
                    className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-[#5865F2] text-white border-2 border-ink font-bold uppercase tracking-wider text-sm brut-press disabled:opacity-40"
                    style={{ boxShadow: "4px 4px 0 0 var(--ink)" }}>
              {publishing === -1 ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Publicar tudo no Discord
            </button>
          )}
        </div>

        {output && <Preview title="JSON" content={output} onCopy={() => navigator.clipboard.writeText(output)} onDownload={() => downloadFile(output, "addons.json", "application/json")} />}
        {csvOut && <Preview title="CSV" content={csvOut} onCopy={() => navigator.clipboard.writeText(csvOut)} onDownload={() => downloadFile(csvOut, "addons.csv", "text/csv")} />}

        {/* Toasts */}
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-xs">
          {toasts.map(t => (
            <div key={t.id} className={`flex items-center gap-2 px-4 py-2 border-2 border-ink rounded-md font-mono font-bold text-xs animate-slide-up ${
              t.type === "ok" ? "bg-lime" : t.type === "err" ? "bg-destructive/20 text-destructive" : "bg-paper"
            }`}>
              {t.type === "ok" ? <CheckCircle2 className="size-4" /> : t.type === "err" ? <AlertCircle className="size-4" /> : <AlertCircle className="size-4" />}
              {t.text}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Sub-componentes de campo (Tailwind) ──────────────────────────────────────────
type FieldProps = {
  icon: React.ReactNode; label: string; value: string;
  onChange: (v: string) => void; type?: string; className?: string; hint?: string; error?: string;
};

function Field({ icon, label, value, onChange, type = "text", className = "", hint, error }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono font-bold">
        <span className="size-3 [&>svg]:size-3">{icon}</span>
        {label}
      </span>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        className={`mt-1 w-full h-10 px-3 rounded-md bg-input border-2 outline-none text-sm transition ${
          error ? "border-destructive" : "border-ink focus:bg-paper"
        }`}
      />
      {error ? (
        <span className="text-[10px] text-destructive mt-1 flex items-center gap-1"><AlertCircle className="size-3" /> {error}</span>
      ) : hint && (
        <span className="text-[10px] text-muted-foreground/80">{hint}</span>
      )}
    </label>
  );
}

function TextArea({ icon, label, value, onChange, error }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <label className="block md:col-span-2">
      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono font-bold">
        <span className="size-3 [&>svg]:size-3">{icon}</span>
        {label}
      </span>
      <textarea
        value={value} onChange={e => onChange(e.target.value)} rows={4}
        className={`mt-1 w-full px-3 py-2 rounded-md bg-input border-2 outline-none text-sm ${
          error ? "border-destructive" : "border-ink focus:bg-paper"
        }`}
      />
      {error && <span className="text-[10px] text-destructive mt-1 flex items-center gap-1"><AlertCircle className="size-3" /> {error}</span>}
    </label>
  );
}

function Preview({ title, content, onCopy, onDownload }: { title: string; content: string; onCopy: () => void; onDownload: () => void }) {
  return (
    <div className="mt-8 brut p-5">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="font-display text-2xl flex items-center gap-2"><Eye className="size-5" /> PREVIEW {title}</div>
        <div className="flex gap-2">
          <button onClick={onCopy} className="inline-flex items-center gap-2 px-3 h-9 rounded-md border-2 border-ink bg-paper text-xs font-bold uppercase brut-press">
            <Copy className="size-3.5" /> Copiar
          </button>
          <button onClick={onDownload} className="inline-flex items-center gap-2 px-3 h-9 rounded-md border-2 border-ink bg-orange text-xs font-bold uppercase brut-press">
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

function downloadFile(content: string, name: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

// ─── Rota ─────────────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel — Mine Addons News" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});
