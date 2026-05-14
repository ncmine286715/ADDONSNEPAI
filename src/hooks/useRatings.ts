import { useState, useEffect, useCallback } from "react";

const PREFIX = "man.ratings.v1";

export type Rating = {
  id: string;
  stars: number; // 1-5
  comment?: string;
  date: string;
};

function read(addonId: string): Rating[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${PREFIX}.${addonId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function write(addonId: string, items: Rating[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${PREFIX}.${addonId}`, JSON.stringify(items));
  window.dispatchEvent(new Event(`ratings:${addonId}:change`));
}

export function useRatings(addonId: string) {
  const [ratings, setRatings] = useState<Rating[]>(() => read(addonId));
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    const sync = () => setRatings(read(addonId));
    window.addEventListener(`ratings:${addonId}:change`, sync);
    return () => window.removeEventListener(`ratings:${addonId}:change`, sync);
  }, [addonId]);

  const average = ratings.length > 0
    ? ratings.reduce((s, r) => s + r.stars, 0) / ratings.length
    : 0;

  const add = useCallback((stars: number, comment?: string) => {
    if (stars < 1 || stars > 5) return;
    const next: Rating = {
      id: Math.random().toString(36).slice(2),
      stars,
      comment: comment?.trim().slice(0, 300),
      date: new Date().toISOString(),
    };
    const list = [...read(addonId), next];
    write(addonId, list);
    setRatings(read(addonId));
    setUserRating(stars);
  }, [addonId]);

  return { ratings, average, count: ratings.length, add, userRating };
}
