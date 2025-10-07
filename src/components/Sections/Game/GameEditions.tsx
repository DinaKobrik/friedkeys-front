"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";

interface Game {
  id: number;
  title: string;
  image?: string;
  price: number;
  discount?: number;
  discountDate?: string;
}

const GameEditionsSection: React.FC = () => {
  const params = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("/images/no-image.jpg");
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dynamicMargin, setDynamicMargin] = useState<string>("0px");
  const [dynamicPadding, setDynamicPadding] = useState<string>("0px");
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  const fetchGame = useCallback(async () => {
    const id = params?.id as string;
    if (!id) {
      throw new Error("No game ID found in params");
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/games?type=game&id=${id}`);
      if (!response.ok)
        throw new Error(`Failed to fetch game: ${await response.text()}`);
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
      throw new Error(`Failed to fetch game: ${error}`);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  useEffect(() => {
    if (game) {
      setImageSrc(
        game.image && game.image.trim() ? game.image : "/images/no-image.jpg"
      );
      const storedFavorites = localStorage.getItem("favoriteGames");
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites);
        setIsFavorite(favoriteIds.includes(game.id));
      }
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
      if (!response.ok)
        throw new Error(
          `Failed to fetch updated games: ${await response.text()}`
        );
      await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch updated games: ${error}`);
    }
  };

  useEffect(() => {
    const detectTouchDevice = () => {
      const isTouch =
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;
      setIsTouchDevice(isTouch);
    };

    const updateDynamicStyles = () => {
      if (typeof window === "undefined") return;
      const windowWidth = window.innerWidth;
      const scrollbarWidthValue =
        window.innerWidth - document.documentElement.clientWidth;
      let calculatedOffset: number;

      if (windowWidth < 576) {
        calculatedOffset = 16;
        setDynamicMargin(`-${calculatedOffset}px`);
        setDynamicPadding(`${calculatedOffset}px`);
      } else if (windowWidth >= 576 && windowWidth < 1700) {
        calculatedOffset = 46;
        setDynamicMargin(`-${calculatedOffset}px`);
        setDynamicPadding(`${calculatedOffset}px`);
      } else if (windowWidth >= 1607 && windowWidth <= 1609) {
        calculatedOffset = 146;
        setDynamicMargin(`-${calculatedOffset}px`);
        setDynamicPadding(`${calculatedOffset}px`);
      } else if (windowWidth > 1608 && windowWidth <= 1920) {
        calculatedOffset = isTouchDevice
          ? (windowWidth - 1608) / 2
          : (windowWidth - scrollbarWidthValue - 1608) / 2;
        setDynamicMargin(`-${calculatedOffset}px`);
        setDynamicPadding(`${calculatedOffset}px`);
      } else {
        calculatedOffset = 146;
        setDynamicMargin(`-${calculatedOffset}px`);
        setDynamicPadding(`${calculatedOffset}px`);
      }
    };

    detectTouchDevice();
    updateDynamicStyles();
    window.addEventListener("resize", updateDynamicStyles);
    return () => window.removeEventListener("resize", updateDynamicStyles);
  }, [isTouchDevice]);

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isTouchDevice) return;
    const startX = e.clientX;
    const scrollLeft = containerRef.current.scrollLeft;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX;
      const walk = (currentX - startX) * 2;
      if (containerRef.current) {
        containerRef.current.scrollLeft = scrollLeft - walk;
      }
    };

    const handleDragEndDocument = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleDragEndDocument);
      if (containerRef.current) {
        containerRef.current.style.cursor = "grab";
        containerRef.current.style.userSelect = "auto";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleDragEndDocument);
    containerRef.current.style.cursor = "grabbing";
    containerRef.current.style.userSelect = "none";
  };

  const handleDragEnd = () => {
    if (!containerRef.current || isTouchDevice) return;
    containerRef.current.style.cursor = "grab";
    containerRef.current.style.userSelect = "auto";
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
    <section aria-label="Game Editions Section">
      <Heading
        variant="h1"
        className="mb-[24px] sm:mb-[40px]"
        aria-label="Game Editions Title">
        Editions
      </Heading>
      <div
        className="mx-auto relative max-w-[1920px] overflow-hidden"
        style={{ marginLeft: dynamicMargin, marginRight: dynamicMargin }}>
        <div
          ref={containerRef}
          className="flex w-full overflow-scroll hide-scrollbar h-full gap-[12px] sm:gap-[24px]"
          style={{
            paddingLeft: dynamicPadding,
            paddingRight: dynamicPadding,
            cursor: isTouchDevice ? "auto" : "grab",
            userSelect: isTouchDevice ? "auto" : "none",
          }}
          {...(!isTouchDevice
            ? {
                onMouseDown: handleDragStart,
                onMouseUp: handleDragEnd,
                onMouseLeave: handleDragEnd,
              }
            : {})}>
          {editions.map((edition, index) => (
            <div
              key={index}
              className="flex flex-col relative game__editions-card border-[1px] border-transparent justify-between gap-[8px] flex-shrink-0 w-[268px] sm:w-[400px] lg:w-[520px]"
              aria-label={`${edition.type} Edition Details`}>
              <div
                className="favorite absolute w-[36px] h-[36px] sm:w-[48px] sm:h-[48px] right-[2px] top-[1px] md:right-[4px] md:top-[3px] z-10 flex justify-center items-center cursor-pointer"
                onClick={toggleFavorite}
                aria-label={
                  isFavorite
                    ? `Remove ${game.title} from favorites`
                    : `Add ${game.title} to favorites`
                }
                aria-pressed={isFavorite}>
                <svg
                  width="16.5"
                  height="21"
                  className="sm:w-[22px] sm:h-[28px]"
                  viewBox="0 0 22 28"
                  fill={isFavorite ? "#FFFF25" : "none"}
                  xmlns="http://www.w3.org/2000/svg">
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
              <div className="card-corner game__editions-img w-[calc(100%-2px)] md:w-[calc(100%-4px)] h-[160px] sm:h-[280px] relative flex-shrink-0">
                <Image
                  src={imageSrc || "/images/no-image.jpg"}
                  alt={`${game.title} ${edition.type} Edition`}
                  width={520}
                  height={280}
                  className="object-cover w-full h-full m-[1px] md:m-[3px]"
                  loading="lazy"
                  onError={() => setImageSrc("/images/no-image.jpg")}
                />
              </div>
              <div className="bg-2 p-[20px] pb-[32px] h-full flex flex-col justify-between gap-[16px]">
                <div className="mb-[40px] sm:mb-[80px]">
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
                          <span
                            className="line-through font-usuzi-condensed text-gray-68 font-bold text-[20px] sm:text-[32px] leading-[16px] sm:leading-[30px]"
                            aria-label={`Original price: ${game.price} dollars`}>
                            {game.price}$
                          </span>
                          <span
                            className="text-white font-usuzi-condensed font-bold text-[24px] leading-[22px] sm:text-[32px] py-[4px] px-[8px] md:py-[6px] md:px-[16px] rounded-[2px] bg-sale"
                            aria-label={`Discount of ${game.discount}%`}>
                            -{game.discount}%
                          </span>
                        </div>
                        <span
                          className="text-white font-usuzi-condensed text-center font-bold text-[32px] sm:text-[48px] leading-[28px] sm:leading-[37px]"
                          aria-label={`Discounted price: ${discountPrice} dollars`}>
                          {discountPrice}$
                        </span>
                      </>
                    ) : (
                      <span
                        className="text-white font-usuzi-condensed text-center w-full font-bold text-[32px] sm:text-[48px] leading-[28px] sm:leading-[37px]"
                        aria-label={`Price: ${game.price} dollars`}>
                        {game.price}$
                      </span>
                    )}
                  </div>
                  <div className="w-full">
                    <Button
                      variant="primary"
                      className="max-w-[calc(100%-20px)]"
                      disabled={true}
                      aria-label={`Add ${game.title} ${edition.type} Edition to cart (disabled)`}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameEditionsSection;
