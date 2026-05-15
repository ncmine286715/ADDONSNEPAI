import { Link, useLocation } from "@tanstack/react-router";
import { Boxes, Heart, Bell, Scale } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { useNewAddonNotification } from "@/lib/newAddonNotification";
import { useComparison } from "@/lib/comparison";
import { ThemeToggle } from "./ThemeToggle";

const SiDiscord = (p: React.SVGProps<<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3a13.93 13.93 0 0 0-.617 1.27 18.27 18.27 0 0 0-5.487 0A13.45 13.45 0 0 0 9.83 3a19.74 19.74 0 0 0-3.76 1.37C2.515 9.59 1.79 14.69 2.151 19.71a19.9 19.9 0 0 0 5.99 3.03c.485-.66.916-1.36 1.286-2.1a12.9 12.9 0 0 1-2.026-.97c.17-.124.336-.253.497-.385 3.87 1.78 8.066 1.78 11.892 0 .163.132.33.261.5.385-.65.388-1.328.71-2.03.972.371.737.802 1.438 1.287 2.099a19.88 19.88 0 0 0 5.992-3.03c.42-5.79-.71-10.84-3.222-15.342ZM8.02 16.51c-1.183 0-2.157-1.085-2.157-2.42 0-1.336.953-2.422 2.157-2.422s2.178 1.086 2.157 2.422c.001 1.335-.953 2.42-2.157 2.42Zm7.96 0c-1.183 0-2.157-1.085-2.157-2.42 0-1.336.953-2.422 2.157-2.422s2.178 1.086 2.157 2.422c0 1.335-.953 2.42-2.157 2.42Z"/>
  </svg>
);
const SiYoutube = (p: React.SVGProps<<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export function Header() {
  const { ids: favIds } = useFavorites();
  const { showNotification, newCount } = useNewAddonNotification();
  const { ids: compareIds } = useComparison();
  useLocation();

  const link = (to: string, label: string) => (
    <Link
      to={to}
      className="px-3 py-1.5 text-sm font-bold tracking-wide uppercase rounded-md border-2 border-transparent hover:border-ink hover:bg-paper transition-colors"
      activeProps={{ className: "border-2 border-ink bg-orange shadow-[2px_2px_0_0_var(--ink)]" }}
      activeOptions={{ exact: to === "/" }}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="size-10 rounded-md bg-orange border-2 border-ink grid place-items-center shadow-[3px_3px_0_0_var(--ink)] group-hover:shadow-[5px_5px_0_0_var(--ink)] group-hover:-translate-y-0.5 transition-all">
            <Boxes className="size-5 text-ink" strokeWidth={3} />
          </div>
          <div className="leading-none">
            <div className="font-display text-2xl tracking-tight">MINE ADDONS</div>
            <div className="text-[10px] tracking-[0.3em] font-mono text-muted-foreground -mt-0.5">/ N E W S</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 relative z-10">
          {link("/", "Início")}
          {link("/ncmine", "NCMine")}
          {link("/favoritos", "Favoritos")}
          {link("/admin", "Painel")}
        </nav>

        <div className="flex items-center gap-2">
          {/* Compare indicator */}
          {compareIds.length > 0 && (
            <Link
              to="/"
              className="relative size-10 rounded-md border-2 border-ink bg-orange grid place-items-center shadow-[2px_2px_0_0_var(--ink)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              title={`${compareIds.length} na comparação`}
            >
              <Scale className="size-4" />
              <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-ink border-2 border-ink text-paper text-[10px] font-bold grid place-items-center">
                {compareIds.length}
              </span>
            </Link>
          )}

          <Link
            to="/favoritos"
            className="md:hidden relative size-10 rounded-md border-2 border-ink bg-paper grid place-items-center shadow-[2px_2px_0_0_var(--ink)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            <Heart className={`size-4 ${favIds.size > 0 ? "fill-orange text-ink" : ""}`} />
            {favIds.size > 0 && (
              <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-orange border-2 border-ink text-[10px] font-bold grid place-items-center">
                {favIds.size}
              </span>
            )}
          </Link>

          {showNotification && (
            <div className="relative size-10 rounded-md border-2 border-ink bg-orange grid place-items-center animate-pulse shadow-[2px_2px_0_0_var(--ink)]" title="Novos add-ons disponíveis!">
              <Bell className="size-4" />
              {newCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-ink border-2 border-ink text-paper text-[10px] font-bold grid place-items-center">
                  {newCount}
                </span>
              )}
            </div>
          )}

          <ThemeToggle />
          <a
            href="https://discord.gg"
            target="_blank"
            rel="noreferrer"
            className="size-10 rounded-md border-2 border-ink bg-paper grid place-items-center hover:bg-violet hover:text-paper transition shadow-[2px_2px_0_0_var(--ink)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            <SiDiscord className="size-4" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="size-10 rounded-md border-2 border-ink bg-paper grid place-items-center hover:bg-orange transition shadow-[2px_2px_0_0_var(--ink)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            <SiYoutube className="size-4" />
          </a>
        </div>
      </div>
    </header>
  );
}