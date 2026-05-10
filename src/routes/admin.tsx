import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Copy, Download as DownloadIcon, Plus, Trash2, CheckCircle2, AlertCircle,
  Hash, Type, Tag as TagIcon, GitBranch, User, Calendar, Star, TrendingUp,
  Image as ImageIcon, Link as LinkIcon, FileText, Youtube, Wrench, Eye, FileSpreadsheet,
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
  const cols = ["id","title","category","version","rating","downloads","date","author","image","downloadUrl","youtubeId","tags","short","description"] as const;
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

function Admin() {
  const [list, setList] = useState<Draft[]>([{ ...empty }]);
  const [output, setOutput] = useState<string>("");
  const [csvOut, setCsvOut] = useState<string>("");

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

  const cleaned = (): Addon[] => validations.map((v) => (v as { ok: true; data: Addon }).data);

  const generate = () => {
    if (!allValid) return;
    setOutput(JSON.stringify(cleaned(), null, 2));
  };
  const generateCsv = () => {
    if (!allValid) return;
    setCsvOut(toCSV(cleaned()));
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
          <FileText className="size-4" /> Preencha, valide e cole o JSON em <code className="bg-secondary px-1.5 py-0.5 rounded border border-ink">src/data/addons.json</code>.
        </p>

        <div className={`brut px-4 py-3 mb-6 flex items-center gap-3 ${allValid ? "bg-lime" : "bg-paper"}`}>
          {allValid ? (
            <><CheckCircle2 className="size-5" /><span className="font-bold">Tudo válido</span></>
          ) : (
            <><AlertCircle className="size-5 text-destructive" /><span className="text-destructive font-bold">Corrija os erros antes de gerar</span></>
          )}
          <span className="ml-auto text-xs font-mono">{list.length} add-on{list.length > 1 ? "s" : ""}</span>
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
                  {list.length > 1 && (
                    <button onClick={() => setList((p) => p.filter((_, x) => x !== i))}
                            className="text-destructive hover:text-red-600 p-1.5"><Trash2 className="size-4" /></button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <Field icon={<Type />} label="Título" value={a.title} onChange={(v) => update(i, { title: v, id: a.id || slugify(v) })} error={errors.title} />
                  <Field icon={<Hash />} label="ID (slug)" value={a.id} onChange={(v) => update(i, { id: v })} error={errors.id || (isDupe ? "ID já usado em outro add-on" : undefined)} />
                  <Field icon={<TagIcon />} label="Categoria" value={a.category} onChange={(v) => update(i, { category: v })} error={errors.category} hint="ncmine, shaders, mobs, texturas, mapas..." />
                  <Field icon={<GitBranch />} label="Versão" value={a.version} onChange={(v) => update(i, { version: v })} error={errors.version} />
                  <Field icon={<User />} label="Autor" value={a.author} onChange={(v) => update(i, { author: v })} error={errors.author} />
                  <Field icon={<Calendar />} label="Data" type="date" value={a.date} onChange={(v) => update(i, { date: v })} error={errors.date} />
                  <Field icon={<Star />} label="Avaliação (0-5)" type="number" value={a.rating} onChange={(v) => update(i, { rating: v })} error={errors.rating} />
                  <Field icon={<TrendingUp />} label="Downloads" type="number" value={a.downloads} onChange={(v) => update(i, { downloads: v })} error={errors.downloads} />
                  <Field icon={<ImageIcon />} label="URL da imagem" value={a.image} onChange={(v) => update(i, { image: v })} error={errors.image} className="md:col-span-2" />
                  <Field icon={<LinkIcon />} label="URL de download" value={a.downloadUrl} onChange={(v) => update(i, { downloadUrl: v })} error={errors.downloadUrl} className="md:col-span-2" />
                  <Field icon={<Youtube />} label="ID do vídeo YouTube (opcional)" value={a.youtubeId} onChange={(v) => update(i, { youtubeId: v })} error={errors.youtubeId} hint="Ex: dQw4w9WgXcQ" className="md:col-span-2" />
                  <Field icon={<TagIcon />} label="Tags (vírgula)" value={a.tagsRaw} onChange={(v) => update(i, { tagsRaw: v })} error={errors.tags} className="md:col-span-2" />
                  <Field icon={<FileText />} label="Resumo (até 140)" value={a.short} onChange={(v) => update(i, { short: v })} error={errors.short} className="md:col-span-2" />
                  <TextArea icon={<FileText />} label="Descrição completa" value={a.description} onChange={(v) => update(i, { description: v })} error={errors.description} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => setList((p) => [...p, { ...empty }])}
                  className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-paper border-2 border-ink font-bold uppercase tracking-wider text-sm brut-press">
            <Plus className="size-4" /> Adicionar
          </button>
          <button
            onClick={generate}
            disabled={!allValid}
            className="inline-flex items-center gap-2 px-6 h-11 rounded-md bg-orange border-2 border-ink font-bold uppercase tracking-wider text-sm brut-press disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ boxShadow: "4px 4px 0 0 var(--ink)" }}
          >
            <Eye className="size-4" /> Gerar JSON
          </button>
          <button
            onClick={generateCsv}
            disabled={!allValid}
            className="inline-flex items-center gap-2 px-6 h-11 rounded-md bg-lime border-2 border-ink font-bold uppercase tracking-wider text-sm brut-press disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ boxShadow: "4px 4px 0 0 var(--ink)" }}
          >
            <FileSpreadsheet className="size-4" /> Gerar CSV
          </button>
        </div>

        {output && (
          <Preview
            title="JSON"
            content={output}
            onCopy={() => navigator.clipboard.writeText(output)}
            onDownload={() => downloadFile(output, "addons.json", "application/json")}
          />
        )}
        {csvOut && (
          <Preview
            title="CSV"
            content={csvOut}
            onCopy={() => navigator.clipboard.writeText(csvOut)}
            onDownload={() => downloadFile(csvOut, "addons.csv", "text/csv;charset=utf-8")}
          />
        )}
      </div>
    </>
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

type FieldProps = {
  icon: React.ReactNode;
  label: string; value: string;
  onChange: (v: string) => void;
  type?: string; className?: string; hint?: string; error?: string;
};

function Field({ icon, label, value, onChange, type = "text", className = "", hint, error }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono font-bold">
        <span className="size-3 [&>svg]:size-3">{icon}</span>
        {label}
      </span>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className={`mt-1 w-full h-10 px-3 rounded-md bg-input border-2 outline-none text-sm transition ${
          error ? "border-destructive" : "border-ink focus:bg-paper"
        }`}
      />
      {error
        ? <span className="text-[10px] text-destructive mt-1 flex items-center gap-1"><AlertCircle className="size-3" /> {error}</span>
        : hint && <span className="text-[10px] text-muted-foreground/80">{hint}</span>}
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
        value={value} onChange={(e) => onChange(e.target.value)} rows={4}
        className={`mt-1 w-full px-3 py-2 rounded-md bg-input border-2 outline-none text-sm ${
          error ? "border-destructive" : "border-ink focus:bg-paper"
        }`}
      />
      {error && <span className="text-[10px] text-destructive mt-1 flex items-center gap-1"><AlertCircle className="size-3" /> {error}</span>}
    </label>
  );
}
