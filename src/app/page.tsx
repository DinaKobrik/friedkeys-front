import "./globals.css";
// import Button from "@/components/ui/Button";
// import Heading from "@/components/ui/Heading";
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
      {/* <Button variant="primary">Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="primary" disabled>
        Disabled Primary
      </Button>
      <Heading variant="h1">Hello</Heading>
      <Heading variant="h2">Subtitle</Heading>
      <Heading variant="h3">Subheading</Heading> */}
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
