"use client";

import React from "react";
import { CartProvider } from "@/components/Sections/Game/CartHandler";
import GameHeader from "@/components/Sections/Game/GameHeader";
import GameAbout from "@/components/Sections/Game/GameAbout";
import GameSlider from "@/components/Sections/Game/GameSlider";
import GameEditions from "@/components/Sections/Game/GameEditions";
import GameDescription from "@/components/Sections/Game/GameDescription";
import GameConfigurations from "@/components/Sections/Game/GameConfigurations";
import GameFranchise from "@/components/Sections/Game/GameFranchise";
import GameGenre from "@/components/Sections/Game/GameGenre";
import GameReviews from "@/components/Sections/Game/GameReviews";
import CartButton from "@/components/Sections/Game/CartHandler";
import { useParams } from "next/navigation";
import { Game } from "@/types/game";
import { FavoriteProvider } from "@/components/Sections/Game/FavoriteHandler";

const GameDetailPage: React.FC = () => {
  const params = useParams();
  const [game, setGame] = React.useState<Game | null>(null);

  React.useEffect(() => {
    const fetchGame = async () => {
      const id = params?.id as string;
      if (!id) return;

      try {
        const response = await fetch(`/api/games?type=game&id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch game");
        const data = await response.json();
        if (Array.isArray(data)) {
          const foundGame = data.find((g) => g.id === Number(id));
          setGame(foundGame || null);
        } else if (data.id) {
          setGame(data);
        } else {
          setGame(null);
        }
      } catch (error) {
        console.error("Failed to fetch game:", error);
        setGame(null);
      }
    };

    fetchGame();
  }, [params]);

  return (
    <FavoriteProvider>
      <CartProvider>
        <main className="min-h-screen relative flex flex-col w-full gap-[56px] md:gap-[120px] mt-[24px] sm:mt-[80px]">
          <GameHeader />
          <GameAbout />
          <GameSlider />
          <GameEditions />
          <GameDescription />
          <GameConfigurations />
          <GameFranchise />
          <GameGenre />
          <GameReviews />
          <section className="sm:hidden">
            {game && <CartButton game={game} />}
          </section>
        </main>
      </CartProvider>
    </FavoriteProvider>
  );
};

export default GameDetailPage;
