import { useCallback, useEffect, useState } from "react";

const REACTIONS_KEY = "man.reactions.v1";

type ReactionType = "❤️" | "🔥" | "😍" | "💩";

interface ReactionState {
  [addonId: string]: {
    [reaction in ReactionType]?: number;
  };
}

function readReactions(): ReactionState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(REACTIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeReactions(state: ReactionState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REACTIONS_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("reactions:change"));
}

export function useReactions() {
  const [state, setState] = useState<ReactionState>({});

  useEffect(() => {
    setState(readReactions());
    const sync = () => setState(readReactions());
    window.addEventListener("reactions:change", sync);
    return () => window.removeEventListener("reactions:change", sync);
  }, []);

  const react = useCallback((addonId: string, reaction: ReactionType) => {
    const current = readReactions();
    if (!current[addonId]) current[addonId] = {};
    current[addonId][reaction] = (current[addonId][reaction] ?? 0) + 1;
    writeReactions(current);
    setState({ ...current });
  }, []);

  const getReactionCount = useCallback((addonId: string, reaction: ReactionType) => {
    return state[addonId]?.[reaction] ?? 0;
  }, [state]);

  return { react, getReactionCount, state };
}