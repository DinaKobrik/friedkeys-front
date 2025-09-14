import "./globals.css";
import AppFooter from "@/components/Partials/AppFooter";
import AppHeader from "@/components/Partials/AppHeader";
import BottomBar from "@/components/Partials/BottomBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="max-w-[1700px] mx-auto px-[16px] sm:px-[46px] font-inter bg-main text-white font-medium">
        <AppHeader />
        {children}
        <footer>
          <AppFooter />
          <BottomBar />
        </footer>
      </body>
    </html>
  );
}
