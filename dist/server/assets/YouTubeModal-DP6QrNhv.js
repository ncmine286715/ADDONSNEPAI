import { c as createLucideIcon } from "./Header-CTqlX3-v.js";
import { r as reactExports, V as jsxRuntimeExports } from "./server-eYEy0ivm.js";
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
export {
  Play as P,
  YouTubeModal as Y
};
