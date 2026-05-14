import { useState, useEffect, useCallback } from "react";

const KEY = "man.followed.authors.v1";

function read(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function write(s: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(Array.from(s)));
  window.dispatchEvent(new Event("followed:change"));
}

export function useFollowedAuthors() {
  const [authors, setAuthors] = useState<Set<string>>(() => read());

  useEffect(() => {
    const sync = () => setAuthors(read());
    window.addEventListener("followed:change", sync);
    return () => window.removeEventListener("followed:change", sync);
  }, []);

  const toggle = useCallback((author: string) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(40);
    const next = new Set(read());
    if (next.has(author)) next.delete(author); else next.add(author);
    write(next);
    setAuthors(read());
  }, []);

  const isFollowing = useCallback((author: string) => authors.has(author), [authors]);

  return { authors, toggle, isFollowing };
}
