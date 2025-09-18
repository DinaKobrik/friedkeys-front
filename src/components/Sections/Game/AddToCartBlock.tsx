"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/ui/Button";

interface Game {
  id: number | string;
  title?: string;
  price: number;
  discount?: number;
  discountDate?: string;
  image?: string;
}

const AddToCartBlock: React.FC = () => {
  const params = useParams();
  const gameId = params?.id as string;
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      const id = gameId;
      if (!id) return;

      try {
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
    };

    if (gameId) {
      fetchGame();
    }
  }, [gameId]);

  const discountPrice = game?.discount
    ? (game.price * (1 - (game.discount || 0) / 100)).toFixed(2)
    : null;
  const isDiscountExpired = game?.discountDate
    ? new Date(game.discountDate).getTime() < new Date().getTime()
    : false;

  const handleAddToCart = () => {
    if (game) {
      // Логиа добавления в корзину
    }
  };

  if (loading) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-gray-900 p-[16px] sm:p-[24px] z-50 flex items-center justify-between">
        <span>Loading...</span>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-gray-900 p-[16px] sm:p-[24px] z-50 flex items-center justify-between">
        <span>Game not found</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 sm:hidden p-[16px] z-[10000] flex w-full items-center justify-center gap-[16px] bg-main border-primary-main border-t-[1px]">
      <div className="flex flex-shrink-0 gap-[1px] sm:gap-[20px] items-end ">
        {discountPrice &&
        game.discount &&
        game.discount > 0 &&
        !isDiscountExpired ? (
          <div className="flex items-center gap-[16px]">
            <span className="text-white font-usuzi-condensed font-bold text-[18px] leading-[18px] py-[4px] px-[8px] rounded-[2px] bg-sale">
              -{game.discount}%
            </span>
            <div className="flex items-end gap-[2px] flex-col">
              <span className="text-white font-usuzi-condensed text-center w-full font-bold text-[22px] leading-[22px]">
                {discountPrice}$
              </span>
              <span className="line-through font-usuzi-condensed text-gray-68 font-bold text-[18px] leading-[16px]">
                {game.price}$
              </span>
            </div>
          </div>
        ) : (
          <span className="text-white font-usuzi-condensed text-center w-full font-bold text-[22px] leading-[22px]">
            {game.price}$
          </span>
        )}
      </div>
      <div className="max-w-[245px] w-full">
        <Button variant="primary" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default AddToCartBlock;
