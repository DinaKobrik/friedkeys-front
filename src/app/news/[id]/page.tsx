"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Text from "@/components/ui/Text";
import Heading from "@/components/ui/Heading";
import { New } from "@/types/new";
import { useParams } from "next/navigation";
import GameCard from "@/components/Sections/GameCard";
import { Game } from "@/types/game";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function NewPage() {
  const router = useRouter();
  const params = useParams();
  const [news, setNews] = useState<New | null>(null);
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const id = params?.id as string;
      if (!id) return;

      // Запрос новости
      const newsResponse = await fetch(`/api/games?type=news&gameId=${id}`);
      const newsData = await newsResponse.json();
      if (newsData.length > 0) {
        const fetchedNews = newsData[0];
        setNews(fetchedNews);

        setGame(null);

        // Запрос всех игр
        const allGamesResponse = await fetch(`/api/games?type=game`);
        const allGamesData = await allGamesResponse.json();
        if (Array.isArray(allGamesData)) {
          const foundGame = allGamesData.find(
            (g) => g.id === fetchedNews.gameId
          );
          setGame(foundGame || null);
        } else {
          setGame(null);
        }
      } else {
        setNews(null);
      }
    };

    fetchData();
  }, [params]);

  if (!news || !game)
    return (
      <Heading variant="h3" className="min-h-screen mt-[80px]">
        Loading...
      </Heading>
    );

  // Форматирование даты
  const date = new Date(news.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = new Date(
    `${news.date}T${news.time}`
  ).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <main className="min-h-screen mt-[24px] sm:mt-[80px]">
      <Heading variant="h3" className="hidden lg:block">
        Home / news / {news.title}
      </Heading>
      <Button
        onClick={() => router.push("/news")}
        variant="secondary"
        className="max-w-[150px] sm:max-w-[190px] ml-[10px] block lg:hidden bg-main">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-[8px]">
          <path
            d="M15.5 19L8.5 12L15.5 5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="square"
          />
        </svg>
        All news
      </Button>
      <section>
        <div className="mb-[50px] sm:mb-[80px] relative new__image -z-10 my-[26px]">
          <div className="w-[100vw] ml-[-16px] sm:ml-[-46px] mainCustom:w-[calc(100%+92px)] h-full max-h-[905px]">
            <Image
              src={news.image}
              alt={news.title}
              width={1608}
              height={905}
              className="mx-auto blur-xl"
            />
          </div>
          <div className="absolute top-1/2 translate-y-[-45%] 2xl:translate-y-[-50%] left-1/2 translate-x-[-50%] w-full h-full max-w-[1064px] max-h-[612px]">
            <div className="mx-auto h-[calc(100%-26px)] md:h-[calc(100%-52px)] mainCustom:h-full">
              <Image
                src={news.image}
                alt={news.title}
                width={1064}
                height={560}
                className="mx-auto object-cover w-full h-full new-clip"
              />
            </div>
          </div>
        </div>
        <Heading variant="h1" className="mb-[16px]">
          {news.title}
        </Heading>
        <p className="text-[#C1C1C1] text-[14px] leading-[16px] sm:text-[20px] sm:leading-[24px] text-start mb-[48px] sm:mb-[80px]">
          {formattedDate}, {formattedTime}
        </p>
      </section>
      <section className="max-w-[1064px] mx-auto">
        <Text className="mb-[75px]">{news.description}</Text>

        <div className="max-w-[175px] sm:max-w-[520px] mx-auto mb-[32px] sm:mb-[48px]">
          {game ? (
            <GameCard game={game} />
          ) : (
            <Text>No game data available</Text>
          )}
        </div>
        <div className="flex flex-wrap gap-[16px]">
          {news.hashtags.map((tag, index) => (
            <span
              key={index}
              className="text-white text-[14px] leading-[14px] sm:text-[20px] sm:leading-[20px]">
              {tag}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
