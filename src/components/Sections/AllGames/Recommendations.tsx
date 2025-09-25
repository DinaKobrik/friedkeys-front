"use client";

import React, { useState, useEffect } from "react";
import Heading from "@/components/ui/Heading";
import GameWrapper from "@/components/layout/GameWrapper";
import GameCard from "../GameCard";
import { Game } from "@/types/game";

const Recommendations = () => {
  const [recommendedGames, setRecommendedGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      const url = new URL("/api/games", window.location.origin);
      const res = await fetch(url.toString());
      if (!res.ok) console.error("Fetch error:", await res.text());
      const data = await res.json();

      // Сортировка по количеству отзывов и выбор топ-3, исключая предзаказы
      const topGames = data
        .filter((game: Game) => !game.preOrder && game.reviews)
        .sort((a: Game, b: Game) => (b.reviews || 0) - (a.reviews || 0))
        .slice(0, 3);
      setRecommendedGames(topGames);
    };
    fetchGames();
  }, []);

  return (
    <section>
      <Heading variant="h1">Recommendations</Heading>
      <GameWrapper>
        {recommendedGames.length > 0 ? (
          recommendedGames.map((game) => (
            <div
              key={game.id}
              className="flex-shrink-0 max-w-[175px] sm:min-w-[200px] sm:max-w-[340px] lg:max-w-[520px] w-full">
              <GameCard key={game.id} game={game} />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-68">Loading recommendations...</p>
        )}
      </GameWrapper>
    </section>
  );
};

export default Recommendations;
