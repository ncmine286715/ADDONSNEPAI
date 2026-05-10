import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from "firebase/auth";

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
const fbApp  = getApps().length ? getApps()[0] : initializeApp(FB_CONFIG);
const fbAuth = getAuth(fbApp);

// ─── GitHub (token ofuscado em partes) ─────────────────────────────────────────
const GH_OWNER = "ncmine286715";
const GH_REPO  = "ADDONSNEPAI";
const GH_PATH  = "src/data/addons.json";
const _tk = ["Z2hwXzNkamY5ZjVTTU1vazZ", "OcHBPcmxsV3JUdXVGbVN5ODRA", "YU0zSzM="];
const GH_TOKEN = () => atob(_tk.join("").replace("@", ""));

// ─── NVIDIA NIM ─────────────────────────────────────────────────────────────────
const NV_BASE  = "https://integrate.api.nvidia.com/v1";
const NV_MODEL = "nvidia/llama-3.1-nemotron-ultra-253b-v1";

// ─── CORS proxies fallback ───────────────────────────────────────────────────────
const PROXIES = [
  (u) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
  (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
];

const DISCORD_KEY      = "admin_discord_webhook";
const DISCORD_SITE_KEY = "admin_discord_site_url";
const NV_KEY_LS        = "admin_nv_key";

const empty = {
  id: "", title: "", category: "ncmine", version: "1.0.0",
  rating: "5", downloads: "0",
  date: new Date().toISOString().slice(0, 10),
  image: "", tagsRaw: "", short: "", description: "",
  downloadUrl: "", author: "", youtubeId: "",
};

// ─── Helpers ────────────────────────────────────────────────────────────────────
const slugify = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
   .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function draftToAddon(d) {
  const rating    = Number(d.rating);
  const downloads = Number(d.downloads);
  const errors    = {};
  if (!d.title)       errors.title       = "Obrigatório";
  if (!d.author)      errors.author      = "Obrigatório";
  if (!d.image)       errors.image       = "Obrigatório";
  if (!d.short)       errors.short       = "Obrigatório";
  if (!d.description) errors.description = "Obrigatório";
  if (!d.downloadUrl) errors.downloadUrl = "Obrigatório";
  if (!d.category)    errors.category    = "Obrigatório";
  if (isNaN(rating) || rating < 0 || rating > 5) errors.rating = "0 a 5";
  if (isNaN(downloads) || downloads < 0)          errors.downloads = "≥ 0";
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: {
      id: d.id || slugify(d.title), title: d.title, category: d.category,
      version: d.version, rating, downloads, date: d.date, image: d.image,
      tags: d.tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
      short: d.short, description: d.description,
      downloadUrl: d.downloadUrl, author: d.author,
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

async function ghPush(content, sha, msg = "chore: atualiza addons.json via painel") {
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
async function extractViaNvidia(url, apiKey) {
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
async function extractViaProxy(url) {
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
  const gm  = (...attrs) => {
    for (const a of attrs) {
      const v = doc.querySelector(`meta[property="${a}"]`)?.getAttribute("content")
             || doc.querySelector(`meta[name="${a}"]`)?.getAttribute("content") || "";
      if (v.trim()) return v.trim();
    }
    return "";
  };
  const title = gm("og:title","twitter:title") || doc.title.replace(/[-|–].+$/, "").trim();
  const image = gm("og:image","twitter:image");
  const short = gm("og:description","twitter:description","description").slice(0, 140);
  const author = doc.querySelector(".author-name,.creator a,.post-author a,[rel='author'],.author,.username")
                    ?.textContent?.trim() || gm("author");
  const kw = gm("keywords","og:keywords");
  const pageTags = Array.from(doc.querySelectorAll(".tag,.tag-label,.tags a"))
                       .map(el => el.textContent?.trim() ?? "").filter(Boolean);
  const tagsRaw = [...new Set([...kw.split(/[,;]+/).map(t=>t.trim()).filter(Boolean),...pageTags])].slice(0,8).join(", ");
  const description = doc.querySelector(".post-content,.entry-content,.content,.description,article .body")
                         ?.textContent?.trim() || short;
  const dlSels = ['a[href*="mediafire"]','a[href*="drive.google"]','a[href*=".mcaddon"]','a[href*=".mcpack"]','a[class*="download"]'];
  let downloadUrl = "";
  for (const sel of dlSels) {
    const href = doc.querySelector(sel)?.getAttribute("href") ?? "";
    if (href && !href.startsWith("#")) { try { downloadUrl = new URL(href, url).href; } catch { downloadUrl = href; } break; }
  }
  let youtubeId = "";
  for (const iframe of doc.querySelectorAll("iframe[src*='youtube']")) {
    const m = (iframe.getAttribute("src") ?? "").match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (m) { youtubeId = m[1]; break; }
  }
  const r = {};
  if (title)       r.title       = title;
  if (author)      r.author      = author;
  if (short)       r.short       = short;
  if (description) r.description = description;
  if (tagsRaw)     r.tagsRaw     = tagsRaw;
  if (image)       r.image       = image;
  if (downloadUrl) r.downloadUrl = downloadUrl;
  if (youtubeId)   r.youtubeId   = youtubeId;
  if (title)       r.id          = slugify(title);
  return r;
}

// ─── Discord ──────────────────────────────────────────────────────────────────────
async function publishToDiscord(webhookUrl, addon, siteUrl) {
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
          { name: "👤 Autor",     value: addon.author   || "—", inline: true },
          { name: "📁 Categoria", value: addon.category || "—", inline: true },
          { name: "🔖 Versão",    value: `v${addon.version}`,   inline: true },
          { name: "⭐ Nota",      value: `${Number(addon.rating).toFixed(1)}/5`, inline: true },
          { name: "📅 Data",      value: new Date(addon.date).toLocaleDateString("pt-BR"), inline: true },
          ...(addon.tags?.length ? [{ name: "🏷️ Tags", value: addon.tags.join(" · ") }] : []),
        ],
        footer: { text: "Mine Addons News" },
        timestamp: new Date().toISOString(),
      }],
      components: [{ type:1, components:[{ type:2, style:5, label:"Ver Add-on", emoji:{name:"🔗"}, url:addonUrl }] }],
    }),
  });
  if (!res.ok) throw new Error(`Discord: ${res.status}`);
}

// ─── Toast hook ───────────────────────────────────────────────────────────────────
function useToasts() {
  const [toasts, set] = useState([]);
  const n = useRef(0);
  const push = useCallback((type, text) => {
    const id = ++n.current;
    set(p => [...p, { id, type, text }]);
    setTimeout(() => set(p => p.filter(t => t.id !== id)), 4500);
  }, []);
  return { toasts, ok: t => push("ok",t), err: t => push("err",t), info: t => push("info",t) };
}

// ─── Design tokens ───────────────────────────────────────────────────────────────
const mono = "'IBM Plex Mono','Courier New',monospace";
const ink  = "#0a0a0a";
const btn  = (bg="#fff", fg=ink, full=false) => ({
  display:"inline-flex", alignItems:"center", justifyContent: full?"center":"flex-start", gap:7,
  height:42, padding:"0 18px",
  background:bg, color:fg, border:`2px solid ${ink}`,
  boxShadow:`3px 3px 0 ${ink}`,
  fontFamily:mono, fontWeight:700, fontSize:11,
  letterSpacing:"0.08em", textTransform:"uppercase",
  cursor:"pointer", whiteSpace:"nowrap",
  ...(full ? { width:"100%" } : {}),
});
const inp = (hasErr=false) => ({
  width:"100%", height:42, padding:"0 14px",
  border:`2px solid ${hasErr?"#e11d48":ink}`,
  background:"#f5f4f1", fontFamily:mono, fontSize:13,
  outline:"none", boxSizing:"border-box",
});
const card = (bg="#fff", shadow=ink) => ({
  background:bg, border:`2px solid ${ink}`,
  boxShadow:`4px 4px 0 ${shadow}`,
  padding:"1.25rem 1.5rem", marginBottom:"1.25rem",
});
const lbl = {
  display:"block", fontSize:10, fontWeight:700,
  letterSpacing:"0.12em", textTransform:"uppercase", color:"#444", marginBottom:3,
};
const tag = (bg="#fff") => ({
  display:"inline-flex", alignItems:"center", gap:4,
  padding:"2px 8px", background:bg, border:`1.5px solid ${ink}`,
  fontSize:9, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
});

// ─── Sub-components ───────────────────────────────────────────────────────────────

function Field({ label, value, onChange, type="text", hint, error, full, rows }) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : undefined }}>
      <label style={lbl}>{label}</label>
      {rows
        ? <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows}
            style={{ ...inp(!!error), height:"auto", padding:"10px 14px", resize:"vertical", width:"100%", fontFamily:mono }} />
        : <input type={type} value={value} onChange={e=>onChange(e.target.value)} style={inp(!!error)} />}
      {error && <p style={{ fontSize:11, color:"#e11d48", marginTop:3, fontFamily:mono }}>⚠ {error}</p>}
      {hint && !error && <p style={{ fontSize:10, color:"#888", marginTop:3 }}>{hint}</p>}
    </div>
  );
}

function UrlExtractor({ nvKey, onExtracted, onError }) {
  const [url, setUrl]     = useState("");
  const [mode, setMode]   = useState("nvidia");
  const [busy, setBusy]   = useState(false);
  const [step, setStep]   = useState("");

  const handle = async () => {
    const t = url.trim(); if (!t) return;
    setBusy(true);
    try {
      let data;
      if (mode === "nvidia") {
        if (!nvKey) throw new Error("Configure a NVIDIA API Key nas ⚙️ Configurações.");
        setStep("Conectando ao NVIDIA NIM (Llama 3.1 Nemotron)...");
        data = await extractViaNvidia(t, nvKey);
      } else {
        setStep("Buscando via proxy CORS gratuito...");
        data = await extractViaProxy(t);
      }
      onExtracted(data);
      setUrl(""); setStep("");
    } catch (e) {
      onError(e.message); setStep("");
    }
    setBusy(false);
  };

  return (
    <div style={{ background:"#f0fdf4", border:`2px solid ${ink}`, padding:"1rem 1.25rem", marginBottom:"1.25rem" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, flexWrap:"wrap" }}>
        <span style={{ fontFamily:mono, fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" }}>
          ✨ Preencher por URL
        </span>
        <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
          {[["nvidia","🟢 NVIDIA NIM"],["proxy","🌐 Proxy CORS"]].map(([m,label]) => (
            <button key={m} onClick={()=>setMode(m)} style={{
              ...btn(mode===m?ink:"#fff", mode===m?"#f97316":ink),
              height:28, padding:"0 10px", fontSize:9,
            }}>{label}</button>
          ))}
        </div>
      </div>

      {mode === "nvidia" && !nvKey && (
        <div style={{ background:"#fef3c7", border:`1.5px solid #d97706`, padding:"8px 12px", marginBottom:8 }}>
          <p style={{ fontSize:11, fontFamily:mono, color:"#92400e", margin:0 }}>
            ⚠ Configure a NVIDIA API Key em ⚙️ Configurações (grátis em{" "}
            <a href="https://build.nvidia.com" target="_blank" rel="noreferrer" style={{color:"#1d4ed8"}}>build.nvidia.com</a>
            ).
          </p>
        </div>
      )}
      {mode === "proxy" && (
        <p style={{ fontSize:11, fontFamily:mono, color:"#555", marginBottom:8 }}>
          Usa proxies públicos gratuitos — pode falhar em alguns sites. NVIDIA NIM é mais confiável.
        </p>
      )}

      <div style={{ display:"flex", gap:8 }}>
        <input value={url} onChange={e=>setUrl(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&!busy&&handle()}
          placeholder="Cole o link: MCPEDL, ModBay, Planet Minecraft..."
          style={{ ...inp(), flex:1 }} disabled={busy} />
        <button onClick={handle} disabled={busy||!url.trim()}
          style={{ ...btn("#7c3aed","#fff"), opacity:busy||!url.trim()?0.5:1 }}>
          {busy?"⏳ Extraindo...":"✨ Extrair"}
        </button>
      </div>
      {step && <p style={{ fontSize:11, color:"#6b21a8", marginTop:8, fontFamily:mono }}>⟳ {step}</p>}
    </div>
  );
}

function SettingsPanel({ nvKey, setNvKey, webhook, setWebhook, siteUrl, setSiteUrl, onTestDiscord }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={card("#fffbeb")}>
      <button onClick={()=>setOpen(p=>!p)}
        style={{ all:"unset", cursor:"pointer", display:"flex", alignItems:"center", gap:10, width:"100%", fontFamily:mono }}>
        <span>⚙️</span>
        <span style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>Configurações</span>
        <span style={{ marginLeft:"auto" }}>{open?"▲":"▼"}</span>
      </button>
      {open && (
        <div style={{ marginTop:16, borderTop:`1.5px dashed ${ink}`, paddingTop:16 }}>
          <label style={lbl}>🟢 NVIDIA NIM — API Key (gratuita)</label>
          <p style={{ fontSize:11, color:"#555", fontFamily:mono, marginBottom:6 }}>
            1. Acesse <a href="https://build.nvidia.com/nvidia/llama-3_1-nemotron-ultra-253b-v1" target="_blank" rel="noreferrer" style={{color:"#1d4ed8"}}>build.nvidia.com</a>
            {" "}→ 2. Crie conta grátis → 3. Clique "Get API Key" → 4. Cole abaixo
          </p>
          <div style={{ display:"flex", gap:8, marginBottom:20 }}>
            <input type="password" value={nvKey}
              onChange={e=>{ setNvKey(e.target.value); localStorage.setItem(NV_KEY_LS, e.target.value); }}
              placeholder="nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              style={{ ...inp(), flex:1 }} />
            {nvKey && <span style={tag("#d1fae5")}>✓ Salva</span>}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            <div>
              <label style={lbl}>🔔 Discord Webhook URL</label>
              <input type="url" value={webhook}
                onChange={e=>{ setWebhook(e.target.value); localStorage.setItem(DISCORD_KEY, e.target.value); }}
                placeholder="https://discord.com/api/webhooks/..."
                style={inp()} />
            </div>
            <div>
              <label style={lbl}>🌐 URL do Site</label>
              <input type="url" value={siteUrl}
                onChange={e=>{ setSiteUrl(e.target.value); localStorage.setItem(DISCORD_SITE_KEY, e.target.value); }}
                placeholder="https://mineaddonsnews.com"
                style={inp()} />
            </div>
          </div>
          {webhook && (
            <button onClick={onTestDiscord} style={btn("#5865F2","#fff")}>
              📨 Testar Webhook Discord
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function GithubPanel({ onLoad, onPush, loading, hasSha }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={card("#f0fdf4")}>
      <button onClick={()=>setOpen(p=>!p)}
        style={{ all:"unset", cursor:"pointer", display:"flex", alignItems:"center", gap:10, width:"100%", fontFamily:mono }}>
        <span>⚙️</span>
        <span style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>
          GitHub — Editar addons.json direto
        </span>
        <span style={{ ...tag("#bbf7d0"), marginLeft:"auto" }}>{GH_OWNER}/{GH_REPO}</span>
        <span style={{ marginLeft:8 }}>{open?"▲":"▼"}</span>
      </button>
      {open && (
        <div style={{ marginTop:16, borderTop:`1.5px dashed ${ink}`, paddingTop:16 }}>
          <p style={{ fontSize:12, color:"#555", fontFamily:mono, marginBottom:12 }}>
            Fluxo: <strong>1</strong> Carregue → <strong>2</strong> Edite → <strong>3</strong> Salve. Sem copiar JSON.
          </p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <button onClick={onLoad} disabled={loading} style={{ ...btn("#fff",ink), opacity:loading?0.5:1 }}>
              {loading?"⏳ Carregando...":"📥 Carregar do GitHub"}
            </button>
            <button onClick={onPush} disabled={loading||!hasSha}
              style={{ ...btn("#16a34a","#fff"), opacity:loading||!hasSha?0.4:1 }}
              title={!hasSha?"Carregue primeiro":""}>
              {loading?"⏳ Enviando...":"🚀 Salvar no GitHub"}
            </button>
          </div>
          {!hasSha && <p style={{ fontSize:11, color:"#888", fontFamily:mono, marginTop:8 }}>⚠ Carregue do GitHub antes de salvar.</p>}
        </div>
      )}
    </div>
  );
}

function AddonCard({ draft, index, validation, isDupe, onUpdate, onRemove, onPublish, publishing, webhook, nvKey }) {
  const errors = validation.ok ? {} : validation.errors;
  const u = (p) => onUpdate(index, p);
  const bc = isDupe ? "#e11d48" : (!validation.ok ? "#f97316" : ink);

  return (
    <div style={{ background:"#fff", border:`2px solid ${bc}`, boxShadow:`4px 4px 0 ${bc}`, padding:"1.25rem 1.5rem", marginBottom:"1.25rem" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1.25rem", flexWrap:"wrap" }}>
        <span style={{ fontSize:22, fontWeight:700, fontFamily:mono }}>#{index+1}</span>
        {validation.ok && !isDupe && <span style={tag("#d1fae5")}>✓ Válido</span>}
        {isDupe && <span style={tag("#fee2e2")}>✗ ID duplicado</span>}
        {!validation.ok && <span style={tag("#fee2e2")}>✗ {Object.keys(errors).length} erro(s)</span>}
        <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
          {validation.ok && !isDupe && webhook && (
            <button onClick={()=>onPublish(index)} disabled={publishing!==null}
              style={{ ...btn("#5865F2","#fff"), height:36, fontSize:10, opacity:publishing!==null?0.5:1 }}>
              {publishing===index?"⏳":"📨"} Discord
            </button>
          )}
          <button onClick={()=>onRemove(index)} style={{ ...btn("#fee2e2","#e11d48"), height:36, fontSize:10 }}>🗑</button>
        </div>
      </div>

      <UrlExtractor
        nvKey={nvKey}
        onExtracted={data => u({ ...data, id: data.title ? slugify(data.title) : draft.id })}
        onError={msg => alert(msg)}
      />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(210px, 1fr))", gap:"0.75rem 1rem" }}>
        <Field label="Título *" value={draft.title} onChange={v=>u({title:v, id:draft.id||slugify(v)})} error={errors.title} />
        <Field label="ID (slug)" value={draft.id} onChange={v=>u({id:v})} error={errors.id||(isDupe?"ID duplicado":undefined)} />
        <Field label="Categoria *" value={draft.category} onChange={v=>u({category:v})} error={errors.category}
          hint="ncmine · shaders · mobs · texturas · mapas · pvp · decoracao · utilitarios" />
        <Field label="Versão" value={draft.version} onChange={v=>u({version:v})} />
        <Field label="Autor *" value={draft.author} onChange={v=>u({author:v})} error={errors.author} />
        <Field label="Data" type="date" value={draft.date} onChange={v=>u({date:v})} />
        <Field label="Avaliação (0-5)" type="number" value={draft.rating} onChange={v=>u({rating:v})} error={errors.rating} />
        <Field label="Downloads" type="number" value={draft.downloads} onChange={v=>u({downloads:v})} />
        <Field label="URL da Imagem *" value={draft.image} onChange={v=>u({image:v})} error={errors.image} full />
        <Field label="URL de Download *" value={draft.downloadUrl} onChange={v=>u({downloadUrl:v})} error={errors.downloadUrl} full />
        <Field label="ID YouTube (opcional)" value={draft.youtubeId} onChange={v=>u({youtubeId:v})} hint="Ex: dQw4w9WgXcQ" full />
        <Field label="Tags (vírgula)" value={draft.tagsRaw} onChange={v=>u({tagsRaw:v})} full />
        <Field label="Resumo * (até 140 chars)" value={draft.short} onChange={v=>u({short:v})} error={errors.short} full />
        <Field label="Descrição completa *" value={draft.description} onChange={v=>u({description:v})} error={errors.description} full rows={4} />
      </div>

      {draft.image && (
        <div style={{ marginTop:"1rem" }}>
          <span style={lbl}>Preview</span>
          <img src={draft.image} alt="preview"
            style={{ marginTop:6, height:80, border:`2px solid ${ink}`, objectFit:"cover" }}
            onError={e=>(e.currentTarget.style.display="none")} />
        </div>
      )}
    </div>
  );
}

function Toasts({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div style={{ position:"fixed", bottom:24, right:16, zIndex:9999, display:"flex", flexDirection:"column", gap:8, maxWidth:340 }}>
      <style>{`@keyframes slideUp{from{transform:translateY(8px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
      {toasts.map(t=>(
        <div key={t.id} style={{
          display:"flex", alignItems:"center", gap:10, padding:"12px 16px",
          border:`2px solid ${ink}`, boxShadow:`3px 3px 0 ${ink}`,
          background: t.type==="ok"?"#d1fae5":t.type==="err"?"#fee2e2":"#fff",
          fontFamily:mono, fontSize:12, fontWeight:700,
          animation:"slideUp 0.2s ease",
        }}>
          {t.type==="ok"?"✓":t.type==="err"?"✗":"ℹ"} {t.text}
        </div>
      ))}
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────────
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pw,    setPw]    = useState("");
  const [err,   setErr]   = useState("");
  const [busy,  setBusy]  = useState(false);

  const submit = async () => {
    if (!email || !pw) { setErr("Preencha e-mail e senha."); return; }
    setBusy(true); setErr("");
    try {
      await signInWithEmailAndPassword(fbAuth, email, pw);
    } catch (e) {
      const m = {
        "auth/invalid-credential": "E-mail ou senha incorretos.",
        "auth/user-not-found":     "Usuário não encontrado.",
        "auth/wrong-password":     "Senha incorreta.",
        "auth/too-many-requests":  "Muitas tentativas. Aguarde um momento.",
        "auth/invalid-email":      "E-mail inválido.",
      };
      setErr(m[e.code] || "Erro de autenticação. Tente novamente.");
    }
    setBusy(false);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:ink }}>
      <div style={{ background:"#fff", border:`3px solid ${ink}`, boxShadow:`10px 10px 0 #f97316`, padding:"3rem 2.5rem", width:390, maxWidth:"90vw" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:"0.5rem" }}>
          <span style={{ fontSize:38 }}>🔒</span>
          <h1 style={{ fontFamily:mono, fontWeight:700, fontSize:26, letterSpacing:"-1px", textTransform:"uppercase", margin:0 }}>
            Painel Admin
          </h1>
        </div>
        <p style={{ color:"#888", fontSize:12, fontFamily:mono, marginBottom:"2rem" }}>
          Mine Addons News — Firebase Authentication
        </p>

        <label style={lbl}>E-mail</label>
        <input type="email" value={email}
          onChange={e=>{ setEmail(e.target.value); setErr(""); }}
          onKeyDown={e=>e.key==="Enter"&&submit()}
          placeholder="seu@email.com"
          style={{ ...inp(), marginBottom:12 }} />

        <label style={lbl}>Senha</label>
        <input type="password" value={pw}
          onChange={e=>{ setPw(e.target.value); setErr(""); }}
          onKeyDown={e=>e.key==="Enter"&&submit()}
          placeholder="••••••••••••••••"
          style={{ ...inp(!!err), marginBottom:4 }} />

        {err && <p style={{ fontSize:11, color:"#e11d48", fontFamily:mono, marginBottom:8 }}>⚠ {err}</p>}

        <button onClick={submit} disabled={busy}
          style={{ ...btn(ink,"#f97316",true), marginTop:16, opacity:busy?0.6:1 }}>
          {busy ? "Verificando..." : "Entrar →"}
        </button>

        <p style={{ fontSize:10, color:"#bbb", fontFamily:mono, marginTop:16, textAlign:"center" }}>
          Autenticado via Firebase · Somente usuários autorizados
        </p>
      </div>
    </div>
  );
}

// ─── Main Admin ────────────────────────────────────────────────────────────────────
export default function Admin() {
  const [user,        setUser]        = useState(undefined); // undefined = ainda carregando
  const [list,        setList]        = useState([{ ...empty }]);
  const [output,      setOutput]      = useState("");
  const [nvKey,       setNvKey]       = useState("");
  const [webhook,     setWebhook]     = useState("");
  const [siteUrl,     setSiteUrl]     = useState("");
  const [publishing,  setPublishing]  = useState(null);
  const [ghLoading,   setGhLoading]   = useState(false);
  const [ghSha,       setGhSha]       = useState(null);
  const { toasts, ok, err, info }     = useToasts();

  useEffect(() => {
    const unsub = onAuthStateChanged(fbAuth, (u) => setUser(u ?? null));
    return () => unsub();
  }, []);

  useEffect(() => {
    setNvKey(localStorage.getItem(NV_KEY_LS)          ?? "");
    setWebhook(localStorage.getItem(DISCORD_KEY)      ?? "");
    setSiteUrl(localStorage.getItem(DISCORD_SITE_KEY) ?? "");
  }, []);

  const validations = useMemo(() => list.map(draftToAddon), [list]);
  const dupes       = useMemo(() => {
    const seen = new Map();
    validations.forEach((v,i) => { if(v.ok){ const a=seen.get(v.data.id)??[]; a.push(i); seen.set(v.data.id,a); } });
    const c = new Set();
    seen.forEach(idxs => { if(idxs.length>1) idxs.forEach(i=>c.add(i)); });
    return c;
  }, [validations]);
  const allValid = validations.every(v=>v.ok) && dupes.size===0;
  const cleaned  = () => validations.filter(v=>v.ok).map(v=>v.data);

  const update = (i,p) => setList(prev => prev.map((a,idx) => idx===i ? {...a,...p} : a));
  const remove = (i)   => {
    if (list.length > 1) setList(p => p.filter((_,x) => x !== i));
    else info("Precisa ter pelo menos 1 addon.");
  };

  const ghLoad = async () => {
    setGhLoading(true);
    try {
      const { content, sha } = await ghGet();
      setGhSha(sha);
      if (Array.isArray(content) && content.length) {
        setList(content.map(a => ({
          id: a.id??"", title: a.title??"", category: a.category??"ncmine",
          version: a.version??"1.0.0", rating: String(a.rating??5),
          downloads: String(a.downloads??0), date: a.date??empty.date,
          image: a.image??"", tagsRaw: (a.tags??[]).join(", "),
          short: a.short??"", description: a.description??"",
          downloadUrl: a.downloadUrl??"", author: a.author??"",
          youtubeId: a.youtubeId??"",
        })));
        ok(`${content.length} addon(s) carregado(s) do GitHub!`);
      } else {
        info("Repositório vazio ou sem addons.");
      }
    } catch(e) { err(e.message); }
    setGhLoading(false);
  };

  const ghPushAll = async () => {
    if (!allValid) { err("Corrija os erros antes de enviar."); return; }
    if (!ghSha)    { err("Carregue do GitHub primeiro para obter o SHA."); return; }
    setGhLoading(true);
    try { await ghPush(cleaned(), ghSha); ok("✓ addons.json atualizado no GitHub!"); }
    catch(e) { err(e.message); }
    setGhLoading(false);
  };

  const publishOne = async (i) => {
    const v = validations[i]; if(!v.ok||!webhook) return;
    setPublishing(i);
    try { await publishToDiscord(webhook, v.data, siteUrl); ok(`"${v.data.title}" publicado!`); }
    catch(e) { err(e.message); }
    setPublishing(null);
  };

  const testDiscord = async () => {
    try {
      const r = await fetch(webhook, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ username:"Mine Addons News", content:"✅ Webhook funcionando!" }),
      });
      r.ok ? ok("Teste enviado com sucesso!") : err(`Discord: ${r.status}`);
    } catch { err("Falha ao conectar ao Discord."); }
  };

  // ── Estados de carregamento e auth ──
  if (user === undefined) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:ink }}>
        <p style={{ color:"#f97316", fontFamily:mono, fontSize:16 }}>⟳ Verificando autenticação...</p>
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  // ── Painel principal ──
  return (
    <div style={{ minHeight:"100vh", background:"#faf9f6", fontFamily:mono }}>
      <style>{`
        * { box-sizing:border-box; }
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap');
        input:focus, textarea:focus { background:#fff!important; outline:none; }
        button:active { transform:translate(2px,2px); box-shadow:1px 1px 0 #0a0a0a!important; }
        textarea { font-family:'IBM Plex Mono',monospace; font-size:13px; }
      `}</style>

      {/* Header */}
      <div style={{ background:ink, padding:"1rem 2rem", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
        <span style={{ fontSize:22 }}>🔧</span>
        <h1 style={{ color:"#f97316", fontFamily:mono, fontSize:24, fontWeight:700, letterSpacing:"-1px", margin:0 }}>
          PAINEL ADMIN
        </h1>
        <span style={{ ...tag("#fef08a"), marginLeft:"auto" }}>Mine Addons News</span>
        <span style={{ color:"#888", fontSize:11 }}>{user.email}</span>
        <button onClick={()=>signOut(fbAuth)} style={{ ...btn("#333","#fff"), height:36, fontSize:10 }}>
          Sair
        </button>
      </div>

      <div style={{ maxWidth:960, margin:"0 auto", padding:"2rem 1rem" }}>

        <SettingsPanel nvKey={nvKey} setNvKey={setNvKey}
          webhook={webhook} setWebhook={setWebhook}
          siteUrl={siteUrl} setSiteUrl={setSiteUrl}
          onTestDiscord={testDiscord} />

        <GithubPanel onLoad={ghLoad} onPush={ghPushAll} loading={ghLoading} hasSha={!!ghSha} />

        {/* Barra de status */}
        <div style={{ ...card(allValid?"#d1fae5":"#fee2e2"), display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:18 }}>{allValid?"✓":"✗"}</span>
          <span style={{ fontWeight:700, fontSize:14 }}>
            {allValid ? "Tudo válido — pronto para salvar/publicar!" : "Corrija os erros antes de gerar ou enviar"}
          </span>
          <span style={{ marginLeft:"auto", fontSize:12, color:"#555" }}>
            {list.length} addon{list.length!==1?"s":""}
          </span>
        </div>

        {/* Cards de addons */}
        {list.map((a,i) => (
          <AddonCard key={i} draft={a} index={i}
            validation={validations[i]} isDupe={dupes.has(i)}
            onUpdate={update} onRemove={remove}
            onPublish={publishOne} publishing={publishing}
            webhook={webhook} nvKey={nvKey} />
        ))}

        {/* Botões de ação */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginTop:8 }}>
          <button onClick={()=>setList(p=>[...p,{...empty}])} style={btn("#fff",ink)}>
            ＋ Adicionar addon
          </button>
          <button onClick={()=>allValid&&setOutput(JSON.stringify(cleaned(),null,2))}
            disabled={!allValid} style={{ ...btn("#f97316","#fff"), opacity:allValid?1:0.4 }}>
            👁 Ver JSON
          </button>
          <button onClick={ghPushAll} disabled={!allValid||ghLoading||!ghSha}
            style={{ ...btn("#16a34a","#fff"), opacity:allValid&&!ghLoading&&ghSha?1:0.4 }}>
            {ghLoading?"⏳ Enviando...":"🚀 Salvar no GitHub"}
          </button>
          {webhook && (
            <button onClick={async()=>{
              if(!allValid||publishing!==null) return;
              setPublishing(-1); let sent=0;
              for(const addon of cleaned()){
                try{ await publishToDiscord(webhook,addon,siteUrl); sent++; await new Promise(r=>setTimeout(r,1100)); }
                catch{ err(`Erro: ${addon.title}`); }
              }
              setPublishing(null); ok(`${sent}/${cleaned().length} publicado(s)!`);
            }} disabled={!allValid||publishing!==null}
              style={{ ...btn("#5865F2","#fff"), opacity:allValid&&publishing===null?1:0.4 }}>
              {publishing===-1?"⏳ Publicando...":"📢 Publicar tudo no Discord"}
            </button>
          )}
        </div>

        {/* JSON Preview */}
        {output && (
          <div style={{ ...card(), marginTop:"2rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12, flexWrap:"wrap" }}>
              <span style={{ fontWeight:700, fontSize:14 }}>👁 JSON GERADO</span>
              <button onClick={()=>{navigator.clipboard.writeText(output);ok("Copiado!");}}
                style={{ ...btn("#fff",ink), height:34, fontSize:10 }}>📋 Copiar</button>
              <button onClick={()=>{
                const blob=new Blob([output],{type:"application/json"});
                const u=URL.createObjectURL(blob);
                const a=document.createElement("a"); a.href=u; a.download="addons.json"; a.click();
                URL.revokeObjectURL(u);
              }} style={{ ...btn("#f97316","#fff"), height:34, fontSize:10 }}>⬇ Baixar</button>
            </div>
            <pre style={{ background:ink, color:"#a3e635", padding:"1.25rem", fontSize:12,
              overflowX:"auto", maxHeight:480, margin:0, fontFamily:mono }}>
              <code>{output}</code>
            </pre>
          </div>
        )}
      </div>

      <Toasts toasts={toasts} />
    </div>
  );
}
