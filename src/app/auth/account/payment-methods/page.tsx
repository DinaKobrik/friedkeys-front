"use client";

import React, { useState, useEffect } from "react";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import AccountMenu from "@/components/Sections/Account/AccountMenu";
import Image from "next/image";

interface CreditCard {
  id: string;
  image: string;
  number: string;
  expiry: string;
  name: string;
}

const PaymentMethodsPage = () => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);

  const baseStyle =
    "card-corner bg-2 py-[24px] px-[16px] sm:py-[32px] sm:px-[28px]";

  // Данные из localStorage
  useEffect(() => {
    const savedCards =
      typeof window !== "undefined"
        ? localStorage.getItem("creditCards")
        : null;
    const defaultCards: CreditCard[] = [
      {
        id: "CARD-001",
        image: "/images/cards/visa.png",
        number: "4111-1111-1111-1234",
        expiry: "12/25",
        name: "Visa",
      },
      {
        id: "CARD-002",
        image: "/images/cards/amex.png",
        number: "4111-1111-1111-9012",
        expiry: "09/27",
        name: "American Express",
      },
      {
        id: "CARD-003",
        image: "/images/cards/mastercard.png",
        number: "4111-1111-1111-5678",
        expiry: "06/26",
        name: "MasterCard",
      },
    ];
    setCreditCards(savedCards ? JSON.parse(savedCards) : defaultCards);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("creditCards", JSON.stringify(creditCards));
    }
  }, [creditCards]);

  // Удаление карты
  const handleDeleteCard = (id: string) => {
    setCreditCards(creditCards.filter((card: CreditCard) => card.id !== id));
  };

  // SVG корзины
  const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.11719 6.45117H19.8784L18.461 21.2503H5.53458L4.11719 6.45117Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M16.4758 5.99734L15.4071 2.75H8.59217L7.52344 5.99734"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M12 11.3633L12 16.3361"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );

  return (
    <main className="min-h-screen mt-[24px] sm:mt-[80px]">
      <AccountMenu activeLink="/auth/account/payment-methods" />
      <section>
        <Heading
          variant="h1"
          className="mt-[40px] mb-[24px] sm:mt-[80px] sm:mb-[48px]">
          Payment Methods
        </Heading>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-[24px] mb-[24px] sm:mb-[56px]">
          <div className={baseStyle}>
            <div className="max-w-[520px] w-full mx-auto flex flex-col justify-between h-full">
              <Heading
                variant="h2"
                className="mb-[24px] sm:mb-[32px] text-center">
                Debit / Credit Card
              </Heading>
              <div className="mb-[24px] sm:mb-[32px]">
                {creditCards.map((card: CreditCard) => {
                  const lastFour = card.number.slice(-4);
                  return (
                    <div
                      key={card.id}
                      className="mb-[16px] last:mb-0 flex items-center justify-between">
                      <div className="flex items-center gap-[16px]">
                        <Image
                          src={card.image}
                          alt={`${card.name} card`}
                          width={40}
                          height={26}
                          className="mr-[12px] rounded-[2px] overflow-hidden"
                        />
                        <Text>
                          {card.name} **** {lastFour}
                        </Text>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => handleDeleteCard(card.id)}
                        className="max-w-[70px] mr-0 hidden lg:block">
                        <TrashIcon />
                      </Button>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="max-w-[24px] h-[40px] lg:hidden">
                        <TrashIcon />
                      </button>
                    </div>
                  );
                })}
              </div>
              <Button
                variant="primary"
                className="max-w-[500px] hidden lg:block">
                Add Card
              </Button>
              <Button variant="secondary" className="max-w-[500px] lg:hidden">
                Add Card
              </Button>
            </div>
          </div>

          <div className={baseStyle}>
            <div className="max-w-[520px] w-full mx-auto flex flex-col justify-between h-full">
              <Heading
                variant="h2"
                className="mb-[24px] sm:mb-[32px] text-center">
                wallet
              </Heading>
              <Heading
                variant="h1"
                className="mb-[24px] sm:mb-[32px] text-center">
                120.38 $
              </Heading>
              <Button
                variant="primary"
                className="max-w-[500px] hidden lg:block">
                Add to Wallet
              </Button>
              <Button variant="secondary" className="max-w-[500px] lg:hidden">
                Add to Wallet
              </Button>
            </div>
          </div>

          <div className={baseStyle}>
            <div className="max-w-[520px] w-full mx-auto flex flex-col justify-between h-full">
              <Heading variant="h2" className="mb-[40px] text-center">
                paypal
              </Heading>
              <Button
                variant="primary"
                className="max-w-[500px] hidden lg:block">
                Add paypal
              </Button>
              <Button variant="secondary" className="max-w-[500px] lg:hidden">
                Add paypal
              </Button>
            </div>
          </div>

          <div className={baseStyle}>
            <div className="max-w-[520px] w-full mx-auto flex flex-col justify-between h-full">
              <Heading variant="h2" className="mb-[40px] text-center">
                Crypto
              </Heading>
              <Button
                variant="primary"
                className="max-w-[500px] hidden lg:block">
                Add crypto Wallet
              </Button>
              <Button variant="secondary" className="max-w-[500px] lg:hidden">
                Add crypto Wallet
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PaymentMethodsPage;
