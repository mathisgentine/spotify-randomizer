// pages/api/spotify-callback.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the authorization code from URL parameters
    const code = req.query.code;
    
    // Get the code verifier from cookies
    const codeVerifier = req.cookies.spotify_code_verifier;

    if (!code || !codeVerifier) {
      return res.status(400).json({ error: 'Missing code or code_verifier' });
    }

    // Exchange the code for access token using PKCE
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify-callback`,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${error}`);
    }

    const tokens = await tokenResponse.json();

    const commonCookieOptions = `HttpOnly; Path=/; SameSite=Lax; Secure=${process.env.NODE_ENV === 'production'}`;
    res.setHeader('Set-Cookie', [
      `spotify_access_token=${tokens.access_token}; ${commonCookieOptions}; Max-Age=${tokens.expires_in}`,
      `spotify_refresh_token=${tokens.refresh_token}; ${commonCookieOptions}; Max-Age=31536000` // 1 year
    ]);

    // Redirect to your dashboard
    res.redirect('/randomize');
  } catch (error) {
    console.error('Spotify callback error:', error);
    res.status(500).json({ error: 'Failed to process Spotify callback' });
  }
}