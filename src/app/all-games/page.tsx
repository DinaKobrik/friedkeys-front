"use client";

import "../globals.css";
import React, { Suspense } from "react";
import GameList from "@/components/Sections/AllGames/GameList";
import Recommendations from "@/components/Sections/AllGames/Recommendations";
import { FavoriteProvider } from "@/components/Sections/Game/FavoriteHandler";

export default function AllGame() {
  return (
    <FavoriteProvider>
      <main className="flex flex-col w-full gap-[40px] md:gap-[120px]">
        <Suspense
          fallback={
            <div className="text-[32px] font-usuzi-condensed text-white uppercase col-span-3 text-center mt-[80px]">
              Loading games...
            </div>
          }>
          <GameList />
        </Suspense>
        <Recommendations />
      </main>
    </FavoriteProvider>
  );
}
