"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { Game } from "@/types/game";
import AccountMenu from "@/components/Sections/Account/AccountMenu";
import Pagination from "@/components/ui/Pagination";
import { useRouter } from "next/navigation";
import Link from "next/link";

// SVG
const LikeIcon = ({ className }: { className?: string }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
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

const DeleteIcon = ({ className }: { className?: string }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M5.49219 8.60156H26.5071L24.6173 28.3337H7.38205L5.49219 8.60156Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
    <path
      d="M21.9678 7.99641L20.5428 3.66663H11.4562L10.0312 7.99641"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
    <path
      d="M16 15.1517L16 21.7822"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
  </svg>
);

const EditIcon = ({ className }: { className?: string }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M21.4675 4L28 10.5325L10.5325 28L4.00614 27.9939L4 21.4675L21.4675 4Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="square"
    />
    <path
      d="M27.0976 27.9929L4.00781 27.9922"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="square"
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

// Форматирование даты
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const ProductReviews: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;
  const router = useRouter();

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

    const savedReviews = localStorage.getItem("reviews");
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      const initialReviews: Review[] = [
        {
          gameId: 1,
          liked: true,
          review:
            "This game offers an incredible experience with stunning graphics that truly immerse you in its world. The attention to detail in the environments is remarkable, and the soundtrack enhances the atmosphere perfectly. The gameplay mechanics are smooth and engaging, providing hours of entertainment. However, there are some minor issues with optimization that can cause occasional lag. The multiplayer mode is a highlight, allowing for cooperative play that adds depth.",
          pros: "Stunning graphics, Smooth gameplay, Great soundtrack, Engaging multiplayer",
          cons: "Occasional lag, Minor bugs, Optimization issues, Some UI glitches",
          likes: 15,
          dislikes: 2,
          date: "2020-09-05",
          order: "FK-20250603-1241",
        },
        {
          gameId: 2,
          liked: false,
          review:
            "This game disappointed me with its slow pace and outdated controls that feel clunky and unresponsive. The story has some interesting moments, but the delivery is lackluster, making it hard to stay engaged. The graphics are decent but lack the polish of modern titles, and the lack of updates is noticeable. On the positive side, the single-player campaign offers a decent narrative, though it’s marred by technical issues.",
          pros: "Interesting story, Decent narrative",
          cons: "Slow pace, Clunky controls, Outdated graphics, Lack of support, Technical issues",
          likes: 5,
          dislikes: 10,
          date: "2021-03-15",
          order: "FK-20250603-1242",
        },
        {
          gameId: 3,
          liked: true,
          review:
            "An absolutely addictive game that keeps you hooked with its rich world and deep character customization.",
          pros: "Rich open world, Fluid combat, Deep character development, Variety of weapons",
          cons: "Frustrating loading times, Repetitive quests",
          likes: 20,
          dislikes: 1,
          date: "2022-07-10",
          order: "FK-20250603-1243",
        },
        {
          gameId: 4,
          liked: true,
          review:
            "This action-packed game delivers intense combat and a captivating storyline. The visuals are impressive, and the level design encourages exploration. The multiplayer feature adds replay value, though server issues can disrupt gameplay. The controls are responsive, but the learning curve might be steep for beginners. Overall, it’s a thrilling experience worth trying.",
          pros: "Unique art style, Active community",
          cons: "Poor performance, Frequent crashes, Lack of content updates, Unfinished gameplay",
          likes: 12,
          dislikes: 3,
          date: "2023-01-20",
          order: "FK-20250603-1244",
        },
        {
          gameId: 5,
          liked: false,
          review:
            "A strategy game with a complex system that requires patience. The graphics are functional but dated, and the AI can be unpredictable. The campaign offers strategic depth, yet the lack of tutorials hinders new players. Multiplayer is engaging but suffers from matchmaking delays. It’s a niche title for dedicated fans.",
          pros: "Improved mechanics, Captivating storyline, Breathtaking visuals, High replay value",
          cons: "Steep difficulty curve, Persistent bugs",
          likes: 8,
          dislikes: 7,
          date: "2023-06-15",
          order: "FK-20250603-1245",
        },
        {
          gameId: 6,
          liked: true,
          review:
            "This RPG offers a rich narrative and beautiful art style. Character development is deep, and the side quests add value. The combat system is satisfying, though it can feel repetitive over time. Performance is solid, but some bugs affect the late-game experience. A great choice for story lovers.",
          pros: "Rich narrative, Beautiful art, Deep character development",
          cons: "Repetitive combat, Some bugs",
          likes: 18,
          dislikes: 2,
          date: "2024-02-10",
          order: "FK-20250603-1246",
        },
        {
          gameId: 7,
          liked: false,
          review:
            "A racing game with decent mechanics but poor optimization. The tracks are varied, and the car customization is a plus. However, frequent crashes and lack of content updates disappoint. The online mode is fun but laggy, making it hard to enjoy fully. It needs significant improvements.",
          pros: "Varied tracks, Car customization",
          cons: "Poor optimization, Frequent crashes, Lack of updates, Laggy online",
          likes: 6,
          dislikes: 9,
          date: "2024-09-01",
          order: "FK-20250603-1247",
        },
      ];
      setReviews(initialReviews);
      localStorage.setItem("reviews", JSON.stringify(initialReviews));
    }

    fetchGames();
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem("reviews", JSON.stringify(reviews));
    }
  }, [reviews]);

  const handleDeleteReview = (globalIndex: number) => {
    const newReviews = reviews.filter((_, i) => i !== globalIndex);
    setReviews(newReviews);
  };

  const handleEditReview = (globalIndex: number) => {
    const review = reviews[globalIndex];
    localStorage.setItem("editIndex", globalIndex.toString());
    router.push(
      `/auth/account/product-reviews/write-review?gameId=${review.gameId}`
    );
  };

  // Логика пагинации
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const paginatedReviews = reviews
    .slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage)
    .map((review, localIndex) => {
      const game = games.find((g) => g.id === review.gameId);
      if (!game) {
        console.warn(`Game with id ${review.gameId} not found.`);
        return null;
      }
      const globalIndex = (currentPage - 1) * reviewsPerPage + localIndex;
      return (
        <div
          key={globalIndex}
          className="grid grid-cols-1 lg:grid-cols-3 gap-[8px] sm:gap-[24px]">
          <div className="card-corner">
            <Link href={`/all-games/${game.id}`} className="w-full h-full">
              <Image
                src={game.image}
                alt={game.title}
                width={520}
                height={280}
                className="object-cover w-full h-full"
              />
            </Link>
          </div>
          <div className="lg:col-span-2 card-corner grid grid-cols-1 gap-[23px] w-full p-[16px] pb-[24px] sm:py-[24px] sm:px-[32px] xl:h-[280px] bg-2 relative">
            <div className="h-[20px] w-[50%] absolute top-0 left-[50%] bg-primary-main translate-x-[-50%] blur-[50px] z-0"></div>
            <div className="flex items-center gap-[16px] sm:gap-[32px]">
              <div
                className={`w-[64px] h-[40px] sm:w-[72px] sm:h-[48px] flex justify-center items-center py-[8px] px-[20px] border-[1px] skew-x-[-20deg] ${
                  review.liked
                    ? "border-primary-main bg-primary-20"
                    : "border-red bg-red-20 rotate-180"
                }`}>
                <LikeIcon className={`skew-x-[20deg]`} />
              </div>
              <div className="flex items-center justify-between gap-[24px] w-full">
                <Heading variant="h3" className="line-clamp-1">
                  {game.title}
                </Heading>
                <Text className="text-[20px] leading-[20px] text-[#C1C1C1] flex-shrink-0 hidden lg:block">
                  {formatDate(review.date)}
                </Text>
              </div>
            </div>
            <Text className="line-clamp-3">{review.review}</Text>
            <div className="flex justify-between items-start xl:items-end flex-col xl:flex-row gap-[16px]">
              <div className="flex gap-[8px] sm:gap-[16px] items-center flex-shrink-0">
                <p className="text-[14px] leading-[20px] sm:text-[20px] font-medium text-white">
                  This review is helpful
                </p>
                <div className="py-[6px] px-[12px] lg:py-[13px] lg:px-[30px] lg:skew-x-[-20deg] bg-primary-20">
                  <span className="lg:skew-x-[20deg] block font-semibold text-[14px] leading-[20px] sm:text-[20px] sm:leading-[26px]">
                    Yes {review.likes}
                  </span>
                </div>
                <div className="py-[6px] px-[12px] lg:py-[13px] lg:px-[30px] lg:skew-x-[-20deg] bg-red-20">
                  <span className="lg:skew-x-[20deg] block font-semibold text-[14px] leading-[20px] sm:text-[20px] sm:leading-[26px]">
                    No {review.dislikes}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-end xl:justify-end w-full">
                <div className="flex gap-[10px] sm:gap-[26px]">
                  <Button
                    variant="secondary"
                    className="w-[64px] h-[40px] sm:w-[72px] sm:h-[48px] flex justify-center items-center"
                    onClick={() => handleDeleteReview(globalIndex)}>
                    <DeleteIcon className="cursor-pointer w-[24px] h-[24px] sm:w-[32px] sm:h-[32px]" />
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-[64px] h-[40px] sm:w-[72px] sm:h-[48px] flex justify-center items-center"
                    onClick={() => handleEditReview(globalIndex)}>
                    <EditIcon className="cursor-pointer w-[24px] h-[24px] sm:w-[32px] sm:h-[32px]" />
                  </Button>
                </div>
                <Text className="text-[#C1C1C1] flex-shrink-0 lg:hidden">
                  {formatDate(review.date)}
                </Text>
              </div>
            </div>
          </div>
        </div>
      );
    });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document
      .querySelector(".favorites-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <Heading variant="h3" className="text-center py-10">
        Loading...
      </Heading>
    );
  }

  return (
    <main className="mt-[24px] sm:mt-[80px]">
      <AccountMenu activeLink="/auth/account/product-reviews" />
      <section>
        <div className="flex items-center justify-between mb-[48px] mt-[40px] sm:mt-[80px]">
          <Heading variant="h1" className="text-center lg:text-left w-full">
            Product Reviews
          </Heading>
          <div className="game-count hidden lg:block flex-shrink-0 text-[16px] sm:text-[32px] font-usuzi-condensed text-white uppercase">
            {reviews.length} reviews
          </div>
        </div>
        {reviews.length === 0 ? (
          <Heading variant="h3" className="my-[24px] sm:my-[48px]">
            No reviews yet
          </Heading>
        ) : (
          <div className="favorites-grid grid grid-cols-1 gap-[16px] sm:gap-[24px] mb-[24px] sm:mb-[48px]">
            {paginatedReviews}
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
        <Button variant="primary" className="max-w-[500px]">
          leave a review for the game
        </Button>
      </section>
    </main>
  );
};

export default ProductReviews;
