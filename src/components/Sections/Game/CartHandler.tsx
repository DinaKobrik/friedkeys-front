"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Button from "@/components/ui/Button";
import { Game } from "@/types/game";

export interface CartItem {
  quantity: number;
  edition: string;
  platform: string;
  region: string;
  addedAt: number;
}

interface CartContextType {
  cartQuantities: { [key: string]: CartItem };
  setCartQuantities: React.Dispatch<
    React.SetStateAction<{ [key: string]: CartItem }>
  >;
  selectedEdition: string;
  setSelectedEdition: (edition: string) => void;
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartQuantities, setCartQuantities] = useState<{
    [key: string]: CartItem;
  }>(() => {
    const cartData =
      typeof window !== "undefined" ? localStorage.getItem("cart") : null;
    return cartData ? JSON.parse(cartData) : {};
  });
  const [selectedEdition, setSelectedEdition] = useState(() => {
    return typeof window !== "undefined"
      ? localStorage.getItem("selectedEdition") || "Standard"
      : "Standard";
  });
  const [selectedPlatform, setSelectedPlatform] = useState(() => {
    return typeof window !== "undefined"
      ? localStorage.getItem("selectedPlatform") || "PC"
      : "PC";
  });
  const [selectedRegion, setSelectedRegion] = useState(() => {
    return typeof window !== "undefined"
      ? localStorage.getItem("selectedRegion") || "US"
      : "US";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cartQuantities));
      localStorage.setItem("selectedEdition", selectedEdition);
      localStorage.setItem("selectedPlatform", selectedPlatform);
      localStorage.setItem("selectedRegion", selectedRegion);
    }
  }, [cartQuantities, selectedEdition, selectedPlatform, selectedRegion]);

  return (
    <CartContext.Provider
      value={{
        cartQuantities,
        setCartQuantities,
        selectedEdition,
        setSelectedEdition,
        selectedPlatform,
        setSelectedPlatform,
        selectedRegion,
        setSelectedRegion,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

const CartButton: React.FC<{ game: Game | null }> = ({ game }) => {
  const {
    cartQuantities,
    setCartQuantities,
    selectedEdition,
    selectedPlatform,
    selectedRegion,
  } = useCart();

  const getUniqueCartKey = (gameId: string) =>
    `${gameId}_${selectedEdition}_${selectedPlatform}_${selectedRegion}`;

  const addToCart = () => {
    if (!game) return;
    const gameId = game.id.toString();
    const cartKey = getUniqueCartKey(gameId);
    const newItem: CartItem = {
      quantity: (cartQuantities[cartKey]?.quantity || 0) + 1,
      edition: selectedEdition,
      platform: selectedPlatform,
      region: selectedRegion,
      addedAt: Date.now(),
    };
    setCartQuantities({
      ...cartQuantities,
      [cartKey]: newItem,
    });
  };

  const updateQuantity = (cartKey: string, delta: number) => {
    const currentItem = cartQuantities[cartKey] || {
      quantity: 0,
      edition: selectedEdition,
      platform: selectedPlatform,
      region: selectedRegion,
      addedAt: Date.now(),
    };
    const newQuantity = Math.max(0, currentItem.quantity + delta);

    if (newQuantity === 0) {
      const newCartQuantities = { ...cartQuantities };
      delete newCartQuantities[cartKey];
      setCartQuantities(newCartQuantities);
    } else {
      const newItem = {
        ...currentItem,
        quantity: newQuantity,
        addedAt: Date.now(),
      };
      setCartQuantities({
        ...cartQuantities,
        [cartKey]: newItem,
      });
    }
  };

  const getCartItemForCurrentFilters = () => {
    if (!game) return null;
    const gameId = game.id.toString();
    const cartKey = getUniqueCartKey(gameId);
    return cartQuantities[cartKey] || null;
  };

  const cartItem = getCartItemForCurrentFilters();
  const cartQuantity = cartItem ? cartItem.quantity : 0;
  const cartKey = getUniqueCartKey(game?.id.toString() || "");

  const discountPrice = game?.discount
    ? (game.price * (1 - game.discount / 100)).toFixed(2)
    : null;
  const isDiscountExpired = game?.discountDate
    ? new Date(game.discountDate).getTime() < new Date().getTime()
    : false;

  if (!game) return null;

  return (
    <div className="sm:static fixed bottom-0 left-0 p-4 z-[10000] flex flex-row sm:flex-col w-full items-center justify-center gap-4 bg-main sm:bg-transparent border-t-[1px] sm:border-none border-primary-main">
      <div className="flex flex-shrink-0 gap-[1px] sm:hidden sm:gap-[20px] items-end ">
        {discountPrice &&
        game.discount &&
        game.discount > 0 &&
        !isDiscountExpired ? (
          <div className="flex items-center gap-[16px]">
            <span className="text-white font-usuzi-condensed font-bold text-[18px] leading-[18px] py-[4px] px-[8px] rounded-[2px] bg-sale">
              -{game.discount}%
            </span>
            <div className="flex items-end gap-[2px] flex-col">
              <span className="text-white font-usuzi-condensed text-center w-full font-bold text-[22px] leading-[22px]">
                {discountPrice}$
              </span>
              <span className="line-through font-usuzi-condensed text-gray-68 font-bold text-[18px] leading-[16px]">
                {game.price}$
              </span>
            </div>
          </div>
        ) : (
          <span className="text-white font-usuzi-condensed text-center w-full font-bold text-[22px] leading-[22px]">
            {game.price}$
          </span>
        )}
      </div>
      <div className="hidden sm:flex gap-[1px] sm:gap-[20px] w-full items-end justify-between">
        {discountPrice &&
        game.discount &&
        game.discount > 0 &&
        !isDiscountExpired ? (
          <>
            <div className="flex items-center gap-[16px] flex-col sm:flex-row">
              <span className="line-through font-usuzi-condensed text-gray-68 font-bold text-[20px] sm:text-[32px] leading-[16px] sm:leading-[30px]">
                {game.price}$
              </span>
              <span className="text-white font-usuzi-condensed font-bold text-[24px] leading-[22px] py-[4px] px-[8px] md:py-[6px] md:px-[16px] rounded-[2px] bg-sale">
                -{game.discount}%
              </span>
            </div>
            <span className="text-white font-usuzi-condensed text-center font-bold text-[32px] sm:text-[48px] leading-[28px] sm:leading-[37px]">
              {discountPrice}$
            </span>
          </>
        ) : (
          <span className="text-white font-usuzi-condensed text-center w-full font-bold text-[32px] sm:text-[48px] leading-[28px] sm:leading-[37px]">
            {game.price}$
          </span>
        )}
      </div>
      {cartQuantity === 0 ? (
        <Button
          variant="primary"
          className="max-w-[245px] w-full sm:max-w-[calc(100%-20px)]"
          onClick={addToCart}>
          Add to Cart
        </Button>
      ) : (
        <div className="flex sm:w-full h-[42px] sm:h-[52px] items-center gap-6 w-full max-w-[202px] sm:max-w-[100%] sm:justify-center">
          <div className="hidden sm:block font-usuzi-condensed text-[24px] leading-[26px] text-center w-full">
            in the cart
          </div>
          <div className="flex items-center gap-6 w-full max-w-[202px]">
            <Button
              variant="secondary"
              className="max-w-[64px] h-[48px] flex items-center justify-center"
              onClick={() => updateQuantity(cartKey, -1)}>
              -
            </Button>
            <span className="text-white text-[18px] font-bold">
              {cartQuantity}
            </span>
            <Button
              variant="secondary"
              className="max-w-[64px] h-[48px] flex items-center justify-center"
              onClick={() => updateQuantity(cartKey, 1)}>
              +
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartButton;
