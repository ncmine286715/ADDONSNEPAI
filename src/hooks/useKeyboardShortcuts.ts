import { useEffect } from "react";

export function useKeyboardShortcuts({
  onSearchFocus,
  onEscape,
}: {
  onSearchFocus?: () => void;
  onEscape?: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onSearchFocus?.();
      }
      // Escape
      if (e.key === "Escape") {
        onEscape?.();
      }
    };
    
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onSearchFocus, onEscape]);
}
