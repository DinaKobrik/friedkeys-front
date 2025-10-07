"use client";

import React, { useState, useEffect } from "react";
import Heading from "@/components/ui/Heading";
import GameCard from "@/components/Sections/GameCard";
import { useParams } from "next/navigation";
import { Game } from "@/types/game";

const GameFranchise: React.FC = () => {
  const params = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      const id = params?.id as string;
      if (!id) return;

      try {
        const url = new URL(
          `/api/games?type=game&id=${id}`,
          window.location.origin
        );
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Failed to fetch game");
        const data = await res.json();

        if (Array.isArray(data)) {
          const foundGame = data.find((g) => g.id === Number(id));
          setGame(foundGame || null);
        } else if (data.id) {
          setGame(data);
        } else {
          setGame(null);
        }
      } catch (error) {
        console.error("Failed to fetch game:", error);
        setGame(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [params]);

  if (loading)
    return (
      <Heading variant="h3" aria-live="polite">
        Loading...
      </Heading>
    );

  return (
    <section aria-label="Game Franchise Section">
      <Heading
        variant="h1"
        className="mb-[24px] sm:mb-[40px]"
        aria-label={`${game?.title || "Unknown Game"} Franchise Title`}>
        {game?.title || "Unknown Game"} Franchise
      </Heading>
      <div className="flex overflow-scroll hide-scrollbar w-full gap-[12px] sm:-[16px] lg:gap-x-[24px] mt-[24px] sm:mt-[40px]">
        {game ? (
          <div className="flex-shrink-0 max-w-[175px] sm:min-w-[200px] sm:max-w-[340px] lg:max-w-[520px] w-full">
            <GameCard key={game.id} game={game} />
          </div>
        ) : (
          <p className="text-center text-gray-68" aria-live="polite">
            No game data available...
          </p>
        )}
      </div>
    </section>
  );
};

export default GameFranchise;
