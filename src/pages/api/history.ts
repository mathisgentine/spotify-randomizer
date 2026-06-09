// pages/api/history.ts
import { addHistory, getHistory } from '@/lib/db';
import type { SpotifyTrack, SpotifyEpisode } from '@/types/spotify';
import { NextApiRequest, NextApiResponse } from 'next';

type HistoryInsertRequest = {
  spotify_user_id: string;
  type: 'track' | 'episode';
  track?: SpotifyTrack;
  episode?: SpotifyEpisode;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { spotify_user_id, type, track, episode }: HistoryInsertRequest = req.body;

    if (!spotify_user_id || (!track && !episode)) {
      return res.status(400).json({ error: 'Invalid request payload' });
    }

    const isTrack = type === 'track';
    const item = isTrack ? track : episode;

    if (!item) {
      return res.status(400).json({ error: 'Track or Episode data required' });
    }

    try {
      // Extract fields
      const historyItem = {
        spotify_user_id,
        created_at: new Date().toISOString(),
        name: item.name,
        artist: isTrack
            ? (item as SpotifyTrack).artists.map(artist => artist.name).join(', ') // Join artist names for track
            : ' ', // To Do : Fetch Show name //
        image: isTrack ? (item as SpotifyTrack).album.images[0].url : (item as SpotifyEpisode).images[0].url,
        type: isTrack ? 'track' : 'episode',
        link: isTrack ? `https://open.spotify.com/track/${(item as SpotifyTrack).id}` : `https://open.spotify.com/episode/${(item as SpotifyEpisode).id}`,
      };

      // Add to history
      addHistory(historyItem);
      return res.status(201).json({ message: 'Item added to history' });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars 
    } catch (error) {
      return res.status(500).json({ error: 'Failed to add item to history' });
    }
  }

  if (req.method === 'GET') {
    const { spotify_user_id } = req.query;
    if (!spotify_user_id) {
      return res.status(400).json({ error: 'spotify_user_id is required' });
    }

    try {
      const history = await getHistory(spotify_user_id as string);
      return res.status(200).json({ history });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch history' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
