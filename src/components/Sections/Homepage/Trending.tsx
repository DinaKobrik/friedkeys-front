"use client";

import React, { useState, useEffect } from "react";
import Heading from "@/components/ui/Heading";
import GameCard from "@/components/Sections/GameCard";
import { Game } from "@/types/game";
import Button from "@/components/ui/Button";

const TrendingGames = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      const url = new URL("/api/games", window.location.origin);
      const res = await fetch(url.toString());
      if (!res.ok) console.error("Fetch error:", await res.text());
      const data = await res.json();

      const topGames = data
        .filter((game: Game) => !game.preOrder)
        .sort((a: Game, b: Game) => (b.popularity ?? 0) - (a.popularity ?? 0))
        .slice(0, 6);

      setGames(topGames);
    };
    fetchGames();
  }, []);

  return (
    <section>
      <div className="mb-[24px] sm:mb-[40px] flex justify-between items-center">
        <Heading variant="h1">Trending</Heading>
        <Button
          variant="secondary"
          className="max-w-[238px] mr-[10px] hidden md:block"
          onClick={() => {
            window.location.href = "/all-games?filter=trending";
          }}>
          see all games
        </Button>
      </div>
      <div className="w-full flex sm:grid overflow-scroll hide-scrollbar sm:overflow-visible sm:grid-flow-row sm:grid-cols-2 lg:grid-cols-3 gap-[12px] sm:gap-[24px]">
        {games.length > 0 ? (
          games.map((game) => <GameCard key={game.id} game={game} />)
        ) : (
          <p className="text-gray-68">Loading trending games...</p>
        )}
      </div>
    </section>
  );
};

export default TrendingGames;
