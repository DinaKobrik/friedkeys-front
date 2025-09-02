"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Heading from "@/components/ui/Heading";
import Link from "next/link";
import type { New } from "@/types/new";

interface NewProps {
  news: New;
  isVertical?: boolean;
  className?: string;
  isLastVisible?: boolean;
}

const New: React.FC<NewProps> = ({
  news,
  isVertical = true,
  className = "",
  isLastVisible = false,
}) => {
  const [isMobileLessThan768, setIsMobileLessThan768] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const [descriptionLines, setDescriptionLines] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobileLessThan768(window.innerWidth < 768);
      }
    };
    handleResize();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    if (!titleRef.current || isVertical) return;

    const observer = new ResizeObserver((entries) => {
      if (entries.length === 0) return;
      for (const entry of entries) {
        const lineHeight = parseInt(getComputedStyle(entry.target).lineHeight);
        const height = entry.contentRect.height;
        const lines = Math.min(Math.ceil(height / lineHeight), 2);

        setDescriptionLines(isMobileLessThan768 ? Math.max(0, 3 - lines) : 2);
      }
    });

    observer.observe(titleRef.current);

    const lineHeight = parseInt(getComputedStyle(titleRef.current).lineHeight);
    const height = titleRef.current.offsetHeight;
    const lines = Math.min(Math.ceil(height / lineHeight), 2);
    setDescriptionLines(isMobileLessThan768 ? Math.max(0, 3 - lines) : 2);

    return () => {
      observer.disconnect();
    };
  }, [news.title, isVertical, isMobileLessThan768]);

  return (
    <Link
      href={`/news/${news.id}`}
      className={`block h-full w-full ${className}`}>
      <div
        className={`grid gap-[8px]
         ${
           isVertical
             ? "grid-cols-1 grid-rows-2 xs:grid-rows-3 md:grid-rows-2 xl:grid-rows-3 h-full"
             : "grid-cols-3"
         }
        `}>
        <div
          className={`card-corner flex-shrink-0 w-full h-full ${
            isVertical
              ? "max-w-[792px] max-h-[520px] row-span-1 xs:row-span-2 md:row-span-1 xl:row-span-2"
              : "max-w-[520px] max-h-[248px]"
          }`}>
          <Image
            src={news.image}
            alt={news.title}
            width={300}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className={`w-full relative flex flex-col justify-between col-span-2 ${
            isVertical
              ? "py-[24px] px-[20px] bg-2"
              : "md:py-[24px] md:px-[20px] md:bg-2 h-[80px] sm:h-[160px] md:h-[248px]"
          } ${!isVertical && isMobileLessThan768 ? "" : "card-corner"}`}>
          <div>
            <div
              ref={titleRef}
              className={`sm:mb-[16px] ${
                isVertical
                  ? "mb-[8px]"
                  : "line-clamp-2 mb-[4px] overflow-hidden"
              }`}>
              <Heading
                variant="h3"
                className={` 
                ${
                  isVertical
                    ? "line-clamp-1"
                    : "inline-block w-full break-words"
                }
                `}>
                {news.title}
              </Heading>
            </div>
            <p
              className={`text-white text-[14px] leading-[16px] sm:text-[20px] sm:leading-[24px] mb-[4px] ${
                isVertical
                  ? "line-clamp-5 md:line-clamp-6"
                  : `line-clamp-${descriptionLines} !important sm:line-clamp-2 md:line-clamp-4`
              }`}>
              {news.description}
            </p>
          </div>
          <p className="text-[#C1C1C1] text-[14px] leading-[16px] sm:text-[20px] sm:leading-[24px] text-end">
            {news.date}
          </p>

          <div
            className={`${
              isVertical ? "block md:hidden" : "hidden"
            } h-[7px] w-[75%] absolute bottom-0 left-[50%] bg-primary-main translate-x-[-50%] blur-[30px] z-0`}></div>
        </div>
      </div>
      <div
        className={`${
          isVertical ? "hidden" : "block md:hidden"
        } h-[2px] w-full bg-primary-main blur-[6px] mt-[16px] ${
          isLastVisible ? "hidden" : ""
        }`}></div>
    </Link>
  );
};

export default New;
