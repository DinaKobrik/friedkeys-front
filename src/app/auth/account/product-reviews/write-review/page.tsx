"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  FormEvent,
  KeyboardEvent,
  Suspense,
} from "react";
import Image from "next/image";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { useRouter, useSearchParams } from "next/navigation";
import { Game } from "@/types/game";

// SVG
const LikeIcon = ({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    onClick={onClick}
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

interface Review {
  gameId: number;
  liked: boolean;
  review: string;
  pros: string;
  cons: string;
  likes: number;
  dislikes: number;
  date: string;
  order: string;
}

const ReviewContent: React.FC = React.memo(() => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [games, setGames] = useState<Game[]>([]);
  const [game, setGame] = useState<Game | null>(null);
  const [liked, setLiked] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [pros, setPros] = useState<string>("");
  const [cons, setCons] = useState<string>("");
  const [gameId, setGameId] = useState<number>(1);
  const [isTouchedReview, setIsTouchedReview] = useState(false);
  const [isValidReview, setIsValidReview] = useState(true);
  const [isLg, setIsLg] = useState(false);
  const [order, setOrder] = useState<string>("123456789");
  const [originalReview, setOriginalReview] = useState<Review | null>(null);

  const handleResize = useCallback(() => {
    setIsLg(window.innerWidth >= 992);
  }, []);

  const fetchGames = useCallback(async () => {
    try {
      const response = await fetch("/api/games?type=game");
      const data = await response.json();
      if (Array.isArray(data)) {
        setGames(data);
      } else {
        console.warn("Invalid games data format from API");
      }
    } catch (error) {
      console.error("Failed to fetch games:", error);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  useEffect(() => {
    const paramGameId = searchParams.get("gameId");
    const paramLiked = searchParams.get("liked") === "true";
    const paramOrder =
      searchParams.get("order") ||
      `ORD${Math.floor(100000 + Math.random() * 900000)}`;

    if (paramGameId) {
      const newGameId = Number(paramGameId);
      setGameId(newGameId);

      const storedReviews = localStorage.getItem("reviews");
      const reviews = storedReviews ? JSON.parse(storedReviews) : [];
      const existingReview = reviews.find(
        (r: Review) => r.gameId === newGameId
      );

      if (existingReview) {
        setOriginalReview(existingReview);
        setLiked(existingReview.liked);
        setReviewText(existingReview.review || "");
        setPros(existingReview.pros || "");
        setCons(existingReview.cons || "");
        setOrder(existingReview.order || paramOrder);
      } else {
        setOriginalReview(null);
        setLiked(paramLiked || false);
        setReviewText("");
        setPros("");
        setCons("");
        setOrder(paramOrder);
      }

      if (games.length > 0) {
        const foundGame = games.find((g) => g.id === newGameId);
        setGame(foundGame || games[0]);
      }
    }
  }, [searchParams, games]);

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setReviewText(value);
    setIsTouchedReview(true);
    setIsValidReview(value.trim().length > 0);
  };

  const handleProsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPros(value);
  };

  const handleConsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCons(value);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement>,
    field: string
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      switch (field) {
        case "review":
          document.querySelector<HTMLInputElement>('[name="pros"]')?.focus();
          break;
        case "pros":
          document.querySelector<HTMLInputElement>('[name="cons"]')?.focus();
          break;
        case "cons":
          (e.target as HTMLTextAreaElement).blur();
          break;
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidReview) return;

    const savedReviews = localStorage.getItem("reviews") || "[]";
    const reviews = JSON.parse(savedReviews);
    const newReview: Review = {
      gameId,
      liked,
      review: reviewText,
      pros,
      cons,
      likes: 0,
      dislikes: 0,
      date: new Date().toISOString().split("T")[0],
      order,
    };

    const existingIndex = reviews.findIndex((r: Review) => r.gameId === gameId);
    if (existingIndex !== -1) {
      reviews[existingIndex] = newReview;
    } else {
      reviews.push(newReview);
    }

    localStorage.setItem("reviews", JSON.stringify(reviews));
    router.push("/auth/account/product-reviews");
  };

  const handleCancel = () => {
    if (originalReview) {
      setLiked(originalReview.liked);
      setReviewText(originalReview.review || "");
      setPros(originalReview.pros || "");
      setCons(originalReview.cons || "");
      setOrder(
        originalReview.order ||
          `ORD${Math.floor(100000 + Math.random() * 900000)}`
      );
    }
    router.push("/auth/account/product-reviews");
  };

  if (!game) {
    return (
      <Heading variant="h3" className="text-center py-10" aria-live="polite">
        Loading...
      </Heading>
    );
  }

  return (
    <main
      className="mt-[40px] sm:mt-[80px]"
      role="main"
      aria-label="Write Review Page">
      <Suspense fallback={<div>Loading review form...</div>}>
        <section role="region" aria-label="Review Form Section">
          <Heading
            variant="h3"
            className="mb-[24px] sm:mb-[40px]"
            aria-label={`Navigation: account / orders / ${order} / review of ${game.title}`}>
            {isLg
              ? `account / orders / ${order} / review of ${game.title}`
              : ""}
          </Heading>
          <Heading
            variant="h1"
            className="mb-[24px] sm:mb-[80px] text-center sm:text-left relative z-10"
            aria-label="Review the game title">
            review the game
          </Heading>
          <div
            className="max-w-[792px] w-full mx-auto"
            role="region"
            aria-label="Game Review Content">
            <div
              className="max-w-[568px] mx-auto mb-[24px] sm:mb-[48px] relative"
              role="region"
              aria-label={`Game image and title: ${game.title}`}>
              <Image
                src={game.image}
                alt={game.title}
                width={568}
                height={320}
                className="absolute top-0 left-0 min-h-[226px] sm:min-h-[320px] filter blur-[20px] z-0 object-cover"
                loading="lazy"
              />
              <Image
                src={game.image}
                alt={game.title}
                width={520}
                height={280}
                className="relative z-10 min-h-[216px] sm:min-h-[280px] top-[5px] sm:top-[20px] mx-auto mb-[13px] sm:mb-[44px] object-cover"
                loading="lazy"
              />
              <Heading
                variant="h3"
                className="text-center relative z-10 max-w-[520px]"
                aria-label={`Game title: ${game.title}`}>
                {game.title}
              </Heading>
            </div>
            <div
              className="mb-[24px] sm:mb-[56px]"
              role="region"
              aria-label="Review instructions">
              <Text
                className="font-bold mb-[8px]"
                aria-label="Instruction bold text">
                Tell us what you think about this game!
              </Text>
              <Text aria-label="Instruction details">
                Share your experience to help other players decide — whether you
                loved it or not, your opinion matters
              </Text>
            </div>
            <form
              action=""
              className="flex flex-col w-full gap-[24px] sm:gap-[56px]"
              onSubmit={handleSubmit}
              aria-label="Review submission form">
              <div
                className="flex gap-[26px] max-w-[calc(100%-20px)] mx-auto w-full"
                role="group"
                aria-label="Like or dislike selection">
                <button
                  type="button"
                  className={`w-full h-[40px] sm:h-[48px] flex justify-center items-center py-[8px] px-[20px] border-[1px] skew-x-[-20deg] border-red rotate-180 ${
                    !liked ? "bg-red-20" : ""
                  }`}
                  onClick={() => setLiked(false)}
                  aria-label="Dislike this game">
                  <LikeIcon className="skew-x-[20deg] w-[24px] h-[24px] sm:w-[32px] sm:h-[32px]" />
                </button>
                <button
                  type="button"
                  className={`w-full h-[40px] sm:h-[48px] flex justify-center items-center py-[8px] px-[20px] border-[1px] skew-x-[-20deg] border-primary-main ${
                    liked ? "bg-primary-20" : ""
                  }`}
                  onClick={() => setLiked(true)}
                  aria-label="Like this game">
                  <LikeIcon className="skew-x-[20deg] w-[24px] h-[24px] sm:w-[32px] sm:h-[32px]" />
                </button>
              </div>
              <Textarea
                label="Your Review"
                value={reviewText}
                name="review"
                required
                onChange={handleReviewChange}
                onKeyDown={(e) => handleKeyDown(e, "review")}
                placeholder="What did you enjoy? Any issues? Would you recommend it?"
                className="w-full h-[104px] sm:h-[120px]"
                variant="straight"
                isTouched={isTouchedReview}
                isValid={isValidReview}
                errorMessage={
                  !isValidReview && isTouchedReview ? "Fill in the field" : ""
                }
                aria-label="Your review text area"
              />
              <Textarea
                label="Pros"
                value={pros}
                name="pros"
                onChange={handleProsChange}
                onKeyDown={(e) => handleKeyDown(e, "pros")}
                placeholder="What did you like? (separate items with commas)"
                className="w-full h-[104px] sm:h-[120px]"
                variant="straight"
                aria-label="Pros text area"
              />
              <Textarea
                label="Cons"
                value={cons}
                name="cons"
                onChange={handleConsChange}
                onKeyDown={(e) => handleKeyDown(e, "cons")}
                placeholder="What could be better? (separate items with commas)"
                className="w-full h-[104px] sm:h-[120px]"
                variant="straight"
                aria-label="Cons text area"
              />
              <div
                className="flex flex-col-reverse md:flex-row gap-[8px] sm:gap-[26px] max-w-[calc(100%-20px)] mx-auto w-full"
                role="region"
                aria-label="Form actions">
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  aria-label="Back to reviews">
                  Back to reviews
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  aria-label="Submit review">
                  Submit Review
                </Button>
              </div>
            </form>
          </div>
        </section>
      </Suspense>
    </main>
  );
});

ReviewContent.displayName = "ReviewContent";

export default function WriteReviewPage() {
  return (
    <Suspense
      fallback={
        <Heading variant="h3" className="text-center py-10">
          Loading review form...
        </Heading>
      }>
      <ReviewContent />
    </Suspense>
  );
}
