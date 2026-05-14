export function SkeletonCard() {
  return (
    <article className="brut flex flex-col overflow-hidden">
      <div className="aspect-[16/10] bg-secondary border-b-2 border-ink animate-pulse" />
      <div className="p-3 md:p-4 flex-1 flex flex-col gap-3">
        <div className="h-5 md:h-6 bg-secondary rounded w-3/4 animate-pulse" />
        <div className="h-3 md:h-4 bg-secondary rounded w-full animate-pulse" />
        <div className="h-3 md:h-4 bg-secondary rounded w-2/3 animate-pulse" />
        <div className="mt-auto flex justify-between pt-2">
          <div className="h-3 bg-secondary rounded w-16 animate-pulse" />
          <div className="h-3 bg-secondary rounded w-12 animate-pulse" />
        </div>
      </div>
      <div className="px-3 pb-3 md:px-4 md:pb-4">
        <div className="h-9 md:h-10 bg-secondary rounded border-2 border-ink animate-pulse" />
      </div>
    </article>
  );
}
