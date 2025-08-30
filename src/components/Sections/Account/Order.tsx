"use client";

import React, { useState, useEffect } from "react";
import Text from "@/components/ui/Text";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";

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
}

const Order: React.FC<OrderProps> = ({
  id,
  date,
  time,
  gameCount,
  totalPrice,
  paymentMethod,
  status,
  index,
}) => {
  const [isAlternate, setIsAlternate] = useState(false);
  const [isLessThan1199State, setIsLessThan1199State] = useState(false);

  useEffect(() => {
    const checkAlternate = () => {
      const isDesktop = window.innerWidth >= 991;
      const isLessThan1199 = window.innerWidth < 1199;
      const isSecondItem = index % 2 === 1;
      setIsAlternate(isDesktop && isSecondItem);
      setIsLessThan1199State(isLessThan1199);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkAlternate);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", checkAlternate);
      }
    };
  }, [index]);
  // const [isLessThan1199State, setIsLessThan1199State] = useState(
  //   window.innerWidth < 1199 || false
  // );
  const baseClass = `order-grid p-[16px] pb-[24px] sm:p-[32px] sm:pb-[40px] xl:p-[16px] xl:pb-[16px] grid gap-[24px] justify-between ${
    isLessThan1199State ? "card-corner" : ""
  }`;
  const backgroundClass = isAlternate
    ? "bg-2 xl:bg-[#0000001a]"
    : "bg-2 xl:bg-transparent";

  return (
    <div className={`${baseClass} ${backgroundClass}`}>
      <div className="flex justify-between py-[4px] border-b-[1px] border-3 xl:border-none">
        <Heading variant="h3" className="xl:hidden w-full">
          ID
        </Heading>
        <Text className="text-end xl:text-start xl:font-bold w-full">{id}</Text>
      </div>

      <div className="flex justify-between py-[4px] border-b-[1px] border-3 xl:border-none">
        <Heading variant="h3" className="xl:hidden w-full">
          date / time
        </Heading>
        <Text className="text-end 2xl:pr-[60px] w-full">
          {date} {time}
        </Text>
      </div>
      <div className="flex justify-between py-[4px] border-b-[1px] border-3 xl:border-none">
        <Heading variant="h3" className="xl:hidden w-full">
          count games
        </Heading>
        <Text className="text-end xl:text-center w-full">{gameCount}</Text>
      </div>
      <div className="flex justify-between py-[4px] border-b-[1px] border-3 xl:border-none">
        <Heading variant="h3" className="xl:hidden w-full">
          total price
        </Heading>
        <Text className="text-end xl:pr-[30px] 2xl:pr-[50px] mainCustom:pr-[70px] w-full">
          {totalPrice}$
        </Text>
      </div>
      <div className="flex justify-between py-[4px] border-b-[1px] border-3 xl:border-none">
        <Heading variant="h3" className="xl:hidden w-full">
          Payment method
        </Heading>
        <Text className="text-end xl:pr-[40px] 2xl:pr-[60px] mainCustom:pr-[80px] w-full">
          {paymentMethod}
        </Text>
      </div>
      <div className="flex justify-between py-[4px]">
        <Heading variant="h3" className="xl:hidden w-full">
          status
        </Heading>
        <Text className="text-end xl:text-start 2xl:pl-[40px] mainCustom:pl-[60px] w-full">
          {status}
        </Text>
      </div>
      <Button variant="secondary" className="xl:hidden">
        see more
      </Button>
    </div>
  );
};

export default Order;
