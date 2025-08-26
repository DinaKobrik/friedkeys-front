// import { Game } from "@/types/game";

// export const filterGames = (
//   games: Game[],
//   filters: {
//     genre?: string[];
//     platform?: string;
//     system?: string;
//     hasDiscount?: boolean;
//   }
// ) => {
//   let filtered = [...games];
//   if (filters.genre)
//     filtered = filtered.filter((game: Game) =>
//       filters.genre!.some((g) => game.genres.includes(g))
//     );
//   if (filters.platform)
//     filtered = filtered.filter((game: Game) =>
//       game.platforms.includes(filters.platform!)
//     );
//   if (filters.system)
//     filtered = filtered.filter((game: Game) =>
//       game.systems.includes(filters.system!)
//     );
//   if (filters.hasDiscount)
//     filtered = filtered.filter(
//       (game: Game) => game.discount !== undefined && game.discount > 0
//     );
//   return filtered;
// };

// export const sortGames = (games: Game[], sortBy: string) => {
//   let sorted = [...games];
//   switch (sortBy) {
//     case "price-high-to-low":
//       sorted.sort((a: Game, b: Game) => b.price - a.price);
//       break;
//     case "price-low-to-high":
//       sorted.sort((a: Game, b: Game) => a.price - b.price);
//       break;
//     case "most-popular":
//       sorted.sort((a: Game, b: Game) => b.popularity - a.popularity);
//       break;
//     case "highest-rated":
//       sorted.sort((a: Game, b: Game) => b.rating - a.rating);
//       break;
//     case "most-reviewed":
//       sorted.sort((a: Game, b: Game) => (b.reviews || 0) - (a.reviews || 0));
//       break;
//     case "newest-first":
//       sorted.sort(
//         (a: Game, b: Game) =>
//           new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
//       );
//       break;
//     case "oldest-first":
//       sorted.sort(
//         (a: Game, b: Game) =>
//           new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
//       );
//       break;
//     case "biggest-discount":
//       sorted.sort((a: Game, b: Game) => (b.discount || 0) - (a.discount || 0));
//       break;
//     case "on-sale-first":
//       sorted.sort(
//         (a: Game, b: Game) => (b.discount ? -1 : 1) - (a.discount ? -1 : 1)
//       );
//       break;
//     case "only-discounted":
//       sorted = sorted.filter(
//         (game: Game) => game.discount !== undefined && game.discount > 0
//       );
//       break;
//     case "a-z":
//       sorted.sort((a: Game, b: Game) => a.title.localeCompare(b.title));
//       break;
//     case "z-a":
//       sorted.sort((a: Game, b: Game) => b.title.localeCompare(a.title));
//       break;
//   }
//   return sorted;
// };
import { Game } from "@/types/game";

// Фильтр по скидкам
export const hasDiscountFilter = (game: Game): boolean => {
  const isDiscountValid = game.discount !== undefined && game.discount > 0;
  let discountDateTime: number | null = null;

  if (game.discountDate) {
    const discountDate = new Date(game.discountDate);
    if (!isNaN(discountDate.getTime())) {
      discountDate.setHours(23, 59, 59, 999); // Конец дня
      discountDateTime = discountDate.getTime();
    } else {
      console.log(
        `Invalid discountDate for game ${game.id}: ${game.discountDate}`
      );
      return false;
    }
  }

  const isDiscountExpired = discountDateTime
    ? discountDateTime <= new Date().getTime()
    : true;
  return isDiscountValid && !isDiscountExpired;
};

// Фильтр по предзаказам
export const preOrderFilter = (game: Game): boolean => game.preOrder;

// Фильтр по трендам (исключение предзаказов)
export const trendingFilter = (game: Game): boolean => !game.preOrder;

// Общие фильтры
export const genreFilter = (game: Game, genres: string[]): boolean =>
  genres.length > 0 ? genres.some((g) => game.genres?.includes(g)) : true;

export const platformFilter = (game: Game, platform: string): boolean =>
  !!platform ? game.platforms.includes(platform) : true;

export const systemFilter = (game: Game, system: string): boolean =>
  !!system ? game.systems.includes(system) : true;

export const dlcFilter = (game: Game, dlcFilter: string): boolean =>
  dlcFilter === "DLS" ? game.hasDlc : true;

export const priceRangeFilter = (
  game: Game,
  minPrice: string,
  maxPrice: string
): boolean => {
  const min = parseFloat(minPrice);
  const max = parseFloat(maxPrice);
  const price = game.price;

  const isMinValid = isNaN(min) || price >= min;
  const isMaxValid = isNaN(max) || price <= max;

  return isMinValid && isMaxValid;
};

// Функция для применения всех фильтров
export const applyFilters = (
  games: Game[],
  filters: {
    genre: string[];
    platform: string;
    system: string;
    hasDiscount: boolean;
    dlcFilter: string;
    minPrice: string;
    maxPrice: string;
  },
  activeFilter: string | null
): Game[] => {
  let filteredGames = [...games];

  if (activeFilter === "pre-orders") {
    filteredGames = filteredGames.filter(preOrderFilter);
  } else if (activeFilter === "trending") {
    filteredGames = filteredGames.filter(trendingFilter);
  }

  if (filters.hasDiscount) {
    filteredGames = filteredGames.filter(hasDiscountFilter);
  }

  filteredGames = filteredGames.filter((game) =>
    genreFilter(game, filters.genre)
  );
  filteredGames = filteredGames.filter((game) =>
    platformFilter(game, filters.platform)
  );
  filteredGames = filteredGames.filter((game) =>
    systemFilter(game, filters.system)
  );
  filteredGames = filteredGames.filter((game) =>
    dlcFilter(game, filters.dlcFilter)
  );
  filteredGames = filteredGames.filter((game) =>
    priceRangeFilter(game, filters.minPrice, filters.maxPrice)
  );

  return filteredGames;
};

// Функция для сортировки
export const applySort = (games: Game[], sort: string): Game[] => {
  if (!sort) return games;

  return [...games].sort((a, b) => {
    switch (sort) {
      case "price-high-to-low":
        return b.price - a.price;
      case "price-low-to-high":
        return a.price - b.price;
      case "a-z":
        return a.title.localeCompare(b.title);
      case "z-a":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });
};
