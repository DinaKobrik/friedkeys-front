import React, { useState, useEffect, useCallback, useRef } from "react";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Link from "next/link";

const AccountMenu: React.FC<{ activeLink?: string }> = ({ activeLink }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [menuOffset, setMenuOffset] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const getWindowDimensions = useCallback(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth;
    }
    return 0;
  }, []);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setWindowWidth(getWindowDimensions());
      if (getWindowDimensions() >= 991) {
        setIsMenuVisible(false);
      }
    };

    const updateMenuOffset = () => {
      if (menuRef.current && isClient) {
        const rect = menuRef.current.getBoundingClientRect();
        setMenuOffset(rect.top > 0 ? rect.top : 0);
      }
    };

    if (isClient) {
      setWindowWidth(getWindowDimensions());
      handleResize();
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", updateMenuOffset);
      updateMenuOffset();
    }

    if (isMenuVisible && windowWidth < 991) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "visible";
      document.body.style.height = "auto";
    }

    return () => {
      if (isClient) {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", updateMenuOffset);
      }
      document.body.style.overflow = "visible";
      document.body.style.height = "auto";
    };
  }, [isMenuVisible, isClient, getWindowDimensions, windowWidth]);

  const calculateDynamicHeight = () => {
    if (isClient && windowWidth < 991 && isMenuVisible) {
      const vh = window.innerHeight || 0;
      const topOffset = windowWidth < 768 ? 68 : 84;
      const adjustedHeight = vh - menuOffset + topOffset;
      return adjustedHeight > 0 ? `${adjustedHeight}px` : "auto";
    }
    return "auto";
  };

  const menuClassName = `overflow-y-auto lg:overflow-visible px-[16px] lg:px-0 py-[16px] lg:py-0 absolute lg:static left-0 right-0 bg-2 lg:bg-transparent z-50 lg:z-20 w-[100vw] lg:w-auto left-[-16px] sm:left-[-46px] ${
    windowWidth >= 991 ? "flex h-auto" : isMenuVisible ? "block" : "hidden"
  } ${
    windowWidth < 991 && isMenuVisible
      ? "top-[68px] sm:top-[84px] pb-[142px]"
      : "top-0"
  } ${windowWidth < 991 && isMenuVisible ? "bottom-0" : "bottom-auto"}`;

  return (
    <div className="mb-[24px] mt-[24px] sm:mt-[80px] relative">
      <div className="flex justify-between items-center bg-2 w-[100vw] relative left-[-16px] sm:left-[-46px] py-[8px] sm:py-[16px] px-[16px] sm:px-[46px] lg:hidden">
        <Heading variant="h2">account Menu</Heading>
        <Button
          variant="secondary"
          className="max-w-[64px] mr-0"
          onClick={toggleMenu}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 8.5L12 15.5L5 8.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        </Button>
      </div>
      <div
        ref={menuRef}
        className={menuClassName}
        style={{ height: calculateDynamicHeight() }}>
        <div className="flex flex-col w-full lg:flex-row bg-2 lg:bg-transparent items-center justify-start lg:justify-center 2xl:justify-between flex-wrap gap-[16px] lg:gap-[20px]">
          <Heading variant="h2">
            <Link
              href="/auth/account/personal-info"
              className={`account__link relative z-10 ${
                activeLink === "/auth/account/personal-info"
                  ? "account__link--active"
                  : ""
              }`}>
              personal info
            </Link>
          </Heading>
          <Heading variant="h2">
            <Link
              href="/auth/account/orders"
              className={`account__link relative z-10 ${
                activeLink === "/auth/account/orders"
                  ? "account__link--active"
                  : ""
              }`}>
              orders
            </Link>
          </Heading>
          <Heading variant="h2">
            <Link
              href="/auth/account/payment-methods"
              className={`account__link relative z-10 ${
                activeLink === "/auth/account/payment-methods"
                  ? "account__link--active"
                  : ""
              }`}>
              Payment methods
            </Link>
          </Heading>
          <Heading variant="h2">
            <Link
              href="/auth/account/favorites"
              className={`account__link relative z-10 ${
                activeLink === "/auth/account/favorites"
                  ? "account__link--active"
                  : ""
              }`}>
              favorites
            </Link>
          </Heading>
          <Heading variant="h2">
            <Link
              href="/auth/account/product-reviews"
              className={`account__link relative z-10 ${
                activeLink === "/auth/account/product-reviews"
                  ? "account__link--active"
                  : ""
              }`}>
              Product Reviews
            </Link>
          </Heading>
        </div>
      </div>
    </div>
  );
};

export default AccountMenu;
