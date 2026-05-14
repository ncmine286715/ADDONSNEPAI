import { Link } from "@tanstack/react-router";
import { UserCheck, Boxes } from "lucide-react";
import { ADDONS } from "@/lib/addons";
import { useFollowedAuthors } from "@/hooks/useFollowedAuthors";
import { AddonCard } from "@/components/AddonCard";

export function FollowedAuthorsSection() {
  const { authors } = useFollowedAuthors();
  const addons = ADDONS.filter((a) => authors.has(a.author));
  const accents: Array<"orange" | "lime" | "violet"> = ["orange", "lime", "violet"];

  if (authors.size === 0) return null;

  return (
    <section className="w-full px-4 py-8 md:py-12 border-y-2 border-ink bg-lime/10">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-2 mb-6">
          <UserCheck className="size-6 text-orange" />
          <h2 className="font-display text-2xl md:text-3xl tracking-tight">
            🎯 Dos criadores que você segue
          </h2>
        </div>
        {addons.length === 0 ? (
          <div className="brut py-12 text-center">
            <Boxes className="size-10 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">Nenhum add-on dos criadores seguidos ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {addons.map((a, i) => (
              <AddonCard key={a.id} addon={a} accent={accents[i % accents.length]} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
