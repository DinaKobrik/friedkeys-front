import { NextResponse } from "next/server";
import gamesData from "../../../../public/data/games.json";
import { Game } from "@/types/game";
import * as fs from "fs";
import * as path from "path";

export async function GET(request: Request) {
  const logFile = path.join(process.cwd(), "debug.log");
  const log = (message: string) => {
    fs.appendFileSync(logFile, `${new Date().toISOString()} - ${message}\n`);
    console.error(message);
  };

  log("Route executed");
  log(`Raw gamesData: ${JSON.stringify(gamesData)}`);
  if (!gamesData || !Array.isArray(gamesData)) {
    log("gamesData is invalid or empty:" + JSON.stringify(gamesData));
    return NextResponse.json({ error: "Invalid data" }, { status: 500 });
  }
  log(`Games data length: ${(gamesData as Game[]).length}`);

  const { searchParams } = new URL(request.url);
  log(
    `Query params: ${JSON.stringify(
      Object.fromEntries(searchParams.entries())
    )}`
  );

  let filteredGames = [...(gamesData as Game[])];
  const genre = searchParams.get("genre")?.split(",");
  if (genre && genre.length > 0 && genre.some((g) => g.trim())) {
    log(`Applying genre filter: ${genre}`);
    filteredGames = filteredGames.filter((game: Game) =>
      genre.some((g) => g.trim() && game.genres.includes(g))
    );
    log(`After genre filter length: ${filteredGames.length}`);
  }
  const platform = searchParams.get("platform");
  if (platform) {
    log(`Applying platform filter: ${platform}`);
    filteredGames = filteredGames.filter((game: Game) =>
      game.platforms.includes(platform)
    );
    log(`After platform filter length: ${filteredGames.length}`);
  }
  const system = searchParams.get("system");
  if (system) {
    log(`Applying system filter: ${system}`);
    filteredGames = filteredGames.filter((game: Game) =>
      game.systems.includes(system)
    );
    log(`After system filter length: ${filteredGames.length}`);
  }
  const hasDiscount = searchParams.get("hasDiscount");
  const today = new Date();
  if (hasDiscount === "true") {
    log("Applying hasDiscount filter");
    filteredGames = filteredGames.filter((game: Game) => {
      const isDiscountValid = game.discount && game.discount > 0;
      const discountDate = game.discountDate
        ? new Date(game.discountDate)
        : null;
      if (discountDate && discountDate <= today) {
        log(`Discount for game ${game.id} expired on ${game.discountDate}`);
        return false;
      }

      return isDiscountValid;
    });
    log(`After hasDiscount filter length: ${filteredGames.length}`);
  }

  const preOrder = searchParams.get("preOrder");
  if (preOrder === "true") {
    log("Applying preOrder filter");
    filteredGames = filteredGames.filter(
      (game: Game) => game.preOrder === true
    );
    log(`After preOrder filter length: ${filteredGames.length}`);
  }
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice || maxPrice) {
    log(`Applying price filter: min=${minPrice}, max=${maxPrice}`);
    filteredGames = filteredGames.filter((game: Game) => {
      const discountPrice = game.discount
        ? game.price * (1 - game.discount / 100)
        : game.price;
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      return discountPrice >= min && discountPrice <= max;
    });
    log(`After price filter length: ${filteredGames.length}`);
  }
  const dlcFilter = searchParams.get("dlcFilter");
  if (dlcFilter === "DLS") {
    log("Applying DLS filter: Only DLS");
    filteredGames = filteredGames.filter((game: Game) => game.hasDlc === true);
    log(`After DLS filter length: ${filteredGames.length}`);
  }

  // Сортировка
  const sort = searchParams.get("sort");
  log(`Sort param: ${sort}`);
  if (sort) {
    switch (sort) {
      case "price-high-to-low":
        filteredGames.sort((a: Game, b: Game) => {
          const aDiscountPrice = a.discount
            ? a.price * (1 - a.discount / 100)
            : a.price;
          const bDiscountPrice = b.discount
            ? b.price * (1 - b.discount / 100)
            : b.price;
          return bDiscountPrice - aDiscountPrice;
        });
        log("Applied price-high-to-low sort");
        break;
      case "price-low-to-high":
        filteredGames.sort((a: Game, b: Game) => {
          const aDiscountPrice = a.discount
            ? a.price * (1 - a.discount / 100)
            : a.price;
          const bDiscountPrice = b.discount
            ? b.price * (1 - b.discount / 100)
            : b.price;
          return aDiscountPrice - bDiscountPrice;
        });
        log("Applied price-low-to-high sort");
        break;
      case "most-popular":
        filteredGames.sort((a: Game, b: Game) => b.popularity - a.popularity);
        log("Applied most-popular sort");
        break;
      case "highest-rated":
        filteredGames.sort((a: Game, b: Game) => b.rating - a.rating);
        log("Applied highest-rated sort");
        break;
      case "most-reviewed":
        filteredGames.sort(
          (a: Game, b: Game) => (b.reviews || 0) - (a.reviews || 0)
        );
        log("Applied most-reviewed sort");
        break;
      case "newest-first":
        filteredGames.sort(
          (a: Game, b: Game) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
        );
        log("Applied newest-first sort");
        break;
      case "oldest-first":
        filteredGames.sort(
          (a: Game, b: Game) =>
            new Date(a.releaseDate).getTime() -
            new Date(b.releaseDate).getTime()
        );
        log("Applied oldest-first sort");
        break;
      case "biggest-discount":
        filteredGames.sort(
          (a: Game, b: Game) => (b.discount || 0) - (a.discount || 0)
        );
        log("Applied biggest-discount sort");
        break;
      case "on-sale-first":
        filteredGames.sort(
          (a: Game, b: Game) => (b.discount ? -1 : 1) - (a.discount ? -1 : 1)
        );
        log("Applied on-sale-first sort");
        break;
      case "only-discounted":
        filteredGames = filteredGames.filter(
          (game: Game) => game.discount !== undefined && game.discount > 0
        );
        log("Applied only-discounted filter");
        break;
      case "a-z":
        filteredGames.sort((a: Game, b: Game) =>
          a.title.localeCompare(b.title)
        );
        log("Applied a-z sort");
        break;
      case "z-a":
        filteredGames.sort((a: Game, b: Game) =>
          b.title.localeCompare(a.title)
        );
        log("Applied z-a sort");
        break;
      default:
        log(`No sort applied for: ${sort}`);
    }
  }

  log(`Final filteredGames length: ${filteredGames.length}`);
  log(`Final filteredGames: ${JSON.stringify(filteredGames)}`);
  return NextResponse.json(filteredGames);
}
