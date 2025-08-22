"use client";

import React, { useState, useEffect, useRef } from "react";
import { Game } from "@/types/game";
import { useSearchParams, useRouter } from "next/navigation";
import GameCard from "../GameCard";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Input from "@/components/ui/Input";
import Pagination from "@/components/ui/Pagination";

const GameList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filters, setFilters] = useState({
    genre: [] as string[],
    platform: "",
    system: "",
    hasDiscount: false,
    dlcFilter: "Games & DLS",
    minPrice: "",
    maxPrice: "",
  });
  const [sort, setSort] = useState("");
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isSystemOpen, setIsSystemOpen] = useState(false);
  const [isDlcOpen, setIsDlcOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const genreRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<HTMLDivElement>(null);
  const systemRef = useRef<HTMLDivElement>(null);
  const dlcRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage, setGamesPerPage] = useState(12);

  const genres = [
    "Action",
    "Adventure",
    "Platformer",
    "Racing",
    "Sports",
    "Simulation",
    "Stealth",
    "Survival",
    "Horror",
    "Sandbox",
    "Wargame",
  ];
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterFromUrl = searchParams.get("filter");
  const genreFromUrl = searchParams.get("genre");
  const platforms = ["PlayStation", "Xbox", "Nintendo", "PC"];
  const systems = ["PC", "Mac", "Linux", "Switch", "Switch 2", "PlayStation 4"];
  const dlcOptions = ["Games & DLS", "DLS"];
  const sortOptions = [
    "price-high-to-low",
    "price-low-to-high",
    "most-popular",
    "highest-rated",
    "most-reviewed",
    "newest-first",
    "oldest-first",
    "biggest-discount",
    "on-sale-first",
    "only-discounted",
    "a-z",
    "z-a",
  ];
  const [isMobile, setIsMobile] = useState(false);
  // Инициализация фильтров и активного фильтра из URL с немедленной фильтрацией
  useEffect(() => {
    let newActiveFilter = activeFilter;
    let newFilters = { ...filters };

    // Обработка жанра из URL
    if (genreFromUrl) {
      newFilters = {
        ...newFilters,
        genre: [...new Set([...newFilters.genre, genreFromUrl])],
      };
    }

    // Обработка фильтров Sale, Pre-order, Trending из URL
    if (filterFromUrl === "sale") {
      newActiveFilter = "sale";
      newFilters = { ...newFilters, hasDiscount: true };
    } else if (filterFromUrl === "pre-orders") {
      newActiveFilter = "pre-orders";
    } else if (filterFromUrl === "trending") {
      newActiveFilter = "trending";
    } else {
      newActiveFilter = null;
      newFilters = { ...newFilters, hasDiscount: false };
    }

    // Обновляем состояние
    setActiveFilter(newActiveFilter);
    setFilters(newFilters);

    // Немедленный вызов fetchGames для применения фильтрации
    const fetchGames = async () => {
      const url = new URL("/api/games", window.location.origin);
      if (newActiveFilter === "pre-orders") {
        url.searchParams.append("preOrder", "true");
      } else if (newActiveFilter === "sale") {
        url.searchParams.append("hasDiscount", "true");
      } else {
        url.searchParams.append("preOrder", "false");
      }
      if (newFilters.genre.length > 0) {
        url.searchParams.append("genre", newFilters.genre.join(","));
      }
      Object.entries({ ...newFilters, sort }).forEach(
        ([key, value]) => value && url.searchParams.append(key, value as string)
      );
      const res = await fetch(url.toString());
      if (!res.ok) console.error("Fetch error:", await res.text());
      const data = await res.json();

      const filteredGames =
        newActiveFilter === "pre-orders"
          ? data.filter((game: Game) => game.preOrder)
          : data.filter((game: Game) => !game.preOrder);
      setGames(filteredGames);
      setCurrentPage(1);
    };
    fetchGames();
    const checkWidth = () => setIsMobile(window.innerWidth < 992);
    checkWidth();

    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, [genreFromUrl, filterFromUrl]);

  useEffect(() => {
    const handleResize = () => {
      setGamesPerPage(window.innerWidth < 991 ? 8 : 12);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    const fetchGames = async () => {
      const url = new URL("/api/games", window.location.origin);
      if (activeFilter === "pre-orders") {
        url.searchParams.append("preOrder", "true");
      } else if (activeFilter === "sale") {
        url.searchParams.append("hasDiscount", "true");
      } else {
        url.searchParams.append("preOrder", "false");
      }
      if (filters.genre.length > 0) {
        url.searchParams.append("genre", filters.genre.join(","));
      }
      Object.entries({ ...filters, sort }).forEach(
        ([key, value]) => value && url.searchParams.append(key, value as string)
      );
      const res = await fetch(url.toString());
      if (!res.ok) console.error("Fetch error:", await res.text());
      const data = await res.json();

      const filteredGames =
        activeFilter === "pre-orders"
          ? data.filter((game: Game) => game.preOrder)
          : data.filter((game: Game) => !game.preOrder);
      setGames(filteredGames);
      setCurrentPage(1);
    };
    fetchGames();
    return () => window.removeEventListener("resize", handleResize);
  }, [filters, sort, activeFilter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        genreRef.current &&
        !genreRef.current.contains(event.target as Node)
      ) {
        setIsGenreOpen(false);
      }
      if (
        platformRef.current &&
        !platformRef.current.contains(event.target as Node)
      ) {
        setIsPlatformOpen(false);
      }
      if (
        systemRef.current &&
        !systemRef.current.contains(event.target as Node)
      ) {
        setIsSystemOpen(false);
      }
      if (dlcRef.current && !dlcRef.current.contains(event.target as Node)) {
        setIsDlcOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetFilters = () => {
    setFilters({
      genre: [],
      platform: "",
      system: "",
      hasDiscount: false,
      dlcFilter: "Games & DLS",
      minPrice: "",
      maxPrice: "",
    });
    setSort("");
    setActiveFilter(null);
    router.push("/all-games");
  };

  type FilterType = keyof typeof filters | "sort";

  const resetSingleFilter = (filterType: FilterType) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      switch (filterType) {
        case "genre":
          newFilters.genre = [];
          break;
        case "platform":
          newFilters.platform = "";
          break;
        case "system":
          newFilters.system = "";
          break;
        case "hasDiscount":
          newFilters.hasDiscount = false;
          break;
        case "dlcFilter":
          newFilters.dlcFilter =
            prev.dlcFilter === "DLS" ? "Games & DLS" : prev.dlcFilter;
          break;
        case "minPrice":
          newFilters.minPrice = "";
          break;
        case "maxPrice":
          newFilters.maxPrice = "";
          break;
      }
      return newFilters;
    });
    if (filterType === "sort") setSort("");
    if (filterType === "genre" && filters.genre.length > 0) {
      const currentParams = new URLSearchParams(searchParams);
      currentParams.delete("genre");
      router.push(`/all-games?${currentParams.toString()}`);
    }
    if (filterType === "hasDiscount" && activeFilter === "sale") {
      setActiveFilter(null);
      router.push("/all-games");
    }
  };

  const closeAllDropdowns = () => {
    setIsSortOpen(false);
    setIsSystemOpen(false);
    setIsPlatformOpen(false);
    setIsGenreOpen(false);
    setIsDlcOpen(false);
  };

  const totalPages = Math.ceil(games.length / gamesPerPage);
  const paginatedGames = games.slice(
    (currentPage - 1) * gamesPerPage,
    currentPage * gamesPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document
      .querySelector(".game-list")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  const handleFilterClick = (newFilter: string) => {
    // Деактивация фильтра при повторном клике
    if (activeFilter === newFilter) {
      setActiveFilter(null);
      setFilters((prev) => ({ ...prev, hasDiscount: false }));
      router.push("/all-games"); // Сброс URL при деактивации
    } else {
      setActiveFilter(newFilter);
      setFilters((prev) => ({
        ...prev,
        hasDiscount: newFilter === "sale",
      }));
      // Обновляем URL только если текущий URL не /all-games
      if (filterFromUrl || searchParams.toString()) {
        router.push(`/all-games?filter=${newFilter}`);
      }
    }
    closeAllDropdowns();
  };

  useEffect(() => {
    if (isFiltersVisible && window.innerWidth < 992) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "visible";
      document.body.style.height = "auto";
    }
    return () => {
      document.body.style.overflow = "visible";
      document.body.style.height = "auto";
    };
  }, [isFiltersVisible]);

  return (
    <div className="game-list mt-[24px] sm:mt-[56px] relative">
      <Heading variant="h1" className="block lg:hidden mb-[8px] text-center">
        catalog
      </Heading>
      <div className="filter-buttons max-w-[986px] my-0 mx-auto mb-4">
        <div className="flex flex-wrap justify-center items-center gap-[8px] sm:gap-[20px]">
          <button
            onClick={() => handleFilterClick("trending")}
            className={`category focus:outline-none py-[8px] px-[15px] sm:py-[16px] sm:px-[30px] text-[20px] leading-[24px] sm:text-[38px] sm:leading-[44px] font-usuzi-condensed text-white uppercase ${
              activeFilter === "trending" ? "category--active" : ""
            }`}>
            Trending
          </button>
          <button
            onClick={() => handleFilterClick("pre-orders")}
            className={`category focus:outline-none  py-[8px] px-[15px] sm:py-[16px] sm:px-[30px] text-[20px] leading-[24px] sm:text-[38px] sm:leading-[44px] font-usuzi-condensed text-white uppercase ${
              activeFilter === "pre-orders" ? "category--active" : ""
            }`}>
            Pre-orders
          </button>
          <button
            onClick={() => handleFilterClick("sale")}
            className={`category focus:outline-none  py-[8px] px-[15px] sm:py-[16px] sm:px-[30px] text-[20px] leading-[24px] sm:text-[38px] sm:leading-[44px] font-usuzi-condensed text-white uppercase ${
              activeFilter === "sale" ? "category--active" : ""
            }`}>
            Sale
          </button>
        </div>
      </div>
      <div className="game-count flex justify-between items-center mb-[24px]">
        {isMobile && (
          <div className="skew-x-[-20deg] bg-2 h-[42px] sm:h-[58px] flex">
            <button
              onClick={toggleFilters}
              className="filter-list focus:outline-none skew-x-[20deg] py-[12px] px-[38px] sm:py-[16px] sm:px-[30px] w-full text-white flex justify-between items-center text-[15px] leading-[17px]  sm:text-[34px] font-usuzi-condensed uppercase">
              Filters
              {(sort ||
                filters.system ||
                filters.platform ||
                filters.genre.length > 0 ||
                filters.dlcFilter !== "Games & DLS") && (
                <div className="flex items-center">
                  <span className="ml-2 flex items-center justify-center w-5 h-5 bg-primary-main text-black rounded-full text-xs">
                    {[
                      sort ? 1 : 0,
                      filters.system ? 1 : 0,
                      filters.platform ? 1 : 0,
                      filters.genre.length,
                      filters.dlcFilter !== "Games & DLS" ? 1 : 0,
                    ].reduce((a, b) => a + b, 0)}
                  </span>
                </div>
              )}
            </button>
          </div>
        )}
        <div className="game-count text-[16px] sm:text-[32px] font-usuzi-condensed text-white uppercase">
          {games.length} games
        </div>
      </div>
      <div
        className={`w-full lg:w-auto overflow-y-auto lg:overflow-visible h-auto lg:h-auto px-[16px] lg:px-0 fixed left-0 right-0 lg:sticky
      bg-main lg:bg-transparent z-50 lg:z-20 ${
        !isMobile ? "block" : isFiltersVisible ? "block" : "hidden"
      }`}
        style={{
          top: isMobile && isFiltersVisible ? "82px" : "auto",
          bottom: isMobile && isFiltersVisible ? "60px" : "auto",
        }}>
        <div>
          <div className="flex justify-between items-center lg:hidden">
            <h3 className="text-[32px] font-usuzi-condensed text-white uppercase mt-4">
              Fliters
            </h3>
            <span
              onClick={() => setIsFiltersVisible(false)}
              className="text-white p-[8px] cursor-pointer mb-[20px]">
              ✖
            </span>
          </div>
          <div className=" w-full grid cols-1 lg:grid-cols-3 xl:grid-cols-5 lg:justify-between items-center gap-[20px] mb-[20px] lg:mb-[40px]">
            <div className="relative w-full" ref={sortRef}>
              <div
                className={`skew-x-[0deg] lg:skew-x-[-20deg] bg-2 w-full h-[58px] flex ${
                  sort ? "border-2 border-primary-main" : ""
                }`}>
                <button
                  onClick={() => {
                    closeAllDropdowns();
                    setIsSortOpen(!isSortOpen);
                  }}
                  className="filter-list focus:outline-none skew-x-[0deg] lg:skew-x-[20deg] py-[16px] px-[30px] w-full text-white flex justify-between items-center">
                  <span className={sort ? "text-white" : "text-gray-68"}>
                    {sort
                      ? sortOptions
                          .find((option) => option === sort)
                          ?.replace(/-/g, " ")
                          .replace(/(^|\s)\w/g, (c) => c.toUpperCase())
                      : "Sort"}
                    {sort && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          resetSingleFilter("sort");
                        }}
                        className="text-primary-main px-[8px] cursor-pointer relative z-50">
                        ✖
                      </span>
                    )}
                  </span>
                  <svg
                    width="18"
                    height="10"
                    viewBox="0 0 18 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: isSortOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s",
                    }}>
                    <path
                      d="M16 1.5L9 8.5L2 1.5"
                      stroke={sort ? "white" : "#a0a0a0"}
                      strokeWidth="1.5"
                      strokeLinecap="square"
                    />
                  </svg>
                </button>
              </div>
              {isSortOpen && (
                <div className="absolute bg-2 text-white w-full mt-1 max-h-[300px] overflow-y-auto z-50 custom-scrollbar">
                  {sortOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setSort(option);
                        setIsSortOpen(false);
                      }}
                      className="px-[30px] py-[8px] cursor-pointer">
                      {option
                        .replace(/-/g, " ")
                        .replace(/(^|\s)\w/g, (c) => c.toUpperCase())}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative w-full" ref={systemRef}>
              <div
                className={`skew-x-[0deg] lg:skew-x-[-20deg] bg-2 w-full h-[58px] flex ${
                  filters.system ? "border-2 border-primary-main" : ""
                }`}>
                <button
                  onClick={() => {
                    closeAllDropdowns();
                    setIsSystemOpen(!isSystemOpen);
                  }}
                  className="filter-list focus:outline-none skew-x-[0deg] lg:skew-x-[20deg] py-[16px] px-[30px] w-full flex justify-between items-center">
                  <span
                    className={filters.system ? "text-white" : "text-gray-68"}>
                    {filters.system || "All systems"}
                    {filters.system && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          resetSingleFilter("system");
                        }}
                        className="text-primary-main px-[8px] cursor-pointer relative z-50">
                        ✖
                      </span>
                    )}
                  </span>
                  <svg
                    width="18"
                    height="10"
                    viewBox="0 0 18 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: isSystemOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s",
                    }}>
                    <path
                      d="M16 1.5L9 8.5L2 1.5"
                      stroke={filters.system ? "white" : "#a0a0a0"}
                      strokeWidth="1.5"
                      strokeLinecap="square"
                    />
                  </svg>
                </button>
              </div>
              {isSystemOpen && (
                <div className="absolute bg-2 text-white w-full mt-1 max-h-[300px] overflow-y-auto z-50 custom-scrollbar">
                  {systems.map((system) => (
                    <div
                      key={system}
                      onClick={() => {
                        setFilters({
                          ...filters,
                          system: filters.system === system ? "" : system,
                        });
                        setIsSystemOpen(false);
                      }}
                      className="px-[30px] py-[8px] cursor-pointer">
                      {system}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative w-full" ref={platformRef}>
              <div
                className={`skew-x-[0deg] lg:skew-x-[-20deg] bg-2 w-full h-[58px] flex ${
                  filters.platform ? "border-2 border-primary-main" : ""
                }`}>
                <button
                  onClick={() => {
                    closeAllDropdowns();
                    setIsPlatformOpen(!isPlatformOpen);
                  }}
                  className="filter-list focus:outline-none skew-x-[0deg] lg:skew-x-[20deg] py-[16px] px-[30px] w-full flex justify-between items-center">
                  <span
                    className={
                      filters.platform ? "text-white" : "text-gray-68"
                    }>
                    {filters.platform || "All platforms"}
                    {filters.platform && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          resetSingleFilter("platform");
                        }}
                        className="text-primary-main px-[8px] cursor-pointer relative z-50">
                        ✖
                      </span>
                    )}
                  </span>
                  <svg
                    width="18"
                    height="10"
                    viewBox="0 0 18 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: isPlatformOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s",
                    }}>
                    <path
                      d="M16 1.5L9 8.5L2 1.5"
                      stroke={filters.platform ? "white" : "#a0a0a0"}
                      strokeWidth="1.5"
                      strokeLinecap="square"
                    />
                  </svg>
                </button>
              </div>
              {isPlatformOpen && (
                <div className="absolute bg-2 text-white w-full mt-1 max-h-[300px] overflow-y-auto z-50 custom-scrollbar">
                  {platforms.map((platform) => (
                    <div
                      key={platform}
                      onClick={() => {
                        setFilters({
                          ...filters,
                          platform:
                            filters.platform === platform ? "" : platform,
                        });
                        setIsPlatformOpen(false);
                      }}
                      className="px-[30px] py-[8px] cursor-pointer">
                      {platform}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative w-full" ref={genreRef}>
              <div
                className={`skew-x-[0deg] lg:skew-x-[-20deg] bg-2 w-full h-[58px] flex ${
                  filters.genre.length > 0 ? "border-2 border-primary-main" : ""
                }`}>
                <button
                  onClick={() => {
                    closeAllDropdowns();
                    setIsGenreOpen(!isGenreOpen);
                  }}
                  className="filter-list focus:outline-none skew-x-[0deg] lg:skew-x-[20deg] py-[16px] px-[30px] w-full text-white flex justify-between items-center">
                  <span
                    className={`flex ${
                      filters.genre.length > 0 ? "text-white" : "text-gray-68"
                    }`}>
                    Genres
                    {filters.genre.length > 0 && (
                      <div className="flex items-center">
                        <span className="ml-2 flex items-center justify-center w-5 h-5 bg-primary-main text-black rounded-full text-xs">
                          {filters.genre.length}
                        </span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            resetSingleFilter("genre");
                          }}
                          className="text-primary-main px-[8px] cursor-pointer relative z-50">
                          ✖
                        </span>
                      </div>
                    )}
                  </span>
                  <svg
                    width="18"
                    height="10"
                    viewBox="0 0 18 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: isGenreOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s",
                    }}>
                    <path
                      d="M16 1.5L9 8.5L2 1.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="square"
                    />
                  </svg>
                </button>
              </div>
              {isGenreOpen && (
                <div className="absolute bg-2 text-white w-full mt-1 max-h-[300px] overflow-y-auto z-50 custom-scrollbar">
                  {genres.map((genre) => (
                    <div
                      key={genre}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          genre: filters.genre.includes(genre)
                            ? filters.genre.filter((g) => g !== genre)
                            : [...filters.genre, genre],
                        })
                      }
                      className="px-[30px] py-[8px] cursor-pointer flex justify-between items-center">
                      <span>{genre}</span>
                      {filters.genre.includes(genre) && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilters({
                              ...filters,
                              genre: filters.genre.filter((g) => g !== genre),
                            });
                          }}
                          className="text-primary-main px-[8px] cursor-pointer">
                          ✖
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative w-full" ref={dlcRef}>
              <div
                className={`skew-x-[0deg] lg:skew-x-[-20deg] bg-2 w-full h-[58px] flex ${
                  filters.dlcFilter !== "Games & DLS"
                    ? "border-2 border-primary-main"
                    : ""
                }`}>
                <button
                  onClick={() => {
                    closeAllDropdowns();
                    setIsDlcOpen(!isDlcOpen);
                  }}
                  className="filter-list focus:outline-none skew-x-[0deg] lg:skew-x-[20deg] py-[16px] px-[30px] w-full flex justify-between items-center">
                  <span
                    className={
                      filters.dlcFilter !== "Games & DLS"
                        ? "text-white"
                        : "text-gray-68"
                    }>
                    {filters.dlcFilter}
                    {filters.dlcFilter !== "Games & DLS" && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          resetSingleFilter("dlcFilter");
                        }}
                        className="text-primary-main px-[8px] cursor-pointer relative z-50">
                        ✖
                      </span>
                    )}
                  </span>
                  <svg
                    width="18"
                    height="10"
                    viewBox="0 0 18 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: isDlcOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s",
                    }}>
                    <path
                      d="M16 1.5L9 8.5L2 1.5"
                      stroke={
                        filters.dlcFilter !== "Games & DLS"
                          ? "white"
                          : "#a0a0a0"
                      }
                      strokeWidth="1.5"
                      strokeLinecap="square"
                    />
                  </svg>
                </button>
              </div>
              {isDlcOpen && (
                <div className="absolute bg-2 text-white w-full mt-1 max-h-[300px] overflow-y-auto z-50 custom-scrollbar">
                  {dlcOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setFilters({ ...filters, dlcFilter: option });
                        setIsDlcOpen(false);
                      }}
                      className="px-[30px] py-[8px] cursor-pointer">
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="lg:max-w-[792px] mx-auto mb-[40px]">
            <h3 className="text-[20px] leading-[24px] lg:text-[32px] font-usuzi-condensed text-white uppercase mb-[8px]">
              Price
            </h3>
            <div className="price-filters flex flex-col lg:flex-row justify-center items-center gap-[18px]">
              <div className="flex w-full gap-[18px] overflow-hidden lg:overflow-visible">
                <div className="relative w-full lg:max-w-[260px]">
                  <Input
                    variant="skewed"
                    textAlign="right"
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, minPrice: e.target.value })
                    }>
                    <span className="absolute skew-x-[20deg] left-[38px] top-1/2 transform -translate-y-1/2 text-gray-68">
                      from
                    </span>
                  </Input>
                </div>
                <div className="relative w-full lg:max-w-[260px]">
                  <Input
                    variant="skewed"
                    textAlign="right"
                    type="number"
                    placeholder="0"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, maxPrice: e.target.value })
                    }>
                    <span className="absolute skew-x-[20deg] left-[38px] top-1/2 transform -translate-y-1/2 text-gray-68">
                      to
                    </span>
                  </Input>
                </div>
              </div>
              <div className="relative w-full lg:max-w-[260px]">
                <div className="w-full">
                  <Button variant="secondary" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="primary"
            className="block lg:hidden mb-[72px]"
            onClick={() => {
              setIsFiltersVisible(false);
              document
                .querySelector(".game-list")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}>
            show {games.length} games
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-[12px] sm:gap-[24px] mb-[56px]">
        {paginatedGames.length > 0 ? (
          paginatedGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              showSaleTimer={activeFilter === "sale"}
            />
          ))
        ) : (
          <p className="text-[32px] font-usuzi-condensed text-white uppercase col-span-3 text-center">
            No games found. Check filters or data.
          </p>
        )}
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default GameList;
