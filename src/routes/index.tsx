import { useMemo, useState, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search, ArrowDown, Boxes, Tag, Calendar, Star, TrendingUp,
  Filter, Sparkles, Flame, Zap, Heart, Mic,
} from "lucide-react";
import { ADDONS, type Addon } from "@/lib/addons";
import { Header } from "@/components/Header";
import { LoadingScreen } from "@/components/LoadingScreen";
import { FloatingAddons } from "@/components/FloatingAddons";
import { AddonCard } from "@/components/AddonCard";
import { AddonCardList } from "@/components/AddonCardList";
import { TopDownloads } from "@/components/TopDownloads";
import { RecentAddons } from "@/components/RecentAddons";
import { RandomAddon } from "@/components/RandomAddon";
import { ViewToggle } from "@/components/ViewToggle";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { getTopDownloads, getRecentAddons } from "@/lib/stats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mine Addons News — Biblioteca direta de add-ons" },
      { name: "description", content: "Biblioteca interativa de add-ons. Procure, filtre, baixe sem enrolação." },
      { property: "og:title", content: "Mine Addons News" },
      { property: "og:description", content: "Add-ons direto. Sem rodeios. Procure, filtre e baixe." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

type Sort = "recent" | "rating" | "downloads";

function Index() {
  const [loading, setLoading] = useState(true);
  const addons: Addon[] = ADDONS;

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("recent");
  const [view, setView] = useState<"grid" | "list">("grid");
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { isListening, startListening } = useVoiceSearch(setQ);
  
  useKeyboardShortcuts({
    onSearchFocus: () => searchInputRef.current?.focus(),
    onEscape: () => setQ(""),
  });

  const categories = useMemo(() => {
    const set = new Set(addons.map((a) => a.category));
    return ["all", ...Array.from(set)];
  }, [addons]);

  const filtered = useMemo(() => {
    let out = addons.filter((a) => {
      if (cat !== "all" && a.category !== cat) return false;
      if (!q) return true;
      const s = q.toLowerCase();
      return (
        a.title.toLowerCase().includes(s) ||
        a.tags.some((t) => t.toLowerCase().includes(s)) ||
        a.short.toLowerCase().includes(s) ||
        a.author.toLowerCase().includes(s)
      );
    });
    if (sort === "rating") out = [...out].sort((a, b) => b.rating - a.rating);
    else if (sort === "downloads") out = [...out].sort((a, b) => b.downloads - a.downloads);
    else out = [...out].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    return out;
  }, [addons, q, cat, sort]);

  const accents: Array<"orange" | "lime" | "violet"> = ["orange", "lime", "violet"];
  
  const topDownloaded = getTopDownloads(3);
  const recentOnes = getRecentAddons(1);

  return (
    <div className="w-full overflow-x-hidden">
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden border-b-2 border-ink w-full">
        <FloatingAddons addons={addons} />
        <div className="absolute inset-0 bg-gradient-to-b from-paper/40 via-paper/70 to-paper" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-28">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 brut-tag brut-tag-accent mb-6 animate-fade-up">
              <Sparkles className="size-3" /> {addons.length} ADD-ONS · ATUALIZADO HOJE
            </div>
            <h1 className="font-display text-5xl md:text-[8.5rem] leading-[0.9] md:leading-[0.85] tracking-tighter animate-fade-up">
              ADD-ONS{" "}
              <span className="inline-block bg-orange border-[3px] border-ink px-2 md:px-3 -rotate-2 text-2xl md:text-[inherit]" style={{ boxShadow: "8px 8px 0 0 var(--ink)" }}>
                DIRETO
              </span>
              <br />
              NO PONTO.
            </h1>
            <p className="mt-6 md:mt-8 max-w-xl text-base md:text-lg text-muted-foreground animate-fade-up [animation-delay:120ms]">
              Sem pop-up. Sem encurtador. Sem rodeio. Baixa, instala, joga.
            </p>
            <div className="mt-6 md:mt-8 flex flex-wrap gap-3 animate-fade-up [animation-delay:240ms]">
              <a
                href="#grid"
                className="inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3.5 rounded-md bg-ink text-paper border-2 border-ink font-display text-sm md:text-lg uppercase tracking-tight brut-press"
                style={{ boxShadow: "4px 4px 0 0 var(--brand-orange)" }}
              >
                <Flame className="size-4 md:size-5" /> Explorar
              </a>
              <RandomAddon />
            </div>
          </div>
        </div>

        {/* marquee strip */}
        <div className="relative border-t-2 border-ink bg-ink text-paper py-2 md:py-3 overflow-hidden w-full">
          <div className="marquee-strip animate-marquee gap-4 md:gap-8 px-2 md:px-4 font-display text-sm md:text-xl uppercase whitespace-nowrap">
            {Array.from({ length: 2 }).flatMap((_, k) => [
              <span key={`a${k}`} className="flex items-center gap-2 md:gap-3"><Zap className="size-3 md:size-5 text-orange" /> Sem encurtador</span>,
              <span key={`b${k}`} className="flex items-center gap-2 md:gap-3"><Boxes className="size-3 md:size-5 text-orange" /> Terabox</span>,
              <span key={`c${k}`} className="flex items-center gap-2 md:gap-3"><Heart className="size-3 md:size-5 text-orange fill-orange" /> Favoritos</span>,
              <span key={`d${k}`} className="flex items-center gap-2 md:gap-3"><Star className="size-3 md:size-5 text-orange fill-orange" /> Curadoria</span>,
              <span key={`e${k}`} className="flex items-center gap-2 md:gap-3"><Flame className="size-3 md:size-5 text-orange" /> NCMine</span>,
            ])}
          </div>
        </div>
      </section>

      {/* TOP DOWNLOADS & RECENTES */}
      <section className="w-full px-4 py-8 md:py-12 border-y-2 border-ink bg-secondary/30">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="size-6 text-orange" />
            <h2 className="font-display text-2xl md:text-3xl tracking-tight">🔥 Mais Baixados da Semana</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TopDownloads addons={topDownloaded} />
            <RecentAddons addons={recentOnes} />
          </div>
        </div>
      </section>

      {/* GRID */}
      <section id="grid" className="relative w-full px-4 py-6 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="brut p-3 md:p-5 mb-6 md:mb-8 md:sticky md:top-16 z-30 bg-paper w-full overflow-x-hidden">
            <div className="flex flex-col gap-3">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" />
                <input
                  ref={searchInputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar... (Ctrl+K)"
                  className="w-full h-10 md:h-11 pl-9 md:pl-10 pr-10 md:pr-12 rounded-md bg-input border-2 border-ink focus:bg-paper outline-none text-sm font-medium"
                />
                <button
                  onClick={startListening}
                  className={`absolute right-2 md:right-3 top-1/2 -translate-y-1/2 size-5 md:size-6 grid place-items-center rounded transition ${isListening ? "bg-orange animate-pulse" : "hover:bg-secondary"}`}
                >
                  <Mic className="size-3 md:size-4" />
                </button>
              </div>
              
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`shrink-0 h-9 md:h-11 px-3 md:px-4 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap border-2 border-ink transition flex items-center gap-1 md:gap-1.5 ${
                      cat === c ? "bg-orange" : "bg-paper hover:bg-secondary"
                    }`}
                  >
                    <Tag className="size-2.5 md:size-3" /> {c === "all" ? "Tudo" : c}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Filter className="size-3 md:size-4" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as Sort)}
                    className="h-9 md:h-11 px-2 md:px-3 rounded-md bg-input border-2 border-ink text-[10px] md:text-sm font-bold uppercase tracking-wider"
                  >
                    <option value="recent">Recentes</option>
                    <option value="rating">Avaliação</option>
                    <option value="downloads">Downloads</option>
                  </select>
                </div>
                <ViewToggle view={view} onChange={setView} />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 md:gap-3 text-[8px] md:text-[10px] tracking-widest uppercase font-mono text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="size-2 md:size-3" /> Data</span>
              <span className="flex items-center gap-1"><Star className="size-2 md:size-3" /> Avaliação</span>
              <span className="flex items-center gap-1"><TrendingUp className="size-2 md:size-3" /> Downloads</span>
              <span className="ml-auto text-ink font-bold text-[10px] md:text-xs">{filtered.length} resultado(s)</span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="brut py-16 md:py-24 text-center">
              <Boxes className="size-10 md:size-12 mx-auto mb-3" />
              <div className="font-display text-2xl md:text-3xl">Nada encontrado</div>
              <div className="text-muted-foreground text-xs md:text-sm mt-2">
                {addons.length === 0 ? "Use o painel para gerar e adicionar." : "Tente outra busca."}
              </div>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((a, i) => (
                <AddonCard key={a.id} addon={a} accent={accents[i % accents.length]} />
              ))}
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {filtered.map((a) => (
                <AddonCardList key={a.id} addon={a} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-ink text-paper mt-8 md:mt-16 w-full">
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-10 flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between text-[10px] md:text-xs">
        <div className="flex items-center gap-2 font-display text-lg md:text-2xl tracking-tight">
          <Boxes className="size-4 md:size-6 text-orange" /> MINE ADDONS NEWS
        </div>
        <div className="font-mono opacity-70 text-center">© {new Date().getFullYear()} — Feito sem encurtador.</div>
      </div>
    </footer>
  );
}
