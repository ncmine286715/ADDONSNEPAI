import { useEffect, useState } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      // SEMPRE começa no claro (false)
      // Só carrega do localStorage se existir
      const saved = localStorage.getItem("man.theme");
      return saved === "dark"; // Se salvou como dark, usa dark, senão claro
    }
    return false; // padrão = claro
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.style.setProperty("--paper", "#1a1a1a");
      root.style.setProperty("--ink", "#f5f5f5");
      root.style.setProperty("--muted-foreground", "#a3a3a3");
      root.style.setProperty("--background", "#1a1a1a");
      root.style.setProperty("--input", "#2a2a2a");
      root.style.setProperty("--secondary", "#2a2a2a");
    } else {
      root.classList.remove("dark");
      root.style.setProperty("--paper", "#fafafa");
      root.style.setProperty("--ink", "#111111");
      root.style.setProperty("--muted-foreground", "#666666");
      root.style.setProperty("--background", "#fafafa");
      root.style.setProperty("--input", "#f0f0f0");
      root.style.setProperty("--secondary", "#e5e5e5");
    }
    localStorage.setItem("man.theme", isDark ? "dark" : "light");
  }, [isDark]);

  return { isDark, toggle: () => setIsDark(!isDark) };
}
