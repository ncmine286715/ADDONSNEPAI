import { useState, useEffect, useCallback } from "react";

const KEY = "man.likes.v1";
const WEEK_KEY = "man.likes.week.v1";

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay(); // 0=domingo
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // segunda
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}

function read(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const savedWeek = localStorage.getItem(WEEK_KEY);
    const currentWeek = getWeekStart();
    if (savedWeek !== currentWeek) {
      localStorage.setItem(WEEK_KEY, currentWeek);
      localStorage.setItem(KEY, "{}");
      return {};
    }
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function write(data: Record<string, number>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("likes:change"));
}

export function useLikes(addonId: string) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => {
      const data = read();
      setCount(data[addonId] ?? 0);
    };
    sync();
    window.addEventListener("likes:change", sync);
    return () => window.removeEventListener("likes:change", sync);
  }, [addonId]);

  useEffect(() => {
    const data = read();
    setCount(data[addonId] ?? 0);
  }, [addonId]);

  const toggle = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(40);
    const data = read();
    const current = data[addonId] ?? 0;
    if (liked) {
      data[addonId] = Math.max(0, current - 1);
      setLiked(false);
    } else {
      data[addonId] = current + 1;
      setLiked(true);
    }
    write(data);
    setCount(data[addonId]);
  }, [addonId, liked]);

  return { liked, count, toggle };
}

export function getTopLiked(addons: any[], limit = 5) {
  if (typeof window === "undefined") return [];
  const data = read();
  return [...addons]
    .sort((a, b) => (data[b.id] ?? 0) - (data[a.id] ?? 0))
    .slice(0, limit)
    .filter(a => (data[a.id] ?? 0) > 0);
}
