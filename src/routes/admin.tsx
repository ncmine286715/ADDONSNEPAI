// src/routes/admin.tsx
import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Copy, Download as DownloadIcon, Plus, Trash2, CheckCircle2, AlertCircle,
  Hash, Type, Tag as TagIcon, GitBranch, User, Calendar, Star, TrendingUp,
  Image as ImageIcon, Link as LinkIcon, FileText, Youtube, Wrench, Eye,
  FileSpreadsheet, Send, Bot, Settings, Sparkles, Loader2, Link2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { AddonSchema, type Addon } from "@/lib/addons";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel — Mine Addons News" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

// ── Constantes e tipos ─────────────────────────────────────────────
type Draft = {
  id: string; title: string; category: string; version: string;
  rating: string; downloads: string; date: string;
  image: string; tagsRaw: string; short: string; description: string;
  downloadUrl: string; author: string; youtubeId: string;
};

const empty: Draft = {
  id: "", title: "", category: "ncmine", version: "1.0.0",
  rating: "5", downloads: "0",
  date: new Date().toISOString().slice(0, 10),
  image: "", tagsRaw: "", short: "", description: "",
  downloadUrl: "", author: "", youtubeId: "",
};

// Pegar variáveis de ambiente (Cloudflare Workers expõe no globalThis)
const NVIDIA_API_KEY = (globalThis as any).NVIDIA_API_KEY || "";
const DISCORD_WEBHOOK = (globalThis as any).DISCORD_WEBHOOK || "";

const NVIDIA_MODELS = [
  "google/gemma-4-31b-it",
  "meta/llama-3.1-70b-instruct",
  "meta/llama-3.1-405b-instruct",
  "nvidia/llama-3.1-nemotron-70b-instruct",
  "mistralai/mistral-7b-instruct-v0.2",
  "mistralai/mixtral-8x7b-instruct-v0.1",
  "google/gemma-2-9b-it",
  "google/gemma-2-27b-it",
  "deepseek-ai/deepseek-r1-distill-llama-70b",
  "nvidia/usdcode-llama3-70b-instruct"
];

type Settings = {
  model: string;
  webhookUrl: string;  // ainda mantida para configuração local (mas o envio vai pelo endpoint)
};

// ── Helpers ────────────────────────────────────────────────────────
function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function draftToAddon(d: Draft): { ok: true; data: Addon } | { ok: false; errors: Record<string, string> } {
  const candidate = {
    id: d.id || slugify(d.title),
    title: d.title,
    category: d.category,
    version: d.version,
    rating: Number(d.rating),
    downloads: Number(d.downloads),
    date: d.date,
    image: d.image,
    tags: d.tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
    short: d.short,
    description: d.description,
    downloadUrl: d.downloadUrl,
    author: d.author,
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
  const cols = ["id", "title", "category", "version", "rating", "downloads", "date", "author", "image", "downloadUrl", "youtubeId", "tags", "short", "description"] as const;
  const head = cols.join(",");
  const rows = items.map((a) =>
    cols.map((c) => csvEscape((a as unknown as Record<string, unknown>)[c])).join(",")
  );
  return [head, ...rows].join("\n");
}

function downloadFile(content: string, name: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

// ── Componente Principal ───────────────────────────────────────────
function Admin() {
  const [activeTab, setActiveTab] = useState<"editor" | "ai" | "settings" | "preview">("editor");
  const [list, setList] = useState<Draft[]>([{ ...empty }]);
  const [output, setOutput] = useState<string>("");
  const [csvOut, setCsvOut] = useState<string>("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Extração
  const [extractUrl, setExtractUrl] = useState("");
  const [extracting, setExtracting] = useState(false);

  const [settings, setSettings] = useState<Settings>({
    model: localStorage.getItem("nvidia_model") || NVIDIA_MODELS[0],
    webhookUrl: localStorage.getItem("discord_webhook") || ""
  });

  // AI State
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("nvidia_model", settings.model);
    localStorage.setItem("discord_webhook", settings.webhookUrl);
  }, [settings]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const validations = useMemo(() => list.map(draftToAddon), [list]);
  const dupes = useMemo(() => {
    const seen = new Map<string, number[]>();
    validations.forEach((v, i) => {
      if (v.ok) {
        const arr = seen.get(v.data.id) ?? [];
        arr.push(i); seen.set(v.data.id, arr);
      }
    });
    const conflicts = new Set<number>();
    seen.forEach((idxs) => { if (idxs.length > 1) idxs.forEach((i) => conflicts.add(i)); });
    return conflicts;
  }, [validations]);

  const allValid = validations.every((v) => v.ok) && dupes.size === 0;

  const update = (i: number, patch: Partial<Draft>) => {
    setList((prev) => prev.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));
  };

  const cleaned = (): Addon[] => validations.filter(v => v.ok).map(v => v.data);

  const generate = () => {
    if (!allValid) return setNotification({ type: "error", msg: "Corrija os erros antes de gerar." });
    setOutput(JSON.stringify(cleaned(), null, 2));
    setNotification({ type: "success", msg: "JSON gerado com sucesso!" });
  };

  const generateCsv = () => {
    if (!allValid) return setNotification({ type: "error", msg: "Corrija os erros antes de gerar." });
    setCsvOut(toCSV(cleaned()));
    setNotification({ type: "success", msg: "CSV gerado com sucesso!" });
  };

  // ── Extração automática ────────────────────────────────────────
  const handleExtract = async () => {
    if (!extractUrl.trim()) return;
    setExtracting(true);
    try {
      const res = await fetch("/api/extract-addon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: extractUrl }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro desconhecido");
      }
      const data = await res.json();
      // Preencher o primeiro draft da lista (ou criar um novo)
      setList(prev => {
        const updated = [...prev];
        if (updated.length === 0) {
          updated.push({ ...empty });
        }
        const current = { ...updated[0] };
        current.title = data.title || current.title;
        current.short = data.short || current.short;
        current.description = data.description || current.description;
        current.image = data.image || current.image;
        current.author = data.author || current.author;
        current.category = data.category || current.category;
        current.tagsRaw = Array.isArray(data.tags) ? data.tags.join(", ") : (data.tagsRaw || "");
        current.downloads = data.downloads || current.downloads;
        current.version = data.version || current.version;
        current.id = slugify(current.title);
        // Se tiver youtubeId, preencher (caso o scraper forneça)
        if (data.youtubeId) current.youtubeId = data.youtubeId;
        updated[0] = current;
        return updated;
      });
      setNotification({ type: "success", msg: "Dados extraídos com sucesso!" });
    } catch (err: any) {
      setNotification({ type: "error", msg: err.message });
    } finally {
      setExtracting(false);
    }
  };

  // ── Envio ao Discord via endpoint seguro ────────────────────────
  const sendToDiscord = async (idx: number) => {
    const v = validations[idx];
    if (!v.ok) {
      setNotification({ type: "error", msg: "Dados inválidos." });
      return;
    }
    try {
      const response = await fetch("/api/notify-discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v.data),
      });
      if (response.ok) {
        setNotification({ type: "success", msg: "✅ Enviado para o Discord!" });
      } else {
        const text = await response.text();
        setNotification({ type: "error", msg: `❌ ${text}` });
      }
    } catch (err) {
      setNotification({ type: "error", msg: "❌ Erro de rede ao comunicar com o servidor." });
    }
  };

  // ── IA Assistant ──────────────────────────────────────────────────
  const askAI = async () => {
    if (!aiPrompt.trim()) {
      setNotification({ type: "error", msg: "Digite uma descrição para o addon." });
      return;
    }
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${NVIDIA_API_KEY}`
        },
        body: JSON.stringify({
          model: settings.model,
          messages: [
            {
              role: "system",
              content: "Você é um especialista em Minecraft Addons. Retorne apenas um JSON válido (sem markdown, sem explicações) com estas chaves exatas: id, title, category, version, rating, downloads, date, image, tags, short, description, downloadUrl, author, youtubeId (opcional)."
            },
            { role: "user", content: aiPrompt }
          ],
          max_tokens: 1024,
          temperature: 0.7,
          top_p: 0.95,
          stream: false
        })
      });
      if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
      const data = await response.json();
      let content = data.choices?.[0]?.message?.content || "";
      content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(content);
      const newDraft: Draft = {
        ...empty,
        id: parsed.id || slugify(parsed.title || "novo-addon"),
        title: parsed.title || "Novo Addon",
        category: parsed.category || "ncmine",
        version: parsed.version || "1.0.0",
        rating: String(parsed.rating ?? 5),
        downloads: String(parsed.downloads ?? 0),
        date: parsed.date || new Date().toISOString().slice(0, 10),
        image: parsed.image || "",
        tagsRaw: Array.isArray(parsed.tags) ? parsed.tags.join(", ") : "",
        short: parsed.short || "",
        description: parsed.description || "",
        downloadUrl: parsed.downloadUrl || "",
        author: parsed.author || "",
        youtubeId: parsed.youtubeId || ""
      };
      setList(prev => [...prev, newDraft]);
      setActiveTab("editor");
      setNotification({ type: "success", msg: "✅ Addon gerado pela IA!" });
      setAiPrompt("");
    } catch (err: any) {
      console.error("Erro IA:", err);
      const msg = err.message || "Erro ao conectar com IA";
      setAiError(msg);
      setNotification({ type: "error", msg: `❌ ${msg}` });
    } finally {
      setAiLoading(false);
    }
  };

  // ── UI ───────────────────────────────────────────────────────────
  const tabs = [
    { id: "editor" as const, label: "Editor", icon: <Wrench className="size-4" /> },
    ...(NVIDIA_API_KEY ? [{ id: "ai" as const, label: "IA Assistente", icon: <Bot className="size-4" /> }] : []),
    { id: "settings" as const, label: "Config", icon: <Settings className="size-4" /> },
    { id: "preview" as const, label: "Preview", icon: <Eye className="size-4" /> },
  ];

  return (
    <>
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Notification Toast */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md border-2 font-bold text-sm brut-shadow ${
            notification.type === "success" ? "bg-lime border-ink" : "bg-destructive text-paper border-destructive"
          }`}>
            {notification.type === "success" ? <CheckCircle2 className="size-4 inline mr-2" /> : <AlertCircle className="size-4 inline mr-2" />}
            {notification.msg}
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <span className="size-12 grid place-items-center bg-orange border-2 border-ink rounded-md" style={{ boxShadow: "4px 4px 0 0 var(--ink)" }}>
            <Wrench className="size-6" />
          </span>
          <h1 className="font-display text-4xl md:text-5xl tracking-tighter">PAINEL ADMIN</h1>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 h-10 rounded-md border-2 font-bold uppercase text-xs tracking-wider transition brut-press ${
                activeTab === t.id ? "bg-paper border-ink" : "bg-input border-ink/50 hover:border-ink"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* TAB: EDITOR */}
        {activeTab === "editor" && (
          <>
            {/* Extractor */}
            <div className="brut p-4 mb-6 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2">
                <Link2 className="size-4 text-muted-foreground" />
                <input
                  type="text"
                  value={extractUrl}
                  onChange={(e) => setExtractUrl(e.target.value)}
                  placeholder="Cole a URL do addon (ex: mcpedl.com/...) para extrair automaticamente"
                  className="w-full h-10 px-3 rounded-md bg-input border-2 border-ink text-sm"
                />
              </div>
              <button
                onClick={handleExtract}
                disabled={extracting || !extractUrl.trim()}
                className="inline-flex items-center gap-2 px-5 h-10 rounded-md bg-lime border-2 border-ink font-bold uppercase text-sm brut-press disabled:opacity-50"
              >
                {extracting ? <Loader2 className="size-4 animate-spin" /> : <DownloadIcon className="size-4" />}
                {extracting ? "Extraindo..." : "Extrair dados"}
              </button>
            </div>

            <div className={`brut px-4 py-3 mb-6 flex items-center gap-3 ${allValid ? "bg-lime" : "bg-paper"}`}>
              {allValid ? (
                <><CheckCircle2 className="size-5" /> <span className="font-bold">Tudo válido</span></>
              ) : (
                <><AlertCircle className="size-5 text-destructive" /> <span className="text-destructive font-bold">Corrija os erros antes de gerar</span></>
              )}
              <span className="ml-auto text-xs font-mono">{list.length} add-on{list.length > 1 ? "s" : ""}</span>
            </div>

            <div className="space-y-5">
              {list.map((a, i) => {
                const v = validations[i];
                const errors = v.ok ? {} : v.errors;
                const isDupe = dupes.has(i);
                return (
                  <div key={i} className={`brut p-5 space-y-4 ${isDupe ? "bg-destructive/10 border-destructive" : ""}`}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-display text-2xl">#{i + 1}</span>
                        {v.ok && !isDupe && <span className="brut-tag brut-tag-lime"><CheckCircle2 className="size-3" /> Válido</span>}
                        {isDupe && <span className="brut-tag bg-destructive text-paper border-destructive"><AlertCircle className="size-3" /> ID duplicado</span>}
                        {!v.ok && <span className="brut-tag bg-destructive text-paper border-destructive"><AlertCircle className="size-3" /> {Object.keys(errors).length} erro(s)</span>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => sendToDiscord(i)} disabled={!v.ok} className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md border-2 border-ink bg-indigo-600 text-paper text-xs font-bold uppercase brut-press disabled:opacity-40">
                          <Send className="size-3.5" /> Discord
                        </button>
                        {list.length > 1 && (
                          <button onClick={() => setList(p => p.filter((_, x) => x !== i))} className="text-destructive hover:text-red-600 p-2 border-2 border-transparent hover:border-destructive rounded">
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <Field icon={<Type />} label="Título" value={a.title} onChange={(v) => update(i, { title: v, id: a.id || slugify(v) })} error={errors.title} />
                      <Field icon={<Hash />} label="ID (slug)" value={a.id} onChange={(v) => update(i, { id: v })} error={errors.id || (isDupe ? "ID já usado" : undefined)} />
                      <Field icon={<TagIcon />} label="Categoria" value={a.category} onChange={(v) => update(i, { category: v })} error={errors.category} hint="ncmine, shaders, mobs..." />
                      <Field icon={<GitBranch />} label="Versão" value={a.version} onChange={(v) => update(i, { version: v })} error={errors.version} />
                      <Field icon={<User />} label="Autor" value={a.author} onChange={(v) => update(i, { author: v })} error={errors.author} />
                      <Field icon={<Calendar />} label="Data" type="date" value={a.date} onChange={(v) => update(i, { date: v })} error={errors.date} />
                      <Field icon={<Star />} label="Avaliação (0-5)" type="number" value={a.rating} onChange={(v) => update(i, { rating: v })} error={errors.rating} />
                      <Field icon={<TrendingUp />} label="Downloads" type="number" value={a.downloads} onChange={(v) => update(i, { downloads: v })} error={errors.downloads} />
                      <Field icon={<ImageIcon />} label="URL da imagem" value={a.image} onChange={(v) => update(i, { image: v })} error={errors.image} className="md:col-span-2" />
                      <Field icon={<LinkIcon />} label="URL de download" value={a.downloadUrl} onChange={(v) => update(i, { downloadUrl: v })} error={errors.downloadUrl} className="md:col-span-2" />
                      <Field icon={<Youtube />} label="ID do vídeo YouTube" value={a.youtubeId} onChange={(v) => update(i, { youtubeId: v })} error={errors.youtubeId} hint="Ex: dQw4w9WgXcQ" className="md:col-span-2" />
                      <Field icon={<TagIcon />} label="Tags (vírgula)" value={a.tagsRaw} onChange={(v) => update(i, { tagsRaw: v })} error={errors.tags} className="md:col-span-2" />
                      <Field icon={<FileText />} label="Resumo (até 140)" value={a.short} onChange={(v) => update(i, { short: v })} error={errors.short} className="md:col-span-2" />
                      <TextArea icon={<FileText />} label="Descrição completa" value={a.description} onChange={(v) => update(i, { description: v })} error={errors.description} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => setList(p => [...p, { ...empty }])} className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-paper border-2 border-ink font-bold uppercase tracking-wider text-sm brut-press">
                <Plus className="size-4" /> Adicionar
              </button>
              <button onClick={generate} disabled={!allValid} className="inline-flex items-center gap-2 px-6 h-11 rounded-md bg-orange border-2 border-ink font-bold uppercase tracking-wider text-sm brut-press disabled:opacity-40 disabled:cursor-not-allowed" style={{ boxShadow: "4px 4px 0 0 var(--ink)" }}>
                <Eye className="size-4" /> Gerar JSON
              </button>
              <button onClick={generateCsv} disabled={!allValid} className="inline-flex items-center gap-2 px-6 h-11 rounded-md bg-lime border-2 border-ink font-bold uppercase tracking-wider text-sm brut-press disabled:opacity-40 disabled:cursor-not-allowed" style={{ boxShadow: "4px 4px 0 0 var(--ink)" }}>
                <FileSpreadsheet className="size-4" /> Gerar CSV
              </button>
            </div>
          </>
        )}

        {/* TAB: AI ASSISTANT (apenas se NVIDIA_API_KEY definida) */}
        {activeTab === "ai" && NVIDIA_API_KEY && (
          <div className="brut p-6 space-y-4 bg-paper">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="size-6 text-orange" />
              <h2 className="font-display text-2xl">Assistente IA (NVIDIA)</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-4">Descreva o addon e a IA preencherá todos os campos automaticamente.</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-mono font-bold">Modelo</label>
                <select value={settings.model} onChange={(e) => setSettings(s => ({ ...s, model: e.target.value }))} className="w-full h-10 px-3 rounded-md bg-input border-2 border-ink text-sm">
                  {NVIDIA_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-mono font-bold">Descreva o Addon</label>
                <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Ex: Um addon de espadas mágicas..." rows={4} className="w-full px-3 py-2 rounded-md bg-input border-2 border-ink text-sm resize-none" />
              </div>
            </div>
            <button onClick={askAI} disabled={aiLoading} className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-purple-600 border-2 border-ink text-paper font-bold uppercase text-sm brut-press disabled:opacity-40 hover:bg-purple-700">
              {aiLoading ? <Loader2 className="size-4 animate-spin" /> : <Bot className="size-4" />}
              {aiLoading ? "Gerando..." : "Gerar com IA"}
            </button>
            {aiError && <div className="p-3 rounded bg-destructive/10 border border-destructive"><p className="text-destructive text-sm">{aiError}</p></div>}
          </div>
        )}

        {/* TAB: SETTINGS */}
        {activeTab === "settings" && (
          <div className="brut p-6 space-y-4 bg-paper">
            <h2 className="font-display text-2xl flex items-center gap-2"><Settings className="size-5" /> Configurações</h2>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-mono font-bold">Discord Webhook (não usado para envio direto, somente referência)</label>
                <input type="text" value={settings.webhookUrl} onChange={(e) => setSettings(s => ({ ...s, webhookUrl: e.target.value }))} placeholder="URL do webhook (opcional aqui, o envio usa endpoint seguro)" className="w-full h-10 px-3 rounded-md bg-input border-2 border-ink text-sm" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">💡 As configurações são salvas automaticamente no navegador. O envio ao Discord agora é feito por endpoint seguro e não expõe o webhook no client.</p>
          </div>
        )}

        {/* TAB: PREVIEW */}
        {activeTab === "preview" && (
          <>
            {output && <Preview title="JSON" content={output} onCopy={() => navigator.clipboard.writeText(output)} onDownload={() => downloadFile(output, "addons.json", "application/json")} />}
            {csvOut && <Preview title="CSV" content={csvOut} onCopy={() => navigator.clipboard.writeText(csvOut)} onDownload={() => downloadFile(csvOut, "addons.csv", "text/csv;charset=utf-8")} />}
            {!output && !csvOut && (
              <div className="brut p-8 text-center">
                <Eye className="size-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Gere o JSON ou CSV primeiro na aba Editor</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

// ── Subcomponentes (inalterados) ──────────────────────────────────
function Preview({ title, content, onCopy, onDownload }: { title: string; content: string; onCopy: () => void; onDownload: () => void }) {
  return (
    <div className="mt-8 brut p-5">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="font-display text-2xl flex items-center gap-2"><Eye className="size-5" /> PREVIEW {title}</div>
        <div className="flex gap-2">
          <button onClick={onCopy} className="inline-flex items-center gap-2 px-3 h-9 rounded-md border-2 border-ink bg-paper text-xs font-bold uppercase brut-press"><Copy className="size-3.5" /> Copiar</button>
          <button onClick={onDownload} className="inline-flex items-center gap-2 px-3 h-9 rounded-md border-2 border-ink bg-orange text-paper text-xs font-bold uppercase brut-press"><DownloadIcon className="size-3.5" /> Baixar</button>
        </div>
      </div>
      <pre className="text-xs font-mono bg-ink text-paper rounded-md p-4 overflow-auto max-h-[500px] border-2 border-ink"><code>{content}</code></pre>
    </div>
  );
}

type FieldProps = { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; type?: string; className?: string; hint?: string; error?: string; };
function Field({ icon, label, value, onChange, type = "text", className = "", hint, error }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono font-bold"><span className="size-3 [&>svg]:size-3">{icon}</span> {label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={`mt-1 w-full h-10 px-3 rounded-md bg-input border-2 outline-none text-sm transition ${error ? "border-destructive bg-destructive/5" : "border-ink focus:bg-paper"}`} />
      {error ? <span className="text-[10px] text-destructive mt-1 flex items-center gap-1"><AlertCircle className="size-3" /> {error}</span> : hint && <span className="text-[10px] text-muted-foreground/80">{hint}</span>}
    </label>
  );
}

function TextArea({ icon, label, value, onChange, error }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <label className="block md:col-span-2">
      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono font-bold"><span className="size-3 [&>svg]:size-3">{icon}</span> {label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className={`mt-1 w-full px-3 py-2 rounded-md bg-input border-2 outline-none text-sm ${error ? "border-destructive bg-destructive/5" : "border-ink focus:bg-paper"}`} />
      {error && <span className="text-[10px] text-destructive mt-1 flex items-center gap-1"><AlertCircle className="size-3" /> {error}</span>}
    </label>
  );
}
