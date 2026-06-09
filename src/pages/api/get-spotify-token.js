import { parse } from 'cookie';

export default function handler(req, res) {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.spotify_access_token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No access token' });
  }

  res.status(200).json({ token });
}
