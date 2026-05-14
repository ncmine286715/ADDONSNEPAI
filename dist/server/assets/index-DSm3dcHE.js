import { r as reactExports, V as jsxRuntimeExports } from "./server-eYEy0ivm.js";
import { L as Link, A as ADDONS } from "./router-BNfELQi1.js";
import { c as createLucideIcon, B as Boxes, u as useFavorites, a as Heart, H as Header } from "./Header-CTqlX3-v.js";
import { A as AddonCard } from "./AddonCard-Dx6FS7Mr.js";
import { S as Star, D as Download, C as Calendar, T as Tag } from "./tag-Bp_a7d2f.js";
import { T as TrendingUp } from "./trending-up-Dl86MTLs.js";
import { S as Sparkles } from "./sparkles-CUUiA7Bb.js";
import { F as Flame } from "./flame-Cd2pyxcV.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./YouTubeModal-DP6QrNhv.js";
const __iconNode$6 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["path", { d: "M16 8h.01", key: "cr5u4v" }],
  ["path", { d: "M16 12h.01", key: "1l6xoz" }],
  ["path", { d: "M16 16h.01", key: "1f9h7w" }],
  ["path", { d: "M8 8h.01", key: "1e4136" }],
  ["path", { d: "M8 12h.01", key: "czm47f" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
];
const Dice6 = createLucideIcon("dice-6", __iconNode$6);
const __iconNode$5 = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$5);
const __iconNode$4 = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
];
const LayoutGrid = createLucideIcon("layout-grid", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "M3 5h.01", key: "18ugdj" }],
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 19h.01", key: "noohij" }],
  ["path", { d: "M8 5h13", key: "1pao27" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 19h13", key: "m83p4d" }]
];
const List = createLucideIcon("list", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M12 19v3", key: "npa21l" }],
  ["path", { d: "M19 10v2a7 7 0 0 1-14 0v-2", key: "1vc78b" }],
  ["rect", { x: "9", y: "2", width: "6", height: "13", rx: "3", key: "s6n7sd" }]
];
const Mic = createLucideIcon("mic", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
function LoadingScreen({ onDone }) {
  const [progress, setProgress] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const start = performance.now();
    const duration = 1100;
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 180);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);
  const pct = Math.round(progress * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[100] bg-paper flex flex-col items-center justify-center gap-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "size-24 rounded-xl bg-orange border-[3px] border-ink flex items-center justify-center",
        style: {
          transform: `rotate(${progress * 360}deg)`,
          boxShadow: "10px 10px 0 0 var(--ink)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "size-12 text-ink", strokeWidth: 3 })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-72", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-paper border-2 border-ink rounded-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full bg-ink transition-[width] duration-75",
          style: { width: `${pct}%` }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex justify-between text-xs font-mono font-bold tracking-widest", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "CARREGANDO" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          pct,
          "%"
        ] })
      ] })
    ] })
  ] });
}
function FloatingAddons({ addons }) {
  const items = reactExports.useMemo(() => {
    if (!addons.length) return [];
    return Array.from({ length: 14 }).map((_, i) => {
      const a = addons[i % addons.length];
      const tx = Math.random() * 100;
      const dx = (Math.random() - 0.5) * 200;
      const sc = 0.5 + Math.random() * 0.7;
      const dur = 14 + Math.random() * 12;
      const delay = -Math.random() * dur;
      const op = 0.55 + Math.random() * 0.35;
      const rot = (Math.random() - 0.5) * 30;
      return { i, a, tx, dx, sc, dur, delay, op, rot };
    });
  }, [addons]);
  if (!items.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 overflow-hidden", children: items.map(({ i, a, tx, dx, sc, dur, delay, op, rot }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "animate-float-up absolute top-0 size-20 md:size-28 overflow-hidden border-[3px] border-ink rounded-md",
      style: {
        left: `${tx}vw`,
        animationDuration: `${dur}s`,
        animationDelay: `${delay}s`,
        boxShadow: "5px 5px 0 0 var(--ink)",
        ["--tx"]: `0px`,
        ["--dx"]: `${dx}px`,
        ["--sc"]: `${sc}`,
        ["--rz"]: `${rot}deg`,
        ["--op"]: `${op}`
      },
      children: a.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: a.image, alt: "", className: "w-full h-full object-cover", loading: "lazy" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-orange" })
    },
    i
  )) });
}
function AddonCardList({ addon }) {
  const { isFav, toggle } = useFavorites();
  const fav = isFav(addon.id);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brut p-3 flex gap-4 items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/addon/$id", params: { id: addon.id }, className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: addon.image, alt: addon.title, className: "size-16 object-cover rounded border border-ink" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/addon/$id", params: { id: addon.id }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl tracking-tight hover:text-orange", children: addon.title }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground line-clamp-1", children: addon.short }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-1 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-3" }),
          " ",
          addon.rating.toFixed(1)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3" }),
          " ",
          addon.downloads.toLocaleString()
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3" }),
          " v",
          addon.version
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggle(addon.id), className: "shrink-0 size-9 rounded-md border-2 border-ink grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `size-4 ${fav ? "fill-orange text-orange" : ""}` }) })
  ] });
}
function TopDownloads({ addons }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brut p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-5 text-orange" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl tracking-tight", children: "📥 Mais Baixados" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: addons.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/addon/$id", params: { id: a.id }, className: "flex items-center gap-3 p-2 hover:bg-secondary rounded-md transition", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-2xl w-8 text-orange", children: [
        "#",
        i + 1
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: a.image, alt: a.title, className: "size-10 object-cover rounded border border-ink" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm truncate", children: a.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3" }),
          " ",
          a.downloads.toLocaleString()
        ] })
      ] })
    ] }, a.id)) })
  ] });
}
function RecentAddons({ addons }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brut p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5 text-orange" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl tracking-tight", children: "✨ Novidades" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: addons.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/addon/$id", params: { id: a.id }, className: "group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: a.image, alt: a.title, className: "w-full aspect-video object-cover rounded border-2 border-ink mb-2 group-hover:scale-105 transition" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm truncate", children: a.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3" }),
        " ",
        new Date(a.date).toLocaleDateString()
      ] })
    ] }, a.id)) })
  ] });
}
function getTopDownloads(limit = 10) {
  return [...ADDONS].sort((a, b) => b.downloads - a.downloads).slice(0, limit);
}
function getRecentAddons(limit = 4) {
  return [...ADDONS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit);
}
function getRandomAddon() {
  return ADDONS[Math.floor(Math.random() * ADDONS.length)];
}
function RandomAddon() {
  const random = getRandomAddon();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/addon/$id",
      params: { id: random.id },
      className: "inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 border-ink bg-paper font-display text-sm uppercase tracking-tight hover:bg-orange transition",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dice6, { className: "size-4" }),
        " Surpreenda-me"
      ]
    }
  );
}
function ViewToggle({ view, onChange }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 border-2 border-ink rounded-md p-1 bg-paper", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => onChange("grid"),
        className: `size-8 rounded grid place-items-center transition ${view === "grid" ? "bg-orange" : "hover:bg-secondary"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "size-4" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => onChange("list"),
        className: `size-8 rounded grid place-items-center transition ${view === "list" ? "bg-orange" : "hover:bg-secondary"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "size-4" })
      }
    )
  ] });
}
function useVoiceSearch(onResult) {
  const [isListening, setIsListening] = reactExports.useState(false);
  const [recognition, setRecognition] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition2 = new SpeechRecognition();
        recognition2.continuous = false;
        recognition2.interimResults = false;
        recognition2.lang = "pt-BR";
        recognition2.onresult = (event) => {
          const text = event.results[0][0].transcript;
          onResult(text);
          setIsListening(false);
        };
        recognition2.onend = () => setIsListening(false);
        setRecognition(recognition2);
      }
    }
  }, [onResult]);
  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };
  return { isListening, startListening };
}
function useKeyboardShortcuts({
  onSearchFocus,
  onEscape
}) {
  reactExports.useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onSearchFocus?.();
      }
      if (e.key === "Escape") {
        onEscape?.();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onSearchFocus, onEscape]);
}
function Index() {
  const [loading, setLoading] = reactExports.useState(true);
  const addons = ADDONS;
  const [q, setQ] = reactExports.useState("");
  const [cat, setCat] = reactExports.useState("all");
  const [sort, setSort] = reactExports.useState("recent");
  const [view, setView] = reactExports.useState("grid");
  const searchInputRef = reactExports.useRef(null);
  const {
    isListening,
    startListening
  } = useVoiceSearch(setQ);
  useKeyboardShortcuts({
    onSearchFocus: () => searchInputRef.current?.focus(),
    onEscape: () => setQ("")
  });
  const categories = reactExports.useMemo(() => {
    const set = new Set(addons.map((a) => a.category));
    return ["all", ...Array.from(set)];
  }, [addons]);
  const filtered = reactExports.useMemo(() => {
    let out = addons.filter((a) => {
      if (cat !== "all" && a.category !== cat) return false;
      if (!q) return true;
      const s = q.toLowerCase();
      return a.title.toLowerCase().includes(s) || a.tags.some((t) => t.toLowerCase().includes(s)) || a.short.toLowerCase().includes(s) || a.author.toLowerCase().includes(s);
    });
    if (sort === "rating") out = [...out].sort((a, b) => b.rating - a.rating);
    else if (sort === "downloads") out = [...out].sort((a, b) => b.downloads - a.downloads);
    else out = [...out].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    return out;
  }, [addons, q, cat, sort]);
  const accents = ["orange", "lime", "violet"];
  const topDownloaded = getTopDownloads(3);
  const recentOnes = getRecentAddons(1);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full overflow-x-hidden", children: [
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingScreen, { onDone: () => setLoading(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden border-b-2 border-ink w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingAddons, { addons }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-paper/40 via-paper/70 to-paper" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto max-w-7xl px-4 py-12 md:py-28", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 brut-tag brut-tag-accent mb-6 animate-fade-up", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-3" }),
          " ",
          addons.length,
          " ADD-ONS · ATUALIZADO HOJE"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl md:text-[8.5rem] leading-[0.9] md:leading-[0.85] tracking-tighter animate-fade-up", children: [
          "ADD-ONS",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block bg-orange border-[3px] border-ink px-2 md:px-3 -rotate-2 text-2xl md:text-[inherit]", style: {
            boxShadow: "8px 8px 0 0 var(--ink)"
          }, children: "DIRETO" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "NO PONTO."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 md:mt-8 max-w-xl text-base md:text-lg text-muted-foreground animate-fade-up [animation-delay:120ms]", children: "Sem pop-up. Sem encurtador. Sem rodeio. Baixa, instala, joga." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 md:mt-8 flex flex-wrap gap-3 animate-fade-up [animation-delay:240ms]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#grid", className: "inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3.5 rounded-md bg-ink text-paper border-2 border-ink font-display text-sm md:text-lg uppercase tracking-tight brut-press", style: {
            boxShadow: "4px 4px 0 0 var(--brand-orange)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-4 md:size-5" }),
            " Explorar"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RandomAddon, {})
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative border-t-2 border-ink bg-ink text-paper py-2 md:py-3 overflow-hidden w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "marquee-strip animate-marquee gap-4 md:gap-8 px-2 md:px-4 font-display text-sm md:text-xl uppercase whitespace-nowrap", children: Array.from({
        length: 2
      }).flatMap((_, k) => [/* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 md:gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "size-3 md:size-5 text-orange" }),
        " Sem encurtador"
      ] }, `a${k}`), /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 md:gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "size-3 md:size-5 text-orange" }),
        " Terabox"
      ] }, `b${k}`), /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 md:gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-3 md:size-5 text-orange fill-orange" }),
        " Favoritos"
      ] }, `c${k}`), /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 md:gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-3 md:size-5 text-orange fill-orange" }),
        " Curadoria"
      ] }, `d${k}`), /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 md:gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-3 md:size-5 text-orange" }),
        " NCMine"
      ] }, `e${k}`)]) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "w-full px-4 py-8 md:py-12 border-y-2 border-ink bg-secondary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-6 text-orange" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl md:text-3xl tracking-tight", children: "🔥 Mais Baixados da Semana" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TopDownloads, { addons: topDownloaded }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RecentAddons, { addons: recentOnes })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "grid", className: "relative w-full px-4 py-6 md:py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brut p-3 md:p-5 mb-6 md:mb-8 md:sticky md:top-16 z-30 bg-paper w-full overflow-x-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: searchInputRef, value: q, onChange: (e) => setQ(e.target.value), placeholder: "Buscar... (Ctrl+K)", className: "w-full h-10 md:h-11 pl-9 md:pl-10 pr-10 md:pr-12 rounded-md bg-input border-2 border-ink focus:bg-paper outline-none text-sm font-medium" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: startListening, className: `absolute right-2 md:right-3 top-1/2 -translate-y-1/2 size-5 md:size-6 grid place-items-center rounded transition ${isListening ? "bg-orange animate-pulse" : "hover:bg-secondary"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "size-3 md:size-4" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1", children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setCat(c), className: `shrink-0 h-9 md:h-11 px-3 md:px-4 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap border-2 border-ink transition flex items-center gap-1 md:gap-1.5 ${cat === c ? "bg-orange" : "bg-paper hover:bg-secondary"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "size-2.5 md:size-3" }),
            " ",
            c === "all" ? "Tudo" : c
          ] }, c)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "size-3 md:size-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: sort, onChange: (e) => setSort(e.target.value), className: "h-9 md:h-11 px-2 md:px-3 rounded-md bg-input border-2 border-ink text-[10px] md:text-sm font-bold uppercase tracking-wider", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "recent", children: "Recentes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "rating", children: "Avaliação" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "downloads", children: "Downloads" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ViewToggle, { view, onChange: setView })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2 md:gap-3 text-[8px] md:text-[10px] tracking-widest uppercase font-mono text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-2 md:size-3" }),
            " Data"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-2 md:size-3" }),
            " Avaliação"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-2 md:size-3" }),
            " Downloads"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-ink font-bold text-[10px] md:text-xs", children: [
            filtered.length,
            " resultado(s)"
          ] })
        ] })
      ] }),
      filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brut py-16 md:py-24 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "size-10 md:size-12 mx-auto mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-2xl md:text-3xl", children: "Nada encontrado" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-xs md:text-sm mt-2", children: addons.length === 0 ? "Use o painel para gerar e adicionar." : "Tente outra busca." })
      ] }) : view === "grid" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6", children: filtered.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(AddonCard, { addon: a, accent: accents[i % accents.length] }, a.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 md:space-y-3", children: filtered.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(AddonCardList, { addon: a }, a.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t-2 border-ink bg-ink text-paper mt-8 md:mt-16 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-6 md:py-10 flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between text-[10px] md:text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-display text-lg md:text-2xl tracking-tight", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "size-4 md:size-6 text-orange" }),
      " MINE ADDONS NEWS"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono opacity-70 text-center", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " — Feito sem encurtador."
    ] })
  ] }) });
}
export {
  Index as component
};
