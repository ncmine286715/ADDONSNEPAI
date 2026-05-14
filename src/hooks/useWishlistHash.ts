import { useMemo } from "react";

export function encodeWishlist(ids: string[]): string {
  const json = JSON.stringify(ids);
  return btoa(json).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function decodeWishlist(hash: string): string[] {
  try {
    const normalized = hash.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const json = atob(padded);
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function useWishlistUrl(ids: string[]) {
  return useMemo(() => {
    if (ids.length === 0) return "";
    const hash = encodeWishlist(ids);
    return `${window.location.origin}/wishlist/${hash}`;
  }, [ids]);
}
