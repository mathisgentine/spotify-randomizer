import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { SpotifyTrack, SpotifyEpisode } from "../../types/spotify";
import { SPOTIFY_GENRES } from "../../utils/genres";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    const { market, type } = req.query;
    const { spotify_access_token } = req.cookies;

    // Generate the random variables
    const randomOffset = Math.floor(Math.random() * 1000);
    const randomChoice = Math.floor(Math.random() * 50);
    
    const randomYearStart = type === "episode"
      ? Math.floor(Math.random() * (2024 - 2000 + 1)) + 2000 // 2000–2025
      : Math.floor(Math.random() * (2024 - 1950 + 1)) + 1950; // 1950–2025

    const randomYearEnd = type === "episode"
      ? randomYearStart + Math.floor(Math.random() * (2025 - randomYearStart + 1)) // End within 2025
      : randomYearStart + Math.floor(Math.random() * Math.min(10, 2025 - randomYearStart + 1)); // Up to 10 years

    const randomYearRange = `${randomYearStart}-${randomYearEnd}`;
    const randomGenre = SPOTIFY_GENRES[Math.floor(Math.random() * SPOTIFY_GENRES.length)];

    const includeGenre = Math.random() < 0.2;

    const query = type === "track"
      ? `year:${randomYearRange} ${includeGenre ? `genre:${randomGenre}` : ''}`
      : `year:${randomYearStart}`; // Episodes use a single year
    
    // Fetch playlists from the chosen category
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${query}&type=${type}&market=${market}&limit=50&offset=${randomOffset}`,
      {
        headers: {
          Authorization: `Bearer ${spotify_access_token}`,
        },
      }
    );

    // Extract the items based on the type
  const items = type === "episode" 
    ? response.data?.episodes?.items as SpotifyEpisode[] 
    : response.data?.tracks?.items as SpotifyTrack[];

  if (!items || items.length === 0) {
  return res.status(200).json(null);
  }

  // Select a random item amongst the 50 returned choices
  const randomItem = items[randomChoice];

  // Ensure the response object matches the expected type
  if (type === "episode") {
    const randomEpisode: SpotifyEpisode = randomItem as SpotifyEpisode;
    return res.status(200).json(randomEpisode);
  } else {
    const randomTrack: SpotifyTrack = randomItem as SpotifyTrack;
    return res.status(200).json(randomTrack);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
}