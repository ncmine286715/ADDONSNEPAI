export function SkeletonCardList() {
  return (
    <div className="brut p-3 flex gap-4 items-center">
      <div className="size-16 bg-secondary rounded border border-ink shrink-0 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-secondary rounded w-1/3 animate-pulse" />
        <div className="h-3 bg-secondary rounded w-1/2 animate-pulse" />
        <div className="h-3 bg-secondary rounded w-24 animate-pulse" />
      </div>
      <div className="size-9 bg-secondary rounded border-2 border-ink shrink-0 animate-pulse" />
    </div>
  );
}
