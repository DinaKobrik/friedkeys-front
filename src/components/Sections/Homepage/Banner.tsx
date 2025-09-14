"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Game } from "@/types/game";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";

const Banner: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedVariant] = useState(5); // Варианты баннеров игр со скидкой

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("/api/games?type=game");
        const data = await response.json();
        if (Array.isArray(data)) {
          setGames(data);
        } else {
          console.warn("Invalid games data format from API");
        }
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
    };

    fetchGames();
  }, []);

  // Выбираем игру по id
  const game = games.find((g) => g.id === 5) || {
    image: "",
    price: 0,
    discount: 0,
    discountDate: "",
    title: "Unknown Game",
  };
  const now = new Date();
  const isDiscountExpired =
    !game.discountDate ||
    new Date(game.discountDate).getTime() <= now.getTime();
  const discountPrice =
    game.discount && game.discount > 0 && !isDiscountExpired
      ? game.price * (1 - game.discount / 100)
      : null;

  // Старая цена
  const PriceOriginalBlock = (
    <div className="skew-x-[-20deg] border-[1px] border-primary-main rounded-[2px] flex justify-center items-center w-full md:w-auto">
      <Heading
        variant="h3"
        className="skew-x-[20deg] h-[50px] py-[10px] sm:py-[12px] px-[30px] line-through hidden sm:block">
        {game.price}$
      </Heading>
      <Heading
        variant="h2"
        className="skew-x-[20deg] h-[42px] py-[10px] sm:py-[12px] px-[12px] line-through sm:hidden">
        {game.price}$
      </Heading>
    </div>
  );
  // Скидка
  const DiscountBadgeBlock = (
    <div className="skew-x-[-20deg] bg-sale rounded-[2px] flex justify-center items-center w-full md:w-auto">
      <Heading
        variant="h3"
        className="skew-x-[20deg] h-[52px] py-[10px] sm:py-[12px] px-[22px] md:px-[30px] hidden sm:block">
        -{game.discount}%
      </Heading>
      <Heading
        variant="h2"
        className="skew-x-[20deg] py-[10px] sm:py-[12px] h-[42px] px-[12px] xs:px-[20px] sm:hidden ">
        -{game.discount}%
      </Heading>
    </div>
  );

  const renderPriceBlock = () => {
    return (
      <div
        className={`sm:absolute z-50 bottom-[0] sm:bottom-[20%] left-[6px] sm:left-[46px] xl:left-[130px] ${
          discountPrice === null
            ? "bodyCustom:left-[237px]"
            : "bodyCustom:left-[157px]"
        } max-w-[calc(100%-32px)] sm:max-w-[calc(100%-46px)] w-full xl:max-w-[800px] mx-auto`}>
        {game.discount && game.discount > 0 && !isDiscountExpired ? (
          <>
            {selectedVariant === 1 && (
              <div className="md:h-[52px] banner-grid w-full items-start justify-items-start gap-[8px] mx-auto ml-[10px]">
                {PriceOriginalBlock}
                <div className="skew-x-[-20deg] border-[1px] border-primary-main rounded-[2px] h-full flex justify-center items-center w-full">
                  <span className="skew-x-[20deg] text-white font-usuzi-condensed text-[24px] leading-[22px] sm:text-[38px] sm:leading-[29px] py-[12px] px-[30px] h-[42px] sm:h-[50px]">
                    {discountPrice?.toFixed(2)}$
                  </span>
                </div>
                {DiscountBadgeBlock}
                <Button
                  variant="primary"
                  className="w-full lg:w-[360px] ml-0 whitespace-nowrap">
                  Add to cart
                </Button>
              </div>
            )}
            {selectedVariant === 2 && (
              <div className=" sm:max-w-[520px] w-full mx-auto ml-[10px]">
                <Heading
                  variant="h1"
                  className="text-center mb-[6px] hidden sm:block">
                  {discountPrice?.toFixed(2)}$
                </Heading>
                <span className="block sm:hidden text-center text-white font-usuzi text-[32px] leading-[26px] mb-[8px]">
                  {discountPrice?.toFixed(2)}$
                </span>
                <div className="h-[42px] sm:h-[52px] flex w-full items-center gap-[8px]">
                  {PriceOriginalBlock}
                  {DiscountBadgeBlock}
                  <Button
                    variant="primary"
                    className="sm:max-w-[216px] ml-0 whitespace-nowrap">
                    Add to cart
                  </Button>
                </div>
              </div>
            )}
            {selectedVariant === 3 && (
              <div className="flex flex-col gap-[8px] w-full max-w-[520px] mx-auto ml-[10px]">
                <div className="h-[42px] sm:h-[52px] flex w-full items-center gap-[8px]">
                  {PriceOriginalBlock}
                  {DiscountBadgeBlock}
                  <div className="skew-x-[-20deg] border-[1px] border-primary-main rounded-[2px] h-full flex justify-center items-center w-full">
                    <span className="skew-x-[20deg] text-white font-usuzi-condensed text-[20px] leading-[24px] sm:text-[38px] sm:leading-[29px] py-[12px] px-[18px] sm:px-[30px]">
                      {discountPrice?.toFixed(2)}$
                    </span>
                  </div>
                </div>
                <Button variant="primary">Add to cart</Button>
              </div>
            )}
            {selectedVariant === 4 && (
              <div className="sm:max-w-[383px] flex flex-col w-full gap-[8px] sm:gap-[16px] ml-[10px] sm:ml-0">
                <div className="grid grid-cols-2 lg:flex justify-between gap-[24px] items-center">
                  {DiscountBadgeBlock}
                  <Heading variant="h1" className="text-center hidden sm:block">
                    {discountPrice?.toFixed(2)}$
                  </Heading>
                  <span className="block sm:hidden text-center text-white font-usuzi text-[32px] leading-[26px]">
                    {discountPrice?.toFixed(2)}$
                  </span>
                </div>

                <Button variant="primary">Add to cart</Button>
              </div>
            )}
            {selectedVariant === 5 && (
              <>
                <div className="flex gap-[8px] items-center h-[42px] sm:h-[52px] max-w-[calc(100%-20px)] sm:max-w-[calc(100%-66px)] w-full mx-auto sm:mx-0 ml-[10px] sm:ml-0">
                  {DiscountBadgeBlock}
                  <div className="skew-x-[-20deg] border-[1px] border-primary-main rounded-[2px] h-full flex justify-center items-center">
                    <span className="skew-x-[20deg] text-white font-usuzi-condensed text-[20px] leading-[24px] sm:text-[38px] sm:leading-[29px] py-[10px] sm:py-[12px] px-[12px] xs:px-[18px] md:px-[30px]">
                      {discountPrice?.toFixed(2)}$
                    </span>
                  </div>
                  <Button
                    variant="primary"
                    className="max-w-[362px] ml-0 whitespace-nowrap">
                    Add to cart
                  </Button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="grid grid-cols-2 justify-center sm:flex gap-[8px] w-full ml-[10px] sm:ml-0 sm:justify-start">
            <div className="skew-x-[-20deg] h-[42px] sm:h-[52px] border-[1px] border-primary-main rounded-[2px] flex justify-center items-center">
              <Heading
                variant="h3"
                className="skew-x-[20deg] p-[12px] hidden sm:block">
                {game.price}$
              </Heading>
              <Heading
                variant="h2"
                className="skew-x-[20deg] p-[12px] block sm:hidden">
                {game.price}$
              </Heading>
            </div>
            <Button variant="primary" className="sm:max-w-[216px] ml-0">
              Add to cart
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="relative banner__container w-full mx-auto">
      <div className="relative banner mx-auto mb-[32px] sm:mb-0">
        {game.image && (
          <Image
            src={game.image}
            alt={game.title || "Game Banner"}
            width={1920}
            height={500}
            className="min-h-[216px] sm:min-h-[360px] h-full object-cover"
          />
        )}
      </div>
      {renderPriceBlock()}
    </section>
  );
};

export default Banner;
