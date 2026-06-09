import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import useFetchSpotifyUserId from "@/hooks/useFetchSpotifyUserId";
import { HistoryItem }from "@/lib/db";
import { Button } from "@/components/ui/button"; 
import { Badge } from "@/components/ui/badge";


const History = () => {
  const spotifyUserId = useFetchSpotifyUserId();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (spotifyUserId) {
        setLoading(true); // Set loading to true when starting the request
        try {
          const response = await axios.get(`/api/history`, {
            params: { spotify_user_id: spotifyUserId },
          });
          setHistory(response.data.history);
        } catch (error) {
          console.error("Error fetching history:", error);
        } finally {
          setLoading(false); // Set loading to false after request completes
        }
      }
    };

    fetchHistory();
  }, [spotifyUserId]);

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return ''; 

    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className="mx-auto max-w-lg">
      {loading ? (
        <p className="text-center text-gray-600">Loading history...</p> // Show loading message while fetching
      ) : history.length ? (
        <Carousel className="w-full">
          <CarouselContent>
            {history.map((item, index) => (
              <CarouselItem key={index}>
                <div className="p-2">
                  <Card className="shadow-md">
                    <CardContent className="flex flex-col items-center p-4">
                    {/* Badge showing whether it's a Song or Podcast */}
                    <Badge variant={"secondary"} className="mb-4" // Adjust margin as needed
                    >
                      {item.type === "track" ? "Song" : "Podcast"}
                    </Badge>
                    
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={300}
                        height={300}
                        className="rounded-lg"
                      />
                      <h2 className="mt-4 text-lg font-medium">
                        {truncateText(item.name, 30)} {/* Truncate if name is too long */}
                      </h2>
                      {/* Display artists for track, or podcast name for episode */}
                      {item.type === "track" ? (
                        <p className="mt-2 text-sm text-gray-600">
                          {truncateText(item.artist, 30)} {/* Truncate if artist name is too long */}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-gray-600">
                          {truncateText(item.artist, 30)} {/* Truncate if podcast name is too long */}
                        </p>
                      )}

                      {/* Spotify Button with logo */}
                      <Button
                      className="mt-4 items-center justify-center"
                      onClick={() => window.open(item.link, "_blank")}
                    >
                      <Image 
                        src="/Spotify_logo_without_text.svg" 
                        alt="Spotify logo"
                        width={24}
                        height={24}
                        className="w-5 h-5 mr-2" 
                      />
                      Play on Spotify
                    </Button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <p className="text-center text-gray-600">No history available</p>
      )}
    </div>
  );
};

export default History;