import { r as reactExports, V as jsxRuntimeExports } from "./server-eYEy0ivm.js";
import { L as Link } from "./router-BNfELQi1.js";
import { c as createLucideIcon, u as useFavorites, a as Heart } from "./Header-CTqlX3-v.js";
import { P as Play, Y as YouTubeModal } from "./YouTubeModal-DP6QrNhv.js";
import { T as Tag, S as Star, C as Calendar, D as Download } from "./tag-Bp_a7d2f.js";
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
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Erro ao compartilhar:", err);
      }
    } else {
      const shareText = `${shareData.title}

${shareData.text}

🔗 ${shareData.url}`;
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
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
function AddonCard({ addon, accent = "orange" }) {
  const { isFav, toggle } = useFavorites();
  const [tut, setTut] = reactExports.useState(false);
  const fav = isFav(addon.id);
  const accentClass = accent === "lime" ? "bg-lime" : accent === "violet" ? "bg-violet text-paper" : "bg-orange";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "brut brut-hover group relative overflow-hidden flex flex-col", children: [
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-2 right-2 md:bottom-3 md:right-3 size-7 md:size-9 rounded-full bg-paper border-2 border-ink grid place-items-center opacity-0 group-hover:opacity-100 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "size-3 md:size-4" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 md:p-4 flex-1 flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/addon/$id", params: { id: addon.id }, className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg md:text-2xl leading-none tracking-tight group-hover:text-orange transition-colors", children: addon.title }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => toggle(addon.id),
                "aria-label": fav ? "Remover dos favoritos" : "Salvar como favorito",
                "aria-pressed": fav,
                className: `shrink-0 size-8 md:size-9 rounded-md border-2 border-ink grid place-items-center transition ${fav ? "bg-orange" : "bg-paper hover:bg-secondary"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `size-3.5 md:size-4 ${fav ? "fill-ink" : ""}`, strokeWidth: 2.4 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShareButton, { addon })
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pb-3 md:px-4 md:pb-4 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: addon.downloadUrl,
            target: "_blank",
            rel: "noreferrer",
            onClick: (e) => e.stopPropagation(),
            className: `relative flex-1 inline-flex items-center justify-center gap-2 py-2 md:py-2.5 rounded-md border-2 border-ink font-display text-sm md:text-base tracking-wide uppercase ${accentClass} brut-press overflow-hidden`,
            style: { boxShadow: "4px 4px 0 0 var(--ink)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5 md:size-4", strokeWidth: 3 }),
              "Download",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
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
        ),
        addon.youtubeId && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setTut(true),
            "aria-label": "Ver tutorial",
            className: "size-9 md:size-11 shrink-0 grid place-items-center rounded-md border-2 border-ink bg-paper brut-press hover:bg-orange transition",
            style: { boxShadow: "4px 4px 0 0 var(--ink)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "size-3.5 md:size-4 fill-ink" })
          }
        )
      ] })
    ] }),
    tut && addon.youtubeId && /* @__PURE__ */ jsxRuntimeExports.jsx(YouTubeModal, { id: addon.youtubeId, onClose: () => setTut(false) })
  ] });
}
export {
  AddonCard as A
};
