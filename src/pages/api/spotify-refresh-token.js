export default async function handler(req, res) {
    const refreshToken = req.cookies.spotify_refresh_token;
  
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token is missing' });
    }
  
    try {
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.SPOTIFY_CLIENT_ID,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      });
  
      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        throw new Error(`Token refresh failed: ${error}`);
      }
  
      const tokens = await tokenResponse.json();
  
      const commonCookieOptions = `HttpOnly; Path=/; SameSite=Lax; Secure=${process.env.NODE_ENV === 'production'}`;
      res.setHeader('Set-Cookie', [
        `spotify_access_token=${tokens.access_token}; ${commonCookieOptions}; Max-Age=${tokens.expires_in}`,
        `spotify_refresh_token=${tokens.refresh_token}; ${commonCookieOptions}; Max-Age=31536000` // 1 year
      ]);
  
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({ error: 'Failed to refresh token' });
    }
  }
  