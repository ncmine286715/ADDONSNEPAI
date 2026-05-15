import { useEffect } from "react";

const KEY = "man.scroll-home.v1";

export function useHomeScrollRestoration() {
  useEffect(() => {
    const raw = sessionStorage.getItem(KEY);
    if (raw) {
      try {
        const { y, t } = JSON.parse(raw);
        if (Date.now() - t < 10 * 60 * 1000) {
          const timer = setTimeout(() => window.scrollTo({ top: y, behavior: "instant" }), 50);
          return () => clearTimeout(timer);
        }
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      sessionStorage.setItem(KEY, JSON.stringify({ y: window.scrollY, t: Date.now() }));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      onScroll();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
}