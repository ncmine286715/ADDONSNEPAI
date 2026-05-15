import { useCallback, useEffect, useState } from "react";
import type { Addon } from "./addons";

const COMPARISON_KEY = "man.comparison.v1";
const MAX_COMPARE = 2;

function readComparison(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPARISON_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeComparison(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(COMPARISON_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("comparison:change"));
}

export function useComparison() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readComparison());
    const sync = () => setIds(readComparison());
    window.addEventListener("comparison:change", sync);
    return () => window.removeEventListener("comparison:change", sync);
  }, []);

  const addToComparison = useCallback((addonId: string) => {
    const current = readComparison();
    if (current.includes(addonId)) return;
    const next = [...current, addonId].slice(0, MAX_COMPARE);
    writeComparison(next);
    setIds(next);
  }, []);

  const removeFromComparison = useCallback((addonId: string) => {
    const next = readComparison().filter((id) => id !== addonId);
    writeComparison(next);
    setIds(next);
  }, []);

  const clearComparison = useCallback(() => {
    writeComparison([]);
    setIds([]);
  }, []);

  const isInComparison = useCallback((addonId: string) => {
    return ids.includes(addonId);
  }, [ids]);

  const getComparisonAddons = useCallback((addons: Addon[]): Addon[] => {
    return addons.filter((a) => ids.includes(a.id));
  }, [ids]);

  return {
    ids,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    getComparisonAddons,
  };
}