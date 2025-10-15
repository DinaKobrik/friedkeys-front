"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import { useCart } from "@/components/Sections/Game/CartHandler";
import {
  FavoriteProvider,
  useFavorite,
} from "@/components/Sections/Game/FavoriteHandler";

interface Game {
  id: number;
  title: string;
  image: string;
  price: number;
  discount?: number;
  discountDate?: string;
  releaseDate?: string;
  hasDlc?: boolean;
  preOrder?: boolean;
  reviews?: number;
}

const RecommendationsBlock: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const { cartQuantities, setCartQuantities } = useCart();
  const { favoriteIds, toggleFavorite: toggleFavoriteFromContext } =
    useFavorite();
  const [isFavorite, setIsFavorite] = useState<{ [key: number]: boolean }>({});
  const [isLessThan992, setIsLessThan992] = useState(false);
  const [isLessThan768, setIsLessThan768] = useState(false);
  const [isOneLine, setIsOneLine] = useState<{ [key: number]: boolean }>({});
  const [imageSrcs, setImageSrcs] = useState<{ [key: number]: string }>({});

  const infoRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const fetchGames = useCallback(async () => {
    try {
      const url = new URL("/api/games", window.location.origin);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch games");
      const data = await res.json();

      const topGames = data
        .filter((game: Game) => !game.preOrder && game.reviews)
        .sort((a: Game, b: Game) => (b.reviews || 0) - (a.reviews || 0))
        .slice(0, 3);
      setGames(topGames);
    } catch (error) {
      console.error("Error fetching games:", error);
      setGames([]);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  useEffect(() => {
    setIsFavorite(
      games.reduce((acc, game) => {
        acc[game.id] = favoriteIds.includes(game.id);
        return acc;
      }, {} as { [key: number]: boolean })
    );
  }, [games, favoriteIds]);

  useEffect(() => {
    const handleResize = () => {
      setIsLessThan992(window.innerWidth < 992);
      setIsLessThan768(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const checkLineCount = () => {
      games.forEach((game) => {
        const ref = infoRefs.current[game.id];
        if (ref) {
          const height = ref.getBoundingClientRect().height;
          const isSingleLine = height <= (isLessThan768 ? 30 : 40);
          setIsOneLine((prev) => ({ ...prev, [game.id]: isSingleLine }));
        }
      });
    };

    checkLineCount();
    window.addEventListener("resize", checkLineCount);
    return () => window.removeEventListener("resize", checkLineCount);
  }, [games, isLessThan768]);

  useEffect(() => {
    setImageSrcs(
      games.reduce(
        (acc, game) => ({
          ...acc,
          [game.id]:
            game.image && game.image.trim()
              ? game.image
              : "/images/no-image.jpg",
        }),
        {}
      )
    );
  }, [games]);

  const getUniqueCartKey = useCallback(
    (gameId: string) => `${gameId}_Standard_PC_US`,
    []
  );

  const addToCart = useCallback(
    (gameId: number) => {
      const gameIdStr = gameId.toString();
      const cartKey = getUniqueCartKey(gameIdStr);
      const newItem = {
        quantity: (cartQuantities[cartKey]?.quantity || 0) + 1,
        edition: "Standard",
        platform: "PC",
        region: "US",
        addedAt: Date.now(),
      };
      const newCartQuantities = {
        ...cartQuantities,
        [cartKey]: newItem,
      };
      setCartQuantities(newCartQuantities);
    },
    [cartQuantities, setCartQuantities, getUniqueCartKey]
  );

  const updateQuantity = useCallback(
    (gameId: number, delta: number) => {
      const gameIdStr = gameId.toString();
      const cartKey = getUniqueCartKey(gameIdStr);
      const currentItem = cartQuantities[cartKey] || {
        quantity: 0,
        edition: "Standard",
        platform: "PC",
        region: "US",
        addedAt: Date.now(),
      };
      const newQuantity = Math.max(0, currentItem.quantity + delta);

      if (newQuantity === 0) {
        const newCartQuantities = { ...cartQuantities };
        delete newCartQuantities[cartKey];
        setCartQuantities(newCartQuantities);
      } else {
        const newItem = {
          ...currentItem,
          quantity: newQuantity,
          addedAt: Date.now(),
        };
        const newCartQuantities = {
          ...cartQuantities,
          [cartKey]: newItem,
        };
        setCartQuantities(newCartQuantities);
      }
    },
    [cartQuantities, setCartQuantities, getUniqueCartKey]
  );

  const isDiscountExpired = (discountDate?: string) => {
    if (!discountDate) return true;
    return new Date(discountDate).getTime() < new Date().getTime();
  };

  return (
    <FavoriteProvider>
      <section className="mb-[56px] md:mb-[120px] 2xl:mb-0">
        <Heading
          variant="h1"
          aria-label="Recommendations Section"
          aria-live="polite"
          className="mb-[24px] sm:mb-[40px]">
          Recommendations
        </Heading>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px] sm:gap-[24px]">
          {games.length > 0 ? (
            games.map((game) => {
              const discountPrice =
                game.discount && !isDiscountExpired(game.discountDate)
                  ? (game.price * (1 - game.discount / 100)).toFixed(2)
                  : null;
              const cartKey = getUniqueCartKey(game.id.toString());
              const cartItem = cartQuantities[cartKey] || null;
              const cartQuantity = cartItem ? cartItem.quantity : 0;

              return (
                <div
                  key={game.id}
                  className="w-full  h-[125px] sm:h-[280px] lg:h-full flex flex-col relative min-w-[138px] xs:min-w-[175px] sm:min-w-[200px]">
                  <div className="h-full w-full">
                    <div
                      className={`game-card lg:bg-2 relative h-full flex flex-row lg:flex-col justify-between gap-[12px] sm:gap-[16px] lg:gap-[0px] ${
                        isLessThan992 ? "" : "card-corner"
                      }`}>
                      <div
                        className={`relative w-full max-w-[81px] sm:max-w-[180px] lg:max-w-[520px] h-[125px] sm:h-[280px] ${
                          isLessThan992 ? "card-corner" : ""
                        }`}>
                        <div
                          className="favorite absolute w-[36px] h-[36px] sm:w-[48px] sm:h-[48px] right-0 top-0 z-10 flex justify-center items-center cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavoriteFromContext(game.id);
                          }}>
                          <svg
                            width="16.5"
                            height="21"
                            className="sm:w-[22px] sm:h-[28px]"
                            viewBox="0 0 22 28"
                            fill={isFavorite[game.id] ? "#FFFF25" : "none"}
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M20.9702 1.66669C13.1831 1.66669 8.81716 1.66669 1.03003 1.66669V26.3334L11.0336 21.7394L20.9702 26.3334V1.66669Z"
                              stroke={isFavorite[game.id] ? "#FFFF25" : "white"}
                              strokeWidth="2"
                              strokeLinecap="square"
                            />
                          </svg>
                        </div>
                        <Link
                          href={`/all-games/${game.id}`}
                          className="w-full h-full">
                          <Image
                            src={imageSrcs[game.id] || "/images/no-image.jpg"}
                            alt={game.title}
                            width={520}
                            height={280}
                            className="object-cover w-full h-full"
                            onError={() =>
                              setImageSrcs((prev) => ({
                                ...prev,
                                [game.id]: "/images/no-image.jpg",
                              }))
                            }
                          />
                        </Link>
                      </div>
                      <div
                        className={`w-full md:bg-2 p-0 md:p-[32px] md:pt-[24px] flex flex-col justify-between ${
                          isLessThan992 && !isLessThan768 ? "card-corner" : ""
                        }`}>
                        <div>
                          <div className="flex gap-[16px] items-start">
                            <p
                              className={`hidden lg:block font-medium text-white h-auto text-[12px] leading-[17px] sm:text-[20px] py-[4px] sm:py-[6px] px-[8px] bg-DLS ${
                                game.hasDlc ? "block" : "hidden sm:hidden"
                              }`}
                              aria-label={`DLC indicator for ${game.title}`}>
                              DLS
                            </p>
                            <h3
                              className="font-medium font-usuzi-condensed lg:font-inter line-clamp-2 text-white text-[14px] sm:text-[20px] leading-[17px] sm:leading-[24px] mb-[12px] sm:mb-[23px]"
                              aria-label={`Game title: ${game.title}`}>
                              {game.title}
                            </h3>
                          </div>
                          <div
                            ref={(el) => {
                              infoRefs.current[game.id] = el;
                            }}
                            className={`flex lg:hidden items-center flex-wrap line-clamp-2 justify-${
                              isOneLine[game.id] ? "between" : "start"
                            } w-full gap-[8px] md:gap-[20px] gap-y-[3px]`}>
                            <span className="text-white text-[13px] leading-[15px] sm:text-[20px] whitespace-nowrap">
                              Standard
                            </span>
                            <span className="text-white text-[13px] leading-[15px] sm:text-[20px] flex gap-[4px] sm:gap-[8px] items-center whitespace-nowrap">
                              <svg
                                width="40"
                                height="29"
                                viewBox="0 0 37 29"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-[16px] h-[16px] sm:w-[30px] sm:h-[30px]">
                                <path
                                  d="M36.6398 22.3516C35.9232 23.2566 34.1698 23.9016 34.1698 23.9016L21.1148 28.5966V25.1333L30.7215 21.705C31.8132 21.315 31.9798 20.7616 31.0932 20.4716C30.2098 20.18 28.6082 20.2633 27.5165 20.6566L21.1165 22.9133V19.3216L21.4832 19.1966C21.4832 19.1966 23.3332 18.54 25.9348 18.2516C28.5348 17.965 31.7215 18.2916 34.2215 19.24C37.0382 20.1316 37.3548 21.4466 36.6398 22.3516ZM22.3565 16.4566V7.60329C22.3565 6.56329 22.1665 5.60663 21.1915 5.33663C20.4465 5.09663 19.9832 5.78996 19.9832 6.82829V29L14.0098 27.1016V0.666626C16.5498 1.13829 20.2498 2.25496 22.2382 2.92496C27.2965 4.66329 29.0115 6.82829 29.0115 11.7033C29.0115 16.455 26.0815 18.2566 22.3582 16.4566H22.3565ZM3.0515 24.7733C0.159835 23.9566 -0.321832 22.2566 0.996501 21.2783C2.21483 20.375 4.2865 19.695 4.2865 19.695L12.8498 16.645V20.1216L6.68817 22.33C5.59983 22.72 5.4315 23.2733 6.3165 23.5633C7.2015 23.855 8.80483 23.7716 9.89483 23.38L12.8498 22.3066V25.415L12.2615 25.515C9.30483 25.9983 6.15483 25.7966 3.0515 24.7733Z"
                                  fill="white"
                                />
                              </svg>
                              PlayStation Store
                            </span>
                            <span className="text-white text-[13px] leading-[15px] sm:text-[20px] whitespace-nowrap">
                              PC
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center h-[40px] sm:h-[48px] lg:h-[34px]">
                          <div className="hidden lg:flex flex-col sm:flex-row gap-[1px] sm:gap-[20px] lg:gap-[7px] xl:gap-[20px] items-end mr-auto w-full">
                            {discountPrice &&
                            game.discount &&
                            game.discount > 0 &&
                            !isDiscountExpired(game.discountDate) ? (
                              <>
                                <span
                                  className="text-white font-bold text-[15px] sm:text-[28px] leading-[17px] sm:leading-[28px]"
                                  aria-label={`Discounted price: ${discountPrice}$`}>
                                  {discountPrice}$
                                </span>
                                <span
                                  className="line-through text-gray-68 font-bold text-[12px] sm:text-[20px] leading-[14px] sm:leading-[20px]"
                                  aria-label={`Original price: ${game.price}$`}>
                                  {game.price}$
                                </span>
                                <span
                                  className={`absolute right-0 md:sticky md:right-auto md:bottom-auto text-white font-bold text-[13px] md:text-[18px] leading-[13px] sm:leading-[20px] py-[4px] px-[8px] md:py-[7px] md:px-[16px] rounded-[2px] bg-sale ${"bottom-[102px] sm:bottom-[130px]"}`}
                                  aria-label={`Discount percentage: -${game.discount}%`}>
                                  -{game.discount}%
                                </span>
                              </>
                            ) : (
                              <span
                                className="text-white font-bold text-[15px] sm:text-[28px] leading-[17px] sm:leading-[28px]"
                                aria-label={`Price: ${game.price}$`}>
                                {game.price}$
                              </span>
                            )}
                          </div>
                          <div className="flex lg:hidden flex-col sm:flex-row gap-[1px] sm:gap-[20px] lg:gap-[7px] xl:gap-[20px] items-start sm:items-end mr-auto w-full">
                            {discountPrice &&
                            game.discount &&
                            game.discount > 0 &&
                            !isDiscountExpired(game.discountDate) ? (
                              <div className="flex items-center gap-[12px] sm:gap-[20px]">
                                <span
                                  className={`text-white font-bold text-[13px] md:text-[18px] leading-[20px] py-[4px] px-[8px] md:py-[7px] md:px-[16px] rounded-[2px] bg-sale ${"bottom-[102px] sm:bottom-[130px]"}`}
                                  aria-label={`Discount percentage: -${game.discount}%`}>
                                  -{game.discount}%
                                </span>
                                <div className="flex flex-col items-end">
                                  <span
                                    className="text-white font-bold text-[15px] sm:text-[28px] leading-[17px] sm:leading-[28px]"
                                    aria-label={`Discounted price: ${discountPrice}$`}>
                                    {discountPrice}$
                                  </span>
                                  <span
                                    className="line-through text-gray-68 font-bold text-[12px] sm:text-[20px] leading-[14px] sm:leading-[20px]"
                                    aria-label={`Original price: ${game.price}$`}>
                                    {game.price}$
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <span
                                className="text-white font-bold text-[15px] sm:text-[28px] leading-[17px] sm:leading-[28px]"
                                aria-label={`Price: ${game.price}$`}>
                                {game.price}$
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`hidden lg:block h-[7px] w-[75%] sm:w-[50%] absolute bottom-0 left-[50%] bg-primary-main translate-x-[-50%] blur-[30px] z-0 ${
                          isLessThan992 ? "card-corner" : ""
                        }`}></div>
                    </div>
                  </div>
                  <div className="lg:mt-[24px] absolute lg:static bottom-[0px] right-0 md:bottom-[32px] md:right-[32px] mr-[10px] lg:mr-0">
                    {cartQuantity === 0 ? (
                      <Button
                        variant="secondary"
                        className="max-w-[245px] w-full h-[40px] sm:h-[48px] flex justify-center items-center lg:max-w-[calc(100%-20px)]"
                        onClick={() => addToCart(game.id)}
                        aria-label={`Add ${game.title} to cart`}>
                        <span className="hidden lg:block">Add to Cart</span>
                        <span className="lg:hidden">
                          <svg
                            width="33"
                            height="32"
                            viewBox="0 0 33 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M20.0032 13.9053H23.5654"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="square"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M11.0484 25.9902C11.4351 25.9902 11.7473 26.3037 11.7473 26.6891C11.7473 27.0757 11.4351 27.3892 11.0484 27.3892C10.6618 27.3892 10.3496 27.0757 10.3496 26.6891C10.3496 26.3037 10.6618 25.9902 11.0484 25.9902Z"
                              fill="white"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="square"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M25.5379 25.9902C25.9246 25.9902 26.2381 26.3037 26.2381 26.6891C26.2381 27.0757 25.9246 27.3892 25.5379 27.3892C25.1513 27.3892 24.8391 27.0757 24.8391 26.6891C24.8391 26.3037 25.1513 25.9902 25.5379 25.9902Z"
                              fill="white"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="square"
                            />
                            <path
                              d="M8.33672 8.69095H29.1698L27.4773 21.5371H9.49457L7.79187 4.61068H4.50317"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="square"
                            />
                          </svg>
                        </span>
                      </Button>
                    ) : (
                      <div
                        className="flex sm:w-full items-center gap-6 w-full max-w-[80px] xs:max-w-[202px] sm:max-w-[80px] md:max-w-[100%] sm:justify-center"
                        aria-live="polite"
                        aria-label={`Game ${game.title} is in cart with quantity ${cartQuantity}`}>
                        <div className="flex justify-center items-center h-[40px] font-usuzi-condensed text-[15px] leading-[17px] sm:text-[24px] sm:leading-[26px] text-center w-full">
                          in the cart
                        </div>
                        <div className="hidden lg:flex items-center gap-6 w-full max-w-[202px]">
                          <Button
                            variant="secondary"
                            className="max-w-[64px] h-[48px] flex items-center justify-center"
                            onClick={() => updateQuantity(game.id, -1)}
                            aria-label={`Decrease quantity of ${game.title}`}>
                            -
                          </Button>
                          <span
                            className="text-white text-[18px] font-bold"
                            aria-label={`Quantity: ${cartQuantity}`}>
                            {cartQuantity}
                          </span>
                          <Button
                            variant="secondary"
                            className="max-w-[64px] h-[48px] flex items-center justify-center"
                            onClick={() => updateQuantity(game.id, 1)}
                            aria-label={`Increase quantity of ${game.title}`}>
                            +
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-68" aria-live="polite">
              Loading recommendations...
            </p>
          )}
        </div>
      </section>
    </FavoriteProvider>
  );
};

export default RecommendationsBlock;
