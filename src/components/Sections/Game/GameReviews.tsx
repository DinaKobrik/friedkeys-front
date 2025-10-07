"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { Suspense } from "react";
const Pagination = React.lazy(() => import("@/components/ui/Pagination"));

interface Review {
  username: string;
  liked: boolean;
  review: string | string[];
  pros: string[];
  cons: string[];
  date: string;
  likes: number;
  dislikes: number;
}

const reviews: Review[] = [
  {
    username: "GamerX123",
    liked: true,
    review:
      "This game is absolutely amazing with its stunning graphics and an incredibly engaging storyline that keeps you hooked for hours. The attention to detail in the visuals is breathtaking, and the narrative depth adds a layer of immersion that's hard to find elsewhere!",
    pros: [
      "The graphics are so detailed that they enhance the overall gaming experience significantly.",
      "The storyline provides a captivating journey with unexpected twists and turns.",
      "The gameplay mechanics are smooth and intuitive, making it enjoyable for all players.",
    ],
    cons: [
      "There are occasional bugs that can disrupt the flow of the game.",
      "The price feels a bit high for the content offered at this stage.",
    ],
    date: "10.09.2025",
    likes: 45,
    dislikes: 5,
  },
  {
    username: "PlayerOne",
    liked: false,
    review:
      "I found this game not worth the hype, as the performance issues are quite noticeable, especially during intense action sequences. The frame drops and lag make it frustrating to play for extended periods.",
    pros: [
      "The sound design is exceptional, creating an immersive audio experience.",
    ],
    cons: [
      "The performance issues are significant and need urgent optimization.",
      "There are several bugs that affect the gameplay experience negatively.",
      "The controls can be clunky and unresponsive at times.",
    ],
    date: "12.09.2025",
    likes: 52,
    dislikes: 18,
  },
  {
    username: "ShadowNinja",
    liked: true,
    review:
      "This game is really enjoyable, especially with its fantastic multiplayer mode that allows for exciting battles with friends. The community aspect adds a lot of replay value to the experience!",
    pros: [
      "The multiplayer mode offers thrilling and competitive gameplay.",
      "The design of the game world is visually appealing and well-crafted.",
    ],
    cons: ["The loading times can be quite long, which breaks the pacing."],
    date: "08.09.2025",
    likes: 30,
    dislikes: 3,
  },
  {
    username: "CoolCat99",
    liked: true,
    review: [
      "A true masterpiece that I highly recommend to everyone! The combination of stunning graphics, beautiful music, and endless replay value makes it a must-play for any gaming enthusiast.",
      "The attention to detail in the game world is remarkable, with immersive environments that pull you into the story. Every level feels unique, enhancing the overall experience.",
      "The character development and plot twists keep you engaged from start to finish. It's a rare game that balances gameplay and narrative so well!",
    ],
    pros: [
      "The graphics are stunning and elevate the visual quality significantly.",
      "The music enhances the atmosphere and keeps you engaged.",
      "The replay value is excellent due to varied gameplay options.",
    ],
    cons: [],
    date: "14.09.2025",
    likes: 60,
    dislikes: 2,
  },
  {
    username: "SilentWolf",
    liked: false,
    review:
      "This game was disappointing, as I expected much more from the developers. The story feels underdeveloped, and the optimization issues make it hard to enjoy fully.",
    pros: [],
    cons: [
      "The story lacks depth and fails to engage the player.",
      "The optimization is poor, leading to frequent crashes.",
    ],
    date: "17.09.2025",
    likes: 8,
    dislikes: 25,
  },
  {
    username: "SunnyDay",
    liked: true,
    review:
      "This game is fun and addictive, perfect for casual gaming sessions! The ease of picking it up and playing makes it ideal for relaxing after a long day.",
    pros: [
      "The ease of use makes it accessible for all skill levels.",
      "The fun factor keeps you coming back for more.",
    ],
    cons: ["The campaign feels a bit short and ends too quickly."],
    date: "15.09.2025",
    likes: 35,
    dislikes: 4,
  },
];

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

const PlusIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true">
    <path d="M20 12H4" stroke="#0EC21B" strokeWidth="2" />
    <path d="M12 4V20" stroke="#0EC21B" strokeWidth="2" />
  </svg>
);

const MinusIcon = () => (
  <svg
    width="16"
    height="4"
    viewBox="0 0 16 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true">
    <path d="M16 2H0" stroke="#D64431" strokeWidth="2.5" />
  </svg>
);

const ReviewCard = ({
  review,
  bgColor,
}: {
  review: Review;
  bgColor: string;
}) => {
  const reviewContent = Array.isArray(review.review)
    ? review.review
    : typeof review.review === "string"
    ? [review.review]
    : [];

  return (
    <div
      className={`card-corner flex flex-col p-[16px] sm:p-[20px] ${bgColor} min-w-[175px]`}
      aria-label={`Review by ${review.username}`}>
      <div
        className={`h-[15px] w-[75%] sm:w-[50%] absolute top-0 left-[50%] translate-x-[-50%] blur-[30px] z-0 rounded-full ${
          review.liked ? "bg-primary-main" : "bg-red"
        }`}
        aria-hidden="true"></div>
      <div>
        <div className="flex items-center justify-between gap-[16px] mb-[32px]">
          <div className="flex items-center justify-start w-full gap-[16px]">
            <div
              className="w-[44px] h-[44px] sm:w-[64px] sm:h-[64px] flex justify-center items-center flex-shrink-0"
              aria-hidden="true">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[28px] h-[28px] sm:w-[40px] sm:h-[40px]">
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
            className={`sm:w-[40px] sm:h-[40px] ${
              !review.liked ? "rotate-180" : ""
            }`}
            aria-label={review.liked ? "Positive review" : "Negative review"}
          />
        </div>
      </div>
      {reviewContent.length > 0 ? (
        reviewContent.map((paragraph: string, index: number) => (
          <Text
            key={index}
            className={
              index === reviewContent.length - 1 ? "mb-[24px]" : "mb-[16px]"
            }
            aria-label={`Review paragraph ${index + 1}`}>
            {paragraph}
          </Text>
        ))
      ) : (
        <Text className="mb-[24px]" aria-label="No review text available">
          No review text available.
        </Text>
      )}
      <div className={review.pros.length > 0 ? "mb-[24px]" : ""}>
        <ul className="flex flex-col w-full gap-[12px]">
          {review.pros.map((pro: string, i: number) => (
            <li
              key={i}
              className="flex items-start gap-[8px]"
              aria-label={`Pro: ${pro}`}>
              <span
                className="flex justify-center items-center w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]"
                aria-hidden="true">
                <PlusIcon />
              </span>
              <Text>{pro}</Text>
            </li>
          ))}
        </ul>
      </div>
      <div className={review.cons.length > 0 ? "mb-[32px]" : ""}>
        <ul className="flex flex-col w-full gap-[12px]">
          {review.cons.map((con: string, i: number) => (
            <li
              key={i}
              className="flex items-start gap-[8px]"
              aria-label={`Con: ${con}`}>
              <span
                className="flex justify-center items-center w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]"
                aria-hidden="true">
                <MinusIcon />
              </span>
              <Text>{con}</Text>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col 2xl:flex-row 2xl:items-center gap-[8px] sm:gap-[16px] justify-between w-full">
        <div className="flex flex-col 2xl:flex-row gap-[8px] sm:gap-[16px] 2xl:items-center flex-shrink-0">
          <p
            className="text-[14px] leading-[20px] sm:text-[20px] font-medium text-white"
            aria-label="Is this review helpful question">
            Is this review helpful?
          </p>
          <div className="flex gap-[8px] sm:gap-[16px] items-center flex-shrink-0 ml-[10px]">
            <div
              className="py-[11px] px-[24px] lg:py-[13px] lg:px-[30px] skew-x-[-20deg] bg-primary-20"
              aria-label={`Mark review as helpful, ${review.likes} likes`}>
              <span className="skew-x-[20deg] block font-semibold text-[14px] leading-[20px] sm:text-[20px] sm:leading-[26px]">
                Yes {review.likes}
              </span>
            </div>
            <div
              className="py-[11px] px-[24px] lg:py-[13px] lg:px-[30px] skew-x-[-20deg] bg-red-20"
              aria-label={`Mark review as not helpful, ${review.dislikes} dislikes`}>
              <span className="skew-x-[20deg] block font-semibold text-[14px] leading-[20px] sm:text-[20px] sm:leading-[26px]">
                No {review.dislikes}
              </span>
            </div>
          </div>
        </div>
        <p
          className="text-gray-68 text-[12px] leading-[16px] sm:text-[17px] sm:leading-[21px] text-end"
          aria-label={`Review date: ${review.date}`}>
          {review.date}
        </p>
      </div>
    </div>
  );
};

const GameReviews: React.FC = () => {
  const [isAllReviews, setIsAllReviews] = useState(false);
  const [isMinimum, setIsMinimum] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage, setReviewsPerPage] = useState(2);
  const [isLg, setIsLg] = useState(false);

  // Процент положительных отзывов
  const totalReviews = reviews.length;
  const likedReviews = reviews.filter((review) => review.liked).length;
  const dislikedReviews = reviews.filter((review) => !review.liked).length;
  const percentageLiked =
    totalReviews > 0 ? Math.round((likedReviews / totalReviews) * 100) : 0;

  // Фильтрация и сортировка отзывов
  const sortedReviews = useMemo(() => {
    return isMinimum
      ? [...reviews].sort((a, b) => b.likes - a.likes)
      : [...reviews].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
  }, [isMinimum]);

  const paginatedReviews = useMemo(() => {
    if (!isAllReviews) {
      return sortedReviews
        .slice(0, 2)
        .map((review: Review, index: number) => (
          <ReviewCard key={index} review={review} bgColor="bg-2" />
        ));
    }
    const startIdx = (currentPage - 1) * reviewsPerPage;
    const endIdx = currentPage * reviewsPerPage;
    return sortedReviews
      .slice(startIdx, endIdx)
      .map((review: Review, index: number) => (
        <ReviewCard key={index} review={review} bgColor="bg-2" />
      ));
  }, [sortedReviews, isAllReviews, currentPage, reviewsPerPage]);

  const paginatedRecentReviews = useMemo(() => {
    const recent = [...reviews].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return recent
      .slice(0, 2)
      .map((review: Review, index: number) => (
        <ReviewCard key={index} review={review} bgColor="bg-3" />
      ));
  }, []);

  const totalPages = useMemo(
    () => Math.ceil(sortedReviews.length / reviewsPerPage),
    [sortedReviews.length, reviewsPerPage]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    document
      .querySelector(".reviews-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth >= 992;
      setReviewsPerPage(isLarge ? 4 : 2);
      setIsLg(isLarge);
      if (isLarge && !isMinimum) {
        setIsMinimum(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMinimum]);

  const handleAllReviewsToggle = () => {
    setIsAllReviews(true);
    setCurrentPage(1);
  };

  return (
    <section aria-label="Game Reviews Section">
      <Heading
        variant="h1"
        className="mb-[24px] sm:mb-[40px]"
        aria-label="Game Reviews Title">
        Reviews
      </Heading>
      <div
        className="card-corner bg-2 py-[32px] px-[16px] sm:px-[40px] flex flex-col lg:flex-row items-center justify-between gap-[24px] mb-[24px] sm:mb-[40px] relative"
        aria-label="Review Summary">
        <div
          className="h-[15px] w-[75%] sm:w-[50%] absolute bottom-0 left-[50%] translate-x-[-50%] blur-[30px] z-0 rounded-full bg-primary-main"
          aria-hidden="true"></div>
        <div className="flex items-center gap-[16px] sm:gap-[40px] z-10">
          <span
            className="font-usuzi text-green text-[36px] sm:text-[48px] leading-[48px]"
            aria-label={`Percentage of positive reviews: ${percentageLiked}%`}>
            {percentageLiked}%
          </span>
          <div className="flex flex-col gap-[4px] sm:gap-[12px]">
            <span
              className="text-green font-usuzi-condensed text-[18px] xs:text-[20px] leading-[24px] sm:text-[32px] sm:leading-[40px]"
              aria-label="Highly Recommended rating">
              Highly Recommended
            </span>
            <span
              className="text-white text-[15px] leading-[19px] sm:text-[20px] sm:leading-[26px]"
              aria-label={`Based on ${totalReviews} reviews`}>
              Based on {totalReviews} reviews
            </span>
          </div>
        </div>
        <div className="flex items-center gap-[18px]">
          <div
            className="py-[6px] px-[30px] h-[42px] sm:h-[52px] border-[1px] border-primary-main skew-x-[-20deg]"
            aria-label={`Positive reviews: ${likedReviews}`}>
            <span className="flex items-center gap-[8px] skew-x-[20deg] ">
              <LikeIcon className="sm:w-[40px] sm:h-[40px]" />
              {likedReviews}
            </span>
          </div>
          <div
            className="py-[6px] px-[30px] h-[42px] sm:h-[52px] border-[1px] border-red skew-x-[-20deg]"
            aria-label={`Negative reviews: ${dislikedReviews}`}>
            <span className="flex items-center gap-[8px] skew-x-[20deg]">
              <LikeIcon className="sm:w-[40px] sm:h-[40px] rotate-180" />
              {dislikedReviews}
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-full items-start gap-[24px] mb-[24px]">
        <div
          className={`${
            isAllReviews ? "lg:max-w-[100%]" : "lg:max-w-[58%]"
          } flex-shrink-0 w-full`}
          aria-label={isMinimum ? "Best Reviews" : "Recent Reviews"}>
          <div className="w-full overflow-hidden mb-[24px] lg:hidden">
            <div className="grid grid-cols-2 skew-x-[-20deg] gap-[10px] w-[calc(100%+24px)] ml-[-12px] mx-auto pb-[2px]">
              <button
                className={`bg-DLS block border-primary-main py-[12px] px-[6px] font-usuzi-condensed text-[15px] xs:text-[17px] leading-[19px] sm:text-[26px] sm:leading-[28px] text-white ${
                  isMinimum ? "border-[1px] configurations__button" : ""
                }`}
                onClick={() => setIsMinimum(true)}
                aria-label="Show best reviews"
                aria-pressed={isMinimum}>
                <span className="block skew-x-[20deg]">Best reviews</span>
              </button>
              <button
                className={`bg-DLS block border-primary-main py-[12px] px-[6px] font-usuzi-condensed text-[15px] xs:text-[17px] leading-[19px] sm:text-[26px] sm:leading-[28px] text-white ${
                  !isMinimum ? "border-[1px] configurations__button" : ""
                }`}
                onClick={() => setIsMinimum(false)}
                aria-label="Show recent reviews"
                aria-pressed={!isMinimum}>
                <span className="block skew-x-[20deg]">Recent reviews</span>
              </button>
            </div>
          </div>
          <Heading
            variant="h2"
            className="mb-[24px] text-center lg:text-left hidden lg:block"
            aria-label={
              isMinimum ? "Best Reviews Title" : "Recent Reviews Title"
            }>
            {isMinimum ? "Best reviews" : "Recent reviews"}
          </Heading>
          <div
            className={`reviews-grid ${
              isAllReviews ? "grid grid-cols-1 xl:grid-cols-2" : "flex flex-col"
            } gap-[24px] w-full`}>
            <Suspense
              fallback={<div aria-live="polite">Loading reviews...</div>}>
              {paginatedReviews}
            </Suspense>
          </div>
        </div>
        <div
          className={`${isAllReviews || !isLg ? "hidden" : "hidden lg:block"}`}
          aria-label="Recent Reviews">
          <Heading
            variant="h2"
            className="mb-[24px]"
            aria-label="Recent Reviews Title">
            Recent reviews
          </Heading>
          <div className="flex flex-col gap-[24px] w-full">
            <Suspense
              fallback={<div aria-live="polite">Loading reviews...</div>}>
              {paginatedRecentReviews}
            </Suspense>
          </div>
        </div>
      </div>
      {!isAllReviews && (
        <Button
          variant="primary"
          className="max-w-[calc(100%-20px)] sm:max-w-[440px] mx-auto transition-all duration-300 bg-primary-main hover:bg-primary-main/80"
          onClick={handleAllReviewsToggle}
          aria-label={`Read all ${totalReviews} reviews`}>
          Read all reviews ({totalReviews})
        </Button>
      )}
      {isAllReviews && totalPages > 1 && (
        <Suspense
          fallback={<div aria-live="polite">Loading pagination...</div>}>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            aria-label="Review pagination"
          />
        </Suspense>
      )}
    </section>
  );
};

export default GameReviews;
