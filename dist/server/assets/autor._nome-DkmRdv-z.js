import { r as reactExports, V as jsxRuntimeExports } from "./server-BM3dfS9d.js";
import { R as Route, L as Link, A as ADDONS } from "./router-Dj3F8oni.js";
import { H as Header, B as Boxes } from "./Header-DUhbY5aB.js";
import { A as AddonCard } from "./AddonCard-YR1ht2vO.js";
import { u as useViewHistory } from "./viewHistory-BzUrEqos.js";
import { A as ArrowLeft } from "./arrow-left-W1B-uqit.js";
import { U as User } from "./user-D9XvJQ97.js";
import { D as Download, S as Star, C as Calendar } from "./tag-CFYdy5i7.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./Tooltip-CtA_S4Jw.js";
import "./loader-circle-DEzON8Ky.js";
function AuthorPage() {
  const {
    addons,
    authorName
  } = Route.useLoaderData();
  const [sort, setSort] = reactExports.useState("recent");
  const {
    getRecentAddons
  } = useViewHistory();
  const sortedAddons = reactExports.useMemo(() => {
    let out = [...addons];
    if (sort === "rating") out = out.sort((a, b) => b.rating - a.rating);
    else if (sort === "downloads") out = out.sort((a, b) => b.downloads - a.downloads);
    else out = out.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    return out;
  }, [addons, sort]);
  const totalDownloads = addons.reduce((sum, a) => sum + a.downloads, 0);
  const avgRating = (addons.reduce((sum, a) => sum + a.rating, 0) / addons.length).toFixed(1);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-orange mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
        " Voltar"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brut p-6 md:p-8 mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-start md:items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-20 rounded-md bg-violet text-paper border-2 border-ink grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-10" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl md:text-5xl", children: authorName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 mt-2 text-sm font-mono", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "size-4" }),
              " ",
              addons.length,
              " add-ons"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4" }),
              " ",
              totalDownloads.toLocaleString(),
              " downloads"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-4 fill-orange" }),
              " ",
              avgRating,
              " média"
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl md:text-3xl", children: "Add-ons do autor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: sort, onChange: (e) => setSort(e.target.value), className: "h-9 px-3 rounded-md bg-input border-2 border-ink text-xs font-bold uppercase", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "recent", children: "Recentes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "rating", children: "Avaliação" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "downloads", children: "Downloads" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6", children: sortedAddons.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(AddonCard, { addon: a, accent: ["orange", "lime", "violet"][i % 3] }, a.id)) }),
      getRecentAddons(ADDONS).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-xl mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-5 text-orange" }),
          " Continuar navegando"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3", children: getRecentAddons(ADDONS).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/addon/$id", params: {
          id: a.id
        }, className: "group brut p-2 hover:shadow-[4px_4px_0_0_var(--ink)] transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: a.image, alt: a.title, className: "w-full aspect-[4/3] object-cover border-2 border-ink mb-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold truncate", children: a.title })
        ] }, a.id)) })
      ] })
    ] })
  ] });
}
export {
  AuthorPage as component
};
