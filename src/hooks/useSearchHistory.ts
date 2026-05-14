import { useState, useCallback, useEffect } from "react";

const KEY = "man.search.history.v1";
const MAX = 5;

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function write(items: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
  window.dispatchEvent(new Event("search:history:change"));
}

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => read());

  useEffect(() => {
    const sync = () => setHistory(read());
    window.addEventListener("search:history:change", sync);
    return () => window.removeEventListener("search:history:change", sync);
  }, []);

  const add = useCallback((term: string) => {
    if (!term.trim()) return;
    const normalized = term.trim().toLowerCase();
    const next = [term.trim(), ...read().filter(h => h.toLowerCase() !== normalized)].slice(0, MAX);
    write(next);
  }, []);

  const remove = useCallback((term: string) => {
    const next = read().filter(h => h !== term);
    write(next);
  }, []);

  const clear = useCallback(() => write([]), []);

  return { history, add, remove, clear };
}
