import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning" | "achievement";

export type Toast = {
  id: string;
  type: ToastType;
  message: string;
};

const KEY = "mine-addons:toasts:list";
const TTL_MS = 3500;

function randomId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function safeRead(): Toast[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Toast[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWrite(toasts: Toast[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(toasts));
}

/**
 * showToast pode ser chamado de qualquer lugar (mesmo fora de componentes).
 * Ele grava em localStorage e dispara um evento para sincronizar a UI.
 */
export function showToast(type: ToastType, message: string) {
  if (typeof window === "undefined") return;

  const id = randomId();
  const toast: Toast = { id, type, message };

  const prev = safeRead();
  const next = [...prev, toast].slice(-5); // mantém no máximo 5
  safeWrite(next);

  // dispara atualização para componentes
  window.dispatchEvent(new Event("toasts:change"));

  // limpa depois do TTL
  window.setTimeout(() => {
    const current = safeRead();
    const filtered = current.filter((t) => t.id !== id);
    safeWrite(filtered);
    window.dispatchEvent(new Event("toasts:change"));
  }, TTL_MS);
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(() => safeRead());

  useEffect(() => {
    const onChange = () => {
      setToasts(safeRead());
    };

    window.addEventListener("toasts:change", onChange as EventListener);
    return () => window.removeEventListener("toasts:change", onChange as EventListener);
  }, []);

  return { toasts };
}
