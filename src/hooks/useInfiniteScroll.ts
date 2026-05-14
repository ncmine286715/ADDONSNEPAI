import { useEffect, useRef, useState } from "react";

export function useInfiniteScroll<T>(items: T[], perPage = 12) {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPage(1);
    setHasMore(items.length > perPage);
  }, [items.length, perPage]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(p => {
          const next = p + 1;
          if (next * perPage >= items.length) {
            setHasMore(false);
          }
          return next;
        });
      }
    }, { rootMargin: "200px" });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, items.length, perPage]);

  const displayed = items.slice(0, page * perPage);

  return { displayed, loaderRef, hasMore };
}
