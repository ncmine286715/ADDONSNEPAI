import { O as useRouter, r as reactExports, V as jsxRuntimeExports } from "./server-BM3dfS9d.js";
import { L as Link } from "./router-Dj3F8oni.js";
function useLocation(opts) {
  const router = useRouter();
  {
    const location = router.stores.location.get();
    return location;
  }
}
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
const __iconNode$4 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$4);
const __iconNode$3 = [
  [
    "path",
    {
      d: "M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z",
      key: "lc1i9w"
    }
  ],
  ["path", { d: "m7 16.5-4.74-2.85", key: "1o9zyk" }],
  ["path", { d: "m7 16.5 5-3", key: "va8pkn" }],
  ["path", { d: "M7 16.5v5.17", key: "jnp8gn" }],
  [
    "path",
    {
      d: "M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z",
      key: "8zsnat"
    }
  ],
  ["path", { d: "m17 16.5-5-3", key: "8arw3v" }],
  ["path", { d: "m17 16.5 4.74-2.85", key: "8rfmw" }],
  ["path", { d: "M17 16.5v5.17", key: "k6z78m" }],
  [
    "path",
    {
      d: "M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z",
      key: "1xygjf"
    }
  ],
  ["path", { d: "M12 8 7.26 5.15", key: "1vbdud" }],
  ["path", { d: "m12 8 4.74-2.85", key: "3rx089" }],
  ["path", { d: "M12 13.5V8", key: "1io7kd" }]
];
const Boxes = createLucideIcon("boxes", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
      key: "mvr1a0"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm"
    }
  ]
];
const Moon = createLucideIcon("moon", __iconNode$1);
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
];
const Sun = createLucideIcon("sun", __iconNode);
const KEY = "man.favorites.v1";
const VIEWS_KEY = "man.views.v1";
function haptic() {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(50);
  }
}
function readSet() {
  if (typeof window === "undefined") return /* @__PURE__ */ new Set();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return /* @__PURE__ */ new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function writeSet(s) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(Array.from(s)));
  window.dispatchEvent(new Event("favorites:change"));
}
function useFavorites() {
  const [ids, setIds] = reactExports.useState(() => readSet());
  reactExports.useEffect(() => {
    const sync = () => setIds(readSet());
    window.addEventListener("favorites:change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("favorites:change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const toggle = reactExports.useCallback((id) => {
    haptic();
    const next = new Set(readSet());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    writeSet(next);
  }, []);
  const isFav = reactExports.useCallback((id) => ids.has(id), [ids]);
  return { ids, toggle, isFav };
}
function readViews() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(VIEWS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function writeViews(v) {
  if (typeof window === "undefined") return;
  localStorage.setItem(VIEWS_KEY, JSON.stringify(v));
  window.dispatchEvent(new Event("views:change"));
}
function useViewCount(id) {
  const [count, setCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const sync = () => setCount(readViews()[id] ?? 0);
    sync();
    window.addEventListener("views:change", sync);
    return () => window.removeEventListener("views:change", sync);
  }, [id]);
  const bump = reactExports.useCallback(() => {
    const v = readViews();
    v[id] = (v[id] ?? 0) + 1;
    writeViews(v);
  }, [id]);
  return { count, bump };
}
const LAST_VISIT_KEY = "man.lastVisit.v1";
const NOTIFICATION_SHOWN_KEY = "man.notificationShown.v1";
function useNewAddonNotification() {
  const [lastVisit, setLastVisit] = reactExports.useState(null);
  const [showNotification, setShowNotification] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const raw = localStorage.getItem(LAST_VISIT_KEY);
    const shownRaw = localStorage.getItem(NOTIFICATION_SHOWN_KEY);
    const last = raw ? new Date(raw) : null;
    setLastVisit(last);
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    if (last && shownRaw !== today.toISOString().split("T")[0]) {
      setShowNotification(true);
    }
  }, []);
  const updateLastVisit = reactExports.useCallback(() => {
    const today = (/* @__PURE__ */ new Date()).toISOString();
    localStorage.setItem(LAST_VISIT_KEY, today);
    const todayKey = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    localStorage.setItem(NOTIFICATION_SHOWN_KEY, todayKey);
    setLastVisit(new Date(today));
    setShowNotification(false);
  }, []);
  const checkNewAddons = reactExports.useCallback((getNewestDate) => {
    if (!lastVisit) return false;
    const newest = getNewestDate();
    if (!newest) return false;
    return new Date(newest) > lastVisit;
  }, [lastVisit]);
  return { lastVisit, updateLastVisit, checkNewAddons, showNotification };
}
function useTheme() {
  const [isDark, setIsDark] = reactExports.useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("man.theme");
      return saved === "dark";
    }
    return false;
  });
  reactExports.useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.style.setProperty("--paper", "#1a1a1a");
      root.style.setProperty("--ink", "#f5f5f5");
      root.style.setProperty("--muted-foreground", "#a3a3a3");
      root.style.setProperty("--background", "#1a1a1a");
      root.style.setProperty("--input", "#2a2a2a");
      root.style.setProperty("--secondary", "#2a2a2a");
    } else {
      root.classList.remove("dark");
      root.style.setProperty("--paper", "#fafafa");
      root.style.setProperty("--ink", "#111111");
      root.style.setProperty("--muted-foreground", "#666666");
      root.style.setProperty("--background", "#fafafa");
      root.style.setProperty("--input", "#f0f0f0");
      root.style.setProperty("--secondary", "#e5e5e5");
    }
    localStorage.setItem("man.theme", isDark ? "dark" : "light");
  }, [isDark]);
  return { isDark, toggle: () => setIsDark(!isDark) };
}
function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick: toggle,
      className: "size-10 rounded-md border-2 border-ink bg-paper grid place-items-center hover:bg-orange transition",
      "aria-label": "Alternar tema",
      children: isDark ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "size-4" })
    }
  );
}
const SiDiscord = (p) => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", ...p, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20.317 4.369A19.79 19.79 0 0 0 16.558 3a13.93 13.93 0 0 0-.617 1.27 18.27 18.27 0 0 0-5.487 0A13.45 13.45 0 0 0 9.83 3a19.74 19.74 0 0 0-3.76 1.37C2.515 9.59 1.79 14.69 2.151 19.71a19.9 19.9 0 0 0 5.99 3.03c.485-.66.916-1.36 1.286-2.1a12.9 12.9 0 0 1-2.026-.97c.17-.124.336-.253.497-.385 3.87 1.78 8.066 1.78 11.892 0 .163.132.33.261.5.385-.65.388-1.328.71-2.03.972.371.737.802 1.438 1.287 2.099a19.88 19.88 0 0 0 5.992-3.03c.42-5.79-.71-10.84-3.222-15.342ZM8.02 16.51c-1.183 0-2.157-1.085-2.157-2.42 0-1.336.953-2.422 2.157-2.422s2.178 1.086 2.157 2.422c.001 1.335-.953 2.42-2.157 2.42Zm7.96 0c-1.183 0-2.157-1.085-2.157-2.42 0-1.336.953-2.422 2.157-2.422s2.178 1.086 2.157 2.422c0 1.335-.953 2.42-2.157 2.42Z" }) });
const SiYoutube = (p) => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", ...p, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" }) });
function Header() {
  const { ids } = useFavorites();
  const { showNotification } = useNewAddonNotification();
  useLocation();
  const link = (to, label) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to,
      className: "px-3 py-1.5 text-sm font-bold tracking-wide uppercase rounded-md border-2 border-transparent hover:border-ink hover:bg-paper transition-colors",
      activeProps: { className: "border-2 border-ink bg-orange" },
      activeOptions: { exact: to === "/" },
      children: label
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 border-b-2 border-ink bg-paper/95 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2.5 group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-md bg-orange border-2 border-ink grid place-items-center", style: { boxShadow: "3px 3px 0 0 var(--ink)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "size-5 text-ink", strokeWidth: 3 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-2xl tracking-tight", children: "MINE ADDONS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] tracking-[0.3em] font-mono text-muted-foreground -mt-0.5", children: "/ N E W S" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden md:flex items-center gap-1 relative z-10", children: [
      link("/", "Início"),
      link("/ncmine", "NCMine"),
      link("/favoritos", "Favoritos"),
      link("/admin", "Painel")
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/favoritos",
          className: "md:hidden relative size-10 rounded-md border-2 border-ink bg-paper grid place-items-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `size-4 ${ids.size > 0 ? "fill-orange text-ink" : ""}` }),
            ids.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-orange border-2 border-ink text-[10px] font-bold grid place-items-center", children: ids.size })
          ]
        }
      ),
      showNotification && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-md border-2 border-ink bg-orange grid place-items-center animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "https://discord.gg",
          target: "_blank",
          rel: "noreferrer",
          className: "size-10 rounded-md border-2 border-ink bg-paper grid place-items-center hover:bg-violet hover:text-paper transition",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SiDiscord, { className: "size-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "https://youtube.com",
          target: "_blank",
          rel: "noreferrer",
          className: "size-10 rounded-md border-2 border-ink bg-paper grid place-items-center hover:bg-orange transition",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SiYoutube, { className: "size-4" })
        }
      )
    ] })
  ] }) });
}
export {
  Boxes as B,
  Header as H,
  Heart as a,
  useNewAddonNotification as b,
  createLucideIcon as c,
  useViewCount as d,
  useFavorites as u
};
