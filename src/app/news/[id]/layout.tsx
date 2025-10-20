"use client";

import { CartProvider } from "@/components/Sections/Game/CartHandler";
import { FavoriteProvider } from "@/components/Sections/Game/FavoriteHandler";

export default function NewsIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FavoriteProvider>
      <CartProvider>{children}</CartProvider>
    </FavoriteProvider>
  );
}
