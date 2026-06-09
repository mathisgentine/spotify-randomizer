// lib/spotify.js
import axios from 'axios';

export async function getSpotifyUserId(accessToken) {
  const response = await axios.get('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.id; // Spotify's unique user_id
}
