"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface LayoutConfig {
  headerType: "default" | "alt";
  showFooter: boolean;
}

const LayoutContext = createContext<{
  config: LayoutConfig;
  setConfig: (config: LayoutConfig) => void;
}>({
  config: { headerType: "default", showFooter: true },
  setConfig: () => {},
});

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<LayoutConfig>({
    headerType: "default",
    showFooter: true,
  });

  return (
    <LayoutContext.Provider value={{ config, setConfig }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutConfig = () => useContext(LayoutContext);
