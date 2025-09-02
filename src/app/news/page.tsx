"use client";

import React, { useState, useEffect } from "react";
import New from "@/components/Sections/News/New";
import { New as NewType } from "@/types/new";
import Heading from "@/components/ui/Heading";
import Pagination from "@/components/ui/Pagination";

export default function NewsPage() {
  const [news, setNews] = useState<NewType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage, setNewsPerPage] = useState(7);

  useEffect(() => {
    const fetchNews = async () => {
      const response = await fetch(
        "/api/games?type=news&sortNews=newest-first"
      );
      const data = await response.json();
      setNews(data);
    };
    fetchNews();

    const handleResize = () => {
      if (typeof window !== "undefined") {
        setNewsPerPage(window.innerWidth < 767 ? 6 : 7);
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

  // Логика пагинации
  const totalPages = Math.ceil(news.length / newsPerPage);
  const paginatedNews = news
    .slice((currentPage - 1) * newsPerPage, currentPage * newsPerPage)
    .map((newItem, index, array) => (
      <New
        key={newItem.id}
        news={newItem}
        isVertical={index < (window.innerWidth < 767 ? 1 : 2)}
        className={
          index < (window.innerWidth < 767 ? 1 : 2) ? "" : "col-1 md:col-span-2"
        }
        isLastVisible={index === array.length - 1}
      />
    ));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document
      ?.querySelector(".news-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen mt-[24px] sm:mt-[80px]">
      <Heading variant="h3" className="mb-[24px] sm:mb-[40px]">
        Home / news
      </Heading>
      <Heading variant="h1" className="mb-[40px] sm:mb-[80px]">
        news
      </Heading>
      <div className="news-grid grid grid-cols-1 md:grid-cols-2 gap-[24px] mb-[24px] sm:mb-[56px]">
        {paginatedNews}
      </div>
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
}
