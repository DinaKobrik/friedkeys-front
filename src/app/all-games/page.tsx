import "../globals.css";
import GameList from "@/components/Sections/AllGames/GameList";
import Recommendations from "@/components/Sections/Recommendations";

export default function AllGame() {
  return (
    <main>
      <GameList />
      <Recommendations />
    </main>
  );
}
