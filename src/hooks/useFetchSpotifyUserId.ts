import { useEffect } from "react";
import useSpotifyUserStore from "@/stores/spotifyUserStore";
import { getSpotifyUserId } from "@/utils/me";

const useFetchSpotifyUserId = () => {
  const { spotifyUserId, setSpotifyUserId } = useSpotifyUserStore();

  useEffect(() => {
    const fetchUserId = async () => {
      if (!spotifyUserId) {
        try {
          // Call the API route to fetch the token
          const response = await fetch("/api/get-spotify-token");
          const data = await response.json();

          if (data.error) {
            console.error("Error fetching token:", data.error);
            return;
          }

          const token = data.token;

          // Fetch and set Spotify User ID in the store
          const userId = await getSpotifyUserId(token);
          setSpotifyUserId(userId);
        } catch (error) {
          console.error("Error fetching Spotify user ID:", error);
        }
      }
    };

    fetchUserId();
  }, [spotifyUserId, setSpotifyUserId]);

  return spotifyUserId;
};

export default useFetchSpotifyUserId;
