"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Game } from "@/types/game";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Link from "next/link";

const Banner: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedVariant] = useState(5); // варианты дизайна по скидке
  const [cartQuantities, setCartQuantities] = useState<{
    [key: string]: {
      quantity: number;
      edition: string;
      platform: string;
      region: string;
      addedAt: number;
    };
  }>({});
  const [imageSrc, setImageSrc] = useState<string>("/images/no-image.jpg");
  const [loading, setLoading] = useState(true);
  const [dynamicMargin, setDynamicMargin] = useState<string>("0px");
  const [dynamicPadding, setDynamicPadding] = useState<string>("0px");
  const [dynamicLeft, setDynamicLeft] = useState<string>("6px");

  const updateDynamicStyles = useCallback(() => {
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    const scrollbarWidthValue =
      windowWidth - (document.documentElement?.clientWidth || windowWidth);
    const isTouchDevice = navigator.maxTouchPoints > 0;

    let calculatedOffset: number;
    if (windowWidth < 576) {
      calculatedOffset = 16;
      setDynamicMargin(`-${calculatedOffset}px`);
      setDynamicLeft("6px");
    } else if (windowWidth >= 576 && windowWidth < 1200) {
      calculatedOffset = 46;
      setDynamicMargin(`-${calculatedOffset}px`);
      setDynamicLeft("46px");
    } else if (windowWidth >= 1200 && windowWidth < 1292) {
      calculatedOffset = 46;
      setDynamicMargin(`-${calculatedOffset}px`);
      setDynamicLeft(`${calculatedOffset + 96}px`);
    } else if (windowWidth >= 1200) {
      calculatedOffset = isTouchDevice
        ? (windowWidth - scrollbarWidthValue - 1200) / 2
        : (windowWidth - scrollbarWidthValue - 1200) / 2;
      setDynamicMargin(`-${calculatedOffset}px`);
      setDynamicLeft(`${calculatedOffset + 156}px`);
    } else {
      calculatedOffset = 146;
      setDynamicMargin("-146px");
      setDynamicLeft("0px");
    }

    setDynamicPadding(`${calculatedOffset}px`);
  }, []);

  const debounce = <T extends (...args: unknown[]) => void>(
    func: T,
    wait: number
  ) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/games?type=game");
        if (!response.ok) throw new Error("Failed to fetch games");
        const data = await response.json();
        if (Array.isArray(data)) {
          setGames(data);
        } else {
          console.warn("Invalid games data format from API");
        }
      } catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        setLoading(false);
      }
    };

    const cartData = localStorage.getItem("cart");
    setCartQuantities(cartData ? JSON.parse(cartData) : {});
    fetchGames();
    updateDynamicStyles();
    const debouncedUpdate = debounce(updateDynamicStyles, 100);
    window.addEventListener("resize", debouncedUpdate);
    return () => window.removeEventListener("resize", debouncedUpdate);
  }, [updateDynamicStyles]);

  const topGames = useMemo(
    () =>
      games.find((g) => g.id === 3) || {
        id: 1,
        image: "",
        price: 0,
        discount: 0,
        discountDate: "",
        title: "Unknown Game",
      },
    [games]
  );

  useEffect(() => {
    setImageSrc(
      topGames.image && topGames.image.trim()
        ? topGames.image
        : "/images/no-image.jpg"
    );
  }, [topGames.image]);

  const isDiscountExpired = useMemo(() => {
    const now = new Date();
    return (
      !topGames.discountDate ||
      new Date(topGames.discountDate).getTime() <= now.getTime()
    );
  }, [topGames.discountDate]);

  const discountPrice = useMemo(
    () =>
      topGames.discount && topGames.discount > 0 && !isDiscountExpired
        ? topGames.price * (1 - topGames.discount / 100)
        : null,
    [topGames.discount, topGames.price, isDiscountExpired]
  );

  const getUniqueCartKey = useCallback(
    (gameId: number) => `${gameId}_Standard_PC_US`,
    []
  );

  const cartItem = cartQuantities[getUniqueCartKey(topGames.id)] || {
    quantity: 0,
    edition: "Standard",
    platform: "PC",
    region: "US",
    addedAt: 0,
  };
  const cartQuantity = cartItem.quantity;

  const addToCart = useCallback(() => {
    const gameId = topGames.id;
    const cartKey = getUniqueCartKey(gameId);
    const newItem = {
      quantity: (cartQuantities[cartKey]?.quantity || 0) + 1,
      edition: "Standard",
      platform: "PC",
      region: "US",
      addedAt: Date.now(),
    };
    setCartQuantities((prev) => {
      const newQuantities = {
        ...prev,
        [cartKey]: newItem,
      };
      localStorage.setItem("cart", JSON.stringify(newQuantities));
      return newQuantities;
    });
  }, [topGames.id, cartQuantities, getUniqueCartKey]);

  const updateQuantity = useCallback(
    (gameId: number, delta: number) => {
      const cartKey = getUniqueCartKey(gameId);
      setCartQuantities((prev) => {
        const currentItem = prev[cartKey] || {
          quantity: 0,
          edition: "Standard",
          platform: "PC",
          region: "US",
          addedAt: Date.now(),
        };
        const newQuantity = Math.max(0, currentItem.quantity + delta);

        if (newQuantity === 0) {
          const newQuantities = { ...prev };
          delete newQuantities[cartKey];
          localStorage.setItem("cart", JSON.stringify(newQuantities));
          return newQuantities;
        }

        const newItem = {
          ...currentItem,
          quantity: newQuantity,
          addedAt: currentItem.addedAt || Date.now(),
        };
        const newQuantities = {
          ...prev,
          [cartKey]: newItem,
        };
        localStorage.setItem("cart", JSON.stringify(newQuantities));
        return newQuantities;
      });
    },
    [getUniqueCartKey]
  );

  const PriceOriginalBlock = useMemo(
    () => (
      <div
        className="skew-x-[-20deg] border-[1px] border-primary-main rounded-[2px] flex justify-center items-center w-full md:w-auto"
        aria-label={`Original price: ${topGames.price} dollars`}>
        <Heading
          variant="h3"
          className="skew-x-[20deg] h-[45px] py-[10px] sm:py-[11px] px-[22px] line-through hidden sm:block">
          {topGames.price}$
        </Heading>
        <Heading
          variant="h2"
          className="skew-x-[20deg] h-[40px] py-[10px] px-[4px] xs:px-[12px] line-through sm:hidden">
          {topGames.price}$
        </Heading>
      </div>
    ),
    [topGames.price]
  );

  const DiscountBadgeBlock = useMemo(
    () => (
      <div
        className="skew-x-[-20deg] bg-sale rounded-[2px] flex justify-center items-center w-full md:w-auto"
        aria-label={`Discount: ${topGames.discount}%`}>
        <Heading
          variant="h3"
          className="skew-x-[20deg] h-[45px] py-[10px] sm:py-[12px] px-[22px] hidden sm:block">
          -{topGames.discount}%
        </Heading>
        <Heading
          variant="h2"
          className="skew-x-[20deg] py-[10px] sm:py-[12px] h-[42px] px-[4px] xs:px-[20px] sm:hidden">
          -{topGames.discount}%
        </Heading>
      </div>
    ),
    [topGames.discount]
  );

  const renderPriceBlock = useCallback(() => {
    const isInCart = cartQuantity > 0;

    return (
      <div
        className={`sm:absolute z-50 bottom-[0] sm:bottom-[20%] ${dynamicLeft} xl:max-w-[642px] xl:w-full mx-auto  sm:ml-0`}
        style={{ left: dynamicLeft }}
        aria-live="polite">
        {topGames.discount && topGames.discount > 0 && !isDiscountExpired ? (
          <>
            {selectedVariant === 1 && (
              <div className="md:h-[45px] banner-grid max-w-[calc(100%-30px)] sm:max-w-[100%] w-full items-start justify-items-start gap-[8px] mx-auto">
                {PriceOriginalBlock}
                <div
                  className="skew-x-[-20deg] border-[1px] border-primary-main rounded-[2px] h-full flex justify-center items-center w-full"
                  aria-label={`Discounted price: ${discountPrice?.toFixed(
                    2
                  )} dollars`}>
                  <span className="skew-x-[20deg] text-white font-usuzi-condensed text-[24px] leading-[20px] sm:text-[28px] sm:leading-[21px] py-[11px] px-[30px] h-[42px] sm:h-[43px]">
                    {discountPrice?.toFixed(2)}$
                  </span>
                </div>
                {DiscountBadgeBlock}
                {isInCart ? (
                  <div className="flex items-center gap-[6px] sm:gap-[24px] flex-shrink-0 w-full max-w-[100%] sm:max-w-[202px]">
                    <Button
                      variant="secondary"
                      className="max-w-[44px] sm:max-w-[64px] h-[42px] sm:h-[45px] flex items-center justify-center flex-shrink-0"
                      onClick={() => updateQuantity(topGames.id, -1)}
                      aria-label="Decrease quantity">
                      -
                    </Button>
                    <span
                      className="text-white text-[13px] font-bold"
                      aria-label={`Quantity: ${cartQuantity}`}>
                      {cartQuantity}
                    </span>
                    <Button
                      variant="secondary"
                      className="max-w-[44px] sm:max-w-[64px] h-[42px] sm:h-[45px] flex items-center justify-center flex-shrink-0"
                      onClick={() => updateQuantity(topGames.id, 1)}
                      aria-label="Increase quantity">
                      +
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    className="w-full lg:w-[270px] ml-0 whitespace-nowrap"
                    onClick={addToCart}
                    aria-label={`Add ${topGames.title} to cart`}>
                    Add to cart
                  </Button>
                )}
              </div>
            )}
            {selectedVariant === 2 && (
              <div className="max-w-[calc(100%-30px)] sm:max-w-[455px] w-full mx-auto sm:mx-0 sm:ml-[30px]">
                <Heading
                  variant="h1"
                  className="text-center mb-[6px] hidden sm:block"
                  aria-label={`Discounted price: ${discountPrice?.toFixed(
                    2
                  )} dollars`}>
                  {discountPrice?.toFixed(2)}$
                </Heading>
                <span
                  className="block sm:hidden text-center text-white font-usuzi text-[32px] leading-[26px] mb-[8px]"
                  aria-label={`Discounted price: ${discountPrice?.toFixed(
                    2
                  )} dollars`}>
                  {discountPrice?.toFixed(2)}$
                </span>
                <div className="h-[42px] sm:h-[52px] flex w-full items-center gap-[8px]">
                  {PriceOriginalBlock}
                  {DiscountBadgeBlock}
                  {isInCart ? (
                    <div className="flex items-center sm:gap-[24px] flex-shrink-0 w-full max-w-[125px] sm:max-w-[202px]">
                      <Button
                        variant="secondary"
                        className="max-w-[44px] sm:max-w-[64px] h-[42px] sm:h-[52px] flex items-center justify-center flex-shrink-0"
                        onClick={() => updateQuantity(topGames.id, -1)}
                        aria-label="Decrease quantity">
                        -
                      </Button>
                      <span
                        className="text-white text-[18px] font-bold"
                        aria-label={`Quantity: ${cartQuantity}`}>
                        {cartQuantity}
                      </span>
                      <Button
                        variant="secondary"
                        className="max-w-[44px] sm:max-w-[64px] h-[42px] sm:h-[52px] flex items-center justify-center flex-shrink-0"
                        onClick={() => updateQuantity(topGames.id, 1)}
                        aria-label="Increase quantity">
                        +
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      className="sm:max-w-[216px] ml-0 whitespace-nowrap"
                      onClick={addToCart}
                      aria-label={`Add ${topGames.title} to cart`}>
                      Add to cart
                    </Button>
                  )}
                </div>
              </div>
            )}
            {selectedVariant === 3 && (
              <div className="flex flex-col gap-[8px] w-full max-w-[calc(100%-20px)] sm:max-w-[520px] mx-auto ml-[10px] sm:ml-0">
                <div className="h-[42px] sm:h-[45px] flex w-full items-center gap-[8px] max-w-[100%]">
                  {PriceOriginalBlock}
                  {DiscountBadgeBlock}
                  <div
                    className="skew-x-[-20deg] border-[1px] border-primary-main rounded-[2px] h-full flex justify-center items-center w-full"
                    aria-label={`Discounted price: ${discountPrice?.toFixed(
                      2
                    )} dollars`}>
                    <span className="skew-x-[20deg] text-white font-usuzi-condensed text-[20px] leading-[24px] sm:text-[28px] sm:leading-[29px] py-[9px] px-[8px] xs:px-[18px] sm:px-[22px]">
                      {discountPrice?.toFixed(2)}$
                    </span>
                  </div>
                </div>
                {isInCart ? (
                  <div className="flex items-center gap-[24px] flex-shrink-0 w-full max-w-[202px] mx-auto">
                    <Button
                      variant="secondary"
                      className="max-w-[64px] h-[42px] sm:h-[45px] flex items-center justify-center flex-shrink-0"
                      onClick={() => updateQuantity(topGames.id, -1)}
                      aria-label="Decrease quantity">
                      -
                    </Button>
                    <span
                      className="text-white text-[13px] font-bold"
                      aria-label={`Quantity: ${cartQuantity}`}>
                      {cartQuantity}
                    </span>
                    <Button
                      variant="secondary"
                      className="max-w-[64px] h-[42px] sm:h-[45px] flex items-center justify-center flex-shrink-0"
                      onClick={() => updateQuantity(topGames.id, 1)}
                      aria-label="Increase quantity">
                      +
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    className="sm:max-w-[calc(100%-20px)]"
                    onClick={addToCart}
                    aria-label={`Add ${topGames.title} to cart`}>
                    Add to cart
                  </Button>
                )}
              </div>
            )}
            {selectedVariant === 4 && (
              <div className="max-w-[100%] sm:max-w-[283px] lg:max-w-[250px] flex flex-col w-full gap-[8px] sm:gap-[12px] xs:mx-[10px] sm:ml-0">
                <div className="grid grid-cols-2 lg:flex justify-between gap-[8px] xs:gap-[18px] items-center">
                  {DiscountBadgeBlock}
                  <Heading
                    variant="h1"
                    className="text-center hidden sm:block"
                    aria-label={`Discounted price: ${discountPrice?.toFixed(
                      2
                    )} dollars`}>
                    {discountPrice?.toFixed(2)}$
                  </Heading>
                  <span
                    className="block sm:hidden text-center text-white font-usuzi text-[32px] leading-[26px]"
                    aria-label={`Discounted price: ${discountPrice?.toFixed(
                      2
                    )} dollars`}>
                    {discountPrice?.toFixed(2)}$
                  </span>
                </div>
                {isInCart ? (
                  <div className="flex items-center gap-[24px] flex-shrink-0 w-full max-w-[202px] mx-auto">
                    <Button
                      variant="secondary"
                      className="max-w-[64px] h-[42px] sm:h-[45px] flex items-center justify-center flex-shrink-0"
                      onClick={() => updateQuantity(topGames.id, -1)}
                      aria-label="Decrease quantity">
                      -
                    </Button>
                    <span
                      className="text-white text-[13px] font-bold"
                      aria-label={`Quantity: ${cartQuantity}`}>
                      {cartQuantity}
                    </span>
                    <Button
                      variant="secondary"
                      className="max-w-[64px] h-[42px] sm:h-[45px] flex items-center justify-center flex-shrink-0"
                      onClick={() => updateQuantity(topGames.id, 1)}
                      aria-label="Increase quantity">
                      +
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    className="max-w-[calc(100%-20px)] sm:max-w-[100%]"
                    onClick={addToCart}
                    aria-label={`Add ${topGames.title} to cart`}>
                    Add to cart
                  </Button>
                )}
              </div>
            )}
            {selectedVariant === 5 && (
              <div className="flex flex-col xs:flex-row gap-[8px] items-center xs:h-[42px] sm:h-[52px] sm:max-w-[calc(100%-66px)] w-full mx-auto sm:mx-0">
                <div className="flex gap-[8px] items-center h-[42px] sm:h-[45px] xs:max-w-[calc(100%-20px)] sm:max-w-[calc(100%-66px)] w-full xs:w-auto mx-auto sm:mx-0 xs:ml-[10px] sm:ml-0">
                  {DiscountBadgeBlock}
                  <div
                    className="skew-x-[-20deg] border-[1px] border-primary-main rounded-[2px] h-full flex justify-center items-center"
                    aria-label={`Discounted price: ${discountPrice?.toFixed(
                      2
                    )} dollars`}>
                    <span className="skew-x-[20deg] text-white font-usuzi-condensed text-[20px] leading-[24px] sm:text-[38px] sm:leading-[29px] py-[10px] sm:py-[12px] px-[12px] xs:px-[18px] md:px-[30px]">
                      {discountPrice?.toFixed(2)}$
                    </span>
                  </div>
                </div>
                {isInCart ? (
                  <div className="flex items-center gap-[24px] xs:gap-0 sm:gap-[24px] flex-shrink-0 w-full max-w-[202px] xs:max-w-[140px] sm:max-w-[202px]">
                    <Button
                      variant="secondary"
                      className="max-w-[64px] xs:max-w-[44px] sm:max-w-[64px] h-[42px] sm:h-[45px] flex items-center justify-center flex-shrink-0"
                      onClick={() => updateQuantity(topGames.id, -1)}
                      aria-label="Decrease quantity">
                      -
                    </Button>
                    <span
                      className="text-white text-[13px] font-bold"
                      aria-label={`Quantity: ${cartQuantity}`}>
                      {cartQuantity}
                    </span>
                    <Button
                      variant="secondary"
                      className="max-w-[64px] xs:max-w-[44px] sm:max-w-[64px] h-[42px] sm:h-[45px] flex items-center justify-center flex-shrink-0"
                      onClick={() => updateQuantity(topGames.id, 1)}
                      aria-label="Increase quantity">
                      +
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    className="max-w-[calc(100%-10px)] sm:max-w-[271px] ml-0 whitespace-nowrap"
                    onClick={addToCart}
                    aria-label={`Add ${topGames.title} to cart`}>
                    Add to cart
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-2 justify-center max-w-[calc(100%-30px)] sm:max-w-[100%] mx-auto sm:flex gap-[8px] w-full sm:ml-0 sm:justify-start">
            <div
              className="skew-x-[-20deg] h-[42px] sm:h-[45px] border-[1px] border-primary-main rounded-[2px] flex justify-center items-center"
              aria-label={`Price: ${topGames.price} dollars`}>
              <Heading
                variant="h3"
                className="skew-x-[20deg] p-[12px] hidden sm:block">
                {topGames.price}$
              </Heading>
              <Heading
                variant="h2"
                className="skew-x-[20deg] p-[12px] block sm:hidden">
                {topGames.price}$
              </Heading>
            </div>
            {isInCart ? (
              <div className="flex items-center gap-[8px] xs:gap-[24px] flex-shrink-0 w-full max-w-[202px]">
                <Button
                  variant="secondary"
                  className="max-w-[44px] sm:max-w-[64px] h-[42px] sm:h-[45px] flex items-center justify-center flex-shrink-0"
                  onClick={() => updateQuantity(topGames.id, -1)}
                  aria-label="Decrease quantity">
                  -
                </Button>
                <span
                  className="text-white text-[13px] font-bold"
                  aria-label={`Quantity: ${cartQuantity}`}>
                  {cartQuantity}
                </span>
                <Button
                  variant="secondary"
                  className="max-w-[44px] sm:max-w-[64px] h-[42px] sm:h-[45px] flex items-center justify-center flex-shrink-0"
                  onClick={() => updateQuantity(topGames.id, 1)}
                  aria-label="Increase quantity">
                  +
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                className="sm:max-w-[240px] ml-0"
                onClick={addToCart}
                aria-label={`Add ${topGames.title} to cart`}>
                Add to cart
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }, [
    cartQuantity,
    discountPrice,
    topGames.id,
    topGames.title,
    topGames.price,
    topGames.discount,
    selectedVariant,
    isDiscountExpired,
    addToCart,
    updateQuantity,
    PriceOriginalBlock,
    DiscountBadgeBlock,
    dynamicLeft,
  ]);

  if (loading) {
    return (
      <section
        className="relative banner__container w-[100vw] sm:bg-dark"
        style={{ marginLeft: dynamicMargin, marginRight: dynamicMargin }}
        aria-label="Banner loading">
        <div
          className="relative banner mx-auto max-w-[1920px]"
          style={{ paddingLeft: dynamicPadding, paddingRight: dynamicPadding }}>
          <div className="skeleton skeleton-image" />
        </div>
        <div
          className="sm:absolute z-50 bottom-[0] sm:bottom-[20%] left-[6px] sm:left-[46px] xl:left-[115px] mx-auto ml-[32px] sm:ml-0"
          aria-live="polite">
          <div className="banner-grid w-full items-start justify-items-start gap-[8px] mx-auto">
            <div className="skeleton skeleton-price" />
            <div className="skeleton skeleton-price" />
            <div className="skeleton skeleton-price" />
            <div className="skeleton skeleton-button" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative banner sm:bg-dark"
      style={{ marginLeft: dynamicMargin, marginRight: dynamicMargin }}
      aria-label="Game Banner">
      <div className="relative mx-auto max-w-[1920px]">
        <Link
          href={`/all-games/${topGames.id}`}
          title={`View ${topGames.title} details`}
          aria-label={`View ${topGames.title} details`}>
          <div className="relative banner-img max-w-[1292px] mx-auto w-full aspect-[1292/440] h-[216px] sm:h-[340px] md:h-[440px]">
            <Image
              src={imageSrc}
              alt={topGames.title || "Game Banner"}
              width={1200}
              height={440}
              className="max-w-[1292px] w-full mx-auto h-[216px] sm:h-[340px] md:h-[440px] object-cover no-drag"
              priority
              quality={100}
              onError={() => setImageSrc("/images/no-image.jpg")}
            />
          </div>
        </Link>
      </div>
      {renderPriceBlock()}
    </section>
  );
};

export default Banner;
