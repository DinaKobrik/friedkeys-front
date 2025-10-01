"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Game } from "@/types/game";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Link from "next/link";

const Banner: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedVariant] = useState(1); // Варианты баннеров игр со скидкой
  const [cartQuantities, setCartQuantities] = useState<{
    [key: string]: {
      quantity: number;
      edition: string;
      platform: string;
      region: string;
      addedAt: number;
    };
  }>({});
  const [imageSrc, setImageSrc] = useState<string>("/images/no-image.jpg");

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

    const cartData = localStorage.getItem("cart");
    setCartQuantities(cartData ? JSON.parse(cartData) : {});
  }, []);

  // Выбираем игру по id
  const game = games.find((g) => g.id === 5) || {
    id: 1,
    image: "",
    price: 0,
    discount: 0,
    discountDate: "",
    title: "Unknown Game",
  };

  useEffect(() => {
    setImageSrc(
      game.image && game.image.trim() ? game.image : "/images/no-image.jpg"
    );
  }, [game.image]);

  const now = new Date();
  const isDiscountExpired =
    !game.discountDate ||
    new Date(game.discountDate).getTime() <= now.getTime();
  const discountPrice =
    game.discount && game.discount > 0 && !isDiscountExpired
      ? game.price * (1 - game.discount / 100)
      : null;

  const getUniqueCartKey = (gameId: number) => `${gameId}_Standard_PC_US`;

  const cartItem = cartQuantities[getUniqueCartKey(game.id)] || {
    quantity: 0,
    edition: "Standard",
    platform: "PC",
    region: "US",
    addedAt: 0,
  };
  const cartQuantity = cartItem.quantity;

  const addToCart = () => {
    const gameId = game.id;
    const cartKey = getUniqueCartKey(gameId);
    const newItem = {
      quantity: (cartQuantities[cartKey]?.quantity || 0) + 1,
      edition: "Standard",
      platform: "PC",
      region: "US",
      addedAt: Date.now(),
    };
    setCartQuantities((prev) => {
      const newQuantities = {
        ...prev,
        [cartKey]: newItem,
      };
      localStorage.setItem("cart", JSON.stringify(newQuantities));
      return newQuantities;
    });
  };

  const updateQuantity = (gameId: number, delta: number) => {
    const cartKey = getUniqueCartKey(gameId);
    setCartQuantities((prev) => {
      const currentItem = prev[cartKey] || {
        quantity: 0,
        edition: "Standard",
        platform: "PC",
        region: "US",
        addedAt: Date.now(),
      };
      const newQuantity = Math.max(0, currentItem.quantity + delta);

      if (newQuantity === 0) {
        const newQuantities = { ...prev };
        delete newQuantities[cartKey];
        localStorage.setItem("cart", JSON.stringify(newQuantities));
        return newQuantities;
      }

      const newItem = {
        ...currentItem,
        quantity: newQuantity,
        addedAt: Date.now(),
      };
      const newQuantities = {
        ...prev,
        [cartKey]: newItem,
      };
      localStorage.setItem("cart", JSON.stringify(newQuantities));
      return newQuantities;
    });
  };

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
        className="skew-x-[20deg] h-[42px] py-[10px] sm:py-[12px] px-[4px] xs:px-[12px] line-through sm:hidden">
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
        className="skew-x-[20deg] py-[10px] sm:py-[12px] h-[42px] px-[4px] xs:px-[20px] sm:hidden ">
        -{game.discount}%
      </Heading>
    </div>
  );

  const renderPriceBlock = () => {
    const isInCart = cartQuantity > 0;

    return (
      <div
        className={`sm:absolute z-50 bottom-[0] sm:bottom-[20%] left-[6px] sm:left-[46px] xl:left-[115px] ${
          discountPrice === null
            ? "bodyCustom:left-[237px]"
            : "bodyCustom:left-[157px]"
        } max-w-[calc(100%-32px)] sm:max-w-[calc(100%-46px)] w-full xl:max-w-[800px] mx-auto ml-[32px] sm:ml-0`}>
        {game.discount && game.discount > 0 && !isDiscountExpired ? (
          <>
            {selectedVariant === 1 && (
              <div className=" md:h-[52px] banner-grid w-full items-start justify-items-start gap-[8px] mx-auto ]">
                {PriceOriginalBlock}
                <div className="skew-x-[-20deg] border-[1px] border-primary-main rounded-[2px] h-full flex justify-center items-center w-full">
                  <span className="skew-x-[20deg] text-white font-usuzi-condensed text-[24px] leading-[20px] sm:text-[38px] sm:leading-[29px] py-[12px] px-[30px] h-[42px] sm:h-[50px]">
                    {discountPrice?.toFixed(2)}$
                  </span>
                </div>
                {DiscountBadgeBlock}
                {isInCart ? (
                  <div className="flex items-center gap-[6px] sm:gap-[24px] flex-shrink-0 w-full max-w-[100%] sm:max-w-[202px]">
                    <Button
                      variant="secondary"
                      className="max-w-[44px] sm:max-w-[64px] h-[42px] sm:h-[52px] flex items-center justify-center flex-shrink-0"
                      onClick={() => updateQuantity(game.id, -1)}>
                      -
                    </Button>
                    <span className="text-white text-[18px] font-bold">
                      {cartQuantity}
                    </span>
                    <Button
                      variant="secondary"
                      className="max-w-[44px] sm:max-w-[64px] h-[42px] sm:h-[52px] flex items-center justify-center flex-shrink-0"
                      onClick={() => updateQuantity(game.id, 1)}>
                      +
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    className="w-full lg:w-[360px] ml-0 whitespace-nowrap"
                    onClick={addToCart}>
                    Add to cart
                  </Button>
                )}
              </div>
            )}
            {selectedVariant === 2 && (
              <div className=" sm:max-w-[455px] w-full mx-auto sm:mx-0 sm:ml-[30px]">
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
                  {isInCart ? (
                    <div className="flex items-center sm:gap-[24px] flex-shrink-0 w-full max-w-[125px] sm:max-w-[202px]">
                      <Button
                        variant="secondary"
                        className="max-w-[44px] sm:max-w-[64px] h-[42px] sm:h-[52px] flex items-center justify-center flex-shrink-0"
                        onClick={() => updateQuantity(game.id, -1)}>
                        -
                      </Button>
                      <span className="text-white text-[18px] font-bold">
                        {cartQuantity}
                      </span>
                      <Button
                        variant="secondary"
                        className="max-w-[44px] sm:max-w-[64px] h-[42px] sm:h-[52px] flex items-center justify-center flex-shrink-0"
                        onClick={() => updateQuantity(game.id, 1)}>
                        +
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      className="sm:max-w-[216px] ml-0 whitespace-nowrap"
                      onClick={addToCart}>
                      Add to cart
                    </Button>
                  )}
                </div>
              </div>
            )}
            {selectedVariant === 3 && (
              <div className="flex flex-col gap-[8px] w-full max-w-[calc(100%-20px)] sm:max-w-[520px] mx-auto ml-[10px] sm:ml-0">
                <div className="h-[42px] sm:h-[52px] flex w-full items-center gap-[8px] max-w-[100%]">
                  {PriceOriginalBlock}
                  {DiscountBadgeBlock}
                  <div className="skew-x-[-20deg] border-[1px] border-primary-main rounded-[2px] h-full flex justify-center items-center w-full">
                    <span className="skew-x-[20deg] text-white font-usuzi-condensed text-[20px] leading-[24px] sm:text-[38px] sm:leading-[29px] py-[12px] px-[8px] xs:px-[18px] sm:px-[30px]">
                      {discountPrice?.toFixed(2)}$
                    </span>
                  </div>
                </div>
                {isInCart ? (
                  <div className="flex items-center gap-[24px] flex-shrink-0 w-full max-w-[202px] mx-auto">
                    <Button
                      variant="secondary"
                      className="max-w-[64px] h-[48px] flex items-center justify-center flex-shrink-0"
                      onClick={() => updateQuantity(game.id, -1)}>
                      -
                    </Button>
                    <span className="text-white text-[18px] font-bold">
                      {cartQuantity}
                    </span>
                    <Button
                      variant="secondary"
                      className="max-w-[64px] h-[48px] flex items-center justify-center flex-shrink-0"
                      onClick={() => updateQuantity(game.id, 1)}>
                      +
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    className="sm:max-w-[calc(100%-20px)]"
                    onClick={addToCart}>
                    Add to cart
                  </Button>
                )}
              </div>
            )}
            {selectedVariant === 4 && (
              <div className="max-w-[calc(100%-20px)] sm:max-w-[383px] flex flex-col w-full gap-[8px] sm:gap-[16px] xs:mx-[10px] sm:ml-0">
                <div className="grid grid-cols-2 lg:flex justify-between gap-[8px] xs:gap-[24px] items-center">
                  {DiscountBadgeBlock}
                  <Heading variant="h1" className="text-center hidden sm:block">
                    {discountPrice?.toFixed(2)}$
                  </Heading>
                  <span className="block sm:hidden text-center text-white font-usuzi text-[32px] leading-[26px]">
                    {discountPrice?.toFixed(2)}$
                  </span>
                </div>

                {isInCart ? (
                  <div className="flex items-center gap-[24px] flex-shrink-0 w-full max-w-[202px] mx-auto">
                    <Button
                      variant="secondary"
                      className="max-w-[64px] h-[48px] flex items-center justify-center flex-shrink-0"
                      onClick={() => updateQuantity(game.id, -1)}>
                      -
                    </Button>
                    <span className="text-white text-[18px] font-bold">
                      {cartQuantity}
                    </span>
                    <Button
                      variant="secondary"
                      className="max-w-[64px] h-[48px] flex items-center justify-center flex-shrink-0"
                      onClick={() => updateQuantity(game.id, 1)}>
                      +
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    className="max-w-[calc(100%-20px)] sm:max-w-[100%]"
                    onClick={addToCart}>
                    Add to cart
                  </Button>
                )}
              </div>
            )}
            {selectedVariant === 5 && (
              <>
                <div className="flex flex-col xs:flex-row gap-[8px] items-center xs:h-[42px] sm:h-[52px] sm:max-w-[calc(100%-66px)] w-full mx-auto sm:mx-0 ">
                  <div className="flex gap-[8px] items-center h-[42px] sm:h-[52px] xs:max-w-[calc(100%-20px)] sm:max-w-[calc(100%-66px)] w-full xs:w-auto mx-auto sm:mx-0 xs:ml-[10px] sm:ml-0">
                    {DiscountBadgeBlock}
                    <div className="skew-x-[-20deg] border-[1px] border-primary-main rounded-[2px] h-full flex justify-center items-center">
                      <span className="skew-x-[20deg] text-white font-usuzi-condensed text-[20px] leading-[24px] sm:text-[38px] sm:leading-[29px] py-[10px] sm:py-[12px] px-[12px] xs:px-[18px] md:px-[30px]">
                        {discountPrice?.toFixed(2)}$
                      </span>
                    </div>
                  </div>
                  {isInCart ? (
                    <div className="flex items-center gap-[24px] xs:gap-0 sm:gap-[24px] flex-shrink-0 w-full max-w-[202px] xs:max-w-[140px] sm:max-w-[202px]">
                      <Button
                        variant="secondary"
                        className="max-w-[64px] xs:max-w-[44px] sm:max-w-[64px] h-[42px] sm:h-[52px] flex items-center justify-center flex-shrink-0"
                        onClick={() => updateQuantity(game.id, -1)}>
                        -
                      </Button>
                      <span className="text-white text-[18px] font-bold">
                        {cartQuantity}
                      </span>
                      <Button
                        variant="secondary"
                        className="max-w-[64px] xs:max-w-[44px] sm:max-w-[64px] h-[42px] sm:h-[52px] flex items-center justify-center flex-shrink-0"
                        onClick={() => updateQuantity(game.id, 1)}>
                        +
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      className="max-w-[362px] ml-0 whitespace-nowrap"
                      onClick={addToCart}>
                      Add to cart
                    </Button>
                  )}
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
            {isInCart ? (
              <div className="flex items-center gap-[24px] flex-shrink-0 w-full max-w-[202px]">
                <Button
                  variant="secondary"
                  className="max-w-[64px] h-[48px] flex items-center justify-center flex-shrink-0"
                  onClick={() => updateQuantity(game.id, -1)}>
                  -
                </Button>
                <span className="text-white text-[18px] font-bold">
                  {cartQuantity}
                </span>
                <Button
                  variant="secondary"
                  className="max-w-[64px] h-[48px] flex items-center justify-center flex-shrink-0"
                  onClick={() => updateQuantity(game.id, 1)}>
                  +
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                className="sm:max-w-[216px] ml-0"
                onClick={addToCart}>
                Add to cart
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="relative banner__container w-full mx-auto">
      <div className="relative banner mx-auto mb-[32px] sm:mb-0">
        <Link href={`/all-games/${game.id}`} className="w-full h-full">
          <div className="relative w-full aspect-[1920/806] min-h-[216px] sm:min-h-[360px]">
            <Image
              src={imageSrc}
              alt={game.title || "Game Banner"}
              width={1920}
              height={806}
              className="w-full h-full object-cover"
              onError={() => setImageSrc("/images/no-image.jpg")}
            />
          </div>
        </Link>
      </div>
      {renderPriceBlock()}
    </section>
  );
};

export default Banner;
