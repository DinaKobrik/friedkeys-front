"use client";

import React, { useState, useEffect } from "react";
import Heading from "@/components/ui/Heading";
import GameCard from "@/components/Sections/GameCard";
import { Game } from "@/types/game";
import Button from "@/components/ui/Button";

const PreOrders = () => {
  const [preOrderGames, setPreOrderGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      const url = new URL("/api/games", window.location.origin);
      const res = await fetch(url.toString());
      if (!res.ok) console.error("Fetch error:", await res.text());
      const data = await res.json();

      // Фильтрация и сортировка по ближайшей дате выхода
      const topPreOrderGames = data
        .filter((game: Game) => game.preOrder && game.releaseDate)
        .sort((a: Game, b: Game) => {
          const aReleaseTime = new Date(a.releaseDate!).getTime();
          const bReleaseTime = new Date(b.releaseDate!).getTime();
          return aReleaseTime - bReleaseTime;
        })
        .slice(0, 6);

      setPreOrderGames(topPreOrderGames);
    };
    fetchGames();
  }, []);

  return (
    <div className="my-[40px] md:my-[120px]">
      <div className="mb-[24px] sm:mb-[40px] flex justify-between items-center">
        <Heading variant="h1">Pre-orders</Heading>
        <Button
          variant="secondary"
          className="max-w-[238px] mr-0 hidden sm:block"
          onClick={() => {
            window.location.href = "/all-games?filter=pre-orders";
          }}>
          see all games
        </Button>
      </div>
      <div className=" w-full flex sm:grid overflow-scroll hide-scrollbar sm:overflow-visible sm:grid-flow-row grid-cols-6 sm:grid-cols-2 lg:grid-cols-3 gap-[12px] sm:gap-[24px]">
        {preOrderGames.length > 0 ? (
          preOrderGames.map((game) => <GameCard key={game.id} game={game} />)
        ) : (
          <p className="text-center text-gray-68">Loading pre-orders...</p>
        )}
      </div>
    </div>
  );
};

export default PreOrders;
