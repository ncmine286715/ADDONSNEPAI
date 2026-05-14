import { useMemo } from "react";
import { useToast, type ToastType } from "@/hooks/useToast";

function typeToAccent(type: ToastType) {
  switch (type) {
    case "success":
      return { bg: "bg-emerald-500", border: "border-ink" };
    case "error":
      return { bg: "bg-red-500", border: "border-ink" };
    case "warning":
      return { bg: "bg-orange", border: "border-ink" };
    case "achievement":
      return { bg: "bg-orange", border: "border-ink" };
    case "info":
    default:
      return { bg: "bg-indigo-500", border: "border-ink" };
  }
}

export function Toaster() {
  const { toasts } = useToast();
  const items = useMemo(() => toasts.slice().reverse(), [toasts]);

  return (
    <div
      className="fixed z-50 bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-relevant="additions"
    >
      {items.map((t) => {
        const accent = typeToAccent(t.type);

        return (
          <div
            key={t.id}
            className={[
              "pointer-events-none max-w-[92vw] md:max-w-[520px] rounded-md border-2 border-ink",
              "bg-paper/95 backdrop-blur px-4 py-3 shadow-[4px_4px_0_0_var(--brand-orange)]",
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              <div
                className={[
                  "mt-0.5 size-8 grid place-items-center rounded-md border-2",
                  accent.bg,
                  accent.border,
                  "text-paper font-black",
                ].join(" ")}
                style={{ boxShadow: "3px 3px 0 0 var(--ink)" }}
              >
                {t.type === "achievement"
                  ? "🏆"
                  : t.type === "success"
                    ? "✓"
                    : t.type === "error"
                      ? "!"
                      : t.type === "warning"
                        ? "!"
                        : "i"}
              </div>

              <div className="flex-1">
                <div className="text-[11px] md:text-xs font-bold uppercase tracking-wider">
                  {t.type === "achievement"
                    ? "Conquista"
                    : t.type === "success"
                      ? "Sucesso"
                      : t.type === "error"
                        ? "Erro"
                        : t.type === "warning"
                          ? "Atenção"
                          : "Info"}
                </div>
                <div className="text-sm md:text-base font-semibold leading-snug">
                  {t.message}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
