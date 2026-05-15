import { r as reactExports } from "./server-BM3dfS9d.js";
const HISTORY_KEY = "man.viewHistory.v1";
const MAX_HISTORY = 5;
function readHistory() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeHistory(h) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, MAX_HISTORY)));
}
function useViewHistory() {
  const [history, setHistory] = reactExports.useState([]);
  reactExports.useEffect(() => {
    setHistory(readHistory());
  }, []);
  const addView = reactExports.useCallback((addonId) => {
    const h = readHistory().filter((v) => v.id !== addonId);
    h.unshift({ id: addonId, date: (/* @__PURE__ */ new Date()).toISOString() });
    writeHistory(h);
    setHistory(h.slice(0, MAX_HISTORY));
  }, []);
  const getRecentAddons = reactExports.useCallback((addons) => {
    const ids = readHistory().map((v) => v.id);
    return addons.filter((a) => ids.includes(a.id)).slice(0, MAX_HISTORY);
  }, []);
  const clearHistory = reactExports.useCallback(() => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }, []);
  return { history, addView, getRecentAddons, clearHistory };
}
export {
  useViewHistory as u
};
