"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import Image from "next/image";
import Link from "next/link";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import CartMenu from "@/components/Sections/Cart/CartMenu";
import CartRecommendations from "@/components/Sections/Cart/CartRecommendations";
import TotalPrice from "@/components/Sections/Cart/TotalPrice";
import { CartProvider, useCart } from "@/components/Sections/Game/CartHandler";
import {
  FavoriteProvider,
  useFavorite,
} from "@/components/Sections/Game/FavoriteHandler";

const FavoriteIcon = ({ isFavorite }: { isFavorite: boolean }) => (
  <svg
    width="16.5"
    height="21"
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

const DeleteIcon = ({ className }: { className?: string }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true">
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

const DownArrowIcon = () => (
  <svg
    width="18"
    height="10"
    viewBox="0 0 18 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="skew-x-[20deg]">
    <path
      d="M16 1.5L9 8.5L2 1.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="square"
    />
  </svg>
);

const SteamIcon = () => (
  <svg
    width="40"
    height="20"
    viewBox="0 0 40 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[16px] h-[16px] sm:w-[30px] sm:h-[30px] ">
    <path
      d="M34.2836 0.666992C31.1733 0.666992 28.6521 3.1882 28.6521 6.29851C28.6521 6.51427 28.6642 6.72517 28.6885 6.93366L25.7261 11.004C25.6436 10.9991 25.5612 10.9918 25.4788 10.9918C24.6133 10.9918 23.8109 11.2512 23.1394 11.6973L8.19152 5.65608C7.78424 3.79427 6.12849 2.3979 4.14303 2.3979C1.85455 2.3979 0 4.25487 0 6.54336C0 8.83184 1.85455 10.6864 4.14303 10.6864C4.99636 10.6864 5.79152 10.427 6.45091 9.98336L21.3042 15.9834C21.6606 17.9664 23.3891 19.4743 25.4764 19.4743C27.8182 19.4743 29.7188 17.5737 29.7188 15.2318C29.7188 15.0137 29.697 14.8028 29.6655 14.5943L33.6752 11.8937C33.8739 11.9155 34.0776 11.9276 34.2812 11.9276C37.3915 11.9276 39.9127 9.40639 39.9127 6.29608C39.9127 3.18578 37.3915 0.666992 34.2836 0.666992ZM4.9697 4.35669C3.97818 3.95669 2.85576 4.3373 2.29576 5.20517C2.05415 5.53722 1.90673 5.92838 1.86909 6.3373C1.73576 7.31184 2.27152 8.29608 3.22182 8.68154L4.85576 9.34093C4.62788 9.39911 4.3903 9.43305 4.14303 9.43305C2.5503 9.43305 1.25333 8.13608 1.25333 6.54336C1.25333 4.95063 2.5503 3.65366 4.14303 3.65366C5.17333 3.65366 6.07758 4.19669 6.58909 5.01123L4.9697 4.35669ZM25.4764 18.1846C24.3491 18.1846 23.3697 17.5494 22.8727 16.6185L24.0606 17.0985C24.467 17.4097 24.9645 17.5783 25.4764 17.5785C26.7685 17.5785 27.823 16.5264 27.823 15.2343C27.823 15.0234 27.7915 14.8221 27.7406 14.6282C27.5976 13.9276 27.12 13.3046 26.4097 13.0185L24.7952 12.3664C25.0158 12.3131 25.2436 12.284 25.4788 12.284C27.1055 12.284 28.4315 13.6076 28.4315 15.2367C28.4315 16.8658 27.1055 18.1846 25.4764 18.1846ZM34.2836 9.8379C32.3321 9.8379 30.7442 8.25002 30.7442 6.29851C30.7442 4.34699 32.3321 2.75911 34.2836 2.75911C36.2352 2.75911 37.823 4.34699 37.823 6.29851C37.823 8.25002 36.2352 9.8379 34.2836 9.8379ZM37.0958 6.29851C37.0958 7.85002 35.8327 9.11063 34.2836 9.11063C32.7345 9.11063 31.4715 7.8476 31.4715 6.29851C31.4715 4.74942 32.7345 3.48639 34.2836 3.48639C35.8327 3.48639 37.0958 4.74699 37.0958 6.29851Z"
      fill="white"
    />
  </svg>
);

const MicrosoftIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[16px] h-[16px] sm:w-[30px] sm:h-[30px]">
    <path
      d="M18.0056 39.9397C14.9244 39.6446 11.8049 38.5381 9.12517 36.7897C6.87961 35.3246 6.37251 34.7223 6.37251 33.5204C6.37251 31.1061 9.02708 26.8775 13.5689 22.0569C16.1483 19.3191 19.7413 16.1101 20.1299 16.197C20.8851 16.3659 26.9243 22.2566 29.185 25.0297C32.7601 29.4147 34.4036 33.0051 33.5687 34.6059C32.9339 35.8227 28.9955 38.2009 26.1021 39.1146C23.7174 39.8676 20.5855 40.1868 18.0056 39.9397ZM3.33963 31.0102C1.47363 28.1475 0.53086 25.3292 0.0756855 21.253C-0.0746141 19.907 -0.0207546 19.1371 0.416977 16.3745C0.962546 12.9312 2.92342 8.94779 5.2796 6.49632C6.28311 5.45222 6.37273 5.42678 7.59595 5.83885C9.0814 6.33926 10.6677 7.43485 13.1279 9.65944L14.5633 10.9574L13.7795 11.9203C10.1409 16.3904 6.29985 22.7265 4.85227 26.6465C4.06531 28.7776 3.7479 30.9168 4.0865 31.8074C4.31511 32.4087 4.10513 32.1846 3.33963 31.0102ZM36.0938 31.4971C36.2782 30.5972 36.045 28.9445 35.4986 27.2776C34.3152 23.6676 30.3596 16.9519 26.7274 12.3858L25.584 10.9484L26.821 9.81257C28.4362 8.32946 29.5576 7.44139 30.7677 6.68722C31.7225 6.0921 33.087 5.56526 33.6735 5.56526C34.0351 5.56526 35.3081 6.8864 36.3358 8.32819C37.9275 10.5612 39.0985 13.2681 39.6917 16.0861C40.075 17.9068 40.107 21.8042 39.7535 23.6205C39.4633 25.111 38.8508 27.0445 38.2532 28.3558C37.8055 29.3383 36.6918 31.2465 36.2038 31.8674C35.9529 32.1867 35.9527 32.186 36.0938 31.4971ZM18.3355 4.88358C16.6595 4.03253 14.0741 3.11897 12.6459 2.87318C12.1452 2.78702 11.2912 2.73897 10.7479 2.7664C9.56958 2.8259 9.62221 2.76428 11.5125 1.87119C13.0841 1.12869 14.395 0.692067 16.1746 0.318402C18.1765 -0.101944 21.9394 -0.106877 23.9095 0.308262C26.0373 0.756647 28.5428 1.68905 29.9547 2.5579L30.3743 2.81614L29.4116 2.76752C27.4984 2.67091 24.7102 3.44383 21.7167 4.90062C20.8138 5.34002 20.0283 5.69097 19.9711 5.68049C19.914 5.67001 19.1779 5.3114 18.3355 4.88358Z"
      fill="white"
    />
  </svg>
);

const PlayStationIcon = () => (
  <svg
    width="37"
    height="29"
    viewBox="0 0 37 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[16px] h-[16px] sm:w-[30px] sm:h-[30px] ">
    <path
      d="M36.6398 22.3516C35.9232 23.2566 34.1698 23.9016 34.1698 23.9016L21.1148 28.5966V25.1333L30.7215 21.705C31.8132 21.315 31.9798 20.7616 31.0932 20.4716C30.2098 20.18 28.6082 20.2633 27.5165 20.6566L21.1165 22.9133V19.3216L21.4832 19.1966C21.4832 19.1966 23.3332 18.54 25.9348 18.2516C28.5348 17.965 31.7215 18.2916 34.2215 19.24C37.0382 20.1316 37.3548 21.4466 36.6398 22.3516ZM22.3565 16.4566V7.60329C22.3565 6.56329 22.1665 5.60663 21.1915 5.33663C20.4465 5.09663 19.9832 5.78996 19.9832 6.82829V29L14.0098 27.1016V0.666626C16.5498 1.13829 20.2498 2.25496 22.2382 2.92496C27.2965 4.66329 29.0115 6.82829 29.0115 11.7033C29.0115 16.455 26.0815 18.2566 22.3582 16.4566H22.3565ZM3.0515 24.7733C0.159835 23.9566 -0.321832 22.2566 0.996501 21.2783C2.21483 20.375 4.2865 19.695 4.2865 19.695L12.8498 16.645V20.1216L6.68817 22.33C5.59983 22.72 5.4315 23.2733 6.3165 23.5633C7.2015 23.855 8.80483 23.7716 9.89483 23.38L12.8498 22.3066V25.415L12.2615 25.515C9.30483 25.9983 6.15483 25.7966 3.0515 24.7733Z"
      fill="white"
    />
  </svg>
);

interface Game {
  id: number;
  title: string;
  image: string;
  price: number;
  discount?: number;
  discountDate?: string;
  isFavorite?: boolean;
}

interface Source {
  name: string;
  svg: React.ReactNode;
}

const CartContent: React.FC = () => {
  const { cartQuantities, setCartQuantities } = useCart();
  const { favoriteIds, toggleFavorite: toggleFavoriteFromContext } =
    useFavorite();
  const [cartGames, setCartGames] = useState<Game[]>([]);
  const [gameCache, setGameCache] = useState<{ [id: number]: Game }>({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageSrcs, setImageSrcs] = useState<{ [key: number]: string }>({});
  const [editingCartKey, setEditingCartKey] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState(0);
  const [isMinimum, setIsMinimum] = useState(false);
  const [isOneLine, setIsOneLine] = useState<{ [key: string]: boolean }>({});
  const gamesPerPage = 5;

  const quantityRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const infoRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleResize = () => {
      setIsMinimum(window.innerWidth > 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sources = useMemo(
    (): Source[] => [
      { name: "Steam", svg: <SteamIcon /> },
      { name: "PlayStation Store", svg: <PlayStationIcon /> },
      { name: "Microsoft Store", svg: <MicrosoftIcon /> },
    ],
    []
  );

  const fetchGameById = useCallback(
    async (id: number) => {
      if (gameCache[id]) {
        return gameCache[id];
      }
      try {
        const response = await fetch(`/api/games?type=game&id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch game");
        const data = await response.json();
        const game = Array.isArray(data)
          ? data.find((g) => g.id === id)
          : data.id
          ? data
          : null;
        if (game) {
          setGameCache((prev) => ({ ...prev, [id]: game }));
        }
        return game;
      } catch (error) {
        console.error(`Failed to fetch game with id ${id}:`, error);
        return null;
      }
    },
    [gameCache]
  );

  useEffect(() => {
    const loadCartGames = async () => {
      setLoading(true);
      const gameIds = Object.keys(cartQuantities)
        .map((key) => Number(key.split("_")[0]))
        .filter((id, index, self) => self.indexOf(id) === index);
      if (gameIds.length > 0) {
        const gamesPromises = gameIds.map((id) => fetchGameById(id));
        const games = (await Promise.all(gamesPromises)).filter(
          (game) => game !== null
        ) as Game[];
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

    loadCartGames();
  }, [cartQuantities, fetchGameById, favoriteIds]);

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

  useEffect(() => {
    const checkLineCount = () => {
      const newIsOneLine: { [key: string]: boolean } = {};
      Object.keys(cartQuantities).forEach((cartKey) => {
        const ref = infoRefs.current[cartKey];
        if (ref) {
          const height = ref.getBoundingClientRect().height;
          const isSingleLine = height <= (isMinimum ? 41 : 30);
          newIsOneLine[cartKey] = isSingleLine;
        } else {
          newIsOneLine[cartKey] = true;
        }
      });
      setIsOneLine(newIsOneLine);
    };

    const timer = setTimeout(checkLineCount, 0);
    window.addEventListener("resize", checkLineCount);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkLineCount);
    };
  }, [cartQuantities, isMinimum]);

  const updateQuantity = useCallback(
    (gameId: number, change: number, cartKey: string) => {
      setCartQuantities((prev) => {
        const currentItem = prev[cartKey];
        const newQuantity = Math.max(0, (currentItem?.quantity || 0) + change);

        if (newQuantity === 0) {
          const newCartQuantities = { ...prev };
          delete newCartQuantities[cartKey];
          return newCartQuantities;
        } else {
          return {
            ...prev,
            [cartKey]: {
              ...currentItem,
              quantity: newQuantity,
              addedAt: currentItem?.addedAt || Date.now(),
            },
          };
        }
      });
    },
    [setCartQuantities]
  );

  const removeFromCart = useCallback(
    (gameId: number, cartKey: string) => {
      setCartQuantities((prev) => {
        const newCartQuantities = { ...prev };
        delete newCartQuantities[cartKey];
        return newCartQuantities;
      });
    },
    [setCartQuantities]
  );

  const handleQuantityChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (e: React.ChangeEvent<HTMLInputElement>, cartKey: string) => {
      const value = e.target.value.replace(/^0+/, "") || "";
      const numValue = value === "" ? 0 : parseInt(value) || 0;
      setNewQuantity(numValue);
    },
    []
  );

  const handleQuantityBlur = useCallback(
    (gameId: number, cartKey: string, currentQuantity: number) => {
      const finalQuantity = Math.max(1, newQuantity);
      if (finalQuantity !== currentQuantity) {
        updateQuantity(gameId, finalQuantity - currentQuantity, cartKey);
      }
      setEditingCartKey(null);
      setNewQuantity(finalQuantity);
    },
    [newQuantity, updateQuantity]
  );

  const handleQuantityKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      gameId: number,
      cartKey: string,
      currentQuantity: number
    ) => {
      if (e.key === "Enter") {
        handleQuantityBlur(gameId, cartKey, currentQuantity);
      }
    },
    [handleQuantityBlur]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingCartKey) {
        const ref = quantityRefs.current[editingCartKey];
        if (ref && !ref.contains(event.target as Node)) {
          const [gameId] = editingCartKey.split("_").map(Number);
          const currentQuantity = cartQuantities[editingCartKey]?.quantity || 1;
          handleQuantityBlur(gameId, editingCartKey, currentQuantity);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingCartKey, cartQuantities, handleQuantityBlur]);

  const paginatedGames = useMemo(() => {
    const startIdx = (currentPage - 1) * gamesPerPage;
    const endIdx = currentPage * gamesPerPage;
    const cartEntries = Object.entries(cartQuantities)
      .filter(([, item]) => item.quantity > 0)
      .sort(([, a], [, b]) => b.addedAt - a.addedAt);
    return cartEntries
      .slice(startIdx, endIdx)
      .map(([cartKey, item], index) => {
        const gameId = Number(cartKey.split("_")[0]);
        const game = cartGames.find((g) => g.id === gameId);
        if (!game) return null;

        const quantity = item.quantity;
        const edition = item.edition;
        const platform = item.platform;
        const isDiscountExpired =
          game.discountDate &&
          new Date(game.discountDate).getTime() < new Date().getTime();
        const displayedPrice =
          game.discount && !isDiscountExpired
            ? game.price * (1 - (game.discount || 0) / 100) * quantity
            : game.price * quantity;
        const sourceIndex = index % sources.length;
        const randomSource = sources[sourceIndex];

        const displayTitle =
          edition === "Deluxe" ? `${game.title} Deluxe Edition` : game.title;

        return (
          <div
            key={cartKey}
            className="flex w-full items-center gap-[12px] h-[125px] sm:h-[210px]"
            aria-label={`${game.title} ${edition} Cart Item`}>
            <div className="card-corner relative w-full flex-shrink-0 h-full max-w-[81px] sm:max-w-[180px] lg:max-w-[320px] mainCustom:max-w-[390px]">
              <div
                className="favorite absolute w-[36px] h-[36px] right-0 top-0 z-10 flex justify-center items-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavoriteFromContext(game.id);
                }}>
                <FavoriteIcon isFavorite={game.isFavorite || false} />
              </div>
              <Link href={`/all-games/${game.id}`} className="w-full h-full">
                <Image
                  src={imageSrcs[game.id] || "/images/no-image.jpg"}
                  alt={game.title}
                  width={390}
                  height={210}
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
              className={`flex flex-col w-full justify-between h-full md:p-[24px] md:pt-[18px] md:bg-2 ${
                isMinimum ? "card-corner" : ""
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
                    <span className="text-white font-bold text-[17px] leading-[20px] sm:text-[21px]">
                      {displayedPrice.toFixed(2)}$
                    </span>
                  </div>
                </div>
                <div
                  ref={(el) => {
                    infoRefs.current[cartKey] = el;
                  }}
                  className={`flex items-center flex-wrap line-clamp-2 justify-${
                    isOneLine[cartKey] ?? true ? "between" : "start"
                  } w-full gap-[8px] md:gap-[20px] gap-y-[3px]`}>
                  <span className="text-white text-[13px] leading-[15px] sm:text-[15px] whitespace-nowrap">
                    {edition}
                  </span>
                  <span className="text-white text-[13px] leading-[15px] sm:text-[15px] flex gap-[4px] sm:gap-[8px] items-center whitespace-nowrap">
                    {randomSource.svg} {randomSource.name}
                  </span>
                  <span className="text-white text-[13px] leading-[15px] sm:text-[15px] whitespace-nowrap">
                    {platform}
                  </span>
                </div>
              </div>
              <div className="flex justify-between w-[calc(100%-20px)] mx-auto md:w-full">
                <div>
                  <button
                    className="my-0 mx-auto rounded-[2px] cursor-pointer lg:hover:bg-primary-10 px-[12px] py-[12px] focus:outline-none skew-x-[-20deg] w-[64px] h-[40px] sm:w-[54px] sm:h-[45px] flex justify-center items-center border-[1px] border-DLS lg:border-primary-main"
                    onClick={() => removeFromCart(gameId, cartKey)}
                    aria-label={`Remove ${game.title} ${edition} from cart`}>
                    <DeleteIcon className="cursor-pointer skew-x-[20deg] w-[24px] h-[24px] sm:w-[24px] sm:h-[24px]" />
                  </button>
                </div>
                <div className="flex items-center gap-[24px] flex-shrink-0 w-full max-w-[108px] sm:max-w-[151px]">
                  <div className="relative hidden lg:flex items-center gap-[24px]">
                    <Button
                      variant="secondary"
                      className="max-w-[48px] h-[45px] flex items-center justify-center flex-shrink-0"
                      onClick={() => updateQuantity(gameId, -1, cartKey)}>
                      -
                    </Button>
                    <span className="text-white text-[13px] font-bold">
                      {quantity}
                    </span>
                    <Button
                      variant="secondary"
                      className="max-w-[48px] h-[45px] flex items-center justify-center flex-shrink-0"
                      onClick={() => updateQuantity(gameId, 1, cartKey)}>
                      +
                    </Button>
                  </div>
                  <div className="relative flex justify-end lg:hidden w-full">
                    <div
                      className="max-w-[90px] h-[40px] sm:h-[45px] flex items-center justify-between px-[10px] sm:px-[15px] flex-shrink-0 mr-0 bg-3 border-[1px] border-DLS rounded-[2px] cursor-pointer skew-x-[-20deg] border-primary-main"
                      onClick={() => {
                        setEditingCartKey(cartKey);
                        setNewQuantity(quantity);
                      }}>
                      {editingCartKey === cartKey ? (
                        <input
                          type="number"
                          value={newQuantity}
                          onChange={(e) => handleQuantityChange(e, cartKey)}
                          onBlur={() =>
                            handleQuantityBlur(gameId, cartKey, quantity)
                          }
                          onKeyDown={(e) =>
                            handleQuantityKeyDown(e, gameId, cartKey, quantity)
                          }
                          autoFocus
                          className="font-usuzi-condensed max-w-[40px] text-center bg-transparent skew-x-[20deg] no-arrows focus:outline-none text-[18px] leading-[19px] sm:text-[19px] sm:leading-[21px] font-bold"
                          ref={(el) => {
                            quantityRefs.current[cartKey] = el;
                          }}
                        />
                      ) : (
                        <>
                          <span className="font-usuzi-condensed block my-0 mx-auto rounded-[2px] cursor-pointer text-[18px] leading-[19px] sm:text-[19px] sm:leading-[21px] uppercase text-center px-[12px] py-[12px] w-full focus:outline-none skew-x-[20deg] text-white font-bold">
                            {quantity}
                          </span>
                          <DownArrowIcon />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })
      .filter((item) => item !== null);
  }, [
    cartGames,
    currentPage,
    cartQuantities,
    editingCartKey,
    newQuantity,
    sources,
    isMinimum,
    isOneLine,
    imageSrcs,
    removeFromCart,
    updateQuantity,
    toggleFavoriteFromContext,
    handleQuantityChange,
    handleQuantityBlur,
    handleQuantityKeyDown,
  ]);

  const totalPages = useMemo(
    () => Math.ceil(Object.keys(cartQuantities).length / gamesPerPage),
    [cartQuantities]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  if (loading && cartGames.length === 0) {
    return (
      <Heading variant="h3" className="text-center py-10" aria-live="polite">
        Loading...
      </Heading>
    );
  }

  return (
    <>
      <CartMenu activeItem="shopping-cart" />
      <main>
        <section className="mb-[56px] md:mb-[90px]">
          <Heading
            variant="h1"
            className="mb-[24px] sm:mb-[30px]"
            aria-label="Cart">
            Cart
          </Heading>
          <div className="flex flex-col 2xl:flex-row gap-[18px]">
            <div className="flex-1 flex flex-col gap-[12px]">
              {Object.keys(cartQuantities).length === 0 ? (
                <p className="text-gray-68">Your cart is empty</p>
              ) : (
                paginatedGames
              )}
            </div>
            <div className="hidden 2xl:block">
              <TotalPrice
                cartQuantities={cartQuantities}
                cartGames={cartGames}
              />
            </div>
          </div>
          {totalPages > 1 && (
            <div className="mt-[18px] sm:mt-[42px]">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
              />
            </div>
          )}
        </section>
        <CartRecommendations />
        <div className="2xl:hidden">
          <TotalPrice cartQuantities={cartQuantities} cartGames={cartGames} />
        </div>
      </main>
    </>
  );
};

const CartPage: React.FC = () => {
  return (
    <FavoriteProvider>
      <CartProvider>
        <CartContent />
      </CartProvider>
    </FavoriteProvider>
  );
};

export default CartPage;
