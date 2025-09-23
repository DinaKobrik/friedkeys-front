"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";

interface Game {
  id: number;
  title: string;
  image: string;
  price: number;
  discount?: number;
  discountDate?: string;
}

const GameEditionsSection: React.FC = () => {
  const params = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchGame = useCallback(async () => {
    const id = params?.id as string;
    if (!id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/games?type=game&id=${id}`);
      if (!response.ok) throw new Error("Failed to fetch game");
      const data = await response.json();
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
  }, [params]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteGames");
    if (storedFavorites && game) {
      const favoriteIds = JSON.parse(storedFavorites);
      setIsFavorite(favoriteIds.includes(game.id));
    }
  }, [game]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!game) return;

    const storedFavorites = localStorage.getItem("favoriteGames");
    let favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];

    if (isFavorite) {
      favoriteIds = favoriteIds.filter((id: number) => id !== game.id);
    } else {
      favoriteIds.push(game.id);
    }

    localStorage.setItem("favoriteGames", JSON.stringify(favoriteIds));
    setIsFavorite(!isFavorite);

    try {
      const response = await fetch("/api/games", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        await response.json();
      }
    } catch (error) {
      console.error("Failed to fetch updated games:", error);
    }
  };

  if (loading || !game) {
    return (
      <Heading variant="h3" className="text-center py-10" aria-live="polite">
        Loading...
      </Heading>
    );
  }

  const discountPrice = game.discount
    ? (game.price * (1 - game.discount / 100)).toFixed(2)
    : null;
  const isDiscountExpired = game.discountDate
    ? new Date(game.discountDate).getTime() < new Date().getTime()
    : false;

  const editions = [
    {
      type: "Standard",
      price: discountPrice || game.price.toString() + "$",
      advantages: [
        "Base game access",
        "Full single-player campaign",
        "Basic online features",
      ],
    },
    {
      type: "Deluxe",
      price:
        (discountPrice
          ? (Number(discountPrice) + 20).toFixed(2)
          : (game.price + 20).toString()) + "$",
      advantages: [
        "Base game access",
        "Full single-player campaign",
        "Enhanced online features",
        "Exclusive in-game items",
        "Digital soundtrack",
      ],
    },
  ];

  return (
    <section role="region" aria-label="Game Editions Section">
      <Heading
        variant="h1"
        className="mb-[24px] sm:mb-[40px]"
        aria-label="Game Editions Title">
        Game Editions
      </Heading>
      <div className="flex w-full overflow-scroll hide-scrollbar h-full gap-[12px] sm:gap-[24px]">
        {editions.map((edition, index) => (
          <div
            key={index}
            className="flex flex-col relative game__editions-card border-[1px] border-transparent justify-between gap-[8px] flex-shrink-0 w-[268px] sm:w-[400px] lg:w-[520px]"
            role="region"
            aria-label={`${edition.type} Edition Details`}>
            <div
              className="favorite absolute w-[36px] h-[36px] sm:w-[48px] sm:h-[48px] right-[2px] top-[1px] md:right-[4px] md:top-[3px] z-10 flex justify-center items-center cursor-pointer"
              onClick={toggleFavorite}>
              <svg
                width="16.5"
                height="21"
                className="sm:w-[22px] sm:h-[28px]"
                viewBox="0 0 22 28"
                fill={isFavorite ? "#FFFF25" : "none"}
                xmlns="http://www.w3.org/2000/svg"
                onClick={toggleFavorite}>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.9702 1.66669C13.1831 1.66669 8.81716 1.66669 1.03003 1.66669V26.3334L11.0336 21.7394L20.9702 26.3334V1.66669Z"
                  stroke={isFavorite ? "#FFFF25" : "white"}
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </svg>
            </div>
            <div className="card-corner game__editions-img w-[calc(100%-2px)] md:w-[calc(100%-4px)]  h-[200px] sm:h-[280px] relative flex-shrink-0">
              <Image
                src={game.image}
                alt={`${game.title} ${edition.type} Edition`}
                width={520}
                height={280}
                className="object-cover w-full h-full m-[1px] md:m-[3px]"
                loading="lazy"
              />
            </div>
            <div className="bg-2 p-[20px] pb-[32px] h-full flex flex-col justify-between gap-[16px]">
              <div className="mb-[80px]">
                <Heading
                  variant="h3"
                  className="mb-[20px]"
                  aria-label={`${edition.type} Edition`}>
                  {edition.type} Edition
                </Heading>
                <ul className="list-disc pl-[20px]">
                  {edition.advantages.map((advantage, idx) => (
                    <li key={idx} aria-label={`Advantage: ${advantage}`}>
                      <Text>{advantage}</Text>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col w-full items-start gap-[24px]">
                <div className="flex gap-[1px] sm:gap-[20px] w-full items-center lg:items-end justify-between lg:justify-center">
                  {discountPrice &&
                  game.discount &&
                  game.discount > 0 &&
                  !isDiscountExpired ? (
                    <>
                      <div className="flex items-center gap-[4px] lg:gap-[16px] flex-col lg:flex-row">
                        <span className="line-through font-usuzi-condensed text-gray-68 font-bold text-[20px] sm:text-[32px] leading-[16px] sm:leading-[30px]">
                          {game.price}$
                        </span>
                        <span className="text-white font-usuzi-condensed font-bold text-[24px] leading-[22px] sm:text-[32px] py-[4px] px-[8px] md:py-[6px] md:px-[16px] rounded-[2px] bg-sale">
                          -{game.discount}%
                        </span>
                      </div>
                      <span className="text-white font-usuzi-condensed text-center font-bold text-[32px] sm:text-[48px] leading-[28px] sm:leading-[37px]">
                        {discountPrice}$
                      </span>
                    </>
                  ) : (
                    <span className="text-white font-usuzi-condensed text-center w-full font-bold text-[32px] sm:text-[48px] leading-[28px] sm:leading-[37px]">
                      {game.price}$
                    </span>
                  )}
                </div>
                <Button variant="primary" className="max-w-[calc(100%-20px)]">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GameEditionsSection;
