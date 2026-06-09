export interface SpotifyTrack {
  id: string;
  name: string;
  album: {
    id: string;
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  artists: { id: string; name: string }[];
  href: string;
  preview_url?: string; // Optional preview URL
}

export interface SpotifyEpisode {
  id: string;
  name: string;
  images: { url: string; width: number; height: number }[];
  description: string;
  href: string;
}
