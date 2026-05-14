import { ADDONS, type Addon } from "./addons";

export function getTopDownloads(limit = 10): Addon[] {
  return [...ADDONS].sort((a, b) => b.downloads - a.downloads).slice(0, limit);
}

export function getRecentAddons(limit = 4): Addon[] {
  return [...ADDONS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit);
}

export function getTopRated(limit = 5): Addon[] {
  return [...ADDONS].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function getRandomAddon(): Addon {
  return ADDONS[Math.floor(Math.random() * ADDONS.length)];
}

export function getStats() {
  const totalDownloads = ADDONS.reduce((sum, a) => sum + a.downloads, 0);
  const avgRating = ADDONS.reduce((sum, a) => sum + a.rating, 0) / ADDONS.length;
  const categories = new Set(ADDONS.map(a => a.category));

  return { totalDownloads, avgRating, categoriesCount: categories.size, totalAddons: ADDONS.length };
}

export function getMostViewed(limit?: number): Addon[] {
  if (typeof window === "undefined") return limit ? [] : [...ADDONS];
  try {
    const raw = localStorage.getItem("man.views.v1");
    const views: Record<string, number> = raw ? JSON.parse(raw) : {};
    const sorted = [...ADDONS].sort((a, b) => (views[b.id] ?? 0) - (views[a.id] ?? 0));
    return limit ? sorted.slice(0, limit) : sorted;
  } catch { 
    return limit ? [] : [...ADDONS]; 
  }
}
