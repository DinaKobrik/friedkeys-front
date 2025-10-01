import "./globals.css";
import { Metadata } from "next";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Friedkeys",
  description: "Online Game Store",
  openGraph: {
    title: "Friedkeys",
    description: "Online Game Store",
    url: "https://friedkeys.com/",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Friedkeys",
    description: "Online Game Store",
  },
  alternates: {
    canonical: "https://friedkeys.com/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="max-w-[1700px] mx-auto px-[16px] sm:px-[46px] font-inter bg-main text-white font-medium">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
