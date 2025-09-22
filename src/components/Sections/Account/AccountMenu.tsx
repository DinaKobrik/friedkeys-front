"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Link from "next/link";

const AccountMenu: React.FC<{ activeLink?: string }> = React.memo(
  ({ activeLink }) => {
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

    const handleResize = useCallback(() => {
      const newWidth = getWindowDimensions();
      setWindowWidth(newWidth);
      if (newWidth >= 991) {
        setIsMenuVisible(false);
      }
    }, [getWindowDimensions]);

    const updateMenuOffset = useCallback(() => {
      if (menuRef.current && isClient) {
        const rect = menuRef.current.getBoundingClientRect();
        setMenuOffset(rect.top > 0 ? rect.top : 0);
      }
    }, [isClient]);

    useEffect(() => {
      setIsClient(true);
      handleResize();
      updateMenuOffset();

      if (isClient) {
        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", updateMenuOffset);
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
    }, [isMenuVisible, isClient, handleResize, updateMenuOffset, windowWidth]);

    const calculateDynamicHeight = useMemo(() => {
      if (isClient && windowWidth < 991 && isMenuVisible) {
        const vh = window.innerHeight || 0;
        const topOffset = windowWidth < 768 ? 68 : 84;
        const adjustedHeight = vh - menuOffset + topOffset;
        return adjustedHeight > 0 ? `${adjustedHeight}px` : "auto";
      }
      return "auto";
    }, [isClient, windowWidth, isMenuVisible, menuOffset]);

    const menuClassName = useMemo(() => {
      return `overflow-y-auto lg:overflow-visible px-[16px] lg:px-0 py-[16px] lg:py-0 absolute lg:static left-0 right-0 bg-2 lg:bg-transparent z-50 lg:z-20 w-[100vw] lg:w-auto left-[-16px] sm:left-[-46px] ${
        windowWidth >= 991 ? "flex h-auto" : isMenuVisible ? "block" : "hidden"
      } ${
        windowWidth < 991 && isMenuVisible
          ? "top-[68px] sm:top-[84px] pb-[142px]"
          : "top-0"
      } ${windowWidth < 991 && isMenuVisible ? "bottom-0" : "bottom-auto"}`;
    }, [windowWidth, isMenuVisible]);

    return (
      <section
        className="mb-[24px] mt-[24px] sm:mt-[80px] relative"
        role="region"
        aria-label="Account Menu Navigation">
        <div
          className="flex justify-between items-center bg-2 w-[100vw] relative left-[-16px] sm:left-[-46px] py-[8px] sm:py-[16px] px-[16px] sm:px-[46px] lg:hidden"
          role="banner">
          <Heading variant="h2" aria-label="Account Menu Title">
            account Menu
          </Heading>
          <Button
            variant="secondary"
            className="max-w-[64px] mr-0"
            onClick={toggleMenu}
            aria-label="Toggle Account Menu"
            aria-expanded={isMenuVisible}
            aria-controls="account-menu-content">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true">
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
          style={{ height: calculateDynamicHeight }}
          id="account-menu-content"
          role="navigation"
          aria-label="Account Menu Items">
          <div className="flex flex-col w-full lg:flex-row bg-2 lg:bg-transparent items-center justify-start lg:justify-center 2xl:justify-between flex-wrap gap-[16px] lg:gap-[20px]">
            <Heading variant="h2">
              <Link
                href="/auth/account/personal-info"
                className={`account__link relative z-10 ${
                  activeLink === "/auth/account/personal-info"
                    ? "account__link--active"
                    : ""
                }`}
                aria-label="Personal Info Link"
                aria-current={
                  activeLink === "/auth/account/personal-info"
                    ? "page"
                    : undefined
                }>
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
                }`}
                aria-label="Orders Link"
                aria-current={
                  activeLink === "/auth/account/orders" ? "page" : undefined
                }>
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
                }`}
                aria-label="Payment Methods Link"
                aria-current={
                  activeLink === "/auth/account/payment-methods"
                    ? "page"
                    : undefined
                }>
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
                }`}
                aria-label="Favorites Link"
                aria-current={
                  activeLink === "/auth/account/favorites" ? "page" : undefined
                }>
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
                }`}
                aria-label="Product Reviews Link"
                aria-current={
                  activeLink === "/auth/account/product-reviews"
                    ? "page"
                    : undefined
                }>
                Product Reviews
              </Link>
            </Heading>
          </div>
        </div>
      </section>
    );
  }
);

AccountMenu.displayName = "AccountMenu";

export default AccountMenu;
