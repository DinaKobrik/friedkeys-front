"use client";
import React, { useState, useEffect, useRef, forwardRef } from "react";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import Link from "next/link";

// SVG для звездочки
const StarIcon = forwardRef<
  SVGSVGElement,
  {
    filled: boolean;
    onClick: () => void;
    isInvalid: boolean;
    onHover: () => void;
    isHovered: boolean;
    onFocus: () => void;
    isFocused: boolean;
  }
>(
  (
    { filled, onClick, isInvalid, onHover, isHovered, onFocus, isFocused },
    ref
  ) => (
    <svg
      ref={ref}
      tabIndex={0}
      className={`w-9 h-9 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 outline-none focus:outline-none ${
        filled
          ? "fill-primary-main stroke-primary-main"
          : isHovered || isFocused
          ? "fill-primary-main stroke-primary-main drop-shadow-[0_0_10px_rgba(144,238,144,0.7)]"
          : isInvalid
          ? "stroke-red fill-none"
          : "stroke-primary-main fill-none hover:fill-primary-main hover:stroke-primary-main"
      }`}
      viewBox="0 0 45 43"
      strokeWidth="3"
      stroke="currentColor"
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={() => onHover()}
      onFocus={onFocus}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          onClick();
        }
      }}>
      <path
        d="M22.5 5.5L26.6535 18.2832H40.0945L29.2205 26.1836L33.374 38.9668L22.5 31.0664L11.626 38.9668L15.7795 26.1836L4.90545 18.2832H18.3465L22.5 5.5Z"
        strokeLinecap="round"
      />
    </svg>
  )
);

StarIcon.displayName = "StarIcon";

const FeedbackPage: React.FC = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [isLg, setIsLg] = useState(false);
  const [isTouchedReview, setIsTouchedReview] = useState(false);
  const [isValidReview, setIsValidReview] = useState(true);
  const [isTouchedRating, setIsTouchedRating] = useState(false);
  const [isValidRating, setIsValidRating] = useState(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [fadeOut, setFadeOut] = useState<boolean>(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [focusedStar, setFocusedStar] = useState<number | null>(null);
  const starRefs = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsLg(window.innerWidth >= 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const feedbackMessages = [
    {
      stars: 1,
      text: "We're sorry to hear that.",
      placeholder: "Tell us what went wrong — we want to make things better.",
    },
    {
      stars: 2,
      text: "Not great? Let us know why.",
      placeholder: "We’d love to understand how we can improve.",
    },
    {
      stars: 3,
      text: "Thanks for your honest feedback!",
      placeholder:
        "Tell us what worked and what didn’t — your opinion matters.",
    },
    {
      stars: 4,
      text: "Glad you liked it!",
      placeholder: "What could have made your experience even better?",
    },
    {
      stars: 5,
      text: "Awesome! Thanks for the love!",
      placeholder: "We’d love to hear what you enjoyed most.",
    },
  ];

  const currentFeedback = rating
    ? feedbackMessages.find((msg) => msg.stars === rating)
    : null;

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newReviewText = e.target.value;
    setReviewText(newReviewText);
    if (isTouchedReview && !isValidReview && newReviewText.trim()) {
      setIsValidReview(true);
    }
  };

  const handleRatingChange = (star: number) => {
    setRating(star);
    if (isTouchedRating && !isValidRating) {
      setIsValidRating(true);
    }
    setHoveredStar(null);
    setFocusedStar(null);
  };

  const handleStarHover = (star: number) => {
    setHoveredStar(star);
  };

  const handleStarFocus = (star: number) => {
    setFocusedStar(star);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTouchedReview(true);
    setIsTouchedRating(true);

    const isReviewValid = reviewText.trim() !== "";
    const isRatingValid = rating !== null;

    setIsValidReview(isReviewValid);
    setIsValidRating(isRatingValid);

    if (!isReviewValid || !isRatingValid) {
      return;
    }

    setShowModal(true);
    setFadeOut(false);
    setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowModal(false);
        setRating(null);
        setReviewText("");
        setIsTouchedReview(false);
        setIsTouchedRating(false);
        setIsValidReview(true);
        setIsValidRating(true);
      }, 300);
    }, 2000);
  };

  return (
    <main className="mt-[24px] sm:mt-[60px] xl:mt-[136px]">
      <Heading variant="h3" className="mb-[24px] sm:mb-[30px]">
        {isLg
          ? `Home / User's feedbacks / feedback on the website`
          : `... feedbacks / feedback on the website`}
      </Heading>
      <Heading variant="h1" className="mb-[24px] sm:mb-[60px]">
        feedback on the website
      </Heading>
      <section className="max-w-[792px] mx-auto flex flex-col justify-center gap-[18px] sm:gap-[42px] w-full">
        <div>
          <Text className="font-bold mb-[8px]">
            We’d love to hear your thoughts!
          </Text>
          <Text>
            Tell us about your experience using FriedKeys. Your feedback helps
            us improve and lets other gamers know what to expect
          </Text>
        </div>
        <div>
          <Heading variant="h3" className="mb-[16px]">
            Your Rating
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center md:justify-items-start items-center gap-[16px]">
            <div className="flex gap-[16px] items-center">
              {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                <StarIcon
                  key={star}
                  ref={(el) => {
                    const index = star - 1;
                    if (starRefs.current.length <= index) {
                      starRefs.current = [...starRefs.current, el];
                    } else {
                      starRefs.current[index] = el;
                    }
                  }}
                  filled={rating !== null && star <= rating}
                  onClick={() => handleRatingChange(star)}
                  isInvalid={isTouchedRating && !isValidRating}
                  onHover={() => handleStarHover(star)}
                  isHovered={hoveredStar !== null && star <= hoveredStar}
                  onFocus={() => handleStarFocus(star)}
                  isFocused={focusedStar !== null && star <= focusedStar}
                />
              ))}
            </div>
            <div>
              {currentFeedback && (
                <p className="text-white text-[15px] leading-[19px]">
                  {currentFeedback.text}
                </p>
              )}
              {isTouchedRating && !isValidRating && (
                <Text className="text-red mt-[8px]">
                  Please select a rating
                </Text>
              )}
            </div>
          </div>
        </div>
        <form action="">
          <Textarea
            label="Your Review"
            value={reviewText}
            name="review"
            required
            onChange={handleReviewChange}
            placeholder={currentFeedback ? currentFeedback.placeholder : ""}
            className="w-full h-[104px] sm:h-[120px] py-[16px] px-[20px] resize-none bg-2 text-white placeholder-gray-68 rounded"
            variant="straight"
            isTouched={isTouchedReview}
            isValid={isValidReview}
            errorMessage={
              !isValidReview && isTouchedReview ? "Fill in the field" : ""
            }
          />
          <div className="flex flex-col-reverse md:flex-row justify-center mx-auto gap-[8px] md:gap-[19px] max-w-[calc(100%-18px)] w-full mt-[24px] sm:mt-[42px]">
            <Link
              href="/feedback"
              className="font-usuzi-condensed block my-0 mx-auto rounded-[2px] cursor-pointer text-[17px] leading-[19px] sm:text-[19px] sm:leading-[21px] font-bold uppercase text-center px-[12px] py-[12px] w-full focus:outline-none skew-x-[-20deg] btn-secondary text-white border-2 bg-transparent border-primary-main z-10">
              <span className="flex justify-center items-center skew-x-[20deg]">
                Back to reviews
              </span>
            </Link>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Submit Review
            </Button>
          </div>
        </form>
      </section>
      {showModal && (
        <div
          className={`fixed z-50 top-0 left-0 w-full h-full flex justify-center items-center transition-opacity duration-300 ease-in-out ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
          aria-live="polite">
          <div
            className={`absolute w-full h-full bg-[#0000003A] backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
              fadeOut ? "opacity-0" : "opacity-100"
            }`}></div>
          <div
            className={`relative border-[1px] overflow-hidden border-primary-main bg-2 px-[20px] py-[40px] max-w-[320px] flex justify-center items-center text-center transition-all duration-300 ease-in-out ${
              fadeOut ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}>
            <Heading variant="h3">review submitted for moderation</Heading>
            <div className="h-[7px] w-[75%] sm:w-[50%] absolute bottom-0 left-[50%] bg-primary-main translate-x-[-50%] blur-[30px] z-0"></div>
          </div>
        </div>
      )}
    </main>
  );
};

export default FeedbackPage;
