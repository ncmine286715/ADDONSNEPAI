import { createFileRoute } from "@tanstack/react-router";
import { Crown, Boxes } from "lucide-react";
import { ADDONS } from "@/lib/addons";
import { Header } from "@/components/Header";
import { AddonCard } from "@/components/AddonCard";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/ncmine")({
  head: () => {
    const list = ADDONS.filter((a) => a.category === "ncmine");
    const url = `${SITE_URL}/ncmine`;
    return {
      meta: [
        { title: "NCMine — Coleção exclusiva | Mine Addons News" },
        { name: "description", content: "Coleção curada NCMine. Add-ons da família NCMine, com qualidade verificada." },
        { property: "og:title", content: "NCMine — Coleção exclusiva" },
        { property: "og:description", content: "Add-ons da família NCMine, curadoria direta." },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "NCMine — Coleção exclusiva",
            url,
            hasPart: list.map((a) => ({
              "@type": "SoftwareApplication",
              name: a.title,
              url: `${SITE_URL}/addon/${a.id}`,
              image: a.image,
              applicationCategory: "GameApplication",
            })),
          }),
        },
      ],
    };
  },
  component: NCMinePage,
});

function NCMinePage() {
  const list = ADDONS.filter((a) => a.category === "ncmine");

  return (
    <>
      <Header />
      <section className="relative overflow-hidden border-b-2 border-ink bg-violet text-paper">
        <div className="absolute inset-0 card-grid-bg opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="inline-flex items-center gap-2 brut-tag bg-paper text-ink mb-5">
            <Crown className="size-3" /> CLASSE EXCLUSIVA
          </div>
          <h1 className="font-display text-6xl md:text-[8rem] tracking-tighter leading-[0.85]">
            NCMINE
          </h1>
          <p className="mt-5 max-w-xl text-paper/80 text-lg">
            Coleção curada. Apenas add-ons da família NCMine — verificados, atualizados, direto.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        {list.length === 0 ? (
          <div className="brut py-24 text-center">
            <Boxes className="size-12 mx-auto mb-3" />
            <div className="font-display text-3xl">Nenhum add-on NCMine ainda</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {list.map((a) => (
              <AddonCard key={a.id} addon={a} accent="violet" />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
