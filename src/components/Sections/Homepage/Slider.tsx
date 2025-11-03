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
  const [dynamicMargin, setDynamicMargin] = useState<string>("0px");
  const [dynamicPadding, setDynamicPadding] = useState<string>("0px");
  const [calculatedOffset, setCalculatedOffset] = useState<number>(146);
  const [windowSize, setWindowSize] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const sliderRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);
  const intervalRef = useRef<number | null>(null);

  const updateDynamicStyles = () => {
    const windowWidth = window.innerWidth;
    const scrollbarWidthValue =
      window.innerWidth - document.documentElement.clientWidth;
    const isTouchDevice = navigator.maxTouchPoints > 0;

    let calculatedOffset: number;
    if (windowWidth < 576) {
      calculatedOffset = 16;
      setDynamicMargin(`-${calculatedOffset}px`);
    } else if (windowWidth >= 576 && windowWidth < 1292) {
      calculatedOffset = 46;
      setDynamicMargin(`-${calculatedOffset}px`);
    } else if (windowWidth >= 1199 && windowWidth <= 1201) {
      calculatedOffset = 146;
      setDynamicMargin(`-${calculatedOffset}px`);
    } else if (windowWidth > 1200) {
      calculatedOffset = isTouchDevice
        ? (windowWidth - scrollbarWidthValue - 1200) / 2
        : (windowWidth - scrollbarWidthValue - 1200) / 2;
      setDynamicMargin(`-${calculatedOffset}px`);
    } else {
      calculatedOffset = 146;
      setDynamicMargin("-146px");
    }

    setCalculatedOffset(calculatedOffset);
    setDynamicPadding(`${calculatedOffset}px`);
    setWindowSize(windowWidth);
  };

  const debounce = <T extends (...args: unknown[]) => void>(
    func: T,
    wait: number
  ) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

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

    updateDynamicStyles();
    const debouncedUpdate = debounce(updateDynamicStyles, 100);
    window.addEventListener("resize", debouncedUpdate);
    return () => window.removeEventListener("resize", debouncedUpdate);
  }, []);

  const topGames = useMemo(() => {
    return games
      .filter((game: Game) => game.id >= 12)
      .sort((a: Game, b: Game) => a.id - b.id)
      .slice(0, 3)
      .map((game: Game) => ({
        ...game,
        banner:
          game.image && game.image.trim() ? game.image : "/images/no-image.jpg",
      }));
  }, [games]);

  useLayoutEffect(() => {
    const updateSliderDimensions = () => {
      if (ulRef.current && sliderRef.current && topGames.length > 0) {
        requestAnimationFrame(() => {
          if (ulRef.current && sliderRef.current) {
            const scrollbarWidthValue =
              window.innerWidth - document.documentElement.clientWidth;
            const slideWidth = window.innerWidth - scrollbarWidthValue;
            ulRef.current.style.width = `${slideWidth * topGames.length}px`;
            ulRef.current.style.transform = `translateX(-${
              slideWidth + calculatedOffset
            }px)`;
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
  }, [topGames, calculatedOffset, windowSize]);

  const moveLeft = () => {
    if (!ulRef.current || !sliderRef.current) return;
    const scrollbarWidthValue =
      window.innerWidth - document.documentElement.clientWidth;
    const slideWidth = window.innerWidth - scrollbarWidthValue;
    ulRef.current.style.transition = "transform 0.2s ease-in-out";
    ulRef.current.style.transform = `translateX(-${calculatedOffset}px)`;
    setTimeout(() => {
      if (ulRef.current) {
        const lastSlide = ulRef.current.lastElementChild;
        if (lastSlide) {
          ulRef.current.insertBefore(lastSlide, ulRef.current.firstChild);
        }
        ulRef.current.style.transition = "none";
        ulRef.current.style.transform = `translateX(-${
          slideWidth + calculatedOffset
        }px)`;
      }
    }, 200);
    resetAutoScroll();
  };

  const moveRight = () => {
    if (!ulRef.current || !sliderRef.current) return;
    const scrollbarWidthValue =
      window.innerWidth - document.documentElement.clientWidth;
    const slideWidth = window.innerWidth - scrollbarWidthValue;
    ulRef.current.style.transition = "transform 0.2s ease-in-out";
    ulRef.current.style.transform = `translateX(-${
      slideWidth * 2 + calculatedOffset
    }px)`;
    setTimeout(() => {
      if (ulRef.current) {
        const firstSlide = ulRef.current.firstElementChild;
        if (firstSlide) {
          ulRef.current.appendChild(firstSlide);
        }
        ulRef.current.style.transition = "none";
        ulRef.current.style.transform = `translateX(-${
          slideWidth + calculatedOffset
        }px)`;
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
      const scrollbarWidthValue =
        window.innerWidth - document.documentElement.clientWidth;
      const slideWidth = window.innerWidth - scrollbarWidthValue;
      ulRef.current.style.transition = "transform 0.2s ease-in-out";
      ulRef.current.style.transform = `translateX(-${
        slideWidth + calculatedOffset
      }px)`;
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

  return (
    <section
      className="home__slider relative mx-auto bg-dark"
      style={{ marginLeft: dynamicMargin, marginRight: dynamicMargin }}>
      <div
        key={windowSize}
        className="mx-auto max-w-[1920px] overflow-hidden"
        aria-label="Game Slider Section">
        {loading ? (
          <p className="text-center py-10 text-gray-68" aria-live="polite">
            Loading slider...
          </p>
        ) : topGames.length > 0 ? (
          <div
            className="relative overflow-hidden"
            ref={sliderRef}
            style={{
              paddingLeft: dynamicPadding,
              paddingRight: dynamicPadding,
            }}>
            <ul
              className="flex transition-transform duration-500 ease-in-out"
              ref={ulRef}
              onMouseDown={handleDragStart}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchEnd={handleDragEnd}
              aria-label="Game slides">
              {topGames.map((game: Game, index: number) => (
                <li
                  key={index}
                  className="w-[100vw] home__slide flex-shrink-0"
                  style={{
                    width: `calc(100vw - ${
                      window.innerWidth - document.documentElement.clientWidth
                    }px)`,
                  }}
                  aria-label={`Slide for ${game.title}`}>
                  <Link
                    href={`/all-games/${game.id}`}
                    className="w-full h-full max-w-[1920px] block bg-dark relative"
                    aria-label={`View game ${game.title}`}>
                    <div className="relative home__slide-img max-w-[1200px] w-full h-full mx-auto">
                      <Image
                        src={game.image || "/images/no-image.jpg"}
                        alt={`Banner image for ${game.title}`}
                        width={1920}
                        height={440}
                        className="max-w-[1200px] w-full mx-auto h-[216px] sm:h-[340px] md:h-[440px] xl:h-[500px] object-cover no-drag"
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <button
              onClick={moveLeft}
              className="absolute top-1/2 transform -translate-y-1/2 w-[48px] h-[48px] hidden md:flex justify-center items-center p-[12px] rounded-full bg-DLS backdrop-blur-[10px] z-10"
              style={{
                left: windowSize > 1700 ? "250px" : dynamicPadding,
                marginLeft: 0,
              }}
              aria-label="Previous slide">
              <svg
                width="9"
                height="16"
                viewBox="0 0 12 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true">
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
              className="absolute top-1/2 transform -translate-y-1/2 w-[48px] h-[48px] hidden md:flex justify-center items-center p-[16px] rounded-full bg-DLS backdrop-blur-[10px] z-10"
              style={{
                right: windowSize > 1700 ? "250px" : dynamicPadding,
                marginRight: 0,
              }}
              aria-label="Next slide">
              <svg
                width="9"
                height="16"
                viewBox="0 0 12 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true">
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
      </div>
    </section>
  );
};

export default Slider;
