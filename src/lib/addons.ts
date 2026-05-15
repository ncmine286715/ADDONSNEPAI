import { z } from "zod";
import raw from "@/data/addons.json";

// Schema rigoroso (usado pelo admin para validar addons, mas não para filtrar)
export const AddonSchema = z.object({
  id: z.string().trim().min(1, "ID obrigatório").regex(/^[a-z0-9-]+$/, "Use apenas a-z, 0-9 e hífen"),
  title: z.string().trim().min(1, "Título obrigatório").max(80),
  category: z.string().trim().min(1, "Categoria obrigatória").max(40),
  version: z.string().trim().min(1).max(20),
  rating: z.number().min(0).max(5),
  downloads: z.number().int().nonnegative(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato: AAAA-MM-DD"),
  image: z.string().url("URL inválida"),
  tags: z.array(z.string().trim().min(1)).default([]),
  short: z.string().trim().min(1, "Resumo obrigatório").max(140),
  description: z.string().trim().min(1, "Descrição obrigatória"),
  downloadUrl: z.string().url("URL inválida"),
  author: z.string().trim().min(1).max(60),
  youtubeId: z.string().trim().optional(),
});

export type Addon = z.infer<typeof AddonSchema>;

// Função que "conserta" um addon malformatado aplicando defaults
function fixAddon(rawAddon: any): Addon {
  const today = new Date().toISOString().split('T')[0];
  return {
    id: rawAddon.id?.toString().toLowerCase().replace(/[^a-z0-9-]/g, '-') || `addon-${Date.now()}`,
    title: rawAddon.title?.substring(0, 80) || "Addon sem título",
    category: rawAddon.category?.substring(0, 40) || "Outros",
    version: rawAddon.version?.substring(0, 20) || "1.0",
    rating: typeof rawAddon.rating === 'number' ? Math.min(5, Math.max(0, rawAddon.rating)) : 0,
    downloads: typeof rawAddon.downloads === 'number' ? Math.max(0, rawAddon.downloads) : 0,
    date: /^\d{4}-\d{2}-\d{2}$/.test(rawAddon.date) ? rawAddon.date : today,
    image: rawAddon.image?.startsWith('http') ? rawAddon.image : "https://via.placeholder.com/400",
    tags: Array.isArray(rawAddon.tags) ? rawAddon.tags.filter(t => typeof t === 'string' && t.trim()).map(t => t.trim()) : [],
    short: rawAddon.short?.substring(0, 140) || "Sem descrição curta",
    description: rawAddon.description || "Sem descrição",
    downloadUrl: rawAddon.downloadUrl?.startsWith('http') ? rawAddon.downloadUrl : "#",
    author: rawAddon.author?.substring(0, 60) || "Anônimo",
    youtubeId: typeof rawAddon.youtubeId === 'string' && rawAddon.youtubeId.trim() !== "" ? rawAddon.youtubeId : undefined,
  };
}

// Converte cada item do JSON em um addon válido, SEM descartar nenhum
export const ADDONS: Addon[] = (raw as unknown[]).map((item) => {
  const parsed = AddonSchema.safeParse(item);
  if (parsed.success) return parsed.data;
  // Se falhou, aplica fallback e loga no console (útil para debug)
  console.warn("Addon malformatado, aplicando defaults:", item);
  return fixAddon(item);
});

export function getAddon(id: string): Addon | undefined {
  return ADDONS.find((a) => a.id === id);
}
