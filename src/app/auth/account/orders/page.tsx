"use client";

import React, { useState, useEffect } from "react";
import Heading from "@/components/ui/Heading";
import Pagination from "@/components/ui/Pagination";
import AccountMenu from "@/components/Sections/Account/AccountMenu";
import Order from "@/components/Sections/Account/Order";

const initialMockOrders = Array.from({ length: 97 }, (_, index) => ({
  id: `FK-20250603-124${index + 1}`,
  date: "8/28/2025",
  time: "12:00",
  gameCount: 1,
  totalPrice: "50.00",
  paymentMethod: "Wallet",
  status: "Pending",
}));

export default function OrdersPage() {
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [mockOrders, setMockOrders] = useState(initialMockOrders);

  useEffect(() => {
    const newMockOrders = Array.from(
      { length: initialMockOrders.length },
      (_, index) => {
        const date = new Date(2025, 7, 28 - index, 12 + index, 0);
        const month = String(date.getMonth() + 1);
        const day = String(date.getDate());
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const formattedDate = `${month}/${day}/${year}`;
        const formattedTime = `${hours}:${minutes}`;
        return {
          id: `FK-20250603-124${index + 1}`,
          date: formattedDate,
          time: formattedTime,
          gameCount: Math.floor(Math.random() * 5) + 1,
          totalPrice: (Math.random() * 100 + 50).toFixed(2),
          paymentMethod: ["Wallet", "Paypal", "Crypto", "Card"][
            Math.floor(Math.random() * 3)
          ],
          status: ["Pending", "Completed", "Failed", "Cancelled"][
            Math.floor(Math.random() * 3)
          ],
        };
      }
    );
    setMockOrders(newMockOrders);

    if (typeof window !== "undefined") {
      const handleResize = () => {
        setOrdersPerPage(window.innerWidth < 991 ? 5 : 10);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const totalPages = Math.ceil(mockOrders.length / ordersPerPage);
  const paginatedOrders = mockOrders
    .slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)
    .map((order, index) => (
      <Order
        key={order.id}
        id={order.id}
        date={order.date}
        time={order.time}
        gameCount={order.gameCount}
        totalPrice={order.totalPrice}
        paymentMethod={order.paymentMethod}
        status={order.status}
        index={index}
      />
    ));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document
      .querySelector(".order-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen mt-[24px] sm:mt-[80px]">
      <AccountMenu activeLink="/auth/account/orders" />
      <div className="flex flex-col sm:flex-row justify-between items-center gap-[8px] mt-[40px] sm:mt-[80px] mb-[24px] lg:mb-[80px]">
        <Heading variant="h1">orders</Heading>
        <div className="game-count text-[16px] sm:text-[32px] sm:font-usuzi-condensed text-white sm:uppercase">
          {mockOrders.length} orders
        </div>
      </div>
      <div className="orders-grid hidden xl:grid grid-cols-6 justify-items-center items-center skew-x-[-20deg] bg-3 py-[12px] px-[18px] max-w-[calc(100%-20px)] mx-auto mb-[8px]">
        <Heading variant="h3" className="skew-x-[20deg]">
          ID
        </Heading>
        <Heading variant="h3" className="skew-x-[20deg]">
          date / time
        </Heading>
        <Heading variant="h3" className="skew-x-[20deg]">
          count
        </Heading>
        <Heading variant="h3" className="skew-x-[20deg] text-center">
          total price
        </Heading>
        <Heading variant="h3" className="skew-x-[20deg] text-center">
          Payment method
        </Heading>
        <Heading variant="h3" className="skew-x-[20deg]">
          status
        </Heading>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-[16px] xl:gap-0 mb-[24px] sm:mb-[56px] xl:bg-2 py-[24px]">
        {paginatedOrders}
      </div>
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
}
