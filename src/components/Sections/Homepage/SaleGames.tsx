"use client";

import React, { useState, useEffect, useRef } from "react";
import Heading from "@/components/ui/Heading";
import GameCard from "@/components/Sections/GameCard";
import { Game } from "@/types/game";
import Button from "@/components/ui/Button";

const DiscountedGames = () => {
  const [discountedGames, setDiscountedGames] = useState<Game[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dynamicMargin, setDynamicMargin] = useState<string>("0px");
  const [dynamicPadding, setDynamicPadding] = useState<string>("0px");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [windowSize, setWindowSize] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

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

  const updateDynamicStyles = () => {
    const windowWidth = window.innerWidth;
    let calculatedOffset: number;

    if (windowWidth < 992) {
      if (windowWidth < 576) {
        calculatedOffset = 16;
      } else {
        calculatedOffset = 46;
      }
      setDynamicMargin(`-${calculatedOffset}px`);
      setDynamicPadding(`${calculatedOffset}px`);
    } else {
      calculatedOffset = 0;
      setDynamicMargin("0px");
      setDynamicPadding("0px");
    }

    setWindowSize(windowWidth);
  };

  useEffect(() => {
    updateDynamicStyles();
    window.addEventListener("resize", updateDynamicStyles);
    return () => window.removeEventListener("resize", updateDynamicStyles);
  }, []);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;

    let startX: number;
    if ("touches" in e) {
      startX = e.touches[0].clientX;
    } else {
      startX = e.clientX;
    }

    const scrollLeft = containerRef.current.scrollLeft;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX;
      const walk = (currentX - startX) * 2;
      if (containerRef.current) {
        containerRef.current.scrollLeft = scrollLeft - walk;
      }
    };

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const currentX = moveEvent.touches[0].clientX;
      const walk = (currentX - startX) * 2;
      if (containerRef.current) {
        containerRef.current.scrollLeft = scrollLeft - walk;
      }
    };

    const handleDragEnd = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchend", handleDragEnd);
      if (containerRef.current) {
        containerRef.current.style.cursor = "grab";
        containerRef.current.style.userSelect = "auto";
      }
    };

    if ("touches" in e) {
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleDragEnd);
    } else {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleDragEnd);
    }
    containerRef.current.style.cursor = "grabbing";
    containerRef.current.style.userSelect = "none";
  };

  const handleDragEnd = () => {
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
      containerRef.current.style.userSelect = "auto";
    }
  };

  return (
    <section role="region" aria-label="Discounted Games Section">
      <div className="mb-[24px] sm:mb-[40px] flex justify-between items-center">
        <Heading variant="h1" aria-label="Discounted Games Title">
          Sale
        </Heading>
        <Button
          variant="secondary"
          className="max-w-[238px] mr-[10px] hidden md:block"
          onClick={() => {
            window.location.href = "/all-games?filter=sale";
          }}
          aria-label="View all discounted games">
          see all games
        </Button>
      </div>
      <div
        className="mx-auto relative max-w-[1920px] overflow-hidden"
        style={{ marginLeft: dynamicMargin, marginRight: dynamicMargin }}>
        <div
          ref={containerRef}
          className="flex overflow-x-auto hide-scrollbar gap-[12px] sm:gap-[16px] lg:gap-[24px] w-full items-start"
          role="region"
          aria-label="Discounted games carousel"
          style={{ paddingLeft: dynamicPadding, paddingRight: dynamicPadding }}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}>
          {discountedGames.length > 0 ? (
            discountedGames.map((game) => (
              <div
                key={game.id}
                className="flex-shrink-0 max-w-[175px] sm:min-w-[200px] md:max-w-[340px] lg:max-w-[calc((100%-48px)/3)] w-full"
                role="listitem">
                <GameCard game={game} showSaleTimer={true} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-68" aria-live="polite">
              Loading discounted games...
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default DiscountedGames;
