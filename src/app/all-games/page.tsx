import "../globals.css";
import React, { Suspense } from "react";
import GameList from "@/components/Sections/AllGames/GameList";
import Recommendations from "@/components/Sections/Recommendations";

export default function AllGame() {
  return (
    <main>
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
  );
}
