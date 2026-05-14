import { useState, useEffect, useCallback } from "react";

const PREFIX = "man.comments.v1";

export type Comment = {
  id: string;
  name: string;
  text: string;
  date: string; // ISO
};

function read(addonId: string): Comment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${PREFIX}.${addonId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function write(addonId: string, items: Comment[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${PREFIX}.${addonId}`, JSON.stringify(items.slice(-10)));
  window.dispatchEvent(new Event(`comments:${addonId}:change`));
}

export function useComments(addonId: string) {
  const [comments, setComments] = useState<Comment[]>(() => read(addonId));

  useEffect(() => {
    const sync = () => setComments(read(addonId));
    window.addEventListener(`comments:${addonId}:change`, sync);
    return () => window.removeEventListener(`comments:${addonId}:change`, sync);
  }, [addonId]);

  const add = useCallback((name: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !name.trim()) return;
    const next: Comment = {
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      name: name.trim().slice(0, 30),
      text: trimmed.slice(0, 500),
      date: new Date().toISOString(),
    };
    const list = [...read(addonId), next];
    write(addonId, list);
    setComments(read(addonId));
  }, [addonId]);

  return { comments, add };
}
