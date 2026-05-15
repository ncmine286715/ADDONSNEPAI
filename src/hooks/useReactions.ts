import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "man.reactions.v1";
export type ReactionType = "❤️" | "🔥" | "😍" | "💩";

export function useReactions(addonId: string) {
  const [counts, setCounts] = useState<<Record<<ReactionType, number>>({ "❤️": 0, "🔥": 0, "😍": 0, "💩": 0 });
  const [userReaction, setUserReaction] = useState<<ReactionType | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: Record<string, { counts: Record<<ReactionType, number>; user?: ReactionType }> = raw ? JSON.parse(raw) : {};
    const data = all[addonId] || { counts: { "❤️": 0, "🔥": 0, "😍": 0, "💩": 0 } };
    setCounts(data.counts);
    setUserReaction(data.user || null);
  }, [addonId]);

  const react = useCallback((type: ReactionType) => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: Record<string, { counts: Record<<ReactionType, number>; user?: ReactionType }> = raw ? JSON.parse(raw) : {};
    const data = all[addonId] || { counts: { "❤️": 0, "🔥": 0, "😍": 0, "💩": 0 } };
    
    if (data.user === type) {
      data.counts[type] = Math.max(0, (data.counts[type] || 0) - 1);
      data.user = undefined;
    } else {
      if (data.user) data.counts[data.user] = Math.max(0, (data.counts[data.user] || 0) - 1);
      data.counts[type] = (data.counts[type] || 0) + 1;
      data.user = type;
    }
    
    all[addonId] = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    setCounts({ ...data.counts });
    setUserReaction(data.user || null);
  }, [addonId]);

  return { counts, userReaction, react };
}