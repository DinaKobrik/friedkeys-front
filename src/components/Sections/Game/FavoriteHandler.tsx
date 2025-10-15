"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface FavoriteContextType {
  favoriteIds: number[];
  toggleFavorite: (gameId: number) => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined
);

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = localStorage.getItem("favoriteGames");
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favoriteGames", JSON.stringify(favoriteIds));
    }
  }, [favoriteIds]);

  const toggleFavorite = (gameId: number) => {
    setFavoriteIds((prev) =>
      prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId]
    );
  };

  return (
    <FavoriteContext.Provider value={{ favoriteIds, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorite must be used within a FavoriteProvider");
  }
  return context;
};
