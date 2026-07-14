import { create } from "zustand";

interface BrandState {
  /** Seed driving the navbar logo gradient. The home page hero syncs it. */
  seed: string;
  setSeed: (seed: string) => void;
}

export const useBrandStore = create<BrandState>((set) => ({
  seed: Math.random().toString(36).slice(2, 9),
  setSeed: (seed) => set({ seed }),
}));
