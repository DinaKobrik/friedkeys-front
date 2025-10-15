"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useCart } from "./CartHandler";
import CartButton from "./CartHandler";
import { useFavorite } from "./FavoriteHandler";
import { Game } from "@/types/game";

// SVG для стрелочки
const ArrowIcon = () => (
  <svg
    width="10"
    height="18"
    viewBox="0 0 10 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    transform="rotate(90)"
    aria-hidden="true">
    <path
      d="M1.5 2L8.5 9L1.5 16"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
  </svg>
);

// SVG для избранного
const FavoriteIcon = ({ isFavorite }: { isFavorite: boolean }) => (
  <svg
    width="16.5"
    height="21"
    className="sm:w-[22px] sm:h-[28px]"
    viewBox="0 0 22 28"
    fill={isFavorite ? "#FFFF25" : "none"}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true">
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

const GameHeaderContent: React.FC = () => {
  const params = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("/images/no-image.jpg");
  const { favoriteIds, toggleFavorite } = useFavorite();
  const isFavorite = game ? favoriteIds.includes(game.id) : false;
  const [isEditionOpen, setIsEditionOpen] = useState(false);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const editionRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const [isTouchedEdition, setIsTouchedEdition] = useState(false);
  const [isTouchedPlatform, setIsTouchedPlatform] = useState(false);
  const [isTouchedRegion, setIsTouchedRegion] = useState(false);
  const [isValidEdition, setIsValidEdition] = useState(true);
  const [isValidPlatform, setIsValidPlatform] = useState(true);
  const [isValidRegion, setIsValidRegion] = useState(true);
  const [isMinimum, setIsMinimum] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [windowSize, setWindowSize] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [dynamicMargin, setDynamicMargin] = useState<string>("0px");

  const {
    selectedEdition,
    setSelectedEdition,
    selectedPlatform,
    setSelectedPlatform,
    selectedRegion,
    setSelectedRegion,
  } = useCart();

  const editions = ["Standard", "Deluxe"];
  const platforms = ["PC", "PS5", "Xbox"];
  const regions = [
    "US",
    "EU",
    "Asia",
    "UK",
    "Canada",
    "Australia",
    "Japan",
    "Russia",
    "Brazil",
    "South Africa",
  ];

  const updateDynamicStyles = () => {
    const windowWidth = window.innerWidth;
    const scrollbarWidthValue =
      window.innerWidth - document.documentElement.clientWidth;
    const isTouchDevice = navigator.maxTouchPoints > 0;

    let calculatedOffset: number;
    if (windowWidth < 576) {
      calculatedOffset = 16;
      setDynamicMargin(`-${calculatedOffset}px`);
    } else if (windowWidth >= 576 && windowWidth < 1700) {
      calculatedOffset = 46;
      setDynamicMargin(`-${calculatedOffset}px`);
    } else if (windowWidth >= 1607 && windowWidth <= 1609) {
      calculatedOffset = 146;
      setDynamicMargin(`-${calculatedOffset}px`);
    } else if (windowWidth > 1608 && windowWidth <= 1920) {
      calculatedOffset = isTouchDevice
        ? (windowWidth - 1608) / 2
        : (windowWidth - scrollbarWidthValue - 1608) / 2;
      setDynamicMargin(`-${calculatedOffset}px`);
    } else {
      calculatedOffset = 146;
      setDynamicMargin("-146px");
    }

    setWindowSize(windowWidth);
  };

  useEffect(() => {
    updateDynamicStyles();
    window.addEventListener("resize", updateDynamicStyles);
    return () => window.removeEventListener("resize", updateDynamicStyles);
  }, []);

  useEffect(() => {
    const fetchGame = async () => {
      const id = params?.id as string;
      if (!id) return;

      try {
        const response = await fetch(`/api/games?type=game&id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch game");
        const data = await response.json();
        if (Array.isArray(data)) {
          const foundGame = data.find((g) => g.id === Number(id));
          setGame(foundGame || null);
        } else if (data.id) {
          setGame(data);
        } else {
          setGame(null);
        }
      } catch (error) {
        console.error("Failed to fetch game:", error);
        setGame(null);
      }
    };

    fetchGame();
  }, [params]);

  useEffect(() => {
    if (game) {
      setImageSrc(
        game.image && game.image.trim() ? game.image : "/images/no-image.jpg"
      );
    }
  }, [game]);

  useEffect(() => {
    const handleResize = () => {
      const newIsMinimum = window.innerWidth > 992;
      if (newIsMinimum !== isMinimum) {
        setIsMinimum(newIsMinimum);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMinimum]);

  const toggleFavoriteHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (game) toggleFavorite(game.id);
  };

  const handleEditionSelect = (edition: string) => {
    setSelectedEdition(edition);
    setIsEditionOpen(false);
    setIsTouchedEdition(true);
    setIsValidEdition(true);
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    setIsPlatformOpen(false);
    setIsTouchedPlatform(true);
    setIsValidPlatform(true);
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setIsRegionOpen(false);
    setIsTouchedRegion(true);
    setIsValidRegion(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editionRef.current &&
        !editionRef.current.contains(event.target as Node)
      )
        setIsEditionOpen(false);
      if (
        platformRef.current &&
        !platformRef.current.contains(event.target as Node)
      )
        setIsPlatformOpen(false);
      if (
        regionRef.current &&
        !regionRef.current.contains(event.target as Node)
      )
        setIsRegionOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!game)
    return (
      <Heading variant="h3" aria-live="polite">
        Loading...
      </Heading>
    );

  return (
    <section
      className="relative pt-[40px] lg:pt-0"
      aria-label="Game Header Section">
      <Heading
        variant="h3"
        className="hidden lg:block mb-[24px] sm:mb-[40px]"
        aria-label={`Navigation: Home / Catalog / ${game.title}`}>
        Home / Catalog / {game.title}
      </Heading>
      <Button
        variant="secondary"
        onClick={() => window.history.back()}
        className="absolute top-0 h-[40px] sm:h-[50px] flex justify-center items-center left-0 max-w-[117px] sm:max-w-[157px] lg:hidden"
        aria-label="Go back to previous page">
        <svg
          width="14"
          height="22"
          viewBox="0 0 14 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-[12px]"
          aria-hidden="true">
          <path
            d="M11.668 20.3334L2.33463 11L11.668 1.66669"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="square"
          />
        </svg>
        back
      </Button>
      <div
        className="grid grid-cols-1 gap-[24px]"
        style={{
          marginLeft: dynamicMargin,
          marginRight: dynamicMargin,
        }}>
        <div className="game__header relative h-[320px] sm:h-[440px] md:h-[520px] lg:h-[973px] overflow-hidden">
          <Image
            src={imageSrc || "/images/no-image.jpg"}
            alt={`Background image for ${game.title}`}
            width={1920}
            height={973}
            className="object-cover w-full h-full blur-xl -z-10"
            loading="lazy"
            onError={() => setImageSrc("/images/no-image.jpg")}
          />
        </div>
        <div className="block lg:hidden h-[460px] sm:h-[660px] md:h-[601px]"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 pt-[40px] lg:pt-0 gap-[72px] lg:gap-[12px] xl:gap-[24px] max-w-[1608px] items-start lg:items-center justify-center absolute top-[50px] lg:top-1/2 lg:translate-y-[-45%] 2xl:translate-y-[-50%] left-1/2 translate-x-[-50%] w-full h-[calc(100%-40px)] lg:max-h-[648px]">
          <div className="2xl:col-span-2 top-0 left-0 w-full h-[220px] sm:h-[340px] md:h-[420px] lg:h-full flex justify-center items-center">
            <Image
              src={imageSrc || "/images/no-image.jpg"}
              alt={`${game.title} cover image`}
              width={1064}
              height={648}
              className="object-cover max-w-[1064px] min-h-[220px] max-h-[648px] h-full w-full game__header-img"
              loading="lazy"
              onError={() => setImageSrc("/images/no-image.jpg")}
            />
          </div>
          <div
            className={`${isMinimum ? "game__header-info" : "card-corner"}
            max-w-[520px] xl:max-w-[100%] 2xl:max-w-[520px] w-full lg:h-full mx-auto relative z-50 bg-2 p-[16px] pt-[24px] pb-[40px] sm:p-[40px] sm:pt-[32px] lg:p-[20px] xl:p-[40px] xl:pt-[32px]
            ${isRegionOpen ? "h-[calc(100%+44px)] sm:h-auto lg:h-full" : ""}`}
            aria-label="Game Information and Options">
            <div className="flex items-center w-full justify-between gap-[8px] mb-[20px]">
              <div
                className="line-clamp-2 font-usuzi-condensed text-[24px] leading-[24px] text-white"
                aria-label={`Game title: ${game.title}`}>
                {game.title}
              </div>
              <div
                className="w-[36px] h-[36px] sm:w-[48px] sm:h-[48px] flex justify-center items-center cursor-pointer"
                onClick={toggleFavoriteHandler}
                aria-label={
                  isFavorite
                    ? `Remove ${game.title} from favorites`
                    : `Add ${game.title} to favorites`
                }
                aria-pressed={isFavorite}>
                <FavoriteIcon isFavorite={isFavorite} />
              </div>
            </div>
            <div className="mx-auto w-full flex justify-center items-center gap-[8px] mb-[20px]">
              <Image
                src="/images/steam-logo-gamepage.png"
                alt="Steam platform logo"
                width={40}
                height={40}
                className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px]"
                loading="lazy"
              />
              <span
                className="text-[13px] leading-[15px] sm:text-[20px] sm:leading-[26px] font-medium"
                aria-label="Platform: Steam">
                Steam
              </span>
            </div>
            <div className="flex flex-col gap-[16px] w-full">
              <div
                className="relative cursor-pointer w-full"
                ref={editionRef}
                onClick={() => setIsEditionOpen(!isEditionOpen)}
                aria-label="Edition Selection">
                <label
                  className="mb-[8px] block text-[16px] sm:text-[20px] leading-[20px] font-bold text-white"
                  htmlFor="edition-input">
                  Edition
                </label>
                <Input
                  type="text"
                  value={selectedEdition}
                  name="edition"
                  required
                  onChange={() => {}}
                  variant="straight"
                  errorMessage={
                    !isValidEdition && isTouchedEdition
                      ? "Fill in the field"
                      : ""
                  }
                  className="mb-[0] cursor-pointer"
                  readOnly
                  isTouched={isTouchedEdition}
                  isValid={isValidEdition}
                  backgroundClass="bg-3"
                  aria-label={`Selected edition: ${selectedEdition}`}>
                  <div
                    className="absolute top-[50%] translate-y-[-50%] right-[16px] cursor-pointer"
                    aria-hidden="true">
                    <ArrowIcon />
                  </div>
                </Input>
                {isEditionOpen && (
                  <div
                    className="absolute top-[64px] sm:top-[84px] z-50 w-full bg-3 mt-[8px] max-h-[130px] overflow-y-auto custom-scrollbar"
                    aria-label="Edition options">
                    {editions.map((edition) => (
                      <div
                        key={edition}
                        className="px-[20px] py-[12px] cursor-pointer hover:bg-primary-10"
                        onClick={() => handleEditionSelect(edition)}
                        aria-selected={selectedEdition === edition}>
                        {edition}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div
                className="relative cursor-pointer"
                ref={platformRef}
                onClick={() => setIsPlatformOpen(!isPlatformOpen)}
                aria-label="Platform Selection">
                <label
                  className="mb-[8px] block text-[16px] sm:text-[20px] leading-[20px] font-bold text-white"
                  htmlFor="platform-input">
                  Platforms
                </label>
                <Input
                  type="text"
                  value={selectedPlatform}
                  name="platform"
                  required
                  onChange={() => {}}
                  variant="straight"
                  className="mb-[0] cursor-pointer"
                  readOnly
                  isTouched={isTouchedPlatform}
                  isValid={isValidPlatform}
                  errorMessage={
                    !isValidPlatform && isTouchedPlatform
                      ? "Fill in the field"
                      : ""
                  }
                  backgroundClass="bg-3"
                  aria-label={`Selected platform: ${selectedPlatform}`}>
                  <div
                    className="absolute top-[50%] translate-y-[-50%] right-[16px] cursor-pointer"
                    aria-hidden="true">
                    <ArrowIcon />
                  </div>
                </Input>
                {isPlatformOpen && (
                  <div
                    className="absolute top-[64px] sm:top-[84px] z-50 w-full bg-3 mt-[8px] max-h-[130px] overflow-y-auto custom-scrollbar"
                    aria-label="Platform options">
                    {platforms.map((platform) => (
                      <div
                        key={platform}
                        className="px-[20px] py-[12px] cursor-pointer hover:bg-primary-10"
                        onClick={() => handlePlatformSelect(platform)}
                        aria-selected={selectedPlatform === platform}>
                        {platform}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div
                className="relative cursor-pointer"
                ref={regionRef}
                onClick={() => setIsRegionOpen(!isRegionOpen)}
                aria-label="Region Selection">
                <label
                  className="mb-[8px] block text-[16px] sm:text-[20px] leading-[20px] font-bold text-white"
                  htmlFor="region-input">
                  Key activation region
                </label>
                <Input
                  type="text"
                  value={selectedRegion}
                  name="region"
                  required
                  onChange={() => {}}
                  variant="straight"
                  className="mb-[0] cursor-pointer"
                  readOnly
                  isTouched={isTouchedRegion}
                  isValid={isValidRegion}
                  errorMessage={
                    !isValidRegion && isTouchedRegion ? "Fill in the field" : ""
                  }
                  backgroundClass="bg-3"
                  aria-label={`Selected region: ${selectedRegion}`}>
                  <div
                    className="absolute top-[50%] translate-y-[-50%] right-[16px] cursor-pointer"
                    aria-hidden="true">
                    <ArrowIcon />
                  </div>
                </Input>
                {isRegionOpen && (
                  <div
                    className="absolute top-[64px] sm:top-[84px] z-50 w-full bg-3 mt-[8px] max-h-[130px] overflow-y-auto custom-scrollbar"
                    aria-label="Region options">
                    {regions.map((region) => (
                      <div
                        key={region}
                        className="px-[20px] py-[12px] cursor-pointer hover:bg-primary-10"
                        onClick={() => handleRegionSelect(region)}
                        aria-selected={selectedRegion === region}>
                        {region}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="w-full hidden sm:block">
              <CartButton game={game} />
            </div>
            <div
              className="h-[7px] w-[75%] sm:w-[50%] absolute bottom-0 left-[50%] bg-primary-main translate-x-[-50%] blur-[30px] z-0"
              aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const GameHeader: React.FC = () => <GameHeaderContent />;

export default GameHeader;
