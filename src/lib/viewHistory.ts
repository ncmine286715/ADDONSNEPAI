import { useCallback, useEffect, useState } from "react";
import type { Addon } from "./addons";

const HISTORY_KEY = "man.viewHistory.v1";
const MAX_HISTORY = 5;

interface ViewRecord {
  id: string;
  date: string;
}

function readHistory(): ViewRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeHistory(h: ViewRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, MAX_HISTORY)));
}

export function useViewHistory() {
  const [history, setHistory] = useState<ViewRecord[]>([]);

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  const addView = useCallback((addonId: string) => {
    const h = readHistory().filter((v) => v.id !== addonId);
    h.unshift({ id: addonId, date: new Date().toISOString() });
    writeHistory(h);
    setHistory(h.slice(0, MAX_HISTORY));
  }, []);

  const getRecentAddons = useCallback((addons: Addon[]): Addon[] => {
    const ids = readHistory().map((v) => v.id);
    return addons.filter((a) => ids.includes(a.id)).slice(0, MAX_HISTORY);
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }, []);

  return { history, addView, getRecentAddons, clearHistory };
}