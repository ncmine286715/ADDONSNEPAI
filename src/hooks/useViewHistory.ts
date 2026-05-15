import { useState, useEffect, useCallback } from "react";
import type { Addon } from "@/lib/addons";

const STORAGE_KEY = "man.view-history.v2";
const MAX = 8;

export function useViewHistory() {
  const [history, setHistory] = useState<<Addon[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setHistory(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  const addView = useCallback((addon: Addon) => {
    setHistory((prev) => {
      const next = [addon, ...prev.filter((a) => a.id !== addon.id)].slice(0, MAX);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addView, clearHistory };
}