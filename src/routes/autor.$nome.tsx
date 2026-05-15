import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, User, Boxes } from "lucide-react";
import { ADDONS } from "@/lib/addons";
import { AddonCard } from "@/components/AddonCard";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/autor/$nome")({
  component: AuthorPage,
});

function AuthorPage() {
  const { nome } = Route.useParams();
  const decoded = decodeURIComponent(nome);
  const authorAddons = ADDONS.filter((a) => a.author.toLowerCase() === decoded.toLowerCase());
  const accents: Array<<"orange" | "lime" | "violet"> = ["orange", "lime", "violet"];

  return (
    <div className="w-full overflow-x-hidden">
      <Header />
      <section className="w-full px-4 py-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 text-sm font-bold uppercase tracking-wider hover:text-orange transition"
          >
            <ArrowLeft className="size-4" /> Voltar
          </Link>

          <div className="brut p-5 md:p-8 bg-secondary/30 mb-10 border-2 border-ink shadow-[6px_6px_0_0_var(--ink)] flex items-center gap-4 md:gap-5">
            <div className="size-14 md:size-16 bg-orange border-2 border-ink grid place-items-center shadow-[3px_3px_0_0_var(--ink)] shrink-0">
              <User className="size-7 md:size-8" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-5xl tracking-tight">{decoded}</h1>
              <p className="text-xs md:text-sm text-muted-foreground font-mono mt-1">
                {authorAddons.length} add-on{authorAddons.length !== 1 ? "s" : ""} publicado{authorAddons.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {authorAddons.length === 0 ? (
            <div className="brut py-20 text-center border-2 border-ink bg-paper shadow-[4px_4px_0_0_var(--ink)]">
              <Boxes className="size-12 mx-auto mb-4 opacity-40" />
              <div className="font-display text-2xl">Nenhum add-on encontrado</div>
              <p className="text-muted-foreground text-sm mt-2">Esse autor ainda não publicou nada por aqui.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {authorAddons.map((a, i) => (
                <AddonCard key={a.id} addon={a} accent={accents[i % accents.length]} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}