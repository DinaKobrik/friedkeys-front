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
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    const fetchGames = async () => {
      const url = new URL("/api/games", window.location.origin);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`Fetch error: ${await res.text()}`);
      const data = await res.json();

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
    <section aria-label="Pre-Orders Section">
      <div className="mb-[24px] sm:mb-[30px] flex justify-between items-center">
        <Heading variant="h1" aria-label="Pre-Orders Title">
          Pre-orders
        </Heading>
        <Button
          variant="secondary"
          className="max-w-[178px] mr-[8px] hidden md:block"
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
          className="w-full flex lg:grid overflow-x-auto hide-scrollbar grid-cols-6 lg:overflow-visible lg:grid-flow-row lg:grid-cols-3 gap-[12px] sm:gap-[16px] lg:gap-[18px] items-start"
          aria-label="Pre-order games carousel"
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
          {preOrderGames.length > 0 ? (
            preOrderGames.map((game) => (
              <div
                key={game.id}
                className="flex-shrink-0 max-w-[175px] sm:min-w-[200px] md:max-w-[340px] lg:max-w-[520px] w-full">
                <GameCard game={game} />
              </div>
            ))
          ) : (
            <p className="text-gray-68" aria-live="polite">
              Loading pre-orders...
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PreOrders;
