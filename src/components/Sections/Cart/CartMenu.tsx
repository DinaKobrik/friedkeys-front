"use client";

import React from "react";
import Link from "next/link";

interface CartMenuProps {
  activeItem?: "shopping-cart" | "payment" | "game-activation";
}

const CartMenu: React.FC<CartMenuProps> = ({ activeItem = "shopping" }) => {
  const menuItems = [
    { id: "shopping-cart", label: "Shopping cart" },
    { id: "payment", label: "Payment" },
    { id: "game-activation", label: "Game activation" },
  ];

  return (
    <nav className="w-full my-[24px] sm:my-[80px]">
      <div className=" box-border overflow-hidden relative cart-menu w-[calc(100%+36px)] min-h-[46px] sm:min-h-[68px] ml-[-18px] gap-[4px] xs:gap-[8px] md:gap-[18px]  text-center">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={`/cart/${item.id}`}
            className={`cart-menu__button relative py-[7px] px-[4px] xs:px-[7px] sm:py-[18px] sm:px-[8px] md:px-[18px] skew-x-[-20deg] border-primary-main bg-2 flex items-center  ${
              activeItem === item.id
                ? "border-[1px] cart-menu__button--active"
                : ""
            }`}>
            <h3
              className={`uppercase skew-x-[20deg] w-[80%] ${
                activeItem === item.id ? "text-white" : "text-[#A9A9A9]"
              }  m-0 font-usuzi-condensed text-[16px] leading-[16px] sm:text-[26px] sm:leading-[28px]`}>
              {item.label}
            </h3>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default CartMenu;
