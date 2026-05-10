import { useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import {
  Star, Calendar, User, ArrowLeft, Download, BookOpen, Tag,
  Play, ListOrdered, Hash, FileBox, Sparkles, Heart, Eye, Flame,
} from "lucide-react";
import { ADDONS, getAddon } from "@/lib/addons";
import { Header } from "@/components/Header";
import { YouTubeModal } from "@/components/YouTubeModal";
import { useFavorites, useViewCount } from "@/lib/favorites";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/addon/$id")({
  loader: ({ params }) => {
    const addon = getAddon(params.id);
    if (!addon) throw notFound();
    return { addon };
  },
  head: ({ loaderData, params }) => {
    const a = loaderData?.addon;
    if (!a) return { meta: [{ title: "Add-on — Mine Addons News" }] };
    const url = `${SITE_URL}/addon/${params.id}`;
    return {
      meta: [
        { title: `${a.title} — Mine Addons News` },
        { name: "description", content: a.short },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.short },
        { property: "og:image", content: a.image },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: a.title },
        { name: "twitter:description", content: a.short },
        { name: "twitter:image", content: a.image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: a.title,
            description: a.description,
            applicationCategory: "GameApplication",
            operatingSystem: "Minecraft Bedrock",
            image: a.image,
            url,
            softwareVersion: a.version,
            datePublished: a.date,
            author: { "@type": "Person", name: a.author },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: a.rating,
              ratingCount: Math.max(1, a.downloads || 1),
              bestRating: 5,
              worstRating: 0,
            },
            offers: { "@type": "Offer", price: "0", priceCurrency: "BRL", url: a.downloadUrl },
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <>
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <FileBox className="size-16 mx-auto mb-4" />
        <h1 className="font-display text-7xl mb-4">404</h1>
        <p className="text-muted-foreground mb-6">Add-on não encontrado.</p>
        <Link to="/" className="inline-flex items-center gap-2 brut px-4 py-2 brut-press">
          <ArrowLeft className="size-4" /> Voltar
        </Link>
      </div>
    </>
  ),
  errorComponent: ({ error }) => (
    <>
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-destructive">{error.message}</p>
      </div>
    </>
  ),
  component: AddonPage,
});

function AddonPage() {
  const { addon } = Route.useLoaderData();
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const { isFav, toggle } = useFavorites();
  const { count, bump } = useViewCount(addon.id);
  const fav = isFav(addon.id);

  return (
    <>
      <Header />
      <article className="mx-auto max-w-5xl px-4 py-8 relative">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-orange mb-6">
          <ArrowLeft className="size-4" /> Voltar
        </Link>

        {/* HERO */}
        <div className="relative brut overflow-hidden aspect-[21/9] mb-6 p-0">
          <img src={addon.image} alt={addon.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-paper">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="brut-tag brut-tag-accent"><Tag className="size-3" /> {addon.category}</span>
              <span className="brut-tag bg-paper"><Hash className="size-3" /> v{addon.version}</span>
              <span className="brut-tag bg-paper"><User className="size-3" /> {addon.author}</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.9] tracking-tight">{addon.title}</h1>
            <p className="mt-3 max-w-2xl text-paper/80 text-base md:text-lg">{addon.short}</p>
          </div>
        </div>

        {/* MEGA DOWNLOAD CTA */}
        <div className="brut p-6 md:p-8 mb-8 bg-orange relative overflow-hidden">
          <div className="absolute -top-10 -right-10 size-40 rounded-full border-[3px] border-ink bg-paper opacity-30" />
          <div className="relative flex flex-col md:flex-row gap-6 items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 brut-tag bg-ink text-paper">
                <Sparkles className="size-3" /> Pronto pra jogar
              </div>
              <div className="font-display text-4xl md:text-5xl mt-2 tracking-tight">BAIXA AGORA</div>
              <div className="text-sm font-mono mt-2 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1"><Download className="size-3.5" /> {addon.downloads.toLocaleString()}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Star className="size-3.5 fill-ink" /> {addon.rating.toFixed(1)}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Eye className="size-3.5" /> {count} clique(s)</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href={addon.downloadUrl}
                target="_blank"
                rel="noreferrer"
                onClick={bump}
                className="btn-download mega"
                aria-label={`Download ${addon.title}`}
              >
                <Download className="size-7" strokeWidth={3} /> Download
              </a>
              <button
                onClick={() => toggle(addon.id)}
                className={`size-14 rounded-md border-[3px] border-ink grid place-items-center transition ${
                  fav ? "bg-ink" : "bg-paper"
                }`}
                style={{ boxShadow: "6px 6px 0 0 var(--ink)" }}
                aria-label={fav ? "Remover dos favoritos" : "Salvar"}
              >
                <Heart className={`size-6 ${fav ? "fill-orange text-orange" : ""}`} strokeWidth={2.5} />
              </button>
              {addon.youtubeId && (
                <button
                  onClick={() => setTutorialOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md border-[3px] border-ink bg-paper font-display text-lg uppercase brut-press"
                  style={{ boxShadow: "6px 6px 0 0 var(--ink)" }}
                >
                  <Play className="size-5 fill-ink" /> Tutorial
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Meta cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Meta icon={<Star className="size-4" />} label="Avaliação" value={`${addon.rating.toFixed(1)} / 5`} accent="lime" />
          <Meta icon={<Download className="size-4" />} label="Downloads" value={addon.downloads.toLocaleString()} />
          <Meta icon={<Calendar className="size-4" />} label="Atualizado" value={new Date(addon.date).toLocaleDateString("pt-BR")} />
          <Meta icon={<User className="size-4" />} label="Autor" value={addon.author} accent="violet" />
        </div>

        {/* Description */}
        <section className="brut p-6 md:p-8 mb-8">
          <h2 className="font-display text-3xl md:text-4xl mb-4 flex items-center gap-3">
            <span className="size-10 rounded-md bg-orange border-2 border-ink grid place-items-center">
              <BookOpen className="size-5" />
            </span>
            Descrição
          </h2>
          <p className="text-foreground/85 leading-relaxed whitespace-pre-line">{addon.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {addon.tags.map((t: string) => (
              <span key={t} className="brut-tag">
                <Tag className="size-3" /> {t}
              </span>
            ))}
          </div>
        </section>

        {/* Tutorial steps */}
        <section className="brut p-6 md:p-8 mb-8 bg-secondary">
          <h2 className="font-display text-3xl md:text-4xl mb-5 flex items-center gap-3">
            <span className="size-10 rounded-md bg-violet text-paper border-2 border-ink grid place-items-center">
              <ListOrdered className="size-5" />
            </span>
            Como instalar
          </h2>
          <ol className="space-y-3">
            {[
              "Clique em DOWNLOAD acima e salve o arquivo .mcaddon / .mcpack.",
              "Abra o arquivo — o Minecraft importa automaticamente.",
              "Crie ou edite um mundo e ative o pacote em Recursos / Comportamento.",
              'Ative "Experimentos" se o add-on pedir.',
              "Entre no mundo. Pronto.",
            ].map((s, i) => (
              <li key={i} className="flex gap-4 items-start brut bg-paper p-3">
                <span className="size-9 shrink-0 rounded-md bg-orange border-2 border-ink font-display text-lg grid place-items-center">
                  {i + 1}
                </span>
                <span className="pt-1.5">{s}</span>
              </li>
            ))}
          </ol>
          {addon.youtubeId && (
            <button
              onClick={() => setTutorialOpen(true)}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 brut bg-ink text-paper font-bold uppercase tracking-wider text-sm brut-press"
            >
              <Play className="size-4 fill-paper" /> Ver vídeo tutorial
            </button>
          )}
        </section>

        <div className="text-center pb-16">
          <a
            href={addon.downloadUrl}
            target="_blank"
            rel="noreferrer"
            onClick={bump}
            className="btn-download mega"
          >
            <Flame className="size-7" /> Baixar {addon.title}
          </a>
        </div>
      </article>

      {tutorialOpen && addon.youtubeId && (
        <YouTubeModal id={addon.youtubeId} onClose={() => setTutorialOpen(false)} />
      )}
    </>
  );
}

function Meta({
  icon, label, value, accent = "paper",
}: { icon: React.ReactNode; label: string; value: string; accent?: "paper" | "lime" | "violet" }) {
  const bg = accent === "lime" ? "bg-lime" : accent === "violet" ? "bg-violet text-paper" : "bg-paper";
  return (
    <div className={`brut px-4 py-3 ${bg}`}>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono">
        {icon}
        {label}
      </div>
      <div className="font-display text-xl mt-1 tracking-tight">{value}</div>
    </div>
  );
}

void ADDONS;
