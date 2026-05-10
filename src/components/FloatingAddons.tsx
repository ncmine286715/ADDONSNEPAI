import { useMemo } from "react";
import type { Addon } from "@/lib/addons";

/** Confetti-like floating thumbnails for the hero. Brutalist version. */
export function FloatingAddons({ addons }: { addons: Addon[] }) {
  const items = useMemo(() => {
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

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map(({ i, a, tx, dx, sc, dur, delay, op, rot }) => (
        <div
          key={i}
          className="animate-float-up absolute top-0 size-20 md:size-28 overflow-hidden border-[3px] border-ink rounded-md"
          style={{
            left: `${tx}vw`,
            animationDuration: `${dur}s`,
            animationDelay: `${delay}s`,
            boxShadow: "5px 5px 0 0 var(--ink)",
            ["--tx" as never]: `0px`,
            ["--dx" as never]: `${dx}px`,
            ["--sc" as never]: `${sc}`,
            ["--rz" as never]: `${rot}deg`,
            ["--op" as never]: `${op}`,
          } as React.CSSProperties}
        >
          {a.image ? (
            <img src={a.image} alt="" className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full bg-orange" />
          )}
        </div>
      ))}
    </div>
  );
}
