"use client";

import React, { useState, useEffect, useRef } from "react";
import Heading from "@/components/ui/Heading";
import GameCard from "../GameCard";
import { Game } from "@/types/game";

const Recommendations = () => {
  const [recommendedGames, setRecommendedGames] = useState<Game[]>([]);
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

      // Сортировка по количеству отзывов и выбор топ-3, исключая предзаказы
      const topGames = data
        .filter((game: Game) => !game.preOrder && game.reviews)
        .sort((a: Game, b: Game) => (b.reviews || 0) - (a.reviews || 0))
        .slice(0, 3);
      setRecommendedGames(topGames);
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
    <section role="region" aria-label="Recommendations Section">
      <Heading
        variant="h1"
        aria-label="Recommendations Title"
        className="mb-[24px] sm:mb-[40px]">
        Recommendations
      </Heading>
      <div
        className="mx-auto relative max-w-[1920px] overflow-hidden"
        style={{ marginLeft: dynamicMargin, marginRight: dynamicMargin }}>
        <div
          ref={containerRef}
          className="flex max-w-[100%] overflow-x-auto hide-scrollbar gap-[12px] sm:gap-[16px] lg:gap-[24px] w-full items-start"
          role="region"
          aria-label="Recommended games carousel"
          style={{ paddingLeft: dynamicPadding, paddingRight: dynamicPadding }}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}>
          {recommendedGames.length > 0 ? (
            recommendedGames.map((game) => (
              <div
                key={game.id}
                className="flex-shrink-0 max-w-[175px] sm:min-w-[200px] md:max-w-[340px] lg:max-w-[calc((100%-48px)/3)] w-full"
                role="listitem">
                <GameCard game={game} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-68" aria-live="polite">
              Loading recommendations...
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Recommendations;
