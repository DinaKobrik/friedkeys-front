// utils/search.ts
import { Game } from "@/types/game";

export const filterGamesBySearch = (
  games: Game[],
  searchQuery: string
): Game[] => {
  const query = searchQuery.toLowerCase().trim();
  return games.filter((game) => game.title.toLowerCase().includes(query));
};
