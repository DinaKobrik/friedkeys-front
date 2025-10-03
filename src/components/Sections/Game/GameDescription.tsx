"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";

const GameDescription: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dynamicMargin, setDynamicMargin] = useState<string>("0px");
  const [dynamicPadding, setDynamicPadding] = useState<string>("0px");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [windowSize, setWindowSize] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  const gameData = [
    {
      photo: "/images/game-slider/game-slide1.png",
      subtitle: "Game Feature 1",
      description:
        "This is the first feature of the game, offering an exciting experience with unique gameplay mechanics.",
    },
    {
      photo: "/images/game-slider/game-slide2.png",
      subtitle: "Game Feature 2",
      description:
        "Explore the second feature with enhanced graphics, immersive sound design, and a variety of customizable options that allow players to tailor their experience. This feature includes detailed environments, dynamic lighting effects, and a rich soundtrack that adapts to the gameplay, providing a deeply engaging and interactive world for hours of entertainment.",
    },
    {
      photo: "/images/game-slider/game-slide3.png",
      subtitle: "Game Feature 3",
      description:
        "Discover the third feature, packed with challenges and rewards for players.",
    },
    {
      photo: "/images/game-slider/game-slide4.png",
      subtitle: "Game Feature 4",
      description:
        "Unveil the fourth feature with innovative multiplayer modes and competitive leaderboards to test your skills against others.",
    },
    {
      photo: "/images/game-slider/game-slide5.png",
      subtitle: "Game Feature 5",
      description:
        "Experience the fifth feature, featuring an expansive open world with diverse biomes, intricate quest lines, hidden treasures, and a dynamic weather system that enhances the realism and strategic depth of the gameplay.",
    },
  ];

  const updateDynamicStyles = () => {
    const windowWidth = window.innerWidth;
    const scrollbarWidthValue =
      window.innerWidth - document.documentElement.clientWidth;
    const isTouchDevice = navigator.maxTouchPoints > 0;

    let calculatedOffset: number;
    if (windowWidth < 576) {
      calculatedOffset = 16;
      setDynamicMargin(`-${calculatedOffset}px`);
    } else if (windowWidth >= 576 && windowWidth < 1700) {
      calculatedOffset = 46;
      setDynamicMargin(`-${calculatedOffset}px`);
    } else if (windowWidth >= 1607 && windowWidth <= 1609) {
      calculatedOffset = 146;
      setDynamicMargin(`-${calculatedOffset}px`);
    } else if (windowWidth > 1608 && windowWidth <= 1920) {
      calculatedOffset = isTouchDevice
        ? (windowWidth - 1608) / 2
        : (windowWidth - scrollbarWidthValue - 1608) / 2;
      setDynamicMargin(`-${calculatedOffset}px`);
    } else {
      calculatedOffset = 146;
      setDynamicMargin("-146px");
    }

    setDynamicPadding(`${calculatedOffset}px`);
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
    <section>
      <Heading variant="h1" className="mb-[24px] sm:mb-[40px]">
        Description
      </Heading>
      <div
        className="mx-auto description__custom-scroll relative max-w-[1920px] overflow-hidden"
        style={{ marginLeft: dynamicMargin, marginRight: dynamicMargin }}>
        <div
          ref={containerRef}
          className="flex gap-[12px] sm:gap-[24px] overflow-x-auto scrollbar-hide custom-scrollbar-h items-start pb-[28px] sm:pb-[60px]"
          style={{ paddingLeft: dynamicPadding, paddingRight: dynamicPadding }}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}>
          {gameData.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[268px] sm:w-[394px] lg:w-[520px]">
              <div className="card-corner h-[160px] sm:h-[220px] lg:h-[280px] relative mb-[16px] sm:mb-[32px]">
                <Image
                  src={item.photo}
                  alt={item.subtitle}
                  width={520}
                  height={280}
                  className="object-cover h-full w-full"
                  draggable="false"
                />
              </div>
              <Heading variant="h3" className="mb-[8px] sm:mb-[16px]">
                {item.subtitle}
              </Heading>
              <Text>{item.description}</Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameDescription;
