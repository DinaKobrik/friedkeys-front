import "./globals.css";
import Slider from "@/components/Sections/Homepage/Slider";
import QuickMenu from "@/components/Sections/Homepage/QuickMenu";
import Trending from "@/components/Sections/Homepage/Trending";
import Advantages from "@/components/Sections/Homepage/Advantages";
import NewGames from "@/components/Sections/Homepage/NewGames";
import PreOrders from "@/components/Sections/Homepage/PreOrders";
import SaleGames from "@/components/Sections/Homepage/SaleGames";
import Banner from "@/components/Sections/Homepage/Banner";
import GameReviews from "@/components/Sections/Homepage/GameReviews";
import News from "@/components/Sections/Homepage/News";
import Ganres from "@/components/Sections/Homepage/Ganres";
import JoinNow from "@/components/Sections/Homepage/JoinNow";
import { FavoriteProvider } from "@/components/Sections/Game/FavoriteHandler";

export default function Home() {
  return (
    <FavoriteProvider>
      <main className="flex flex-col gap-[56px] md:gap-[90px] w-full xl:mt-[-76px]">
        <Slider />
        <QuickMenu />
        <Trending />
        <SaleGames />
        <Advantages />
        <NewGames />
        <PreOrders />
        <Banner />
        <GameReviews />
        <News />
        <Ganres />
        <JoinNow />
      </main>
    </FavoriteProvider>
  );
}
