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
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
    ],
    other: [
      {
        rel: "android-chrome",
        url: "/android-chrome-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        rel: "android-chrome",
        url: "/android-chrome-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
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
