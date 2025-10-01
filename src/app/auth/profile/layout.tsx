"use client";

import { useLayoutConfig } from "@/components/LayoutContext";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setConfig } = useLayoutConfig();

  useEffect(() => {
    setConfig({ headerType: "alt", showFooter: false });
    return () => {
      setConfig({ headerType: "default", showFooter: true });
    };
  }, [setConfig]);

  return <>{children}</>;
}
