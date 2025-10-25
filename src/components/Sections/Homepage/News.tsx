"use client";

import React, { useState, useEffect } from "react";
import New from "@/components/Sections/News/New";
import { New as NewType } from "@/types/new";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

const News: React.FC = () => {
  const router = useRouter();
  const [news, setNews] = useState<NewType[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const fetchNews = async () => {
      const response = await fetch(
        "/api/games?type=news&sortNews=newest-first"
      );
      const data = await response.json();
      setNews(data.slice(0, 4));
    };
    fetchNews();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const newsItems = news.map((newItem, index, array) => {
    const isMobile = windowWidth < 768;
    const isTablet = windowWidth >= 768 && windowWidth < 1200;
    const isVertical = index === 0 || (isTablet && index === 1);

    return (
      <New
        key={newItem.id}
        news={newItem}
        isVertical={isVertical}
        className={
          index === 0
            ? isMobile
              ? "col-span-1"
              : isTablet
              ? "col-span-1"
              : "col-span-1 row-span-3"
            : index === 1 && isTablet
            ? "col-span-1"
            : isMobile
            ? "col-span-1"
            : isTablet
            ? "col-span-2 md:col-span-2"
            : "col-span-1 md:col-span-1"
        }
        isLastVisible={index === array.length - 1}
      />
    );
  });

  return (
    <section aria-label="News Section">
      <Heading
        variant="h1"
        className="mb-[24px] sm:mb-[30px]"
        aria-label="News Title">
        news
      </Heading>
      <div className="grid grid-cols-1 gap-[24px] mb-[24px] sm:mb-[30px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] md:gap-[18px]">
          {newsItems.length > 0 ? (
            newsItems
          ) : (
            <p className="text-gray-68" aria-live="polite">
              Loading news...
            </p>
          )}
        </div>
      </div>
      <Button
        variant="primary"
        className="max-w-[calc(100%-20px)] sm:max-w-[192px]"
        onClick={() => router.push("/news")}
        aria-label="Read all news articles">
        Read all
      </Button>
    </section>
  );
};

export default News;
