import { c as createLucideIcon } from "./Header-DUhbY5aB.js";
import { r as reactExports, V as jsxRuntimeExports } from "./server-BM3dfS9d.js";
const __iconNode$1 = [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
];
const Play = createLucideIcon("play", __iconNode$1);
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
const REACTIONS_KEY = "man.reactions.v1";
function readReactions() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(REACTIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function writeReactions(state) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REACTIONS_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("reactions:change"));
}
function useReactions() {
  const [state, setState] = reactExports.useState({});
  reactExports.useEffect(() => {
    setState(readReactions());
    const sync = () => setState(readReactions());
    window.addEventListener("reactions:change", sync);
    return () => window.removeEventListener("reactions:change", sync);
  }, []);
  const react = reactExports.useCallback((addonId, reaction) => {
    const current = readReactions();
    if (!current[addonId]) current[addonId] = {};
    current[addonId][reaction] = (current[addonId][reaction] ?? 0) + 1;
    writeReactions(current);
    setState({ ...current });
  }, []);
  const getReactionCount = reactExports.useCallback((addonId, reaction) => {
    return state[addonId]?.[reaction] ?? 0;
  }, [state]);
  return { react, getReactionCount, state };
}
function YouTubeModal({ id, onClose }) {
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-[100] bg-ink/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up",
      onClick: onClose,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden border-[3px] border-ink bg-ink",
          style: { boxShadow: "12px 12px 0 0 var(--brand-orange)" },
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onClose,
                className: "absolute -top-4 -right-4 z-10 size-11 rounded-full bg-orange border-[3px] border-ink grid place-items-center hover:rotate-90 transition-transform",
                "aria-label": "Fechar",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5 text-ink", strokeWidth: 3 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "iframe",
              {
                src: `https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`,
                title: "Tutorial",
                allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowFullScreen: true,
                className: "w-full h-full"
              }
            )
          ]
        }
      )
    }
  );
}
function Tooltip({ children, text, position = "top" }) {
  const [show, setShow] = reactExports.useState(false);
  const posClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative inline-flex",
      onMouseEnter: () => setShow(true),
      onMouseLeave: () => setShow(false),
      onFocus: () => setShow(true),
      onBlur: () => setShow(false),
      children: [
        children,
        show && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute z-50 ${posClasses[position]} pointer-events-none animate-fade-up`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brut-tag bg-ink text-paper whitespace-nowrap text-[10px] px-2 py-1 border-2 border-ink shadow-[4px_4px_0_0_var(--brand-orange)]", children: text }) })
      ]
    }
  );
}
export {
  Play as P,
  Tooltip as T,
  X,
  YouTubeModal as Y,
  useReactions as u
};
