import "./globals.css";
import Slider from "@/components/Sections/Homepage/Slider";
import Trending from "@/components/Sections/Homepage/Trending";
import Advantages from "@/components/Sections/Homepage/Advantages";
import NewGames from "@/components/Sections/Homepage/NewGames";
import PreOrders from "@/components/Sections/Homepage/PreOrders";
import SaleGames from "@/components/Sections/Homepage/SaleGames";
import Banner from "@/components/Sections/Homepage/Banner";
import News from "@/components/Sections/Homepage/News";
import Ganres from "@/components/Sections/Homepage/Ganres";
import JoinNow from "@/components/Sections/Homepage/JoinNow";

export default function Home() {
  return (
    <main className="flex flex-col gap-[56px] md:gap-[120px] w-full">
      <Slider />
      <Trending />
      <SaleGames />
      <Advantages />
      <NewGames />
      <PreOrders />
      <Banner />
      <News />
      <Ganres />
      <JoinNow />
    </main>
  );
}
