import { V as jsxRuntimeExports } from "./server-eYEy0ivm.js";
import { H as Header } from "./Header-CTqlX3-v.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-BNfELQi1.js";
const SplitErrorComponent = ({
  error
}) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl px-4 py-24 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive", children: error.message }) })
] });
export {
  SplitErrorComponent as errorComponent
};
