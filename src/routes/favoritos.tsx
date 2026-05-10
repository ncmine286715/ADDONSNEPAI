import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Boxes } from "lucide-react";
import { ADDONS } from "@/lib/addons";
import { Header } from "@/components/Header";
import { AddonCard } from "@/components/AddonCard";
import { useFavorites } from "@/lib/favorites";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Favoritos — Mine Addons News" },
      { name: "description", content: "Seus add-ons salvos." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { ids } = useFavorites();
  const list = ADDONS.filter((a) => ids.has(a.id));

  return (
    <>
      <Header />
      <section className="relative border-b-2 border-ink bg-orange">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="inline-flex items-center gap-2 brut-tag bg-ink text-paper mb-4">
            <Heart className="size-3 fill-paper" /> SUA LISTA
          </div>
          <h1 className="font-display text-6xl md:text-8xl tracking-tighter leading-[0.85]">
            FAVORITOS
          </h1>
          <p className="mt-4 text-ink/80 text-lg">Salvos no seu navegador. {list.length} item(s).</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        {list.length === 0 ? (
          <div className="brut py-24 text-center">
            <Boxes className="size-12 mx-auto mb-3" />
            <div className="font-display text-3xl">Sua lista está vazia</div>
            <p className="mt-2 text-muted-foreground">
              Toque no <Heart className="size-3.5 inline align-middle" /> em qualquer add-on para salvar aqui.
            </p>
            <Link to="/" className="inline-flex mt-6 items-center gap-2 px-4 py-2 brut bg-ink text-paper font-bold uppercase brut-press">
              Explorar add-ons
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {list.map((a) => <AddonCard key={a.id} addon={a} />)}
          </div>
        )}
      </section>
    </>
  );
}
