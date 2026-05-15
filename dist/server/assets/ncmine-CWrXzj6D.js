import { V as jsxRuntimeExports } from "./server-BM3dfS9d.js";
import { A as ADDONS } from "./router-Dj3F8oni.js";
import { c as createLucideIcon, H as Header, B as Boxes } from "./Header-DUhbY5aB.js";
import { A as AddonCard } from "./AddonCard-YR1ht2vO.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./Tooltip-CtA_S4Jw.js";
import "./tag-CFYdy5i7.js";
import "./loader-circle-DEzON8Ky.js";
const __iconNode = [
  [
    "path",
    {
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
];
const Crown = createLucideIcon("crown", __iconNode);
function NCMinePage() {
  const list = ADDONS.filter((a) => a.category === "ncmine");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden border-b-2 border-ink bg-violet text-paper", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 card-grid-bg opacity-20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-7xl px-4 py-20 md:py-28", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 brut-tag bg-paper text-ink mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "size-3" }),
          " CLASSE EXCLUSIVA"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-6xl md:text-[8rem] tracking-tighter leading-[0.85]", children: "NCMINE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 max-w-xl text-paper/80 text-lg", children: "Coleção curada. Apenas add-ons da família NCMine — verificados, atualizados, direto." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-4 py-12", children: list.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brut py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "size-12 mx-auto mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl", children: "Nenhum add-on NCMine ainda" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: list.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(AddonCard, { addon: a, accent: "violet" }, a.id)) }) })
  ] });
}
export {
  NCMinePage as component
};
