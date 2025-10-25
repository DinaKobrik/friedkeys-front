"use client";

import React, { useState, useEffect, useRef } from "react";
import Heading from "@/components/ui/Heading";
import GameCard from "../GameCard";
import { Game } from "@/types/game";

const Recommendations: React.FC = () => {
  const [recommendedGames, setRecommendedGames] = useState<Game[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dynamicMargin, setDynamicMargin] = useState<string>("0px");
  const [dynamicPadding, setDynamicPadding] = useState<string>("0px");
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const url = new URL("/api/games", window.location.origin);
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`Fetch error: ${await res.text()}`);
        const data = await res.json();

        // Sort by reviews and select top 3, excluding preorders
        const topGames = data
          .filter((game: Game) => !game.preOrder && game.reviews)
          .sort((a: Game, b: Game) => (b.reviews || 0) - (a.reviews || 0))
          .slice(0, 3);
        setRecommendedGames(topGames);
      } catch (error) {
        throw new Error(`Failed to fetch games: ${error}`);
      }
    };
    fetchGames();
  }, []);

  useEffect(() => {
    const detectTouchDevice = () => {
      const isTouch =
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;
      setIsTouchDevice(isTouch);
    };

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
    };

    detectTouchDevice();
    updateDynamicStyles();
    window.addEventListener("resize", updateDynamicStyles);
    return () => window.removeEventListener("resize", updateDynamicStyles);
  }, []);

  const handleDragStart = (e: React.MouseEvent) => {
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

    const handleDragEnd = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleDragEnd);
      if (containerRef.current) {
        containerRef.current.style.cursor = "grab";
        containerRef.current.style.userSelect = "auto";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleDragEnd);
    containerRef.current.style.cursor = "grabbing";
    containerRef.current.style.userSelect = "none";
  };

  const handleDragEnd = () => {
    if (!containerRef.current || isTouchDevice) return;
    containerRef.current.style.cursor = "grab";
    containerRef.current.style.userSelect = "auto";
  };

  return (
    <section aria-label="Recommendations Section">
      <Heading
        variant="h1"
        aria-label="Recommendations Title"
        className="mb-[24px] sm:mb-[30px]">
        Recommendations
      </Heading>
      <div
        className="mx-auto relative max-w-[1920px] overflow-hidden"
        style={{ marginLeft: dynamicMargin, marginRight: dynamicMargin }}>
        <div
          ref={containerRef}
          className="flex max-w-[100%] overflow-x-auto hide-scrollbar gap-[12px] sm:gap-[16px] lg:gap-[18px] w-full items-start"
          aria-label="Recommended games carousel"
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
          {recommendedGames.length > 0 ? (
            recommendedGames.map((game) => (
              <div
                key={game.id}
                className="flex-shrink-0 max-w-[175px] sm:min-w-[200px] md:max-w-[340px] lg:max-w-[calc((100%-48px)/3)] w-full"
                aria-label={`Game: ${game.title}`}>
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
