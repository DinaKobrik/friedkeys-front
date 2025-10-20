"use client";

import React, { useState, useEffect } from "react";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import GameCard from "@/components/Sections/GameCard";
import { Game } from "@/types/game";

const NewGames = () => {
  const [newGames, setNewGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      const url = new URL("/api/games", window.location.origin);
      const res = await fetch(url.toString());
      if (!res.ok) console.error("Fetch error:", await res.text());
      const data = await res.json();

      // Сортировка по дате выпуска и выбор топ-4, исключая предзаказы
      const latestGames = data
        .filter((game: Game) => !game.preOrder && game.releaseDate)
        .sort((a: Game, b: Game) => {
          return (
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
          );
        })
        .slice(0, 4);
      setNewGames(latestGames);
    };
    fetchGames();
  }, []);

  return (
    <section
      className="max-w-[1400px] w-full mx-auto"
      aria-label="New Games Section">
      <div className="mb-[24px] sm:mb-[40px] flex justify-between items-center">
        <Heading variant="h1" aria-label="New Games Title">
          new
        </Heading>
        <Button
          variant="secondary"
          className="max-w-[238px] mr-[10px] hidden md:block"
          onClick={() => {
            window.location.href = "/all-games";
          }}
          aria-label="View all games">
          see all games
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] sm:gap-[16px] lg:gap-[24px]">
        {newGames.length > 0 ? (
          newGames.map((game) => <GameCard key={game.id} game={game} />)
        ) : (
          <p className="text-gray-68" aria-live="polite">
            Loading new games...
          </p>
        )}
      </div>
    </section>
  );
};

export default NewGames;
