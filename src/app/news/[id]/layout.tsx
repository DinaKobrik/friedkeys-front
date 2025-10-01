"use client";

import { CartProvider } from "@/components/Sections/Game/CartHandler";

export default function NewsIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
