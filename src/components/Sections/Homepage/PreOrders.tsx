"use client";

import React, { useState, useEffect, useRef } from "react";
import Heading from "@/components/ui/Heading";
import GameCard from "@/components/Sections/GameCard";
import { Game } from "@/types/game";
import Button from "@/components/ui/Button";

const PreOrders = () => {
  const [preOrderGames, setPreOrderGames] = useState<Game[]>([]);
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

      // Фильтрация и сортировка по ближайшей дате выхода
      const topPreOrderGames = data
        .filter((game: Game) => game.preOrder && game.releaseDate)
        .sort((a: Game, b: Game) => {
          const aReleaseTime = new Date(a.releaseDate!).getTime();
          const bReleaseTime = new Date(b.releaseDate!).getTime();
          return aReleaseTime - bReleaseTime;
        })
        .slice(0, 6);

      setPreOrderGames(topPreOrderGames);
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
    <section role="region" aria-label="Pre-Orders Section">
      <div className="mb-[24px] sm:mb-[40px] flex justify-between items-center">
        <Heading variant="h1" aria-label="Pre-Orders Title">
          Pre-orders
        </Heading>
        <Button
          variant="secondary"
          className="max-w-[238px] mr-[10px] hidden md:block"
          onClick={() => {
            window.location.href = "/all-games?filter=pre-orders";
          }}
          aria-label="View all pre-order games">
          see all games
        </Button>
      </div>
      <div
        className="mx-auto relative max-w-[1920px] overflow-hidden"
        style={{ marginLeft: dynamicMargin, marginRight: dynamicMargin }}>
        <div
          ref={containerRef}
          className="w-full flex lg:grid overflow-x-auto hide-scrollbar grid-cols-6 lg:overflow-visible lg:grid-flow-row lg:grid-cols-3 gap-[12px] sm:gap-[16px] lg:gap-[24px] items-start"
          role="region"
          aria-label="Pre-order games carousel"
          style={{ paddingLeft: dynamicPadding, paddingRight: dynamicPadding }}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}>
          {preOrderGames.length > 0 ? (
            preOrderGames.map((game) => (
              <div
                key={game.id}
                className="flex-shrink-0 max-w-[175px] sm:min-w-[200px] md:max-w-[340px] lg:max-w-[520px] w-full"
                role="listitem">
                <GameCard game={game} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-68" aria-live="polite">
              Loading pre-orders...
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PreOrders;
