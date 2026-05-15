// src/lib/addons.ts
import { z } from "zod";
// Tenta importar o JSON gerado (estrito) ou o JSON5 diretamente (se configurado)
import raw from "@/data/addons.json";

// Schema permissivo com defaults
const LooseAddonSchema = z.object({
  id: z.string().trim().min(1).or(z.string().default("missing-id")),
  title: z.string().trim().min(1).or(z.string().default("Addon sem título")),
  category: z.string().trim().min(1).or(z.string().default("Outros")),
  version: z.string().trim().min(1).or(z.string().default("1.0")),
  rating: z.number().min(0).max(5).or(z.number().default(0)),
  downloads: z.number().int().nonnegative().or(z.number().default(0)),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.string().default(() => new Date().toISOString().split('T')[0])),
  image: z.string().url().or(z.string().default("https://via.placeholder.com/400")),
  tags: z.array(z.string().trim().min(1)).or(z.array(z.string()).default([])),
  short: z.string().trim().min(1).or(z.string().default("")),
  description: z.string().trim().min(1).or(z.string().default("")),
  downloadUrl: z.string().url().or(z.string().default("#")),
  author: z.string().trim().min(1).or(z.string().default("Anônimo")),
  youtubeId: z.string().trim().optional(),
}).passthrough(); // aceita campos extras

export type Addon = z.infer<typeof LooseAddonSchema>;

// Função para limpar e normalizar um addon problemático
function normalizeAddon(item: unknown): Addon {
  const result = LooseAddonSchema.safeParse(item);
  if (result.success) return result.data;

  // Fallback manual: cria um objeto com defaults + campos originais
  const rawItem = item as Record<string, unknown>;
  console.warn("Addon malformado, aplicando correções automáticas:", rawItem);
  return {
    id: typeof rawItem.id === "string" ? rawItem.id.replace(/[^a-z0-9-]/gi, '-').toLowerCase() : "unknown",
    title: String(rawItem.title ?? "Sem título").slice(0, 80),
    category: String(rawItem.category ?? "Outros").slice(0, 40),
    version: String(rawItem.version ?? "1.0").slice(0, 20),
    rating: typeof rawItem.rating === "number" ? Math.min(5, Math.max(0, rawItem.rating)) : 0,
    downloads: typeof rawItem.downloads === "number" ? Math.max(0, rawItem.downloads) : 0,
    date: typeof rawItem.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawItem.date) ? rawItem.date : new Date().toISOString().split('T')[0],
    image: typeof rawItem.image === "string" ? rawItem.image : "https://via.placeholder.com/400",
    tags: Array.isArray(rawItem.tags) ? rawItem.tags.map(t => String(t).trim()).filter(t => t.length > 0) : [],
    short: String(rawItem.short ?? "").slice(0, 140),
    description: String(rawItem.description ?? ""),
    downloadUrl: typeof rawItem.downloadUrl === "string" ? rawItem.downloadUrl : "#",
    author: String(rawItem.author ?? "Anônimo").slice(0, 60),
    youtubeId: typeof rawItem.youtubeId === "string" ? rawItem.youtubeId : undefined,
  };
}

// Converte o array bruto, nunca descartando nenhum item
export const ADDONS: Addon[] = (raw as unknown[]).map(normalizeAddon);

export function getAddon(id: string): Addon | undefined {
  return ADDONS.find((a) => a.id === id);
}
