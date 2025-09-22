"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useLayoutEffect,
} from "react";
import Image from "next/image";
import { Game } from "@/types/game";
import Link from "next/link";

const Slider: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1920
  );
  const sliderRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/games?type=game");
        const data = await response.json();
        if (Array.isArray(data)) {
          setGames(data);
        } else {
          console.warn("Invalid games data format from API");
        }
      } catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const topGames = useMemo(() => {
    return games
      .sort((a: Game, b: Game) => a.id - b.id)
      .slice(0, 5)
      .map((game: Game) => ({
        ...game,
        image: game.image || "/placeholder.jpg",
      }));
  }, [games]);

  useLayoutEffect(() => {
    const updateSliderDimensions = () => {
      if (ulRef.current && sliderRef.current && topGames.length > 0) {
        requestAnimationFrame(() => {
          if (ulRef.current && sliderRef.current) {
            const slideWidth = sliderRef.current.offsetWidth;
            ulRef.current.style.width = `${slideWidth * topGames.length}px`;
            ulRef.current.style.transform = `translateX(-${slideWidth}px)`;
            const lastSlide = ulRef.current.lastElementChild;
            if (lastSlide) {
              ulRef.current.insertBefore(lastSlide, ulRef.current.firstChild);
            }
          }
        });
      }
    };

    updateSliderDimensions();
    const resizeObserver = new ResizeObserver(updateSliderDimensions);
    if (sliderRef.current) {
      resizeObserver.observe(sliderRef.current);
    }

    const currentSliderRef = sliderRef.current;
    return () => {
      if (currentSliderRef) {
        resizeObserver.unobserve(currentSliderRef);
      }
    };
  }, [topGames, screenWidth]);

  const moveLeft = () => {
    if (!ulRef.current || !sliderRef.current) return;
    const slideWidth = sliderRef.current.offsetWidth;
    ulRef.current.style.transition = "transform 0.2s ease-in-out";
    ulRef.current.style.transform = `translateX(0)`;
    setTimeout(() => {
      if (ulRef.current) {
        const lastSlide = ulRef.current.lastElementChild;
        if (lastSlide) {
          ulRef.current.insertBefore(lastSlide, ulRef.current.firstChild);
        }
        ulRef.current.style.transition = "none";
        ulRef.current.style.transform = `translateX(-${slideWidth}px)`;
      }
    }, 200);
    resetAutoScroll();
  };

  const moveRight = () => {
    if (!ulRef.current || !sliderRef.current) return;
    const slideWidth = sliderRef.current.offsetWidth;
    ulRef.current.style.transition = "transform 0.2s ease-in-out";
    ulRef.current.style.transform = `translateX(-${slideWidth * 2}px)`;
    setTimeout(() => {
      if (ulRef.current) {
        const firstSlide = ulRef.current.firstElementChild;
        if (firstSlide) {
          ulRef.current.appendChild(firstSlide);
        }
        ulRef.current.style.transition = "none";
        ulRef.current.style.transform = `translateX(-${slideWidth}px)`;
      }
    }, 200);
    resetAutoScroll();
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!ulRef.current) return;
    ulRef.current.style.transition = "none";
    setIsDragging(true);
    setStartX("touches" in e ? e.touches[0].clientX : e.clientX);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !ulRef.current || !sliderRef.current) return;
    setIsDragging(false);
    const currentX = "touches" in e ? e.changedTouches[0].clientX : e.clientX;
    const diffX = startX - currentX;
    const threshold = 50;
    if (diffX > threshold) {
      ulRef.current.style.transition = "transform 0.2s ease-in-out";
      moveRight();
    } else if (diffX < -threshold) {
      ulRef.current.style.transition = "transform 0.2s ease-in-out";
      moveLeft();
    } else {
      const slideWidth = sliderRef.current.offsetWidth;
      ulRef.current.style.transition = "transform 0.2s ease-in-out";
      ulRef.current.style.transform = `translateX(-${slideWidth}px)`;
    }
    resetAutoScroll();
  };

  const resetAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    const intervalId = setInterval(
      () => moveRight(),
      3000
    ) as unknown as number;
    intervalRef.current = intervalId;
  };

  useEffect(() => {
    if (topGames.length <= 1 || !ulRef.current || !sliderRef.current) return;

    const autoScroll = () => {
      moveRight();
    };

    const intervalId = setInterval(autoScroll, 3000) as unknown as number;
    intervalRef.current = intervalId;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [topGames, screenWidth]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="relative home__slider w-full max-w-[1920px] mx-auto">
      {loading ? (
        <p className="text-center py-10 text-gray-68">Loading slider...</p>
      ) : topGames.length > 0 ? (
        <div className="relative overflow-hidden" ref={sliderRef}>
          <ul
            className="flex transition-transform duration-500 ease-in-out"
            ref={ulRef}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}>
            {topGames.map((game: Game, index: number) => (
              <li
                key={index}
                className="w-[100vw] home__slide bodyCustom:w-full flex-shrink-0 ">
                <Link href={`/all-games/${game.id}`} className="w-full h-full">
                  <Image
                    src={game.image}
                    alt={game.title || "Game Slider"}
                    width={1920}
                    height={880}
                    className="w-full h-[216px] sm:h-[440px] md:h-[580px] xl:h-[880px] object-cover no-drag"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <button
            onClick={moveLeft}
            className="absolute ml-[16px] sm:ml-[46px] bodyCustom:ml-[54px] left-0 top-1/2 transform -translate-y-1/2 w-[64px] h-[64px] hidden md:flex justify-center items-center p-[16px] rounded-full bg-DLS backdrop-blur-[10px] z-10"
            aria-label="Scroll left">
            <svg
              width="12"
              height="22"
              viewBox="0 0 12 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.6641 20.3334L1.33073 11.0001L10.6641 1.66675"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </button>
          <button
            onClick={moveRight}
            className="absolute mr-[16px] sm:mr-[46px] bodyCustom:mr-[54px] right-0 top-1/2 transform -translate-y-1/2 w-[64px] h-[64px] hidden md:flex justify-center items-center p-[16px] rounded-full bg-DLS backdrop-blur-[10px] z-10"
            aria-label="Scroll right">
            <svg
              width="12"
              height="22"
              viewBox="0 0 12 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.33588 1.66675L10.6693 11.0001L1.33588 20.3334"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </button>
        </div>
      ) : null}
    </section>
  );
};

export default Slider;
