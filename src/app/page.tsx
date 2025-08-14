import "./globals.css";
import Trending from "@/components/Sections/Homepage/Trending";
import Advantages from "@/components/Sections/Homepage/Advantages";
import NewGames from "@/components/Sections/Homepage/NewGames";
import PreOrders from "@/components/Sections/Homepage/PreOrders";
import SaleGames from "@/components/Sections/Homepage/SaleGames";
import Ganres from "@/components/Sections/Homepage/Ganres";
import JoinNow from "@/components/Sections/Homepage/JoinNow";

export default function Home() {
  return (
    <main>
      <Trending />
      <SaleGames />
      <Advantages />
      <NewGames />
      <PreOrders />
      <Ganres />
      <JoinNow />
    </main>
  );
}
