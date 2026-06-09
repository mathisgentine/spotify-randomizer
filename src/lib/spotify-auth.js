const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  }
  
const sha256 = async (buffer) => {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(buffer));
    return new Uint8Array(digest);
  };

const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}
  
export const generateSpotifyAuthURL = async ({ clientId, redirectUri, scopes }) => {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = base64encode(await sha256(codeVerifier));

  const callbackURL = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scopes.join(" "),
    redirect_uri: redirectUri,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  })}`;

  return { callbackURL, codeVerifier };
};