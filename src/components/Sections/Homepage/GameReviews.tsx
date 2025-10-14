"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Image from "next/image";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface Review {
  gameId: number;
  username: string;
  liked: boolean;
  review: string[];
}

interface Game {
  id: number;
  title: string;
  image: string;
}

const LikeIcon = ({ className }: { className?: string }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.1455 10.105C10.8348 10.4675 10.6641 10.9291 10.6641 11.4066V23.3334C10.6641 24.4379 11.5595 25.3334 12.6641 25.3334H23.6616C24.6281 25.3334 25.4564 24.6421 25.6293 23.6911L27.5687 13.0245C27.7919 11.7968 26.8488 10.6667 25.601 10.6667H18.6641L20.8346 4.15516C21.1193 3.30109 20.7326 2.36765 19.9274 1.96504V1.96504C19.1849 1.59381 18.2851 1.77552 17.7448 2.40579L11.1455 10.105Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M5.33333 24V12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const GameReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageSrcs, setImageSrcs] = useState<{ [key: number]: string }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dynamicMargin, setDynamicMargin] = useState<string>("0px");
  const [dynamicPadding, setDynamicPadding] = useState<string>("0px");
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/games?type=game");
      if (!response.ok)
        throw new Error(`Fetch error: ${await response.text()}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setGames(data);
        setImageSrcs(
          data.reduce(
            (acc, game) => ({
              ...acc,
              [game.id]:
                game.image && game.image.trim()
                  ? game.image
                  : "/images/no-image.jpg",
            }),
            {}
          )
        );
      } else {
        throw new Error("Invalid games data format from API");
      }
    } catch (error) {
      throw new Error(`Failed to fetch games: ${error}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();

    const savedReviews = localStorage.getItem("gameReviews");
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      const initialReviews: Review[] = [
        {
          gameId: 1,
          username: "GamingGuru",
          liked: true,
          review: [
            "This game offers an incredible experience with stunning graphics that truly immerse you in its world. The attention to detail in the environments is remarkable, and the soundtrack enhances the atmosphere perfectly.",
            "The gameplay mechanics are smooth and engaging, providing hours of entertainment.",
            "However, there are some minor issues with optimization that can cause occasional lag. The multiplayer mode is a highlight, allowing for cooperative play that adds depth and excitement to every session.",
          ],
        },
        {
          gameId: 2,
          username: "PixelQueen",
          liked: false,
          review: [
            "This game disappointed me with its slow pace and outdated controls that feel clunky and unresponsive. The story has some interesting moments, but the delivery is lackluster.",
            "The graphics are decent but lack the polish of modern titles, and the lack of updates is noticeable.",
            "On the positive side, the single-player campaign offers a decent narrative, though it’s marred by technical issues that detract from the overall experience.",
          ],
        },
        {
          gameId: 3,
          username: "ShadowRiser",
          liked: true,
          review: [
            "An absolutely addictive game that keeps you hooked with its rich world and deep character customization options. The combat system is fluid and rewarding.",
            "The open-world design encourages exploration, though some quests can feel repetitive after a while.",
            "The loading times are a bit frustrating, but the breathtaking visuals and immersive storyline more than make up for it.",
          ],
        },
      ];
      setReviews(initialReviews);
      localStorage.setItem("gameReviews", JSON.stringify(initialReviews));
    }
  }, [fetchGames]);

  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem("gameReviews", JSON.stringify(reviews));
    }
  }, [reviews]);

  useEffect(() => {
    const detectTouchDevice = () => {
      if (typeof window !== "undefined") {
        const isTouch =
          navigator.maxTouchPoints > 0 ||
          window.matchMedia("(pointer: coarse)").matches;
        setIsTouchDevice(isTouch);
      }
    };

    const updateDynamicStyles = () => {
      if (typeof window === "undefined") return;
      const width = window.innerWidth;
      setWindowWidth(width);
      let calculatedOffset: number;

      if (width < 1700) {
        if (width < 576) {
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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current || isTouchDevice || windowWidth >= 1200)
      return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.classList.add("cursor-grabbing");
    scrollContainerRef.current.classList.add("select-none");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      !isDragging ||
      !scrollContainerRef.current ||
      isTouchDevice ||
      windowWidth >= 1200
    )
      return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (!scrollContainerRef.current || isTouchDevice || windowWidth >= 1200)
      return;
    setIsDragging(false);
    scrollContainerRef.current.classList.remove("cursor-grabbing");
    scrollContainerRef.current.classList.remove("select-none");
    scrollContainerRef.current.classList.add(
      windowWidth < 1200 ? "cursor-grab" : "cursor-auto"
    );
  };

  const reviewItems = useMemo(() => {
    return reviews
      .slice(0, 3)
      .map((review, index) => {
        const game = games.find((g) => g.id === review.gameId);
        if (!game) {
          return null;
        }

        return (
          <div
            key={index}
            className="min-w-[268px] sm:min-w-[340px] flex flex-col gap-[8px] w-[calc(100%/3)]"
            aria-label={`Review by ${review.username} for ${game.title}`}>
            <div className="card-corner w-full h-[176px] sm:h-[273px] relative flex-shrink-0">
              <Link
                href={`/all-games/${game.id}`}
                className="w-full h-full"
                aria-label={`View game ${game.title}`}>
                <Image
                  src={imageSrcs[game.id] || "/images/no-image.jpg"}
                  alt={`Cover image for ${game.title}`}
                  width={520}
                  height={273}
                  className="object-cover w-full h-full rounded-[8px]"
                  loading="lazy"
                  onError={() =>
                    setImageSrcs((prev) => ({
                      ...prev,
                      [game.id]: "/images/no-image.jpg",
                    }))
                  }
                />
              </Link>
            </div>
            <div className="card-corner bg-2 flex flex-col items-center p-[20px] pb-[32px] gap-[16px] h-full max-h-[400px]">
              <div
                className={`h-[20px] w-[50%] absolute top-0 left-[50%] ${
                  !review.liked ? "bg-red" : "bg-primary-main"
                } translate-x-[-50%] blur-[50px] z-0`}
                aria-hidden="true"></div>
              <div className="flex items-center justify-between gap-[16px] w-full">
                <div className="flex items-center justify-start w-full gap-[16px]">
                  <div
                    className="w-[44px] h-[44px] sm:w-[64px] sm:h-[64px] bg-3 rounded-full flex justify-center items-center flex-shrink-0"
                    aria-hidden="true">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[28px] h-[28px] sm:w-[40px] sm:h-[40px]"
                      aria-hidden="true">
                      <circle
                        cx="20.0026"
                        cy="19.9999"
                        r="15.4167"
                        stroke="#4EF432"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M19.0601 13.7957L15.8672 24.6177L16.1693 25.1209H22.1571"
                        stroke="#4EF432"
                        strokeWidth="2.5"
                        strokeLinecap="square"
                      />
                      <path
                        d="M27.3125 18.623H27.3292"
                        stroke="#4EF432"
                        strokeWidth="2.5"
                        strokeLinecap="square"
                      />
                      <path
                        d="M11.5547 18.623H11.5714"
                        stroke="#4EF432"
                        strokeWidth="2.5"
                        strokeLinecap="square"
                      />
                    </svg>
                  </div>
                  <div
                    className="text-white font-bold text-[15px] sm:text-[20px] overflow-hidden text-ellipsis whitespace-nowrap"
                    aria-label={`Username: ${review.username}`}>
                    {review.username}
                  </div>
                </div>
                <LikeIcon
                  className={`${
                    !review.liked ? "rotate-180" : ""
                  } w-[28px] h-[28px] sm:w-[40px] md:h-[40px] flex-shrink-0`}
                  aria-label={
                    review.liked ? "Positive review" : "Negative review"
                  }
                />
              </div>
              <div className="flex flex-col gap-[16px] w-full line-clamp-[14] sm:line-clamp-[10] overflow-hidden">
                {review.review.map((paragraph, idx) => (
                  <Text
                    key={idx}
                    className="text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px]"
                    aria-label={`Review paragraph ${idx + 1} by ${
                      review.username
                    }: ${paragraph}`}>
                    {paragraph}
                  </Text>
                ))}
              </div>
            </div>
          </div>
        );
      })
      .filter((item): item is JSX.Element => item !== null);
  }, [reviews, games, imageSrcs]);

  if (loading) {
    return (
      <p className="text-gray-68" aria-live="polite">
        Loading...
      </p>
    );
  }

  return (
    <section aria-label="Game Reviews Section">
      <div className="mb-[24px] sm:mb-[40px] flex justify-between items-center gap-[24px]">
        <Heading variant="h1" aria-label="Game Reviews Title">
          Gamer Reviews
        </Heading>
        <Button
          variant="secondary"
          className="max-w-[238px] mr-[10px] hidden md:block"
          disabled
          onClick={() => {
            window.location.href = "/";
          }}
          aria-label="View all games (currently disabled)">
          see all games
        </Button>
      </div>
      <div
        className="mx-auto relative max-w-[1920px] overflow-hidden"
        style={{
          marginLeft: dynamicMargin,
          marginRight: dynamicMargin,
        }}>
        <div
          ref={scrollContainerRef}
          className={`flex overflow-scroll hide-scrollbar gap-[12px] sm:gap-[16px] lg:gap-[24px] ${
            windowWidth < 1200 && !isTouchDevice
              ? "cursor-grab select-none"
              : "cursor-auto"
          }`}
          style={{
            paddingLeft: dynamicPadding,
            paddingRight: dynamicPadding,
          }}
          aria-label="Game reviews carousel"
          {...(windowWidth < 1200 && !isTouchDevice
            ? {
                onMouseDown: handleMouseDown,
                onMouseMove: handleMouseMove,
                onMouseUp: handleMouseUpOrLeave,
                onMouseLeave: handleMouseUpOrLeave,
              }
            : {})}>
          {reviewItems.length > 0 ? (
            reviewItems
          ) : (
            <Text
              className="text-center text-gray-68 w-full"
              aria-live="polite">
              No reviews available for the current games.
            </Text>
          )}
        </div>
      </div>
    </section>
  );
};

export default GameReviewsSection;
