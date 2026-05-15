import { V as jsxRuntimeExports } from "./server-BM3dfS9d.js";
import { A as ADDONS, L as Link } from "./router-Dj3F8oni.js";
import { u as useFavorites, H as Header, a as Heart, B as Boxes } from "./Header-DUhbY5aB.js";
import { A as AddonCard } from "./AddonCard-YR1ht2vO.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./Tooltip-CtA_S4Jw.js";
import "./tag-CFYdy5i7.js";
import "./loader-circle-DEzON8Ky.js";
function FavoritesPage() {
  const {
    ids
  } = useFavorites();
  const list = ADDONS.filter((a) => ids.has(a.id));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative border-b-2 border-ink bg-orange", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 brut-tag bg-ink text-paper mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-3 fill-paper" }),
        " SUA LISTA"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-6xl md:text-8xl tracking-tighter leading-[0.85]", children: "FAVORITOS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-ink/80 text-lg", children: [
        "Salvos no seu navegador. ",
        list.length,
        " item(s)."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-4 py-12", children: list.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brut py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "size-12 mx-auto mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl", children: "Sua lista está vazia" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-muted-foreground", children: [
        "Toque no ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-3.5 inline align-middle" }),
        " em qualquer add-on para salvar aqui."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "inline-flex mt-6 items-center gap-2 px-4 py-2 brut bg-ink text-paper font-bold uppercase brut-press", children: "Explorar add-ons" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: list.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(AddonCard, { addon: a }, a.id)) }) })
  ] });
}
export {
  FavoritesPage as component
};
