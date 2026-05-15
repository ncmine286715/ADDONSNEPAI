import { r as reactExports, V as jsxRuntimeExports } from "./server-BM3dfS9d.js";
import { b as Route, L as Link } from "./router-Dj3F8oni.js";
import { c as createLucideIcon, u as useFavorites, d as useViewCount, H as Header, a as Heart } from "./Header-DUhbY5aB.js";
import { u as useReactions, T as Tooltip, P as Play, Y as YouTubeModal } from "./Tooltip-CtA_S4Jw.js";
import { u as useViewHistory } from "./viewHistory-BzUrEqos.js";
import { A as ArrowLeft } from "./arrow-left-W1B-uqit.js";
import { T as Tag, D as Download, S as Star, C as Calendar } from "./tag-CFYdy5i7.js";
import { H as Hash } from "./hash-DBISLPd7.js";
import { U as User } from "./user-D9XvJQ97.js";
import { S as Sparkles, E as Eye } from "./sparkles-Bu2WEGIC.js";
import { F as Flame } from "./flame-CrBx-B4g.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = createLucideIcon("book-open", __iconNode$1);
const __iconNode = [
  ["path", { d: "M11 5h10", key: "1cz7ny" }],
  ["path", { d: "M11 12h10", key: "1438ji" }],
  ["path", { d: "M11 19h10", key: "11t30w" }],
  ["path", { d: "M4 4h1v5", key: "10yrso" }],
  ["path", { d: "M4 9h2", key: "r1h2o0" }],
  ["path", { d: "M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02", key: "xtkcd5" }]
];
const ListOrdered = createLucideIcon("list-ordered", __iconNode);
const SCROLL_KEY = "man.scrollPos.v1";
const isUpdatedToday = (dateStr) => {
  const today = /* @__PURE__ */ new Date();
  const date = new Date(dateStr);
  return date.toDateString() === today.toDateString();
};
function AddonPage() {
  const {
    addon
  } = Route.useLoaderData();
  const [tutorialOpen, setTutorialOpen] = reactExports.useState(false);
  const {
    isFav,
    toggle
  } = useFavorites();
  const {
    count,
    bump
  } = useViewCount(addon.id);
  const {
    react,
    getReactionCount
  } = useReactions();
  const {
    addView
  } = useViewHistory();
  const fav = isFav(addon.id);
  const REACTIONS = ["❤️", "🔥", "😍", "💩"];
  reactExports.useEffect(() => {
    const scrollPos = sessionStorage.getItem(`${SCROLL_KEY}_${addon.id}`);
    if (scrollPos) {
      window.scrollTo(0, parseInt(scrollPos, 10));
    }
    addView(addon.id);
  }, [addon.id, addView]);
  reactExports.useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(`${SCROLL_KEY}_${addon.id}`, String(window.scrollY));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [addon.id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "mx-auto max-w-5xl px-4 py-8 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-orange mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
        " Voltar"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative brut overflow-hidden aspect-[21/9] mb-6 p-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: addon.image, alt: addon.title, className: "absolute inset-0 w-full h-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" }),
        isUpdatedToday(addon.date) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4 brut-tag bg-orange text-xs font-bold", children: "Atualizado hoje" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-6 md:p-10 text-paper", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "brut-tag brut-tag-accent", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "size-3" }),
              " ",
              addon.category
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "brut-tag bg-paper", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "size-3" }),
              " v",
              addon.version
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "brut-tag bg-paper", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-3" }),
              " ",
              addon.author
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl md:text-7xl leading-[0.9] tracking-tight", children: addon.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-2xl text-paper/80 text-base md:text-lg", children: addon.short })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brut p-6 md:p-8 mb-8 bg-orange relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-10 -right-10 size-40 rounded-full border-[3px] border-ink bg-paper opacity-30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col md:flex-row gap-6 items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 brut-tag bg-ink text-paper", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-3" }),
              " Pronto pra jogar"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-4xl md:text-5xl mt-2 tracking-tight", children: "BAIXA AGORA" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-mono mt-2 flex flex-wrap items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5" }),
                " ",
                addon.downloads.toLocaleString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-3.5 fill-ink" }),
                " ",
                addon.rating.toFixed(1)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-3.5" }),
                " ",
                count,
                " clique(s)"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { text: "Baixar add-on", position: "bottom", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: addon.downloadUrl, target: "_blank", rel: "noreferrer", onClick: bump, className: "btn-download mega", "aria-label": `Download ${addon.title}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-7", strokeWidth: 3 }),
              " Download"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { text: fav ? "Remover dos favoritos" : "Salvar nos favoritos", position: "bottom", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggle(addon.id), className: `size-14 rounded-md border-[3px] border-ink grid place-items-center transition ${fav ? "bg-ink" : "bg-paper"}`, style: {
              boxShadow: "6px 6px 0 0 var(--ink)"
            }, "aria-label": fav ? "Remover dos favoritos" : "Salvar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `size-6 ${fav ? "fill-orange text-orange" : ""}`, strokeWidth: 2.5 }) }) }),
            addon.youtubeId && /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { text: "Ver tutorial", position: "bottom", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTutorialOpen(true), className: "inline-flex items-center gap-2 px-5 py-3 rounded-md border-[3px] border-ink bg-paper font-display text-lg uppercase brut-press", style: {
              boxShadow: "6px 6px 0 0 var(--ink)"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "size-5 fill-ink" }),
              " Tutorial"
            ] }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mb-6", children: REACTIONS.map((emoji) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => react(addon.id, emoji), className: "px-3 py-1.5 rounded-md border-2 border-ink bg-paper font-display text-sm hover:bg-orange transition", children: [
        emoji,
        " ",
        getReactionCount(addon.id, emoji) > 0 && `(${getReactionCount(addon.id, emoji)})`
      ] }, emoji)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-4" }), label: "Avaliação", value: `${addon.rating.toFixed(1)} / 5`, accent: "lime" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4" }), label: "Downloads", value: addon.downloads.toLocaleString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-4" }), label: "Atualizado", value: new Date(addon.date).toLocaleDateString("pt-BR") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-4" }), label: "Autor", value: addon.author, accent: "violet" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "brut p-6 md:p-8 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-3xl md:text-4xl mb-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-10 rounded-md bg-orange border-2 border-ink grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-5" }) }),
          "Descrição"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/85 leading-relaxed whitespace-pre-line", children: addon.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 flex flex-wrap gap-2", children: addon.tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "brut-tag", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "size-3" }),
          " ",
          t
        ] }, t)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "brut p-6 md:p-8 mb-8 bg-secondary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-3xl md:text-4xl mb-5 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-10 rounded-md bg-violet text-paper border-2 border-ink grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListOrdered, { className: "size-5" }) }),
          "Como instalar"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-3", children: ["Clique em DOWNLOAD acima e salve o arquivo .mcaddon / .mcpack.", "Abra o arquivo — o Minecraft importa automaticamente.", "Crie ou edite um mundo e ative o pacote em Recursos / Comportamento.", 'Ative "Experimentos" se o add-on pedir.', "Entre no mundo. Pronto."].map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-4 items-start brut bg-paper p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-9 shrink-0 rounded-md bg-orange border-2 border-ink font-display text-lg grid place-items-center", children: i + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pt-1.5", children: s })
        ] }, i)) }),
        addon.youtubeId && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTutorialOpen(true), className: "mt-6 inline-flex items-center gap-2 px-4 py-2 brut bg-ink text-paper font-bold uppercase tracking-wider text-sm brut-press", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "size-4 fill-paper" }),
          " Ver vídeo tutorial"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: addon.downloadUrl, target: "_blank", rel: "noreferrer", onClick: bump, className: "btn-download mega", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-7" }),
        " Baixar ",
        addon.title
      ] }) })
    ] }),
    tutorialOpen && addon.youtubeId && /* @__PURE__ */ jsxRuntimeExports.jsx(YouTubeModal, { id: addon.youtubeId, onClose: () => setTutorialOpen(false) })
  ] });
}
function Meta({
  icon,
  label,
  value,
  accent = "paper"
}) {
  const bg = accent === "lime" ? "bg-lime" : accent === "violet" ? "bg-violet text-paper" : "bg-paper";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `brut px-4 py-3 ${bg}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono", children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl mt-1 tracking-tight", children: value })
  ] });
}
export {
  AddonPage as component
};
