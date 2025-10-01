"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Text from "@/components/ui/Text";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface CartItem {
  quantity: number;
  edition: string;
  platform: string;
  region: string;
  addedAt: number;
}

interface OrderProps {
  id: string;
  date: string;
  time: string;
  gameCount: number;
  totalPrice: string;
  paymentMethod: string;
  status: string;
  isAlternate?: boolean;
  index: number;
  items: { [key: string]: CartItem };
}

const Order: React.FC<OrderProps> = React.memo(
  ({
    id,
    date,
    time,
    gameCount,
    totalPrice,
    paymentMethod,
    status,
    index,
    items,
  }) => {
    const [isAlternate, setIsAlternate] = useState(false);
    const [isLessThan1199State, setIsLessThan1199State] = useState(false);
    const router = useRouter();

    const checkAlternate = useCallback(() => {
      if (typeof window !== "undefined") {
        const isDesktop = window.innerWidth >= 991;
        const isLessThan1199 = window.innerWidth < 1199;
        const isSecondItem = index % 2 === 1;
        setIsAlternate(isDesktop && isSecondItem);
        setIsLessThan1199State(isLessThan1199);
      }
    }, [index]);

    useEffect(() => {
      checkAlternate();
      if (typeof window !== "undefined") {
        window.addEventListener("resize", checkAlternate);
        return () => window.removeEventListener("resize", checkAlternate);
      }
    }, [checkAlternate]);

    const handleSeeMoreClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (typeof window !== "undefined") {
          if (!items) {
            console.error(`Error: items is undefined for order ${id}`);
            return;
          }

          localStorage.setItem("oldOrder", JSON.stringify(items));

          localStorage.setItem(
            "oldOrderData",
            JSON.stringify({
              id,
              total: parseFloat(totalPrice),
              date,
              time,
              paymentMethod,
            })
          );

          router.push(`/auth/account/orders/${id}`);
        }
      },
      [items, totalPrice, date, time, paymentMethod, id, router]
    );

    const handleCardClick = useCallback(() => {
      if (typeof window !== "undefined" && window.innerWidth > 1200) {
        if (!items) {
          console.error(`Error: items is undefined for order ${id}`);
          return;
        }

        localStorage.setItem("oldOrder", JSON.stringify(items));

        localStorage.setItem(
          "oldOrderData",
          JSON.stringify({
            id,
            total: parseFloat(totalPrice),
            date,
            time,
            paymentMethod,
          })
        );

        router.push(`/auth/account/orders/${id}`);
      }
    }, [items, totalPrice, date, time, paymentMethod, id, router]);

    const baseClass = useMemo(
      () =>
        `order-grid p-[16px] pb-[24px] sm:p-[32px] sm:pb-[40px] xl:p-[16px] xl:pb-[16px] grid gap-[24px] justify-between ${
          isLessThan1199State ? "card-corner" : ""
        }`,
      [isLessThan1199State]
    );

    const backgroundClass = useMemo(
      () => (isAlternate ? "bg-2 xl:bg-[#0000001a]" : "bg-2 xl:bg-transparent"),
      [isAlternate]
    );

    return (
      <div
        className={`${baseClass} ${backgroundClass} 2xl:cursor-pointer`}
        role="region"
        aria-label={`Order details for ID ${id}, placed on ${date} at ${time}`}
        onClick={handleCardClick}>
        <div className="flex justify-between py-[4px] border-b-[1px] border-3 xl:border-none">
          <Heading variant="h3" className="xl:hidden w-full" aria-hidden="true">
            ID
          </Heading>
          <Text
            className="text-end xl:text-start xl:font-bold w-full"
            aria-label={`Order ID: ${id}`}>
            {id}
          </Text>
        </div>

        <div className="flex justify-between py-[4px] border-b-[1px] border-3 xl:border-none">
          <Heading variant="h3" className="xl:hidden w-full" aria-hidden="true">
            date / time
          </Heading>
          <Text
            className="text-end flex items-center justify-end 2xl:justify-center gap-[16px] 2xl:pr-[60px] w-full"
            aria-label={`Order date and time: ${date} ${time}`}>
            <span>{date}</span> <span>{time}</span>
          </Text>
        </div>
        <div className="flex justify-between py-[4px] border-b-[1px] border-3 xl:border-none">
          <Heading variant="h3" className="xl:hidden w-full" aria-hidden="true">
            count games
          </Heading>
          <Text
            className="text-end xl:text-center w-full"
            aria-label={`Number of games: ${gameCount}`}>
            {gameCount}
          </Text>
        </div>
        <div className="flex justify-between py-[4px] border-b-[1px] border-3 xl:border-none">
          <Heading variant="h3" className="xl:hidden w-full" aria-hidden="true">
            total price
          </Heading>
          <Text
            className="text-end xl:pr-[30px] 2xl:pr-[50px] mainCustom:pr-[70px] w-full"
            aria-label={`Total price: ${totalPrice} dollars`}>
            {totalPrice}$
          </Text>
        </div>
        <div className="flex justify-between py-[4px] border-b-[1px] border-3 xl:border-none">
          <Heading variant="h3" className="xl:hidden w-full" aria-hidden="true">
            Payment method
          </Heading>
          <Text
            className="text-end xl:pr-[40px] 2xl:pr-[60px] mainCustom:pr-[80px] w-full"
            aria-label={`Payment method: ${paymentMethod}`}>
            {paymentMethod}
          </Text>
        </div>
        <div className="flex justify-between py-[4px]">
          <Heading variant="h3" className="xl:hidden w-full" aria-hidden="true">
            status
          </Heading>
          <Text
            className="text-end xl:text-start 2xl:pl-[40px] mainCustom:pl-[60px] w-full"
            aria-label={`Order status: ${status}`}>
            {status}
          </Text>
        </div>
        <Button
          variant="secondary"
          className="max-w-[calc(100%-20px)] xl:hidden"
          aria-label={`View more details for order ID ${id}`}
          onClick={handleSeeMoreClick}>
          see more
        </Button>
      </div>
    );
  }
);

Order.displayName = "Order";

export default Order;
