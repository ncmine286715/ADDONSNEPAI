import { useEffect, useState, useCallback } from "react";

const KEY = "man.favorites.v1";
const VIEWS_KEY = "man.views.v1";

function haptic() {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(50);
  }
}

function readSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function writeSet(s: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(Array.from(s)));
  window.dispatchEvent(new Event("favorites:change"));
}

export function useFavorites() {
  const [ids, setIds] = useState<Set<string>>(() => readSet());

  useEffect(() => {
    const sync = () => setIds(readSet());
    window.addEventListener("favorites:change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("favorites:change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    haptic();
    const next = new Set(readSet());
    if (next.has(id)) next.delete(id); else next.add(id);
    writeSet(next);
  }, []);

  const isFav = useCallback((id: string) => ids.has(id), [ids]);

  return { ids, toggle, isFav };
}

/* ====== Click view counter (per addon, localStorage) ====== */
type ViewMap = Record<string, number>;

function readViews(): ViewMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(VIEWS_KEY);
    return raw ? (JSON.parse(raw) as ViewMap) : {};
  } catch { return {}; }
}

function writeViews(v: ViewMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(VIEWS_KEY, JSON.stringify(v));
  window.dispatchEvent(new Event("views:change"));
}

export function useViewCount(id: string) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const sync = () => setCount(readViews()[id] ?? 0);
    sync();
    window.addEventListener("views:change", sync);
    return () => window.removeEventListener("views:change", sync);
  }, [id]);
  const bump = useCallback(() => {
    const v = readViews();
    v[id] = (v[id] ?? 0) + 1;
    writeViews(v);
  }, [id]);
  return { count, bump };
}
