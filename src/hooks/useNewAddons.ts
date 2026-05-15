import { useMemo } from "react";
import { ADDONS } from "@/lib/addons";

const STORAGE_KEY = "man.last-visit.v1";

export function useNewAddons() {
  const newAddons = useMemo(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const lastVisit = raw ? new Date(raw) : new Date(0);
    return ADDONS.filter((a) => new Date(a.date) > lastVisit).sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, []);

  const markVisited = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  };

  return { count: newAddons.length, newAddons, markVisited };
}