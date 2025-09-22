"use client";

import React, { useState, useEffect } from "react";
import Heading from "@/components/ui/Heading";
import GameWrapper from "@/components/layout/GameWrapper";
import GameCard from "@/components/Sections/GameCard";
import { Game } from "@/types/game";
import Button from "@/components/ui/Button";

const DiscountedGames = () => {
  const [discountedGames, setDiscountedGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      const url = new URL("/api/games", window.location.origin);
      const res = await fetch(url.toString());
      if (!res.ok) console.error("Fetch error:", await res.text());
      const data = await res.json();

      const now = new Date();

      // Фильтрация и сортировка по времени до истечения скидки
      const topDiscountedGames = data
        .filter((game: Game) => {
          const hasDiscount = game.discount && game.discount > 0;
          const isNotPreOrder = !game.preOrder;
          const discountValid = game.discountDate
            ? new Date(game.discountDate).getTime() > now.getTime()
            : false;
          return hasDiscount && isNotPreOrder && discountValid;
        })
        .sort((a: Game, b: Game) => {
          const aTimeLeft = new Date(a.discountDate!).getTime() - now.getTime();
          const bTimeLeft = new Date(b.discountDate!).getTime() - now.getTime();
          return aTimeLeft - bTimeLeft;
        })
        .slice(0, 3);

      setDiscountedGames(topDiscountedGames);
    };
    fetchGames();
  }, []);

  return (
    <section>
      <div className="mb-[24px] sm:mb-[40px] flex justify-between items-center">
        <Heading variant="h1">Sale</Heading>
        <Button
          variant="secondary"
          className="max-w-[238px] mr-[10px] hidden md:block"
          onClick={() => {
            window.location.href = "/all-games?filter=sale";
          }}>
          see all games
        </Button>
      </div>
      <GameWrapper>
        {discountedGames.length > 0 ? (
          discountedGames.map((game) => (
            <GameCard key={game.id} game={game} showSaleTimer={true} />
          ))
        ) : (
          <p className="text-gray-68">Loading discounted games...</p>
        )}
      </GameWrapper>
    </section>
  );
};

export default DiscountedGames;
