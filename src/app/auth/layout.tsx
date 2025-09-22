import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Friedkeys Authentication",
  description: "Authentication and account management at Friedkeys.",
  openGraph: {
    title: "Friedkeys Authentication",
    description: "Authentication and account management at Friedkeys.",
    url: "http://localhost:3000/auth",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Friedkeys Authentication",
    description: "Authentication and account management at Friedkeys.",
  },
  alternates: {
    canonical: "http://localhost:3000/auth",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
