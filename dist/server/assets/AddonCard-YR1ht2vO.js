import { r as reactExports, V as jsxRuntimeExports } from "./server-BM3dfS9d.js";
import { s as showToast, L as Link, A as ADDONS } from "./router-Dj3F8oni.js";
import { c as createLucideIcon, u as useFavorites, a as Heart } from "./Header-DUhbY5aB.js";
import { X, u as useReactions, T as Tooltip, P as Play, Y as YouTubeModal } from "./Tooltip-CtA_S4Jw.js";
import { T as Tag, S as Star, C as Calendar, D as Download } from "./tag-CFYdy5i7.js";
import { L as LoaderCircle } from "./loader-circle-DEzON8Ky.js";
const __iconNode$2 = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode$2);
const __iconNode$1 = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode$1);
const __iconNode = [
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
  ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
  ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
];
const Share2 = createLucideIcon("share-2", __iconNode);
const COMPARISON_KEY = "man.comparison.v1";
const MAX_COMPARE = 2;
function readComparison() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPARISON_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeComparison(ids) {
  if (typeof window === "undefined") return;
  localStorage.setItem(COMPARISON_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("comparison:change"));
}
function useComparison() {
  const [ids, setIds] = reactExports.useState([]);
  reactExports.useEffect(() => {
    setIds(readComparison());
    const sync = () => setIds(readComparison());
    window.addEventListener("comparison:change", sync);
    return () => window.removeEventListener("comparison:change", sync);
  }, []);
  const addToComparison = reactExports.useCallback((addonId) => {
    const current = readComparison();
    if (current.includes(addonId)) return;
    const next = [...current, addonId].slice(0, MAX_COMPARE);
    writeComparison(next);
    setIds(next);
  }, []);
  const removeFromComparison = reactExports.useCallback((addonId) => {
    const next = readComparison().filter((id) => id !== addonId);
    writeComparison(next);
    setIds(next);
  }, []);
  const clearComparison = reactExports.useCallback(() => {
    writeComparison([]);
    setIds([]);
  }, []);
  const isInComparison = reactExports.useCallback((addonId) => {
    return ids.includes(addonId);
  }, [ids]);
  const getComparisonAddons = reactExports.useCallback((addons) => {
    return addons.filter((a) => ids.includes(a.id));
  }, [ids]);
  return {
    ids,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    getComparisonAddons
  };
}
function ComparisonModal({ addons, onClose }) {
  if (addons.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-ink/80 flex items-center justify-center p-4 animate-fade-up", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-paper border-4 border-ink rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 md:p-6 border-b-2 border-ink", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl md:text-3xl tracking-tight", children: "Comparativo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "size-10 rounded-md border-2 border-ink bg-paper grid place-items-center hover:bg-orange transition",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 md:p-6 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b-2 border-ink", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3 font-display text-sm uppercase tracking-wide", children: "Característica" }),
        addons.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 min-w-[150px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base md:text-lg text-center", children: a.title }) }, a.id))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-ink/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-xs uppercase tracking-wider text-muted-foreground", children: "Categoria" }),
          addons.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-center font-medium", children: a.category }, a.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-ink/30 bg-secondary/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-xs uppercase tracking-wider text-muted-foreground", children: "Versão" }),
          addons.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-center font-medium", children: [
            "v",
            a.version
          ] }, a.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-ink/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-xs uppercase tracking-wider text-muted-foreground", children: "Avaliação" }),
          addons.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-center font-medium", children: [
            a.rating.toFixed(1),
            " / 5"
          ] }, a.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-ink/30 bg-secondary/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-xs uppercase tracking-wider text-muted-foreground", children: "Downloads" }),
          addons.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-center font-medium", children: a.downloads.toLocaleString() }, a.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-ink/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-xs uppercase tracking-wider text-muted-foreground", children: "Autor" }),
          addons.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-center font-medium", children: a.author }, a.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-ink/30 bg-secondary/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-xs uppercase tracking-wider text-muted-foreground", children: "Atualizado" }),
          addons.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-center font-medium", children: new Date(a.date).toLocaleDateString("pt-BR") }, a.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-xs uppercase tracking-wider text-muted-foreground", children: "Tags" }),
          addons.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 justify-center", children: a.tags.slice(0, 3).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brut-tag text-[10px]", children: t }, t)) }) }, a.id))
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 md:p-6 border-t-2 border-ink flex flex-col sm:flex-row gap-3", children: addons.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "a",
      {
        href: a.downloadUrl,
        target: "_blank",
        rel: "noreferrer",
        className: "flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-md border-2 border-ink font-display text-sm uppercase bg-orange brut-press",
        style: { boxShadow: "4px 4px 0 0 var(--ink)" },
        children: [
          "Baixar ",
          a.title
        ]
      },
      a.id
    )) })
  ] }) });
}
function haptic() {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(50);
  }
}
function ShareButton({ addon, variant = "icon" }) {
  const [copied, setCopied] = reactExports.useState(false);
  const shareData = {
    title: `${addon.title} - Mine Addons News`,
    text: `${addon.short}

⭐ Avaliação: ${addon.rating}/5
📥 Downloads: ${addon.downloads.toLocaleString()}
🏷️ Categoria: ${addon.category}`,
    url: `${window.location.origin}/addon/${addon.id}`
  };
  const handleShare = async () => {
    haptic();
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast("success", "Link compartilhado!");
      } catch (err) {
        console.log("Erro ao compartilhar:", err);
      }
    } else {
      const shareText = `${shareData.title}

${shareData.text}

🔗 ${shareData.url}`;
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      showToast("success", "Link copiado para a área de transferência!");
      setTimeout(() => setCopied(false), 2e3);
    }
  };
  if (variant === "icon") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: handleShare,
        className: `shrink-0 size-9 rounded-md border-2 border-ink grid place-items-center transition hover:bg-orange ${copied ? "bg-lime" : "bg-paper"}`,
        "aria-label": "Compartilhar add-on",
        children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "size-4" })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick: handleShare,
      className: "inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 border-ink bg-paper font-bold uppercase tracking-wider text-sm brut-press hover:bg-orange transition-all",
      style: { boxShadow: "4px 4px 0 0 var(--ink)" },
      "aria-label": "Compartilhar add-on",
      children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }),
        " Copiado!"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "size-4" }),
        " Compartilhar"
      ] })
    }
  );
}
const isUpdatedToday = (dateStr) => {
  const today = /* @__PURE__ */ new Date();
  const date = new Date(dateStr);
  return date.toDateString() === today.toDateString();
};
function AddonCard({ addon, accent = "orange" }) {
  const { isFav, toggle } = useFavorites();
  const { react, getReactionCount } = useReactions();
  const { addToComparison, removeFromComparison, isInComparison, ids } = useComparison();
  const [tut, setTut] = reactExports.useState(false);
  const [isDownloading, setIsDownloading] = reactExports.useState(false);
  const fav = isFav(addon.id);
  const inComparison = isInComparison(addon.id);
  const accentClass = accent === "lime" ? "bg-lime" : accent === "violet" ? "bg-violet text-paper" : "bg-orange";
  const handleDownload = (e) => {
    e.stopPropagation();
    setIsDownloading(true);
    setTimeout(() => setIsDownloading(false), 1e3);
  };
  const handleFav = () => {
    toggle(addon.id);
  };
  const handleCompare = (e) => {
    e.stopPropagation();
    if (inComparison) {
      removeFromComparison(addon.id);
    } else {
      addToComparison(addon.id);
    }
  };
  const REACTIONS = ["❤️", "🔥", "😍", "💩"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "brut group relative overflow-hidden flex flex-col transition-all duration-200 hover:shadow-[8px_8px_0_0_var(--ink)] hover:-translate-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/addon/$id", params: { id: addon.id }, className: "block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[16/10] overflow-hidden border-b-2 border-ink bg-ink", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: addon.image,
            alt: addon.title,
            className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
            loading: "lazy"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute top-2 left-2 md:top-3 md:left-3 brut-tag brut-tag-accent text-[8px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "size-2.5 md:size-3" }),
          " ",
          addon.category
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute top-2 right-2 md:top-3 md:right-3 brut-tag bg-paper text-[8px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-2.5 md:size-3 fill-ink" }),
          " ",
          addon.rating.toFixed(1)
        ] }),
        isUpdatedToday(addon.date) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-2 left-2 md:bottom-3 md:left-3 brut-tag bg-orange text-[8px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1", children: "Atualizado hoje" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-2 right-2 md:bottom-3 md:right-3 size-7 md:size-9 rounded-full bg-paper border-2 border-ink grid place-items-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "size-3 md:size-4" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 md:p-4 flex-1 flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/addon/$id", params: { id: addon.id }, className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg md:text-2xl leading-none tracking-tight group-hover:text-orange transition-colors", children: addon.title }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { text: fav ? "Remover dos favoritos" : "Salvar nos favoritos", position: "top", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleFav,
                "aria-label": fav ? "Remover dos favoritos" : "Salvar como favorito",
                "aria-pressed": fav,
                className: `shrink-0 size-8 md:size-9 rounded-md border-2 border-ink grid place-items-center transition ${fav ? "bg-orange" : "bg-paper hover:bg-secondary"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `size-3.5 md:size-4 ${fav ? "fill-ink" : ""}`, strokeWidth: 2.4 })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { text: "Compartilhar", position: "top", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShareButton, { addon }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs md:text-sm text-muted-foreground line-clamp-2 min-h-[2rem] md:min-h-[2.5rem]", children: addon.short }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 md:mt-3 flex items-center justify-between text-[10px] md:text-xs font-mono text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-2.5 md:size-3" }),
            " v",
            addon.version
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 font-bold text-ink", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-2.5 md:size-3" }),
            " ",
            addon.downloads.toLocaleString()
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pb-3 md:px-4 md:pb-4 flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 justify-center", children: REACTIONS.map((emoji) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => react(addon.id, emoji),
            className: "text-xs md:text-sm hover:scale-110 transition-transform",
            title: `Reagir com ${emoji}`,
            children: [
              emoji,
              " ",
              getReactionCount(addon.id, emoji) > 0 && `(${getReactionCount(addon.id, emoji)})`
            ]
          },
          emoji
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { text: inComparison ? "Remover da comparação" : "Adicionar à comparação", position: "bottom", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleCompare,
            className: `w-full py-1.5 rounded-md border-2 border-ink font-display text-xs uppercase transition ${inComparison ? "bg-orange" : "bg-paper hover:bg-secondary"}`,
            children: inComparison ? "Comparando ✓" : "Comparar"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pb-3 md:px-4 md:pb-4 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { text: "Baixar arquivo", position: "bottom", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: addon.downloadUrl,
            target: "_blank",
            rel: "noreferrer",
            onClick: handleDownload,
            className: `relative flex-1 inline-flex items-center justify-center gap-2 py-2 md:py-2.5 rounded-md border-2 border-ink font-display text-sm md:text-base tracking-wide uppercase ${accentClass} brut-press overflow-hidden transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_var(--ink)]`,
            style: { boxShadow: "4px 4px 0 0 var(--ink)" },
            children: [
              isDownloading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 md:size-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5 md:size-4", strokeWidth: 3 }),
              isDownloading ? "Baixando..." : "Download",
              !isDownloading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "absolute inset-0 pointer-events-none",
                  style: {
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2.4s linear infinite"
                  }
                }
              )
            ]
          }
        ) }),
        addon.youtubeId && /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { text: "Ver tutorial", position: "bottom", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setTut(true),
            "aria-label": "Ver tutorial",
            className: "size-9 md:size-11 shrink-0 grid place-items-center rounded-md border-2 border-ink bg-paper brut-press hover:bg-orange transition",
            style: { boxShadow: "4px 4px 0 0 var(--ink)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "size-3.5 md:size-4 fill-ink" })
          }
        ) })
      ] })
    ] }),
    tut && addon.youtubeId && /* @__PURE__ */ jsxRuntimeExports.jsx(YouTubeModal, { id: addon.youtubeId, onClose: () => setTut(false) }),
    ids.length >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(ComparisonModal, { addons: ADDONS.filter((a) => ids.includes(a.id)), onClose: () => {
    } })
  ] });
}
export {
  AddonCard as A,
  Check as C,
  Share2 as S,
  ArrowUpRight as a
};
