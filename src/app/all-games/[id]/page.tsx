"use client";

import React from "react";
import GameHeader from "@/components/Sections/Game/GameHeader";
import GameAbout from "@/components/Sections/Game/GameAbout";
import GameSlider from "@/components/Sections/Game/GameSlider";
import GameEditions from "@/components/Sections/Game/GameEditions";
import GameDescription from "@/components/Sections/Game/GameDescription";
import GameConfigurations from "@/components/Sections/Game/GameConfigurations";
import GameFranchise from "@/components/Sections/Game/GameFranchise";
import GameGenre from "@/components/Sections/Game/GameGenre";
import GameReviews from "@/components/Sections/Game/GameReviews";
import AddToCartBlock from "@/components/Sections/Game/AddToCartBlock";

const GameDetailPage: React.FC = () => {
  return (
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
      <AddToCartBlock />
    </main>
  );
};

export default GameDetailPage;
