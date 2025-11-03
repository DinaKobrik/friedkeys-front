"use client";
import React, {
  useEffect,
  useState,
  Suspense,
  useCallback,
  useMemo,
} from "react";
import Heading from "@/components/ui/Heading";
import GameCard from "@/components/Sections/GameCard";
import { Game } from "@/types/game";
import { useFavorite } from "@/components/Sections/Game/FavoriteHandler";
const AccountMenu = React.lazy(
  () => import("@/components/Sections/Account/AccountMenu")
);
const Pagination = React.lazy(() => import("@/components/ui/Pagination"));

export default function FavoritesComponent() {
  const { favoriteIds } = useFavorite();
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage, setReviewsPerPage] = useState(12);

  useEffect(() => {
    const loadFavoriteGames = async () => {
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
            const sortedGames = allGames
              .filter((game) => favoriteIds.includes(game.id))
              .sort((a, b) => {
                const indexA = favoriteIds.indexOf(a.id);
                const indexB = favoriteIds.indexOf(b.id);
                return indexB - indexA;
              });
            setFavoriteGames(sortedGames);
          } else {
            console.error("Failed to fetch games:", response.statusText);
            setFavoriteGames([]);
          }
        } catch (error: unknown) {
          console.error("Error fetching favorite games:", error);
          setFavoriteGames([]);
        }
      } else {
        setFavoriteGames([]);
      }
    };
    loadFavoriteGames();
  }, [favoriteIds]);

  const handleResize = useCallback(() => {
    setReviewsPerPage(window.innerWidth < 991 ? 4 : 6);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const paginatedGames = useMemo(() => {
    const startIdx = (currentPage - 1) * reviewsPerPage;
    const endIdx = currentPage * reviewsPerPage;
    return favoriteGames
      .slice(startIdx, endIdx)
      .map((game) => (
        <GameCard
          key={game.id}
          game={game}
          showSaleTimer={false}
          hidePreOrder={true}
        />
      ));
  }, [favoriteGames, currentPage, reviewsPerPage]);

  const totalPages = useMemo(
    () => Math.ceil(favoriteGames.length / reviewsPerPage),
    [favoriteGames.length, reviewsPerPage]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    document
      .querySelector(".favorites-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main>
      <Suspense fallback={<div aria-live="polite">Loading menu...</div>}>
        <AccountMenu activeLink="/auth/account/favorites" />
      </Suspense>
      <section className="flex w-full flex-col gap-[24px] sm:gap-[36px] mt-[40px] sm:mt-[60px]">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-[8px]">
          <Heading variant="h1" className="text-center sm:text-left">
            Favorites
          </Heading>
          <div className="game-count text-[16px] sm:text-[24px] font-usuzi-condensed text-white uppercase">
            {favoriteGames.length} games
          </div>
        </div>
        <div className="favorites-grid grid grid-cols-2 lg:grid-cols-3 gap-[12px] sm:gap-[16px] lg:gap-[18px]">
          <Suspense fallback={<div>Loading games...</div>}>
            {paginatedGames}
          </Suspense>
        </div>
        {totalPages > 1 && (
          <Suspense fallback={<div>Loading pagination...</div>}>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </Suspense>
        )}
      </section>
    </main>
  );
}
