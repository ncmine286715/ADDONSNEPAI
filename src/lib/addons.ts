import { z } from "zod";
import raw from "@/data/addons.json";

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

export const AddonListSchema = z.array(AddonSchema);

export const ADDONS: Addon[] = (raw as unknown[]).flatMap((x) => {
  const parsed = AddonSchema.safeParse(x);
  return parsed.success ? [parsed.data] : [];
});

export function getAddon(id: string): Addon | undefined {
  return ADDONS.find((a) => a.id === id);
}
