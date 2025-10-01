"use client";

import AppFooter from "@/components/Partials/AppFooter";
import AppHeader from "@/components/Partials/AppHeader";
import AltHeader from "@/components/Partials/AltHeader";
import BottomBar from "@/components/Partials/BottomBar";
import { LayoutProvider, useLayoutConfig } from "@/components/LayoutContext";

const Header: React.FC = () => {
  const { config } = useLayoutConfig();
  return config.headerType === "default" ? <AppHeader /> : <AltHeader />;
};

const Footer: React.FC = () => {
  const { config } = useLayoutConfig();
  return config.showFooter ? (
    <footer>
      <AppFooter />
      <BottomBar />
    </footer>
  ) : null;
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutProvider>
      <Header />
      {children}
      <Footer />
    </LayoutProvider>
  );
}
