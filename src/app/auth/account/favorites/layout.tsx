import { FavoriteProvider } from "@/components/Sections/Game/FavoriteHandler";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favorites - Account",
  description: "Your favorite games page",
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FavoriteProvider>{children}</FavoriteProvider>;
}
