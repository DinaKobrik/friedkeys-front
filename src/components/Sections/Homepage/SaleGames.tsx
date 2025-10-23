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
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    const fetchGames = async () => {
      const url = new URL("/api/games", window.location.origin);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`Fetch error: ${await res.text()}`);
      const data = await res.json();

      const now = new Date();

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
    <section
      className="max-w-[1200px] w-full mx-auto"
      aria-label="Discounted Games Section">
      <div className="mb-[24px] sm:mb-[30px] flex justify-between items-center">
        <Heading variant="h1" aria-label="Discounted Games Title">
          Sale
        </Heading>
        <Button
          variant="secondary"
          className="max-w-[178px] mr-[8px] hidden md:block"
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
          className="flex overflow-x-auto hide-scrollbar gap-[12px] sm:gap-[16px] lg:gap-[18px] w-full items-start"
          aria-label="Discounted games carousel"
          style={{
            paddingLeft: dynamicPadding,
            paddingRight: dynamicPadding,
            cursor: isTouchDevice ? "auto" : "grab",
          }}
          {...(!isTouchDevice
            ? {
                onMouseDown: handleDragStart,
                onMouseUp: handleDragEnd,
                onMouseLeave: handleDragEnd,
              }
            : {})}>
          {discountedGames.length > 0 ? (
            discountedGames.map((game) => (
              <div
                key={game.id}
                className="flex-shrink-0 max-w-[175px] sm:min-w-[200px] md:max-w-[340px] lg:max-w-[calc((100%-48px)/3)] w-full">
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
