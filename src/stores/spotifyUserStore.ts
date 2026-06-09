import { create } from "zustand";

interface SpotifyUserState {
  spotifyUserId: string | null;
  setSpotifyUserId: (id: string | null) => void;
}

const useSpotifyUserStore = create<SpotifyUserState>((set) => ({
  spotifyUserId: null,
  setSpotifyUserId: (id) => set({ spotifyUserId: id }),
}));

export default useSpotifyUserStore;