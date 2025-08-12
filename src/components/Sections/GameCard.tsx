"use client";

import { useState, useEffect } from "react";
import { Game } from "@/types/game";
import Image from "next/image";

interface GameCardProps {
  game: Game;
  showSaleTimer?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, showSaleTimer = false }) => {
  const discountPrice = game.discount
    ? (game.price * (1 - game.discount / 100)).toFixed(2)
    : null;

  // Состояние для отслеживания мобильного режима
  const [isMobile, setIsMobile] = useState(false);

  // Состояние для таймера скидки
  const [discountTime, setDiscountTime] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 767);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Преобразование даты в зависимости от ширины экрана
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

  // Расчёт оставшегося времени до окончания скидки с таймером
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

  // Проверка, истекла ли скидка
  const isDiscountExpired = game.discountDate
    ? new Date(game.discountDate).getTime() < new Date().getTime()
    : false;

  return (
    <div className="w-full h-full flex flex-col relative min-w-[175px] sm:min-w-[200px]">
      <div className="favorite absolute w-[48px] h-[48px] right-0 top-0 z-10 flex justify-center items-center cursor-pointer">
        <svg
          width="22"
          height="28"
          viewBox="0 0 22 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.9702 1.66669C13.1831 1.66669 8.81716 1.66669 1.03003 1.66669V26.3334L11.0336 21.7394L20.9702 26.3334V1.66669Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="square"
          />
        </svg>
      </div>
      <div className="card-corner game-card bg-2 relative h-full flex flex-col justify-between">
        <div
          className="relative w-full h-[240px] max-h-[240px] md:h-[280px] md:max-h-[280px] lg:h-0 lg:max-h-none 
    lg:pb-[52.53%]">
          <Image
            src={game.image}
            alt={game.title}
            fill
            className="object-cover"
          />
          {showSaleTimer && discountTime && (
            <div className="sale-time absolute bottom-0 left-0 text-sale text-[12px] leading-[14px] sm:text-[19px] md:text-[24px] sm:leading-[30px] p-[8px] sm:p-[16px] text-center w-full z-10">
              {discountTime}
            </div>
          )}
        </div>
        <div className="py-[8px] px-[12px] sm:py-[12px] sm:px-[16px]">
          <div className="flex gap-[16px] items-start">
            <p
              className={`hidden sm:block font-medium text-white h-full text-[12px] sm:text-[20px] py-[4px] sm:py-[6px] px-[8px] bg-DLS ${
                game.hasDlc ? "block" : "hidden sm:hidden"
              }`}>
              DLS
            </p>
            <h3 className="text-lg font-medium text-white text-[14px] sm:text-[20px] leading-[17px] sm:leading-[24px] mb-[8px] sm:mb-[14px] h-[34px] sm:h-[52px] overflow-hidden">
              {game.title}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p
              className={`block sm:hidden font-medium text-white h-full text-[12px] sm:text-[20px] py-[4px] sm:py-[6px] px-[8px] bg-DLS ${
                game.hasDlc ? "block" : "hidden"
              }`}>
              DLS
            </p>

            <div className="flex flex-col sm:flex-row gap-[1px] sm:gap-[20px] items-end mr-auto w-full">
              {discountPrice &&
              game.discount &&
              game.discount > 0 &&
              !isDiscountExpired ? (
                <>
                  <span className="text-white font-bold text-[15px] sm:text-[28px] leading-[17px] sm:leading-[28px]">
                    {discountPrice}$
                  </span>{" "}
                  <span className="line-through text-gray-68 font-bold text-[12px] sm:text-[20px] leading-[14px] sm:leading-[20px]">
                    {game.price}$
                  </span>{" "}
                  <span
                    className={`absolute right-0 sm:bottom-[130px] md:sticky md:right-auto md:bottom-auto text-white font-bold text-[13px] sm:text-[18px] py-[4px] px-[8px] sm:py-[7px] sm:px-[16px] rounded-[2px] bg-sale ${
                      showSaleTimer && discountTime
                        ? "bottom-[132px]"
                        : "bottom-[102px]"
                    }`}>
                    -{game.discount}%
                  </span>
                </>
              ) : (
                <span className="text-white font-bold text-[15px] sm:text-[28px]">
                  {game.price}$
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="h-[7px] w-[50%] absolute bottom-0 left-[50%] bg-primary-main translate-x-[-50%] blur-[30px] z-0"></div>
      </div>
      {/* Блок Pre-order */}
      {game.preOrder && game.releaseDate && (
        <div className="block max-w-[284px] mx-auto mt-[12px] py-[4px] px-[12px] skew-x-[-20deg] bg-primary-main">
          <p className="skew-x-[20deg] text-center text-black text-[12px] sm:text-[16px]">
            PRE-ORDER {formatReleaseDate(game.releaseDate)}
          </p>
        </div>
      )}
    </div>
  );
};

export default GameCard;
