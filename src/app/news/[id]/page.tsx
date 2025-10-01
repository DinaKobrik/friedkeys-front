"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Text from "@/components/ui/Text";
import Heading from "@/components/ui/Heading";
import { New } from "@/types/new";
import { useParams, useRouter } from "next/navigation";
import GameCard from "@/components/Sections/GameCard";
import { Game } from "@/types/game";
import Button from "@/components/ui/Button";
import { useCart } from "@/components/Sections/Game/CartHandler";

export default function NewPage() {
  const router = useRouter();
  const params = useParams();
  const [news, setNews] = useState<New | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [backgroundImageSrc, setBackgroundImageSrc] = useState<string>("");
  const [foregroundImageSrc, setForegroundImageSrc] = useState<string>("");
  const { cartQuantities, setCartQuantities } = useCart();

  useEffect(() => {
    setIsMounted(true);

    const fetchData = async () => {
      const id = params?.id as string;
      if (!id) return;

      try {
        // Запрос новости
        const newsResponse = await fetch(`/api/games?type=news&gameId=${id}`);
        if (!newsResponse.ok) throw new Error("Failed to fetch news");
        const newsData = await newsResponse.json();
        if (Array.isArray(newsData) && newsData.length > 0) {
          const fetchedNews = newsData[0];
          setNews(fetchedNews);
          setBackgroundImageSrc(fetchedNews.image || "/images/no-image.jpg");
          setForegroundImageSrc(fetchedNews.image || "/images/no-image.jpg");

          // Запрос всех игр
          const allGamesResponse = await fetch(`/api/games?type=game`);
          if (!allGamesResponse.ok) throw new Error("Failed to fetch games");
          const allGamesData = await allGamesResponse.json();
          if (Array.isArray(allGamesData)) {
            const foundGame = allGamesData.find(
              (g: Game) => g.id === fetchedNews.gameId
            );
            setGame(foundGame || null);
          } else {
            setGame(null);
          }
        } else {
          setNews(null);
          setBackgroundImageSrc("/images/no-image.jpg");
          setForegroundImageSrc("/images/no-image.jpg");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setNews(null);
        setGame(null);
        setBackgroundImageSrc("/images/no-image.jpg");
        setForegroundImageSrc("/images/no-image.jpg");
      }
    };

    fetchData();
  }, [params]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("cart", JSON.stringify(cartQuantities));
    }
  }, [cartQuantities, isMounted]);

  useEffect(() => {
    if (isMounted) {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        try {
          setCartQuantities(JSON.parse(storedCart));
        } catch (error) {
          console.error("Error parsing cart from localStorage:", error);
        }
      }
    }
  }, [isMounted, setCartQuantities]);

  const getUniqueCartKey = (gameId: string) => `${gameId}_Standard_PC_US`;

  const addToCart = (gameId: number) => {
    const gameIdStr = gameId.toString();
    const cartKey = getUniqueCartKey(gameIdStr);
    const newItem = {
      quantity: (cartQuantities[cartKey]?.quantity || 0) + 1,
      edition: "Standard",
      platform: "PC",
      region: "US",
      addedAt: Date.now(),
    };
    const newCartQuantities = {
      ...cartQuantities,
      [cartKey]: newItem,
    };
    setCartQuantities(newCartQuantities);
  };

  const updateQuantity = (gameId: number, delta: number) => {
    const gameIdStr = gameId.toString();
    const cartKey = getUniqueCartKey(gameIdStr);
    const currentItem = cartQuantities[cartKey] || {
      quantity: 0,
      edition: "Standard",
      platform: "PC",
      region: "US",
      addedAt: Date.now(),
    };
    const newQuantity = Math.max(0, currentItem.quantity + delta);

    if (newQuantity === 0) {
      const newCartQuantities = { ...cartQuantities };
      delete newCartQuantities[cartKey];
      setCartQuantities(newCartQuantities);
    } else {
      const newItem = {
        ...currentItem,
        quantity: newQuantity,
        addedAt: Date.now(),
      };
      const newCartQuantities = {
        ...cartQuantities,
        [cartKey]: newItem,
      };
      setCartQuantities(newCartQuantities);
    }
  };

  if (!news || !game) {
    return (
      <Heading variant="h3" className="min-h-screen mt-[80px]">
        Loading...
      </Heading>
    );
  }

  // Форматирование даты в DD.MM.YYYY
  const formattedDate = (() => {
    try {
      const date = new Date(news.date);
      if (isNaN(date.getTime())) {
        return news.date;
      }
      return date
        .toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, ".");
    } catch {
      return news.date;
    }
  })();

  // Форматирование времени
  const formattedTime = (() => {
    try {
      const dateTime = new Date(`${news.date}T${news.time}`);
      if (isNaN(dateTime.getTime())) {
        return news.time;
      }
      return dateTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return news.time;
    }
  })();

  // Проверка количества в корзине
  const cartKey = game ? getUniqueCartKey(game.id.toString()) : "";
  const cartQuantity =
    isMounted && game ? cartQuantities[cartKey]?.quantity || 0 : 0;

  return (
    <main className="mt-[24px] sm:mt-[80px]">
      <Heading variant="h3" className="hidden lg:block">
        Home / news / {news.title}
      </Heading>
      <Button
        onClick={() => router.push("/news")}
        variant="secondary"
        className="max-w-[143px] sm:max-w-[190px] h-[40px] sm:h-[50px] flex justify-center items-center ml-[10px] lg:hidden bg-main"
        aria-label="Back to all news">
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
        <div className="mb-[50px] sm:mb-[80px] relative new__image-container -z-10 my-[26px]">
          <div className="new__image ml-[-16px] sm:ml-[-46px] mainCustom:w-[calc(100%+92px)] h-full max-h-[905px]">
            <Image
              src={backgroundImageSrc}
              alt={news.title}
              width={1608}
              height={905}
              className="mx-auto blur-xl min-h-[320px] max-h-[900px]"
              onError={() => setBackgroundImageSrc("/images/no-image.jpg")}
            />
          </div>
          <div className="absolute top-[50px] 2xl:top-1/2 h-[calc(100%-100px)] mainCustom:h-full 2xl:translate-y-[-50%] left-1/2 translate-x-[-50%] w-full max-w-[1064px] max-h-[612px]">
            <div className="mx-auto w-full h-full">
              <Image
                src={foregroundImageSrc}
                alt={news.title}
                width={1064}
                height={560}
                className="mx-auto min-h-[220px] object-cover w-full h-full new-clip"
                onError={() => setForegroundImageSrc("/images/no-image.jpg")}
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
            <div className="flex flex-col gap-[16px]">
              <GameCard game={game} hidePreOrder={true} />
              {isMounted && (
                <div className="flex justify-center w-full">
                  {cartQuantity === 0 ? (
                    <Button
                      variant="primary"
                      className="max-w-[calc(100%-20px)] w-full h-[40px] sm:h-[48px] flex justify-center items-center"
                      onClick={() => addToCart(game.id)}
                      aria-label={`${
                        game.preOrder ? "Pre-order" : "Add to cart"
                      } ${game.title}`}>
                      <span className="block font-bold">
                        {game.preOrder ? "Pre-order now" : "Add to Cart"}
                      </span>
                    </Button>
                  ) : (
                    <div
                      className="flex flex-col sm:flex-row items-center sm:gap-6 w-full max-w-[calc(100%-20px)] justify-center"
                      aria-live="polite"
                      aria-label={`Game ${game.title} is in cart with quantity ${cartQuantity}`}>
                      <div className="flex justify-center items-center h-[40px] font-usuzi-condensed text-[15px] leading-[17px] sm:text-[24px] sm:leading-[26px] text-center w-full">
                        in the cart
                      </div>
                      <div className="flex items-center gap-6 w-full">
                        <Button
                          variant="secondary"
                          className="max-w-[64px] h-[48px] flex items-center justify-center"
                          onClick={() => updateQuantity(game.id, -1)}
                          aria-label={`Decrease quantity of ${game.title}`}>
                          -
                        </Button>
                        <span
                          className="text-white text-[18px] font-bold"
                          aria-label={`Quantity: ${cartQuantity}`}>
                          {cartQuantity}
                        </span>
                        <Button
                          variant="secondary"
                          className="max-w-[64px] h-[48px] flex items-center justify-center"
                          onClick={() => updateQuantity(game.id, 1)}
                          aria-label={`Increase quantity of ${game.title}`}>
                          +
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Text>No game data available</Text>
          )}
        </div>
      </section>
      <div className="flex flex-wrap gap-[16px]">
        {news.hashtags.map((tag, index) => (
          <span
            key={index}
            className="text-white text-[14px] leading-[14px] sm:text-[20px] sm:leading-[20px]">
            {tag}
          </span>
        ))}
      </div>
    </main>
  );
}
