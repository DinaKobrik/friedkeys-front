"use client";

import { useState, useEffect } from "react";
import { Game } from "@/types/game";
import Image from "next/image";
import Link from "next/link";

interface GameCardProps {
  game: Game;
  showSaleTimer?: boolean;
  hidePreOrder?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  game,
  showSaleTimer = false,
  hidePreOrder = false,
}) => {
  const discountPrice = game.discount
    ? (game.price * (1 - game.discount / 100)).toFixed(2)
    : null;

  const [isMobile, setIsMobile] = useState(false);
  const [discountTime, setDiscountTime] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(
    game.image && game.image.trim() && game.image.startsWith("/images/")
      ? game.image
      : "/images/no-image.jpg"
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 767);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteGames");
    if (storedFavorites) {
      const favoriteIds = JSON.parse(storedFavorites);
      setIsFavorite(favoriteIds.includes(game.id));
    }
  }, [game.id]);

  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const shortYear = year.toString().slice(-2);

    if (isMobile) {
      return `${day.toString().padStart(2, "0")}/${month
        .toString()
        .padStart(2, "0")}/${shortYear}`;
    } else {
      const monthName = date.toLocaleDateString("en-US", { month: "long" });
      return `${day} ${monthName} ${year}`;
    }
  };

  useEffect(() => {
    const updateDiscountTime = () => {
      if (!game.discountDate || !game.discount || game.discount === 0) {
        setDiscountTime(null);
        return;
      }

      const now = new Date();
      const endDate = new Date(game.discountDate);
      const diffMs = endDate.getTime() - now.getTime();

      if (diffMs <= 0) {
        setDiscountTime(null);
        return;
      }

      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        setDiscountTime(`Until the end of day ${diffDays}`);
      } else {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(
          (diffMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setDiscountTime(
          `Until ${diffHours.toString().padStart(2, "0")}:${diffMinutes
            .toString()
            .padStart(2, "0")}:${diffSeconds.toString().padStart(2, "0")}`
        );
      }
    };

    updateDiscountTime();
    const interval = setInterval(updateDiscountTime, 1000);
    return () => clearInterval(interval);
  }, [game.discountDate, game.discount]);

  const isDiscountExpired = game.discountDate
    ? new Date(game.discountDate).getTime() < new Date().getTime()
    : false;

  const toggleFavorite = async () => {
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
      throw new Error(`Failed to fetch updated games: ${error}`);
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col relative min-w-[138px] xs:min-w-[175px] sm:min-w-[200px]"
      role="listitem"
      aria-label={`Game: ${game.title}`}>
      <div
        className="favorite absolute w-[36px] h-[36px] sm:w-[48px] sm:h-[48px] right-0 top-[1px] z-10 flex justify-center items-center cursor-pointer"
        onClick={toggleFavorite}
        role="button"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
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
      <Link href={`/all-games/${game.id}`} className="w-full h-full">
        <div>
          <div className="card-corner game-card bg-2 relative h-full flex flex-col justify-between">
            <div className="relative w-full h-[240px] max-h-[240px] md:h-[280px] md:max-h-[280px] lg:h-0 lg:max-h-none lg:pb-[52.53%]">
              <Image
                src={imageSrc}
                alt={game.title}
                fill
                className="object-cover"
                onError={() => setImageSrc("/images/no-image.jpg")}
                loading="lazy"
              />
              {showSaleTimer && discountTime && (
                <div className="sale-time absolute bottom-0 left-0 text-sale text-[12px] leading-[14px] md:text-[19px] md:leading-[30px] p-[8px] sm:p-[16px] text-center w-full z-10">
                  {discountTime}
                </div>
              )}
            </div>
            <div className="py-[8px] px-[12px] md:py-[12px] md:px-[16px] flex flex-col justify-between">
              <div className="flex gap-[16px] items-start">
                <p
                  className={`hidden sm:block font-medium text-white h-auto text-[12px] sm:text-[20px] py-[4px] sm:py-[6px] px-[8px] bg-DLS ${
                    game.hasDlc ? "block" : "hidden sm:hidden"
                  }`}>
                  DLS
                </p>
                <h3 className="font-medium text-white text-[14px] sm:text-[20px] leading-[17px] sm:leading-[24px] mb-[8px] sm:mb-[14px] h-[34px] sm:h-[51px] overflow-hidden">
                  {game.title}
                </h3>
              </div>
              <div className="flex justify-between items-center h-[34px]">
                <p
                  className={`block sm:hidden font-medium text-white text-[12px] leading-[14px] sm:text-[20px] sm:leading-[24px] py-[4px] sm:py-[6px] px-[8px] bg-DLS ${
                    game.hasDlc ? "block" : "hidden"
                  }`}>
                  DLS
                </p>
                <div className="flex flex-col sm:flex-row gap-[1px] sm:gap-[20px] lg:gap-[7px] xl:gap-[20px] items-end mr-auto w-full">
                  {discountPrice &&
                  game.discount &&
                  game.discount > 0 &&
                  !isDiscountExpired ? (
                    <>
                      <span className="text-white font-bold text-[15px] sm:text-[28px] leading-[17px] sm:leading-[28px]">
                        {discountPrice}$
                      </span>
                      <span className="line-through text-gray-68 font-bold text-[12px] sm:text-[20px] leading-[14px] sm:leading-[20px]">
                        {game.price}$
                      </span>
                      <span
                        className={`absolute right-0 md:sticky md:right-auto md:bottom-auto text-white font-bold text-[13px] md:text-[18px] leading-[20px] py-[4px] px-[8px] md:py-[7px] md:px-[16px] rounded-[2px] bg-sale ${
                          showSaleTimer && discountTime
                            ? "bottom-[132px] sm:bottom-[160px]"
                            : "bottom-[102px] sm:bottom-[130px]"
                        }`}>
                        -{game.discount}%
                      </span>
                    </>
                  ) : (
                    <span className="text-white font-bold text-[15px] sm:text-[28px] leading-[17px] sm:leading-[28px]">
                      {game.price}$
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="h-[7px] w-[75%] sm:w-[50%] absolute bottom-0 left-[50%] bg-primary-main translate-x-[-50%] blur-[30px] z-0"></div>
          </div>
          {!hidePreOrder && game.preOrder && game.releaseDate && (
            <div className="block max-w-[284px] w-[calc(100%-20px)] mx-auto mt-[8px] sm:mt-[12px] py-[4px] px-[12px] skew-x-[-20deg] bg-primary-main rounded-[1px]">
              <p className="font-semibold skew-x-[20deg] text-center text-black text-[12px] leading-[12px] sm:text-[16px] sm:leading-[16px]">
                PRE-ORDER {formatReleaseDate(game.releaseDate)}
              </p>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default GameCard;
