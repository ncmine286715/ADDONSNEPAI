import { useMemo, useState, useRef, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search, ArrowDown, Boxes, Tag, Calendar, Star, TrendingUp,
  Filter, Sparkles, Flame, Zap, Heart, Mic, X, Clock, Loader2, Eye, User, Scale
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
import { SkeletonCard } from "@/components/SkeletonCard";
import { SkeletonCardList } from "@/components/SkeletonCardList";
import { DiscordWidget } from "@/components/DiscordWidget";
import { TopLikedAddons } from "@/components/TopLikedAddons";
import { WishlistShare } from "@/components/WishlistShare";
import { FollowedAuthorsSection } from "@/components/FollowedAuthorsSection";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { getTopDownloads, getRecentAddons as getRecentStats } from "@/lib/stats";
import { Tooltip } from "@/components/Tooltip";
import { useViewHistory } from "@/lib/viewHistory";
import { useNewAddonNotification } from "@/lib/newAddonNotification";
// import { ComparisonModal } from "@/components/ComparisonModal"; // Comentado se não existir

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

type Sort = "recent" | "rating" | "downloads" | "views" | "name-asc" | "name-desc";

function Index() {
  const [loading, setLoading] = useState(true);
  const addons: Addon[] = ADDONS;

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [author, setAuthor] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("recent");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showHistory, setShowHistory] = useState(false);
  const [ids, setIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const { isListening, startListening } = useVoiceSearch(setQ);
  const { history, add, remove, clear } = useSearchHistory();
  const { getRecentAddons: getRecentViewed } = useViewHistory();
  const { showNotification, updateLastVisit } = useNewAddonNotification();

  useKeyboardShortcuts({
    onSearchFocus: () => searchInputRef.current?.focus(),
    onEscape: () => {
      setQ("");
      setShowHistory(false);
    },
  });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const categories = useMemo(() => {
    const set = new Set(addons.map((a) => a.category));
    return ["all", ...Array.from(set)];
  }, [addons]);

  const authors = useMemo(() => {
    const set = new Set(addons.map((a) => a.author));
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"))];
  }, [addons]);

  const filtered = useMemo(() => {
    let out = addons.filter((a) => {
      if (cat !== "all" && a.category !== cat) return false;
      if (author !== "all" && a.author !== author) return false;
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
    else if (sort === "views") {
      const raw = typeof window !== "undefined" ? localStorage.getItem("man.views.v1") : null;
      const views: Record<string, number> = raw ? JSON.parse(raw) : {};
      out = [...out].sort((a, b) => (views[b.id] ?? 0) - (views[a.id] ?? 0));
    }
    else if (sort === "name-asc") out = [...out].sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    else if (sort === "name-desc") out = [...out].sort((a, b) => b.title.localeCompare(a.title, "pt-BR"));
    else out = [...out].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    return out;
  }, [addons, q, cat, author, sort]);

  const accents: Array<"orange" | "lime" | "violet"> = ["orange", "lime", "violet"];

  const topDownloaded = getTopDownloads(3);
  const recentOnes = getRecentStats(1);

  // 🔥 REMOVIDO O INFINITE SCROLL – agora exibe todos os addons de uma vez
  const displayed = filtered; // todos os addons já filtrados
  const hasMore = false;
  const loaderRef = undefined;

  const handleSearch = (term: string) => {
    setQ(term);
    add(term);
    setShowHistory(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value);
    if (e.target.value.trim()) setShowHistory(false);
  };

  const handleInputFocus = () => {
    if (!q.trim() && history.length > 0) setShowHistory(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && q.trim()) {
      add(q.trim());
      setShowHistory(false);
    }
  };

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

      {/* TOP DOWNLOADS & RECENTES & SOCIAL */}
      <section className="w-full px-4 py-8 md:py-12 border-y-2 border-ink bg-secondary/30">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="size-6 text-orange" />
            <h2 className="font-display text-2xl md:text-3xl tracking-tight">🔥 Destaques</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TopDownloads addons={topDownloaded} />
            <RecentAddons addons={recentOnes} />
            <TopLikedAddons />
          </div>
        </div>
      </section>

      <FollowedAuthorsSection />

      {/* Recently Viewed */}
      {!loading && (
        <section className="w-full px-4 py-6 md:py-8 border-t-2 border-ink bg-secondary/30">
          <div className="mx-auto max-w-7xl">
            <h3 className="font-display text-xl md:text-2xl mb-4 flex items-center gap-2">
              <Clock className="size-5 text-orange" /> Vistos recentemente
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {getRecentViewed(addons).map((a) => (
                <Link
                  key={a.id}
                  to="/addon/$id"
                  params={{ id: a.id }}
                  className="group brut p-2 hover:shadow-[4px_4px_0_0_var(--ink)] transition"
                >
                  <img src={a.image} alt={a.title} className="w-full aspect-[4/3] object-cover border-2 border-ink mb-2" />
                  <div className="text-xs font-bold truncate">{a.title}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Addon Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 brut bg-orange border-2 border-ink p-4 rounded-md shadow-[6px_6px_0_0_var(--ink)] z-50 max-w-sm">
          <div className="flex items-start gap-3">
            <Sparkles className="size-5 text-ink shrink-0 mt-0.5" />
            <div>
              <div className="font-display text-lg">Novos add-ons!</div>
              <p className="text-sm mt-1">Há novos add-ons desde sua última visita.</p>
              <button
                onClick={updateLastVisit}
                className="mt-2 text-xs font-bold underline hover:opacity-70"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GRID */}
      <section id="grid" className="relative w-full px-4 py-6 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="brut p-3 md:p-5 mb-6 md:mb-8 md:sticky md:top-16 z-30 bg-paper w-full overflow-x-hidden shadow-[4px_4px_0_0_var(--ink)]">
            <div className="flex flex-col gap-3">
              {/* Search */}
              <div className="relative w-full" ref={historyRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" />
                <input
                  ref={searchInputRef}
                  value={q}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar... (Ctrl+K)"
                  className="w-full h-10 md:h-11 pl-9 md:pl-10 pr-10 md:pr-12 rounded-md bg-input border-2 border-ink focus:bg-paper outline-none text-sm font-medium"
                />
                <button
                  onClick={startListening}
                  className={`absolute right-2 md:right-3 top-1/2 -translate-y-1/2 size-5 md:size-6 grid place-items-center rounded transition ${isListening ? "bg-orange animate-pulse" : "hover:bg-secondary"}`}
                >
                  <Mic className="size-3 md:size-4" />
                </button>

                {showHistory && history.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-paper border-2 border-ink rounded-md shadow-[6px_6px_0_0_var(--ink)] z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b-2 border-ink bg-secondary/30">
                      <span className="text-[10px] uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                        <Clock className="size-3" /> Buscas recentes
                      </span>
                      <button onClick={clear} className="text-[10px] text-destructive font-bold uppercase hover:underline">
                        Limpar
                      </button>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {history.map((term) => (
                        <div key={term} className="flex items-center justify-between px-3 py-2 hover:bg-secondary cursor-pointer group border-b border-ink/10 last:border-0">
                          <button onClick={() => handleSearch(term)} className="flex-1 text-left text-sm font-medium truncate">
                            {term}
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); remove(term); }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded">
                            <X className="size-3 text-destructive" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`shrink-0 h-9 md:h-11 px-3 md:px-4 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap border-2 border-ink transition flex items-center gap-1 md:gap-1.5 ${
                      cat === c ? "bg-orange shadow-[2px_2px_0_0_var(--ink)]" : "bg-paper hover:bg-secondary"
                    }`}
                  >
                    <Tag className="size-2.5 md:size-3" /> {c === "all" ? "Tudo" : c}
                  </button>
                ))}
              </div>

              {/* Filters row */}
              <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                  <Filter className="size-3 md:size-4 shrink-0" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as Sort)}
                    className="h-9 md:h-11 px-2 md:px-3 rounded-md bg-input border-2 border-ink text-[10px] md:text-sm font-bold uppercase tracking-wider shrink-0"
                  >
                    <option value="recent">Recentes</option>
                    <option value="rating">Avaliação</option>
                    <option value="downloads">Downloads</option>
                    <option value="views">Mais vistos</option>
                    <option value="name-asc">Nome A-Z</option>
                    <option value="name-desc">Nome Z-A</option>
                  </select>

                  <User className="size-3 md:size-4 shrink-0 ml-1" />
                  <select
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="h-9 md:h-11 px-2 md:px-3 rounded-md bg-input border-2 border-ink text-[10px] md:text-sm font-bold uppercase tracking-wider shrink-0 min-w-[140px]"
                  >
                    <option value="all">Todos autores</option>
                    {authors.filter(a => a !== "all").map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {ids.length > 0 && (
                    <button
                      onClick={() => setShowCompareModal(true)}
                      className="h-9 md:h-11 px-3 rounded-md bg-orange border-2 border-ink text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0_0_var(--ink)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-1.5"
                    >
                      <Scale className="size-3.5" /> Comparar ({ids.length})
                    </button>
                  )}
                  <Tooltip text="Alternar visualização" position="bottom">
                    <ViewToggle view={view} onChange={setView} />
                  </Tooltip>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 md:gap-3 text-[8px] md:text-[10px] tracking-widest uppercase font-mono text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="size-2 md:size-3" /> Data</span>
              <span className="flex items-center gap-1"><Star className="size-2 md:size-3" /> Avaliação</span>
              <span className="flex items-center gap-1"><TrendingUp className="size-2 md:size-3" /> Downloads</span>
              <span className="flex items-center gap-1"><Eye className="size-2 md:size-3" /> Visualizações</span>
              <span className="ml-auto text-ink font-bold text-[10px] md:text-xs">{filtered.length} resultado(s)</span>
            </div>
          </div>

          {loading || addons.length === 0 ? (
            view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCardList key={i} />)}
              </div>
            )
          ) : filtered.length === 0 ? (
            <div className="brut py-16 md:py-24 text-center shadow-[6px_6px_0_0_var(--ink)]">
              <Boxes className="size-10 md:size-12 mx-auto mb-3" />
              <div className="font-display text-2xl md:text-3xl">Nada encontrado</div>
              <div className="text-muted-foreground text-xs md:text-sm mt-2">
                {addons.length === 0 ? "Use o painel para gerar e adicionar." : "Tente outra busca ou filtro."}
              </div>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {displayed.map((a, i) => (
                <AddonCard key={a.id} addon={a} accent={accents[i % accents.length]} />
              ))}
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {displayed.map((a) => <AddonCardList key={a.id} addon={a} />)}
            </div>
          )}
        </div>
      </section>

      {/* SOCIAL SIDEBAR */}
      <section className="w-full px-4 py-8 md:py-12 border-t-2 border-ink bg-secondary/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DiscordWidget />
            <WishlistShare />
          </div>
        </div>
      </section>

      {/* ComparisonModal (comentado se não existir) */}
      {showCompareModal && (
        // <ComparisonModal addons={ADDONS.filter(a => ids.includes(a.id))} onClose={() => setShowCompareModal(false)} />
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="brut bg-paper p-6 max-w-2xl w-full">
            <h3 className="font-display text-2xl mb-4">Comparar Add-ons</h3>
            <p className="text-sm text-muted-foreground mb-4">Funcionalidade em desenvolvimento.</p>
            <button onClick={() => setShowCompareModal(false)} className="brut px-4 py-2">Fechar</button>
          </div>
        </div>
      )}
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
