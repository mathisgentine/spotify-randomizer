import React, { useState } from "react";
import axios from "axios";
import { SpotifyTrack, SpotifyEpisode } from "../types/spotify";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComboboxMarket } from "@/components/ui/market-combobox";
import { markets } from "@/utils/market";
import { useRouter } from 'next/router';
import useFetchSpotifyUserId from "@/hooks/useFetchSpotifyUserId";
import useAppState from "@/stores/appStateStore";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";



const Randomizer: React.FC = () => {
  const [randomItem, setRandomItem] = useState<SpotifyTrack | SpotifyEpisode | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [iframeContent, setIframeContent] = useState<string>(""); // Manages the iframe content
  const router = useRouter();
  const spotifyUserId = useFetchSpotifyUserId();
  const { selectedMarket, setSelectedMarket, isPodcast, setIsPodcast } = useAppState();
  

  const handleTabsChange = (value: string) => {
    setIsPodcast(value === "podcast");
  };

  const handleRedirectToHistory = () => {
    router.push('/history');
  };

  const fetchRandomItem = async () => {
    setLoading(true);
    setRandomItem(null);
    setErrorMessage(null); // Reset the error message when a new request is made

    try {

      const apiSelectedMarket = markets.find((market) => market.label === selectedMarket)?.value;
      const type = isPodcast ? "episode" : "track";
      const response = await axios.get<SpotifyTrack | SpotifyEpisode>(`/api/random?market=${apiSelectedMarket}&type=${type}`);

      if (response.data) {
        setRandomItem(response.data);
        setIframeContent(
          isPodcast 
            ? "https://open.spotify.com/embed/episode/" 
            : "https://open.spotify.com/embed/track/"
        );
      } else {
        setErrorMessage("No luck! Try again"); // No tracks found, specific error message
      }

      // Insert into DB
      try {
        const payload = {
          spotify_user_id: spotifyUserId,
          type: type,
          ...(type === "track" ? { track: response.data } : { episode: response.data }),
        };
        await axios.post('/api/history', payload);
      } catch (error) {
        console.error('Error fetching random item or inserting into history:', error);
      }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
        setErrorMessage("Error fetching data. Please try again later."); // For network or unexpected errors
    } finally {
      setLoading(false); // Ensure that loading state is always reset
    }
};

return (
  <div className="flex flex-col bg-gradient-to-r from-purple-500 to-indigo-500">
  
  {/* Tabs - Top section */}
  <Tabs defaultValue={isPodcast ? "podcast" : "song"} onValueChange={handleTabsChange} className="w-full p-4 bg-white">
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="song">Song</TabsTrigger>
      <TabsTrigger value="podcast">Podcast</TabsTrigger>
    </TabsList>
  </Tabs>

  {/* Navbar - Below Tabs */}
  <div className="flex items-center justify-start p-4 space-x-4 bg-white">
    <ComboboxMarket
      selectedMarket={selectedMarket}
      onSelectMarket={(market) => setSelectedMarket(market)}
    />
    
    <Button
      type="submit"
      onClick={fetchRandomItem}
      className="w-auto"
      disabled={!selectedMarket || loading}
    >
      {loading ? "Loading..." : "Randomize"}
    </Button>
    </div>

    {/* Main content below the navbar */}
    <div className="flex-grow flex items-center p-4 justify-center">
      {/* The iframe will take up most of the space here */}
      {randomItem ? (
        <iframe
          src={`${iframeContent}/${randomItem.id}`}
          width="100%"   // Adjust width to be responsive
          height="352"   // Large height for the iframe
          allow="encrypted-media"
          className="rounded-lg"
        ></iframe>
      ) : (
        <div className="text-white text-center relative">
        {errorMessage && (
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="mt-4 text-red-500 font-semibold text-center cursor-pointer">
                <p>{errorMessage}</p>
              </div>
            </HoverCardTrigger>
            <HoverCardContent 
              side="bottom" 
              align="center" 
              className="hover:backdrop-opacity-100 text-white p-4 rounded-md shadow-lg border border-gray-700"
            >
              <p className="text-sm">
                Parameters are set randomly. Some combinations might unfortunately lead to no results.
              </p>
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
      )}
    </div>

    {/* Button to navigate to /history */}
    <div className="flex justify-center p-4">
        <Button onClick={handleRedirectToHistory} className="w-auto">
          See History
        </Button>
    </div>

  </div>
  )
};

export default Randomizer;
