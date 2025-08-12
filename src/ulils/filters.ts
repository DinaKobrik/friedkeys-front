import { Game } from "@/types/game";

export const filterGames = (
  games: Game[],
  filters: {
    genre?: string[];
    platform?: string;
    system?: string;
    hasDiscount?: boolean;
  }
) => {
  let filtered = [...games];
  if (filters.genre)
    filtered = filtered.filter((game: Game) =>
      filters.genre!.some((g) => game.genres.includes(g))
    );
  if (filters.platform)
    filtered = filtered.filter((game: Game) =>
      game.platforms.includes(filters.platform!)
    );
  if (filters.system)
    filtered = filtered.filter((game: Game) =>
      game.systems.includes(filters.system!)
    );
  if (filters.hasDiscount)
    filtered = filtered.filter(
      (game: Game) => game.discount !== undefined && game.discount > 0
    );
  return filtered;
};

export const sortGames = (games: Game[], sortBy: string) => {
  let sorted = [...games];
  switch (sortBy) {
    case "price-high-to-low":
      sorted.sort((a: Game, b: Game) => b.price - a.price);
      break;
    case "price-low-to-high":
      sorted.sort((a: Game, b: Game) => a.price - b.price);
      break;
    case "most-popular":
      sorted.sort((a: Game, b: Game) => b.popularity - a.popularity);
      break;
    case "highest-rated":
      sorted.sort((a: Game, b: Game) => b.rating - a.rating);
      break;
    case "most-reviewed":
      sorted.sort((a: Game, b: Game) => (b.reviews || 0) - (a.reviews || 0));
      break;
    case "newest-first":
      sorted.sort(
        (a: Game, b: Game) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      );
      break;
    case "oldest-first":
      sorted.sort(
        (a: Game, b: Game) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
      );
      break;
    case "biggest-discount":
      sorted.sort((a: Game, b: Game) => (b.discount || 0) - (a.discount || 0));
      break;
    case "on-sale-first":
      sorted.sort(
        (a: Game, b: Game) => (b.discount ? -1 : 1) - (a.discount ? -1 : 1)
      );
      break;
    case "only-discounted":
      sorted = sorted.filter(
        (game: Game) => game.discount !== undefined && game.discount > 0
      );
      break;
    case "a-z":
      sorted.sort((a: Game, b: Game) => a.title.localeCompare(b.title));
      break;
    case "z-a":
      sorted.sort((a: Game, b: Game) => b.title.localeCompare(a.title));
      break;
  }
  return sorted;
};
