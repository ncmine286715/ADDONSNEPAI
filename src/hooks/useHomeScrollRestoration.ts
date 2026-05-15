import { useEffect } from "react";

const KEY = "man.home-scroll.v1";

export function useHomeScrollRestoration() {
  useEffect(() => {
    const raw = sessionStorage.getItem(KEY);
    if (raw) {
      const y = parseInt(raw, 10);
      requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" }));
    }
    return () => {
      sessionStorage.setItem(KEY, String(window.scrollY));
    };
  }, []);
}