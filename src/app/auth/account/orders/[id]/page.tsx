"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import { useRouter } from "next/navigation";

// SVG
const FavoriteIcon = ({ isFavorite }: { isFavorite: boolean }) => (
  <svg
    width="16.5"
    height="21"
    className="sm:w-[22px] sm:h-[28px]"
    viewBox="0 0 22 28"
    fill={isFavorite ? "#FFFF25" : "none"}
    xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.9702 1.66669C13.1831 1.66669 8.81716 1.66669 1.03003 1.66669V26.3334L11.0336 21.7394L20.9702 26.3334V1.66669Z"
      stroke={isFavorite ? "#FFFF25" : "white"}
      strokeWidth="2"
      strokeLinecap="square"
    />
  </svg>
);

// SVG Steam
const SteamIcon = () => (
  <svg
    width="40"
    height="20"
    viewBox="0 0 40 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[16px] h-[16px] sm:w-[30px] sm:h-[30px] md:w-[40px] md:h-[40px]">
    <path
      d="M34.2836 0.666992C31.1733 0.666992 28.6521 3.1882 28.6521 6.29851C28.6521 6.51427 28.6642 6.72517 28.6885 6.93366L25.7261 11.004C25.6436 10.9991 25.5612 10.9918 25.4788 10.9918C24.6133 10.9918 23.8109 11.2512 23.1394 11.6973L8.19152 5.65608C7.78424 3.79427 6.12849 2.3979 4.14303 2.3979C1.85455 2.3979 0 4.25487 0 6.54336C0 8.83184 1.85455 10.6864 4.14303 10.6864C4.99636 10.6864 5.79152 10.427 6.45091 9.98336L21.3042 15.9834C21.6606 17.9664 23.3891 19.4743 25.4764 19.4743C27.8182 19.4743 29.7188 17.5737 29.7188 15.2318C29.7188 15.0137 29.697 14.8028 29.6655 14.5943L33.6752 11.8937C33.8739 11.9155 34.0776 11.9276 34.2812 11.9276C37.3915 11.9276 39.9127 9.40639 39.9127 6.29608C39.9127 3.18578 37.3915 0.666992 34.2836 0.666992ZM4.9697 4.35669C3.97818 3.95669 2.85576 4.3373 2.29576 5.20517C2.05415 5.53722 1.90673 5.92838 1.86909 6.3373C1.73576 7.31184 2.27152 8.29608 3.22182 8.68154L4.85576 9.34093C4.62788 9.39911 4.3903 9.43305 4.14303 9.43305C2.5503 9.43305 1.25333 8.13608 1.25333 6.54336C1.25333 4.95063 2.5503 3.65366 4.14303 3.65366C5.17333 3.65366 6.07758 4.19669 6.58909 5.01123L4.9697 4.35669ZM25.4764 18.1846C24.3491 18.1846 23.3697 17.5494 22.8727 16.6185L24.0606 17.0985C24.467 17.4097 24.9645 17.5783 25.4764 17.5785C26.7685 17.5785 27.823 16.5264 27.823 15.2343C27.823 15.0234 27.7915 14.8221 27.7406 14.6282C27.5976 13.9276 27.12 13.3046 26.4097 13.0185L24.7952 12.3664C25.0158 12.3131 25.2436 12.284 25.4788 12.284C27.1055 12.284 28.4315 13.6076 28.4315 15.2367C28.4315 16.8658 27.1055 18.1846 25.4764 18.1846ZM34.2836 9.8379C32.3321 9.8379 30.7442 8.25002 30.7442 6.29851C30.7442 4.34699 32.3321 2.75911 34.2836 2.75911C36.2352 2.75911 37.823 4.34699 37.823 6.29851C37.823 8.25002 36.2352 9.8379 34.2836 9.8379ZM37.0958 6.29851C37.0958 7.85002 35.8327 9.11063 34.2836 9.11063C32.7345 9.11063 31.4715 7.8476 31.4715 6.29851C31.4715 4.74942 32.7345 3.48639 34.2836 3.48639C35.8327 3.48639 37.0958 4.74699 37.0958 6.29851Z"
      fill="white"
    />
  </svg>
);

// SVG Microsoft
const MicrosoftIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[16px] h-[16px] sm:w-[30px] sm:h-[30px] md:w-[40px] md:h-[40px]">
    <path
      d="M18.0056 39.9397C14.9244 39.6446 11.8049 38.5381 9.12517 36.7897C6.87961 35.3246 6.37251 34.7223 6.37251 33.5204C6.37251 31.1061 9.02708 26.8775 13.5689 22.0569C16.1483 19.3191 19.7413 16.1101 20.1299 16.197C20.8851 16.3659 26.9243 22.2566 29.185 25.0297C32.7601 29.4147 34.4036 33.0051 33.5687 34.6059C32.9339 35.8227 28.9955 38.2009 26.1021 39.1146C23.7174 39.8676 20.5855 40.1868 18.0056 39.9397ZM3.33963 31.0102C1.47363 28.1475 0.53086 25.3292 0.0756855 21.253C-0.0746141 19.907 -0.0207546 19.1371 0.416977 16.3745C0.962546 12.9312 2.92342 8.94779 5.2796 6.49632C6.28311 5.45222 6.37273 5.42678 7.59595 5.83885C9.0814 6.33926 10.6677 7.43485 13.1279 9.65944L14.5633 10.9574L13.7795 11.9203C10.1409 16.3904 6.29985 22.7265 4.85227 26.6465C4.06531 28.7776 3.7479 30.9168 4.0865 31.8074C4.31511 32.4087 4.10513 32.1846 3.33963 31.0102ZM36.0938 31.4971C36.2782 30.5972 36.045 28.9445 35.4986 27.2776C34.3152 23.6676 30.3596 16.9519 26.7274 12.3858L25.584 10.9484L26.821 9.81257C28.4362 8.32946 29.5576 7.44139 30.7677 6.68722C31.7225 6.0921 33.087 5.56526 33.6735 5.56526C34.0351 5.56526 35.3081 6.8864 36.3358 8.32819C37.9275 10.5612 39.0985 13.2681 39.6917 16.0861C40.075 17.9068 40.107 21.8042 39.7535 23.6205C39.4633 25.111 38.8508 27.0445 38.2532 28.3558C37.8055 29.3383 36.6918 31.2465 36.2038 31.8674C35.9529 32.1867 35.9527 32.186 36.0938 31.4971ZM18.3355 4.88358C16.6595 4.03253 14.0741 3.11897 12.6459 2.87318C12.1452 2.78702 11.2912 2.73897 10.7479 2.7664C9.56958 2.8259 9.62221 2.76428 11.5125 1.87119C13.0841 1.12869 14.395 0.692067 16.1746 0.318402C18.1765 -0.101944 21.9394 -0.106877 23.9095 0.308262C26.0373 0.756647 28.5428 1.68905 29.9547 2.5579L30.3743 2.81614L29.4116 2.76752C27.4984 2.67091 24.7102 3.44383 21.7167 4.90062C20.8138 5.34002 20.0283 5.69097 19.9711 5.68049C19.914 5.67001 19.1779 5.3114 18.3355 4.88358Z"
      fill="white"
    />
  </svg>
);

// SVG PlayStation
const PlayStationIcon = () => (
  <svg
    width="37"
    height="29"
    viewBox="0 0 37 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[16px] h-[16px] sm:w-[30px] sm:h-[30px] md:w-[40px] md:h-[40px]">
    <path
      d="M36.6398 22.3516C35.9232 23.2566 34.1698 23.9016 34.1698 23.9016L21.1148 28.5966V25.1333L30.7215 21.705C31.8132 21.315 31.9798 20.7616 31.0932 20.4716C30.2098 20.18 28.6082 20.2633 27.5165 20.6566L21.1165 22.9133V19.3216L21.4832 19.1966C21.4832 19.1966 23.3332 18.54 25.9348 18.2516C28.5348 17.965 31.7215 18.2916 34.2215 19.24C37.0382 20.1316 37.3548 21.4466 36.6398 22.3516ZM22.3565 16.4566V7.60329C22.3565 6.56329 22.1665 5.60663 21.1915 5.33663C20.4465 5.09663 19.9832 5.78996 19.9832 6.82829V29L14.0098 27.1016V0.666626C16.5498 1.13829 20.2498 2.25496 22.2382 2.92496C27.2965 4.66329 29.0115 6.82829 29.0115 11.7033C29.0115 16.455 26.0815 18.2566 22.3582 16.4566H22.3565ZM3.0515 24.7733C0.159835 23.9566 -0.321832 22.2566 0.996501 21.2783C2.21483 20.375 4.2865 19.695 4.2865 19.695L12.8498 16.645V20.1216L6.68817 22.33C5.59983 22.72 5.4315 23.2733 6.3165 23.5633C7.2015 23.855 8.80483 23.7716 9.89483 23.38L12.8498 22.3066V25.415L12.2615 25.515C9.30483 25.9983 6.15483 25.7966 3.0515 24.7733Z"
      fill="white"
    />
  </svg>
);

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

interface Game {
  id: number;
  title: string;
  image?: string;
  price: number;
  discount?: number;
  discountDate?: string;
  isFavorite?: boolean;
}

interface CartItem {
  quantity: number;
  edition: string;
  platform: string;
  region: string;
  addedAt: number;
}

interface Review {
  cons: string;
  date: string;
  dislikes: number;
  gameId: number;
  liked: boolean;
  likes: number;
  order: string;
  pros: string;
  review: string;
}

interface Source {
  name: string;
  svg: React.ReactNode;
}

const OrderActivation: React.FC = () => {
  const [orderItems, setOrderItems] = useState<{ [key: string]: CartItem }>({});
  const [cartGames, setCartGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageSrcs, setImageSrcs] = useState<{ [key: number]: string }>({});
  const [isMinimum, setIsMinimum] = useState(false);
  const gamesPerPage = 5;
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [orderData, setOrderData] = useState<{
    id?: string;
    total: number;
    date: string;
    time: string;
    paymentMethod: string;
  } | null>(null);

  const router = useRouter();

  const activationKeys = useMemo(
    () => [
      "FSFWRA – GFGAG8 – FDFG56",
      "KJHGTY – BNMJUI – QWERT7",
      "PLKJH9 – ZXCVBN – ASDFGH",
      "MNBVCX – QWERTY – UIOJKL",
      "HGFDSQ – WERTYU – IOPLKJ",
      "TREWQ2 – YUIOPM – NBVCXZ",
      "ASDFG3 – HJKLPO – QWERTZ",
      "ZXCVB4 – UIOPLK – MJNHBG",
      "POIUYT – REWQAS – DFGHJK",
      "LKJHGF – YTREWQ – CVBNMX",
    ],
    []
  );

  useEffect(() => {
    const checkTouchDevice = () => {
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(isTouch);
    };
    checkTouchDevice();
    window.addEventListener("touchstart", checkTouchDevice);
    return () => window.removeEventListener("touchstart", checkTouchDevice);
  }, []);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMinimum(window.innerWidth < 768);
    };
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  const sources = useMemo(
    (): Source[] => [
      { name: "Steam", svg: <SteamIcon /> },
      { name: "PlayStation Store", svg: <PlayStationIcon /> },
      { name: "Microsoft Store", svg: <MicrosoftIcon /> },
    ],
    []
  );

  const fetchGameById = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/games?type=game&id=${id}`);
      if (!response.ok) throw new Error("Failed to fetch game");
      const data = await response.json();
      if (Array.isArray(data)) {
        const foundGame = data.find((g) => g.id === id);
        return foundGame || null;
      } else if (data.id) {
        return data;
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch game with id ${id}:`, error);
      return null;
    }
  }, []);

  useEffect(() => {
    const loadOrder = async () => {
      const orderDataStr = localStorage.getItem("oldOrderData");
      const orderItemsStr = localStorage.getItem("oldOrder");
      const orderData = orderDataStr ? JSON.parse(orderDataStr) : null;
      const orderItems = orderItemsStr ? JSON.parse(orderItemsStr) : {};

      setOrderItems(orderItems);
      setOrderData(orderData);

      const gameIds = Object.keys(orderItems)
        .map((key) => Number(key.split("_")[0]))
        .filter((id, index, self) => self.indexOf(id) === index);
      if (gameIds.length > 0) {
        const gamesPromises = gameIds.map((id) => fetchGameById(id));
        const games = (await Promise.all(gamesPromises)).filter(
          (game) => game !== null
        ) as Game[];
        const storedFavorites = localStorage.getItem("favoriteGames");
        const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];
        const updatedGames = games.map((game) => ({
          ...game,
          isFavorite: favoriteIds.includes(game.id),
        }));
        setCartGames(updatedGames);
      } else {
        setCartGames([]);
      }
      setLoading(false);
    };

    loadOrder();
  }, [fetchGameById]);

  useEffect(() => {
    setImageSrcs(
      cartGames.reduce(
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
  }, [cartGames]);

  const toggleFavorite = (e: React.MouseEvent, gameId: number) => {
    e.stopPropagation();
    const storedFavorites = localStorage.getItem("favoriteGames");
    let favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];

    if (favoriteIds.includes(gameId)) {
      favoriteIds = favoriteIds.filter((id: number) => id !== gameId);
    } else {
      favoriteIds.push(gameId);
    }

    localStorage.setItem("favoriteGames", JSON.stringify(favoriteIds));
    setCartGames((prevGames) =>
      prevGames.map((game) =>
        game.id === gameId ? { ...game, isFavorite: !game.isFavorite } : game
      )
    );
  };

  const calculateTotal = () => {
    let subtotal = 0;

    Object.entries(orderItems).forEach(([cartKey, item]) => {
      const gameId = Number(cartKey.split("_")[0]);
      const game = cartGames.find((g) => g.id === gameId);
      if (game) {
        const quantity = item.quantity;
        const originalPrice = game.price * quantity;
        subtotal += originalPrice;

        const isDiscountExpired =
          game.discountDate &&
          new Date(game.discountDate).getTime() < new Date().getTime();

        if (game.discount && !isDiscountExpired) {
          const discountAmount =
            ((game.price * (game.discount || 0)) / 100) * quantity;
          subtotal -= discountAmount;
        }
      }
    });

    return {
      subtotal: subtotal.toFixed(2),
    };
  };

  const { subtotal } = calculateTotal();

  const paginatedGames = useMemo(() => {
    const startIdx = (currentPage - 1) * gamesPerPage;
    const endIdx = currentPage * gamesPerPage;
    const orderEntries = Object.entries(orderItems)
      .filter(([, item]) => item.quantity > 0)
      .sort(([, a], [, b]) => b.addedAt - a.addedAt);
    let keyIndex = 0;

    const groupedByGameId = orderEntries.reduce((acc, [cartKey, item]) => {
      const gameId = Number(cartKey.split("_")[0]);
      if (!acc[gameId]) {
        acc[gameId] = [];
      }
      acc[gameId].push({ cartKey, item });
      return acc;
    }, {} as { [key: number]: { cartKey: string; item: CartItem }[] });

    const uniqueGamesWithCards = Object.entries(groupedByGameId)
      .map(([gameId, entries]) => {
        const game = cartGames.find((g) => g.id === Number(gameId));
        if (!game) return null;
        return { game, entries };
      })
      .filter(
        (
          item
        ): item is {
          game: Game;
          entries: { cartKey: string; item: CartItem }[];
        } => item !== null
      );

    const allCards = uniqueGamesWithCards.flatMap(({ game, entries }) => {
      const quantity = entries.reduce(
        (sum, entry) => sum + entry.item.quantity,
        0
      );
      const edition = entries[0].item.edition;
      const platform = entries[0].item.platform;
      const isDiscountExpired =
        game.discountDate &&
        new Date(game.discountDate).getTime() < new Date().getTime();
      const displayedPrice =
        game.discount && !isDiscountExpired
          ? (game.price * (1 - (game.discount || 0) / 100)).toFixed(2)
          : game.price.toFixed(2);
      const sourceIndex = 0;
      const randomSource = sources[sourceIndex];

      const displayTitle =
        edition === "Deluxe" ? `${game.title} Deluxe Edition` : game.title;

      return Array.from({ length: quantity }, (_, index) => {
        const handleReviewClick = (liked: boolean) => {
          const storedReviews = localStorage.getItem("reviews");
          const reviews = storedReviews ? JSON.parse(storedReviews) : [];
          const existingReview = reviews.find(
            (review: Review) => review.gameId === game.id
          );

          if (existingReview) {
            router.push(
              `/auth/account/product-reviews/write-review?gameId=${game.id}&liked=${liked}&reviewId=${existingReview.gameId}`
            );
          } else {
            const currentDate = new Date().toISOString().split("T")[0];
            const order = orderData?.id || "#123456789";
            router.push(
              `/auth/account/product-reviews/write-review?gameId=${game.id}&liked=${liked}&order=${order}&date=${currentDate}`
            );
          }
        };

        const activationKey = activationKeys[keyIndex % activationKeys.length];
        keyIndex++;

        const handleKeyToggle = () => {
          setShowKeys((prev) => ({
            ...prev,
            [entries[0].cartKey + "-" + index]:
              !prev[entries[0].cartKey + "-" + index],
          }));
        };

        return (
          <div
            key={`${entries[0].cartKey}_${index}`}
            className="flex flex-col gap-[4px] sm:gap-[8px] w-full">
            <div
              className="flex w-full items-center gap-[12px] sm:gap-[16px] h-[125px] sm:h-[280px]"
              aria-label={`${game.title} ${edition} Activation Card ${
                index + 1
              }`}>
              <div className="card-corner w-full relative flex-shrink-0 h-full max-w-[81px] sm:max-w-[180px] lg:max-w-[320px] mainCustom:max-w-[520px]">
                <div
                  className="favorite absolute w-[36px] h-[36px] sm:w-[48px] sm:h-[48px] right-0 top-0 z-10 flex justify-center items-center cursor-pointer"
                  onClick={(e) => toggleFavorite(e, game.id)}>
                  <FavoriteIcon isFavorite={game.isFavorite || false} />
                </div>
                <Link href={`/all-games/${game.id}`} className="w-full h-full">
                  <Image
                    src={imageSrcs[game.id] || "/images/no-image.jpg"}
                    alt={game.title}
                    width={520}
                    height={280}
                    className="object-cover w-full h-full"
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

              <div
                className={`flex flex-col w-full justify-between h-full md:p-[32px] md:pt-[24px] md:bg-2 ${
                  isMinimum ? "" : "card-corner"
                } max-w-[calc(100% - 100px)] sm:max-w-[calc(100% - 200px)]`}>
                <div className="w-full">
                  <div className="grid grid-cols-3 md:grid-cols-4 w-full items-center justify-between gap-[12px] mb-[12px] sm:mb-[23px]">
                    <Heading
                      variant="h3"
                      aria-label={displayTitle}
                      className="line-clamp-2 overflow-hidden text-ellipsis w-full flex-shrink-0 col-span-2 md:col-span-3">
                      {displayTitle}
                    </Heading>
                    <div className="flex justify-end gap-[16px] flex-shrink-0 items-end">
                      <span className="text-white font-bold text-[17px] leading-[20px] sm:text-[28px]">
                        {displayedPrice}$
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center flex-wrap line-clamp-2 justify-between sm:justify-start w-full gap-[8px] md:gap-[20px] 2xl:gap-[40px] gap-y-[3px]">
                    <span className="text-white text-[13px] leading-[15px] sm:text-[20px] whitespace-nowrap">
                      {edition}
                    </span>
                    <span className="text-white text-[13px] leading-[15px] sm:text-[20px] flex gap-[4px] sm:gap-[8px] items-center whitespace-nowrap">
                      {randomSource.svg} {randomSource.name}
                    </span>
                    <span className="text-white text-[13px] leading-[15px] sm:text-[20px] whitespace-nowrap">
                      {platform}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col bodyCustom:flex-row items-start bodyCustom:items-center w-full gap-[2px] sm:gap-[8px] md:gap-[16px]">
                  <p className="text-white text-[13px] leading-[15px] sm:text-[20px] sm:leading-[26px]">
                    Ready for activation in your Steam Account
                  </p>
                  <div className="bg-3 h-[34px] md:h-[56px] w-auto xs:w-[257px] md:w-[365px] skew-x-[-20deg] py-[8px] px-[10px] md:py-[16px] md:px-[20px] flex justify-center items-center flex-shrink-0">
                    <div className="flex justify-center items-center skew-x-[20deg] gap-[8px] md:gap-[18px]">
                      <span
                        className={`${
                          showKeys[entries[0].cartKey + "-" + index]
                            ? "text-[11px] xs:text-[13px] md:text-[20px] xs:leading-[13px] md:leading-[20px]"
                            : "text-[16px] leading-[16px] xs:text-[23px] xs:leading-[23px] md:text-[30px] md:leading-[30px]"
                        }`}>
                        {showKeys[entries[0].cartKey + "-" + index]
                          ? activationKey
                          : "•••••• – •••••• – ••••••"}
                      </span>
                      <svg
                        width="28"
                        height="32"
                        viewBox="0 0 28 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`cursor-pointer flex-shrink-0 w-[20px] h-[20px] md:w-[32px] md:h-[32px] ${
                          isTouchDevice ||
                          showKeys[entries[0].cartKey + "-" + index]
                            ? "hidden"
                            : ""
                        }`}
                        onClick={handleKeyToggle}>
                        <path
                          d="M23.8249 31.3487C23.7526 31.3847 23.6774 31.4143 23.6 31.4372C23.5184 31.4607 23.4347 31.476 23.3501 31.4827C23.267 31.4904 23.1833 31.4904 23.1002 31.4827C23.016 31.4763 22.9325 31.4637 22.8502 31.4447C22.7644 31.422 22.6808 31.3915 22.6003 31.3538C22.5196 31.3167 22.4426 31.2718 22.3704 31.2198C22.3008 31.1671 22.2356 31.1088 22.1755 31.0454C22.1138 30.978 22.0594 30.9043 22.013 30.8255L19.7437 27.0645L17.8218 29.3393C17.7353 29.4435 17.6436 29.543 17.5469 29.6375C17.4494 29.7311 17.3519 29.817 17.252 29.8903L17.232 29.9055C17.1362 29.9805 17.036 30.0497 16.9321 30.1127C16.8327 30.1733 16.7291 30.2265 16.6222 30.272C16.5414 30.3096 16.4578 30.3409 16.3722 30.3655C16.2906 30.3909 16.207 30.4095 16.1223 30.4211C16.0345 30.4333 15.946 30.4392 15.8574 30.4388C15.7735 30.4354 15.69 30.4261 15.6075 30.411C15.5065 30.3915 15.4077 30.3619 15.3126 30.3225C15.2192 30.2846 15.1304 30.2363 15.0476 30.1784C14.9649 30.1204 14.8879 30.0544 14.8177 29.9813C14.7482 29.9026 14.6855 29.818 14.6303 29.7285L14.6028 29.678L14.5803 29.6249L14.2579 28.7428V28.6998L12.5559 11.3682C12.5395 11.2568 12.5395 11.1435 12.5559 11.0321C12.5754 10.9218 12.6117 10.8152 12.6634 10.7161C12.7458 10.5588 12.8651 10.4243 13.0108 10.3243C13.0803 10.2757 13.156 10.2366 13.2357 10.2081C13.3163 10.1777 13.4002 10.1573 13.4856 10.1474C13.5931 10.1352 13.7018 10.1395 13.808 10.1601C13.9169 10.1819 14.022 10.2194 14.1204 10.2713L14.1954 10.3117C17.5719 12.5461 20.7184 14.6237 23.8524 16.6938L28.601 19.8255C28.6874 19.8817 28.7708 19.9424 28.8509 20.0075C28.923 20.0646 28.9914 20.1262 29.0558 20.192L29.0708 20.2097C29.1349 20.2743 29.1942 20.3436 29.2483 20.4169C29.3021 20.4859 29.3497 20.5595 29.3907 20.6368C29.4424 20.7285 29.4851 20.825 29.5182 20.925C29.5503 21.0209 29.572 21.1201 29.5832 21.2207C29.5944 21.3223 29.5944 21.4249 29.5832 21.5266C29.5732 21.6284 29.5539 21.7291 29.5257 21.8273C29.4732 21.9975 29.3939 22.158 29.2908 22.3025C29.2408 22.377 29.1848 22.4472 29.1233 22.5123C29.0599 22.5814 28.9914 22.6456 28.9184 22.7044C28.8266 22.7809 28.7297 22.851 28.6285 22.9142C28.5203 22.9797 28.4085 23.0388 28.2936 23.0911C28.1761 23.1442 28.0436 23.1947 27.9287 23.2377C27.8017 23.2813 27.6723 23.3176 27.5413 23.3464C26.849 23.4829 26.1592 23.6522 25.4744 23.8191L24.6622 24.0137L26.9115 27.7899C26.9576 27.8703 26.9961 27.9549 27.0265 28.0426C27.1172 28.3035 27.1302 28.5857 27.0639 28.854V28.8793C27.0436 28.9608 27.016 29.0403 26.9815 29.1169C26.945 29.1952 26.9024 29.2704 26.854 29.3418C26.8039 29.4153 26.747 29.4839 26.6841 29.5465C26.6208 29.609 26.5522 29.6657 26.4791 29.7159L25.9793 30.0419C25.2879 30.5211 24.5685 30.9575 23.8249 31.3487ZM11.7362 5.35261C11.8557 5.58367 11.8823 5.8525 11.8105 6.10294C11.7386 6.35338 11.5739 6.56606 11.3506 6.69656C11.1274 6.82706 10.8629 6.86528 10.6125 6.80324C10.3621 6.7412 10.145 6.5837 10.0067 6.36364L8.0073 2.82503C7.89397 2.59483 7.87164 2.32959 7.94485 2.08332C8.01806 1.83705 8.18131 1.62825 8.40137 1.49941C8.62144 1.37058 8.88178 1.33139 9.1294 1.38984C9.37703 1.44828 9.59333 1.59996 9.73427 1.814L11.7487 5.35261H11.7362ZM7.98731 17.1741C8.21493 17.0595 8.47719 17.0369 8.7207 17.1109C8.96421 17.1849 9.17067 17.35 9.29806 17.5726C9.42545 17.7952 9.4642 18.0585 9.40641 18.3089C9.34862 18.5593 9.19864 18.7781 8.987 18.9206L5.48808 20.9578C5.26045 21.0725 4.99819 21.0951 4.75468 21.021C4.51117 20.947 4.30471 20.7819 4.17732 20.5593C4.04993 20.3367 4.01119 20.0735 4.06897 19.823C4.12676 19.5726 4.27674 19.3538 4.48838 19.2113L7.98731 17.1741ZM7.46997 10.5038C7.71584 10.582 7.92235 10.7532 8.04638 10.9817C8.17042 11.2102 8.2024 11.4783 8.13565 11.7301C8.0689 11.9819 7.90857 12.1979 7.68814 12.3329C7.4677 12.468 7.2042 12.5118 6.95263 12.4551L3.08131 11.3935C2.84368 11.3104 2.64573 11.1399 2.5269 10.9158C2.40807 10.6917 2.3771 10.4305 2.44015 10.1844C2.50321 9.93824 2.65566 9.72516 2.86713 9.58761C3.07859 9.45006 3.33354 9.39815 3.58116 9.44222L7.46247 10.5038H7.46997ZM22.8253 10.84C22.5976 10.9546 22.3354 10.9772 22.0919 10.9031C21.8483 10.8291 21.6419 10.664 21.5145 10.4414C21.3871 10.2189 21.3484 9.95557 21.4062 9.70514C21.4639 9.45471 21.6139 9.23596 21.8256 9.09342L25.3245 7.05619C25.5521 6.94157 25.8144 6.91899 26.0579 6.99303C26.3014 7.06707 26.5079 7.23217 26.6352 7.45473C26.7626 7.67729 26.8014 7.94059 26.7436 8.19102C26.6858 8.44145 26.5358 8.6602 26.3242 8.80274L22.8253 10.84ZM18.1917 5.63317C18.1656 5.76936 18.1121 5.89867 18.0345 6.01306C17.9569 6.12744 17.8569 6.22445 17.7406 6.29805C17.6243 6.37165 17.4943 6.42027 17.3587 6.44087C17.223 6.46148 17.0847 6.45363 16.9521 6.41782C16.8196 6.38202 16.6958 6.31901 16.5884 6.23273C16.481 6.14645 16.3923 6.03874 16.3278 5.9163C16.2634 5.79386 16.2245 5.65931 16.2136 5.52103C16.2028 5.38274 16.2202 5.24368 16.2648 5.11249L17.2944 1.19222C17.3766 0.951893 17.5452 0.751692 17.7668 0.631517C17.9884 0.511341 18.2466 0.480017 18.49 0.543787C18.7334 0.607557 18.9441 0.761737 19.0801 0.975601C19.2161 1.18946 19.2674 1.4473 19.2239 1.69773L18.1917 5.63317ZM23.2326 29.9889L25.6494 28.5077C24.8046 27.0872 23.4376 25.0828 22.7728 23.6623C22.7602 23.633 22.7501 23.6025 22.7428 23.5714C22.7077 23.4145 22.7356 23.25 22.8205 23.1139C22.9053 22.9779 23.0401 22.8815 23.1951 22.8459C24.5397 22.5351 25.9143 22.2419 27.2489 21.9032C27.403 21.8684 27.5536 21.8193 27.6988 21.7566C27.8146 21.7055 27.9237 21.6402 28.0237 21.5619C28.0578 21.5325 28.0895 21.5004 28.1186 21.4659C28.1333 21.4476 28.1451 21.4272 28.1536 21.4052L28.1386 21.3597C28.1093 21.3094 28.0722 21.2642 28.0287 21.2258C27.9644 21.1665 27.895 21.1132 27.8212 21.0665L14.0929 11.9976C14.6203 17.3965 15.3925 23.1442 15.7049 28.5052C15.7132 28.5905 15.7282 28.6751 15.7499 28.7579C15.7655 28.8126 15.7873 28.8651 15.8149 28.9146L15.8474 28.95C15.8714 28.9536 15.8958 28.9536 15.9199 28.95C15.9636 28.9399 16.0063 28.9255 16.0473 28.9071C16.1622 28.8551 16.2698 28.7879 16.3672 28.7074C16.4889 28.6052 16.6017 28.4927 16.7046 28.3712C17.187 27.7975 19.1039 25.3027 19.5538 25.0399C19.6898 24.9581 19.8523 24.9339 20.0058 24.9727C20.1594 25.0116 20.2915 25.1102 20.3735 25.2471L23.2326 29.9863V29.9889Z"
                          fill="#4EF432"
                        />
                      </svg>
                      <svg
                        width="18"
                        height="21"
                        viewBox="0 0 18 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`cursor-pointer flex-shrink-0 w-[20px] h-[20px] md:w-[32px] md:h-[32px] ${
                          !isTouchDevice ||
                          showKeys[entries[0].cartKey + "-" + index]
                            ? "hidden"
                            : ""
                        }`}
                        onClick={handleKeyToggle}>
                        <path
                          d="M6.97168 0.0996094C8.64053 0.0996549 9.97457 1.43465 9.97461 3.10352C9.97459 3.66167 9.78515 4.22244 9.48535 4.70703V3.10352C9.48535 1.73794 8.33725 0.589871 6.97168 0.589844C5.60609 0.589844 4.45801 1.73796 4.45801 3.10352V4.73438C4.16003 4.29221 3.96779 3.72281 3.96777 3.10352C3.96777 1.43462 5.30279 0.0996094 6.97168 0.0996094Z"
                          fill="#4EF432"
                          stroke="#4EF432"
                          strokeWidth="0.2"
                        />
                        <path
                          d="M6.97168 1.2793C7.99226 1.2793 8.79564 2.08202 8.7959 3.10254V6.36426C9.05772 6.20665 9.36949 6.10645 9.73047 6.10645C10.4217 6.1065 11.0455 6.49929 11.3574 7.15527C11.6983 6.91637 12.0936 6.7959 12.4893 6.7959C13.4484 6.79605 14.2148 7.50588 14.3037 8.43848C14.5674 8.27764 14.8828 8.17578 15.248 8.17578C16.2686 8.17603 17.0713 8.97945 17.0713 10V14.1377C17.0712 17.4342 14.4059 20.0996 11.1094 20.0996C8.8652 20.0995 6.62569 19.0443 5.02246 16.1865L5.02148 16.1855C4.47184 15.1721 3.87911 14.2435 3.31934 13.3984C2.76071 12.5551 2.2324 11.791 1.81738 11.1123C1.40307 10.4347 1.09353 9.82982 0.977539 9.30273C0.860262 8.76935 0.939397 8.30384 1.31445 7.92871C1.5724 7.67076 1.87047 7.53967 2.19336 7.51172C2.51389 7.48405 2.85394 7.55855 3.19922 7.7002C3.83308 7.96024 4.50553 8.45632 5.14746 9.01855V3.10254C5.14772 2.08207 5.95111 1.27931 6.97168 1.2793ZM6.97168 2.16895C6.47531 2.16895 6.0374 2.60624 6.03711 3.10254V11.1455L5.86523 10.9648C5.14205 10.2072 4.32027 9.42044 3.58789 8.91797C3.22119 8.66639 2.88374 8.49191 2.59766 8.42383C2.31593 8.35689 2.09775 8.395 1.94141 8.54883C1.80683 8.69687 1.78565 8.92152 1.90723 9.2832C2.02822 9.64305 2.28137 10.1066 2.64355 10.6973C3.36329 11.8711 4.50566 13.534 5.81543 15.8086L6.0498 16.1748C6.60535 17.012 7.21999 17.7278 7.96094 18.2539C8.80564 18.8536 9.81941 19.2099 11.1094 19.21C13.88 19.21 16.1816 16.7738 16.1816 14.1377V11.417H16.1826V9.99902C16.1823 9.50286 15.7442 9.06567 15.248 9.06543C14.7517 9.06543 14.3138 9.50273 14.3135 9.99902V10.4443H13.4238V8.62012C13.4238 8.12374 12.9856 7.68571 12.4893 7.68555C11.9928 7.68555 11.5547 8.12365 11.5547 8.62012V9.75488H10.665V7.93066C10.665 7.43421 10.2269 6.99618 9.73047 6.99609C9.23397 6.99609 8.7959 7.43417 8.7959 7.93066V10.4443H7.90625V3.10254C7.90596 2.60625 7.46801 2.16895 6.97168 2.16895Z"
                          fill="#4EF432"
                          stroke="#4EF432"
                          strokeWidth="0.2"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="skew-x-[-10deg] sm:skew-x-[-20deg] max-w-[calc(100%-30px)] sm:max-w-[calc(100%-20px)] mx-auto py-[8px] px-[24px] bg-2 flex flex-col md:flex-row justify-between items-center w-full gap-[12px]">
              <div className="flex flex-col lg:flex-row lg:items-center sm:gap-[8px] lg:gap-[32px] skew-x-[10deg] sm:skew-x-[20deg]">
                <Heading variant="h3">review the game</Heading>
                <Text>Enjoying the game? Leave us a quick review!</Text>
              </div>
              <div className="flex items-center gap-[42px] skew-x-[10deg] sm:skew-x-[20deg]">
                <button
                  className="py-[6px] px-[12px] border-[1px] border-red skew-x-[-20deg] hover:bg-red-20"
                  onClick={() => handleReviewClick(false)}>
                  <span className="flex items-center gap-[8px] skew-x-[20deg]">
                    <LikeIcon className="rotate-180 w-[24px] h-[24px] sm:w-[34px] sm:h-[34px]" />
                  </span>
                </button>
                <button
                  className="py-[6px] px-[12px] border-[1px] border-primary-main skew-x-[-20deg] hover:bg-primary-20"
                  onClick={() => handleReviewClick(true)}>
                  <span className="flex items-center gap-[8px] skew-x-[20deg]">
                    <LikeIcon className="w-[24px] h-[24px] sm:w-[34px] sm:h-[34px]" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
      });
    });

    return allCards.slice(startIdx, endIdx);
  }, [
    cartGames,
    currentPage,
    gamesPerPage,
    orderItems,
    sources,
    router,
    activationKeys,
    showKeys,
    imageSrcs,
    orderData,
    isTouchDevice,
    isMinimum,
  ]);

  const totalPages = useMemo(
    () =>
      Math.ceil(
        Object.values(orderItems).reduce(
          (sum: number, item: CartItem) => sum + item.quantity,
          0
        ) / gamesPerPage
      ),
    [orderItems, gamesPerPage]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  if (loading) {
    return (
      <Heading variant="h3" className="text-center py-10" aria-live="polite">
        Loading...
      </Heading>
    );
  }

  return (
    <main>
      <div className="flex ml-[10px] max-w-[251px] mb-[40px] sm:mb-[80px] mt-[40px] sm:mt-[80px] sm:max-w-[248px]">
        <Button
          variant="secondary"
          className="max-w-[251px] ml-0 sm:mx-auto "
          onClick={() => (window.location.href = "/auth/account/orders")}>
          <svg
            width="14"
            height="22"
            viewBox="0 0 14 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-[12px]">
            <path
              d="M11.668 20.3334L2.33463 11L11.668 1.66669"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
          my orders
        </Button>
      </div>
      <section className="mb-[56px] md:mb-[120px]">
        <Heading
          variant="h1"
          className="mb-[24px] sm:mb-[40px]"
          aria-label="Game Activation">
          Purchanse completed
        </Heading>
        <div className="flex flex-col 2xl:flex-row gap-[56px] 2xl:gap-[24px]">
          <div className="flex-1 flex flex-col gap-[16px]">
            {Object.keys(orderItems).length === 0 ? (
              <p className="text-gray-68">No games to activate</p>
            ) : (
              <>
                {paginatedGames}
                {totalPages > 1 && (
                  <div className="mt-[24px] sm:mt-[56px]">
                    <Pagination
                      totalPages={totalPages}
                      currentPage={currentPage}
                      handlePageChange={handlePageChange}
                    />
                  </div>
                )}
                <Text className="mt-[24px] sm:mt-[40px]">
                  How to activate your game?{" "}
                  <Link href="/faq" className="text-primary-main underline">
                    Click here
                  </Link>
                </Text>
              </>
            )}
          </div>

          <div className="w-full 2xl:w-[384px] 2xl:px-[12px] flex flex-col gap-[16px]">
            <div className="flex flex-col w-full gap-[20px] pb-[20px] border-b-4 border-[#4C4C4C]">
              <div className="flex w-full justify-between items-center gap-[10px]">
                <span className="uppercase m-0 text-gray-68 font-usuzi-condensed text-[16px] leading-[16px] sm:text-[26px] sm:leading-[28px]">
                  Order
                </span>
                <span className="text-gray-68 font-bold text-[15px] leading-[15px] sm:text-[20px] sm:leading-[24px]">
                  {orderData?.id ? `#${orderData.id}` : "N/A"}
                </span>
              </div>
              <div className="flex w-full justify-between items-center gap-[10px]">
                <span className="uppercase m-0 text-gray-68 font-usuzi-condensed text-[16px] leading-[16px] sm:text-[26px] sm:leading-[28px]">
                  Date
                </span>
                <span className="text-gray-68 font-bold text-[15px] leading-[15px] sm:text-[20px] sm:leading-[24px]">
                  {orderData?.date || "N/A"}
                </span>
              </div>
              <div className="flex w-full justify-between items-center gap-[10px]">
                <span className="uppercase m-0 text-gray-68 font-usuzi-condensed text-[16px] leading-[16px] sm:text-[26px] sm:leading-[28px]">
                  Time
                </span>
                <span className="text-gray-68 font-bold text-[15px] leading-[15px] sm:text-[20px] sm:leading-[24px]">
                  {orderData?.time || "N/A"}
                </span>
              </div>
              <div className="flex w-full justify-between items-center gap-[10px]">
                <span className="uppercase m-0 text-gray-68 font-usuzi-condensed text-[16px] leading-[16px] sm:text-[26px] sm:leading-[28px]">
                  Payment Method
                </span>
                <span className="text-gray-68 font-bold text-[15px] leading-[15px] sm:text-[20px] sm:leading-[24px]">
                  {orderData?.paymentMethod || "N/A"}
                </span>
              </div>
            </div>
            <div className="flex w-full justify-between items-center gap-[10px] 2xl:mb-[68px]">
              <span className="uppercase m-0 text-white font-usuzi-condensed text-[20px] leading-[24px] sm:text-[28px] sm:leading-[28px]">
                Total price
              </span>
              <span className="text-white font-bold text-[20px] leading-[24px] sm:text-[28px] sm:leading-[28px]">
                {orderData?.total ? orderData.total.toFixed(2) : subtotal}$
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OrderActivation;
