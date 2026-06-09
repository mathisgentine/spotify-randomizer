import { generateSpotifyAuthURL } from "@/lib/spotify-auth";

export default async function handler(req, res) {
  const { callbackURL, codeVerifier } = await generateSpotifyAuthURL({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify-callback`,
    scopes: ["user-read-private"],
  });

  // Set code verifier in an HTTP-only cookie
  res.setHeader('Set-Cookie', [
    `spotify_code_verifier=${codeVerifier}; `+
    `HttpOnly; `+
    `Path=/; `+
    `SameSite=Lax; `+
    `Secure=${process.env.NODE_ENV === 'production'}; `+
    `Max-Age=3600`  // Cookie expires in 1 hour
  ]);

  // Redirect to Spotify auth URL
  res.redirect(callbackURL);
}
