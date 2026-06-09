import { create } from "zustand";

type AppState = {
  selectedMarket: string | null;
  setSelectedMarket: (market: string | null) => void;
  isPodcast: boolean;
  setIsPodcast: (value: boolean) => void;
};

const useAppState = create<AppState>((set) => ({
  selectedMarket: null,
  setSelectedMarket: (market) => set({ selectedMarket: market }),
  isPodcast: false,
  setIsPodcast: (value) => set({ isPodcast: value }),
}));

export default useAppState;
