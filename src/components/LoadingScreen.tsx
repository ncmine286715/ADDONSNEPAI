import { useEffect, useState } from "react";
import { Boxes } from "lucide-react";

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1100;
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 180);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const pct = Math.round(progress * 100);

  return (
    <div className="fixed inset-0 z-[100] bg-paper flex flex-col items-center justify-center gap-8">
      <div className="relative">
        <div
          className="size-24 rounded-xl bg-orange border-[3px] border-ink flex items-center justify-center"
          style={{
            transform: `rotate(${progress * 360}deg)`,
            boxShadow: "10px 10px 0 0 var(--ink)",
          }}
        >
          <Boxes className="size-12 text-ink" strokeWidth={3} />
        </div>
      </div>

      <div className="w-72">
        <div className="h-3 bg-paper border-2 border-ink rounded-sm overflow-hidden">
          <div
            className="h-full bg-ink transition-[width] duration-75"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-3 flex justify-between text-xs font-mono font-bold tracking-widest">
          <span>CARREGANDO</span>
          <span>{pct}%</span>
        </div>
      </div>
    </div>
  );
}
