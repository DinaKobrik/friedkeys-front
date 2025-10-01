import React from "react";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";

interface Game {
  id: number;
  price: number;
  discount?: number;
  discountDate?: string;
}

interface CartItem {
  quantity: number;
  edition: string;
  platform: string;
  region: string;
  addedAt: number;
}

interface TotalPriceProps {
  cartQuantities: { [key: string]: CartItem };
  cartGames: Game[];
}

const TotalPrice: React.FC<TotalPriceProps> = ({
  cartQuantities,
  cartGames,
}) => {
  const calculateTotal = () => {
    let officialPrice = 0;
    let totalDiscount = 0;

    Object.entries(cartQuantities).forEach(([cartKey, item]) => {
      const gameId = Number(cartKey.split("_")[0]);
      const game = cartGames.find((g) => g.id === gameId);
      if (game) {
        const quantity = item.quantity;
        const originalPrice = game.price * quantity;
        officialPrice += originalPrice;

        const isDiscountExpired =
          game.discountDate &&
          new Date(game.discountDate).getTime() < new Date().getTime();

        if (game.discount && !isDiscountExpired) {
          const discountAmount =
            ((game.price * (game.discount || 0)) / 100) * quantity;
          totalDiscount += discountAmount;
        }
      }
    });

    const subtotal = officialPrice - totalDiscount;

    return {
      officialPrice: officialPrice.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      subtotal: subtotal.toFixed(2),
    };
  };

  const { officialPrice, totalDiscount, subtotal } = calculateTotal();

  return (
    <>
      <div className="w-full hidden 2xl:w-[384px] sm:px-[12px] 2xl:flex flex-col gap-[16px]">
        <Heading variant="h2" className="mb-[32px]" aria-label="Total Price">
          Total Price
        </Heading>
        <div className="flex flex-col w-full gap-[20px] pb-[20px] border-b-4 border-[#4C4C4C]">
          <div className="flex w-full justify-between items-center gap-[10px]">
            <span className="uppercase m-0 text-gray-68 font-usuzi-condensed text-[16px] leading-[16px] sm:text-[26px] sm:leading-[28px]">
              Official price
            </span>
            <span className="text-gray-68 font-bold text-[20px] leading-[24px]">
              {officialPrice}$
            </span>
          </div>
          <div className="flex w-full justify-between items-center gap-[10px]">
            <span className="uppercase m-0 text-gray-68 font-usuzi-condensed text-[16px] leading-[16px] sm:text-[26px] sm:leading-[28px]">
              Discount
            </span>
            <span className="text-gray-68 font-bold text-[20px] leading-[24px]">
              {totalDiscount}$
            </span>
          </div>
        </div>
        <div className="flex w-full justify-between items-center gap-[10px] mb-[68px]">
          <span className="uppercase m-0 text-white font-usuzi-condensed text-[16px] leading-[16px] sm:text-[28px] sm:leading-[28px]">
            Subtotal
          </span>
          <span className="text-white font-bold text-[28px] leading-[28px]">
            {subtotal}$
          </span>
        </div>
        <Button
          variant="primary"
          onClick={() => (window.location.href = "/cart/payment")}>
          Continue
        </Button>
      </div>
      <div className="w-full 2xl:hidden sm:px-[12px] flex flex-col gap-[16px]">
        <Heading
          variant="h2"
          className="mb-[20px] sm:mb-[32px]"
          aria-label="Total Price">
          Total Price
        </Heading>
        <div className="flex flex-col w-full gap-[20px] pb-[20px] border-b-4 border-[#4C4C4C]">
          <div className="flex w-full justify-between items-center gap-[10px]">
            <span className="uppercase m-0 text-gray-68 font-usuzi-condensed text-[16px] leading-[16px] sm:text-[26px] sm:leading-[28px]">
              Official price
            </span>
            <span className="text-gray-68 font-bold text-[15px] leading-[15px] sm:text-[20px] sm:leading-[24px]">
              {officialPrice}$
            </span>
          </div>
          <div className="flex w-full justify-between items-center gap-[10px]">
            <span className="uppercase m-0 text-gray-68 font-usuzi-condensed text-[16px] leading-[16px] sm:text-[26px] sm:leading-[28px]">
              Discount
            </span>
            <span className="text-gray-68 font-bold text-[15px] leading-[15px] sm:text-[20px] sm:leading-[24px]">
              {totalDiscount}$
            </span>
          </div>
        </div>
        <div className="flex w-full justify-between items-center gap-[10px] sm:mb-[68px]">
          <span className="uppercase m-0 text-white font-usuzi-condensed text-[16px] leading-[16px] sm:text-[28px] sm:leading-[28px]">
            Subtotal
          </span>
          <span className="text-white font-bold text-[20px] leading-[24px] sm:text-[28px] sm:leading-[28px]">
            {subtotal}$
          </span>
        </div>
        <div className="fixed bottom-[60px] left-0 sm:static z-[2000] sm:z-10 flex items-center gap-[16px] w-full p-[16px] sm:p-0 border-t-[1px] border-primary-main sm:border-none bg-2 sm:bg-transparent">
          <span className="sm:hidden text-white font-bold font-usuzi-condensed text-[22px] leading-[22px] sm:text-[28px] sm:leading-[28px]">
            {subtotal}$
          </span>
          <Button
            variant="primary"
            className="max-w-[calc(100%-20px)] mr-[10px] sm:mx-auto"
            onClick={() => (window.location.href = "/cart/payment")}>
            Continue
          </Button>
        </div>
      </div>
    </>
  );
};

export default TotalPrice;
