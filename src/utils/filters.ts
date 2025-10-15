import { Game } from "@/types/game";

// Фильтр по скидкам
export const hasDiscountFilter = (game: Game): boolean => {
  const isDiscountValid = game.discount !== undefined && game.discount > 0;
  let discountDateTime: number | null = null;

  if (game.discountDate) {
    const discountDate = new Date(game.discountDate);
    if (!isNaN(discountDate.getTime())) {
      discountDate.setUTCHours(23, 59, 59, 999);
      discountDateTime = discountDate.getTime();
    } else {
      console.error(
        `Invalid discountDate for game ${game.id}: ${game.discountDate}`
      );
      return false;
    }
  }

  const now = new Date();
  const isDiscountExpired = discountDateTime
    ? discountDateTime <= now.getTime()
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
  const min = parseFloat(minPrice) || 0;
  const max = parseFloat(maxPrice) || Infinity;
  const price =
    game.discount && !hasDiscountFilter(game)
      ? game.price
      : game.discount
      ? game.price * (1 - game.discount / 100)
      : game.price;

  return price >= min && price <= max;
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
