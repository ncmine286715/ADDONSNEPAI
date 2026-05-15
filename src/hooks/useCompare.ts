import { useState, useEffect, useCallback } from "react";
import type { Addon } from "@/lib/addons";

const STORAGE_KEY = "man.compare.v1";

export function useCompare() {
  const [selected, setSelected] = useState<<Addon[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setSelected(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  const toggle = useCallback((addon: Addon) => {
    setSelected((prev) => {
      const exists = prev.find((a) => a.id === addon.id);
      let next: Addon[];
      if (exists) next = prev.filter((a) => a.id !== addon.id);
      else if (prev.length < 2) next = [...prev, addon];
      else return prev;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSelected([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { selected, toggle, clear, isOpen, setIsOpen };
}