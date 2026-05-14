import { V as jsxRuntimeExports } from "./server-eYEy0ivm.js";
import { L as Link } from "./router-BNfELQi1.js";
import { c as createLucideIcon, H as Header } from "./Header-CTqlX3-v.js";
import { A as ArrowLeft } from "./arrow-left-CR93c8uU.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  [
    "path",
    {
      d: "M14.5 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v3.8",
      key: "1kchwa"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "M11.7 14.2 7 17l-4.7-2.8", key: "1yk8tc" }],
  [
    "path",
    {
      d: "M3 13.1a2 2 0 0 0-.999 1.76v3.24a2 2 0 0 0 .969 1.78L6 21.7a2 2 0 0 0 2.03.01L11 19.9a2 2 0 0 0 1-1.76V14.9a2 2 0 0 0-.97-1.78L8 11.3a2 2 0 0 0-2.03-.01z",
      key: "19flxy"
    }
  ],
  ["path", { d: "M7 17v5", key: "1yj1jh" }]
];
const FileBox = createLucideIcon("file-box", __iconNode);
const SplitNotFoundComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 py-24 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(FileBox, { className: "size-16 mx-auto mb-4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-7xl mb-4", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Add-on não encontrado." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 brut px-4 py-2 brut-press", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
      " Voltar"
    ] })
  ] })
] });
export {
  SplitNotFoundComponent as notFoundComponent
};
