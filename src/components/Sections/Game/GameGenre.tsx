"use client";

import React, { useState, useEffect } from "react";
import Heading from "@/components/ui/Heading";
import GameCard from "@/components/Sections/GameCard";
import { useParams } from "next/navigation";
import { Game } from "@/types/game";

const GameGenre: React.FC = () => {
  const params = useParams();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      const id = params?.id as string;
      if (!id) return;

      try {
        const url = new URL("/api/games", window.location.origin);
        const res = await fetch(url.toString());
        if (!res.ok) console.error("Fetch error:", await res.text());
        const data = await res.json();

        const currentGame = data.find((game: Game) => game.id === Number(id));
        if (!currentGame) return;

        const genre = currentGame.genres[0];

        // Фильтруем игры по жанру, исключая предзаказы, и сортируем по рейтингу
        const genreGames = data
          .filter((game: Game) => !game.preOrder && game.genres.includes(genre))
          .sort((a: Game, b: Game) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, 6);

        setGames(genreGames);
      } catch (error) {
        console.error("Failed to fetch games:", error);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [params]);

  if (loading)
    return (
      <Heading variant="h3" aria-live="polite">
        Loading...
      </Heading>
    );

  const genre = games.length > 0 ? games[0].genres[0] : "Unknown Genre";

  return (
    <section role="region" aria-label="Game Genre Section">
      <div className="mb-[24px] sm:mb-[40px]">
        <Heading variant="h1" aria-label={`${genre} Games Title`}>
          {genre}
        </Heading>
      </div>
      <div
        className="w-full grid grid-flow-row grid-cols-2 lg:grid-cols-3 gap-[12px] sm:-[16px] lg:gap-x-[24px] sm:gap-y-[40px]"
        role="list">
        {games.length > 0 ? (
          games.map((game) => <GameCard key={game.id} game={game} />)
        ) : (
          <p className="text-center text-gray-68" aria-live="polite">
            No games available...
          </p>
        )}
      </div>
    </section>
  );
};

export default GameGenre;
