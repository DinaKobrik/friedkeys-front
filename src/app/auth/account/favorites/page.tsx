"use client";
import React, { useEffect, useState } from "react";
import Heading from "@/components/ui/Heading";
import GameCard from "@/components/Sections/GameCard";
import { Game } from "@/types/game";
import AccountMenu from "@/components/Sections/Account/AccountMenu";
import Pagination from "@/components/ui/Pagination";

const Favorites: React.FC = () => {
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage, setReviewsPerPage] = useState(12);

  useEffect(() => {
    const fetchFavoriteGames = async () => {
      const storedFavorites = localStorage.getItem("favoriteGames");
      const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (favoriteIds.length > 0) {
        try {
          const response = await fetch(
            `/api/games?ids=${favoriteIds.join(",")}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const allGames: Game[] = await response.json();
            const filteredGames = allGames.filter((game) =>
              favoriteIds.includes(game.id)
            );

            // Сортировка по последнему добавлению
            const sortedGames = sortByLastAdded(filteredGames, favoriteIds);
            setFavoriteGames(sortedGames);
          } else {
            console.error("Failed to fetch games:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching favorite games:", error);
        }
      } else {
        setFavoriteGames([]);
      }
    };

    fetchFavoriteGames();
  }, []);

  // Настройка количества игр
  useEffect(() => {
    const handleResize = () => {
      setReviewsPerPage(window.innerWidth < 991 ? 8 : 12);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Логика пагинации
  const totalPages = Math.ceil(favoriteGames.length / reviewsPerPage);
  const paginatedGames = favoriteGames
    .slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage)
    .map((game) => (
      <GameCard
        key={game.id}
        game={game}
        showSaleTimer={false}
        hidePreOrder={true}
      />
    ));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document
      .querySelector(".favorites-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Функция сортировки по последнему добавлению
  const sortByLastAdded = (games: Game[], ids: number[]) => {
    return games.sort((a, b) => {
      const indexA = ids.indexOf(a.id);
      const indexB = ids.indexOf(b.id);
      return indexB - indexA;
    });
  };

  return (
    <div>
      <AccountMenu activeLink="/auth/account/favorites" />
      <div className="flex flex-col gap-[24px] sm:gap-[48px] mt-[40px] sm:mt-[80px]">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-[8px]">
          <Heading variant="h1" className="text-center sm:text-left">
            Favorites
          </Heading>
          <div className="game-count text-[16px] sm:text-[32px] font-usuzi-condensed text-white uppercase">
            {favoriteGames.length} games
          </div>
        </div>
        <div className="favorites-grid grid grid-cols-2 lg:grid-cols-3 gap-[12px] sm:gap-[24px] mb-[56px]">
          {paginatedGames}
        </div>
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Favorites;
