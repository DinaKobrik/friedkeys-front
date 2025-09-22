"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from "react";
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

const PaymentMethodsPage = React.memo(() => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);

  const baseStyle =
    "card-corner bg-2 py-[24px] px-[16px] sm:py-[32px] sm:px-[28px]";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCards = localStorage.getItem("creditCards");
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
      if (!savedCards) {
        localStorage.setItem("creditCards", JSON.stringify(defaultCards));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && creditCards.length > 0) {
      localStorage.setItem("creditCards", JSON.stringify(creditCards));
    }
  }, [creditCards]);

  const handleDeleteCard = useCallback((id: string) => {
    setCreditCards((prevCards) =>
      prevCards.filter((card: CreditCard) => card.id !== id)
    );
  }, []);

  const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true">
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

  const creditCardsList = useMemo(() => {
    return creditCards.map((card: CreditCard) => {
      const lastFour = card.number.slice(-4);
      return (
        <div
          key={card.id}
          className="mb-[16px] last:mb-0 flex items-center justify-between"
          role="region"
          aria-label={`Credit card ${card.name} ending in ${lastFour}`}>
          <div className="flex items-center gap-[16px]">
            <Image
              src={card.image}
              alt={`${card.name} card logo`}
              width={40}
              height={26}
              className="mr-[12px] rounded-[2px] overflow-hidden"
              loading="lazy"
            />
            <Text>
              {card.name} **** {lastFour}
            </Text>
          </div>
          <Button
            variant="secondary"
            onClick={() => handleDeleteCard(card.id)}
            className="max-w-[70px] mr-0 hidden lg:block"
            aria-label={`Delete ${card.name} card ending in ${lastFour}`}>
            <TrashIcon />
          </Button>
          <button
            onClick={() => handleDeleteCard(card.id)}
            className="max-w-[24px] h-[40px] lg:hidden"
            aria-label={`Delete ${card.name} card ending in ${lastFour}`}>
            <TrashIcon />
          </button>
        </div>
      );
    });
  }, [creditCards, handleDeleteCard]);

  return (
    <main className="min-h-screen mt-[24px] sm:mt-[80px]">
      <Suspense fallback={<div>Loading menu...</div>}>
        <AccountMenu activeLink="/auth/account/payment-methods" />
      </Suspense>
      <section>
        <Heading
          variant="h1"
          className="mt-[40px] mb-[24px] sm:mt-[80px] sm:mb-[48px]"
          aria-label="Payment Methods Section">
          Payment Methods
        </Heading>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-[24px] mb-[24px] sm:mb-[56px]">
          <div
            className={baseStyle}
            role="region"
            aria-label="Credit Cards Section">
            <div className="max-w-[520px] w-full mx-auto flex flex-col justify-between h-full">
              <Heading
                variant="h2"
                className="mb-[24px] sm:mb-[32px] text-center"
                aria-label="Debit / Credit Card Section">
                Debit / Credit Card
              </Heading>
              <div className="mb-[24px] sm:mb-[32px]">{creditCardsList}</div>
              <Button
                variant="primary"
                className="max-w-[calc(100%-20px)] sm:max-w-[500px] hidden lg:block"
                aria-label="Add New Credit Card">
                Add Card
              </Button>
              <Button
                variant="secondary"
                className="max-w-[calc(100%-20px)] sm:max-w-[500px] lg:hidden"
                aria-label="Add New Credit Card">
                Add Card
              </Button>
            </div>
          </div>

          <div className={baseStyle} role="region" aria-label="Wallet Section">
            <div className="max-w-[520px] w-full mx-auto flex flex-col justify-between h-full">
              <Heading
                variant="h2"
                className="mb-[24px] sm:mb-[32px] text-center"
                aria-label="Wallet Section">
                wallet
              </Heading>
              <Heading
                variant="h1"
                className="mb-[24px] sm:mb-[32px] text-center"
                aria-label="Wallet Balance">
                120.38 $
              </Heading>
              <Button
                variant="primary"
                className="max-w-[calc(100%-20px)] sm:max-w-[500px] hidden lg:block"
                aria-label="Add Funds to Wallet">
                Add to Wallet
              </Button>
              <Button
                variant="secondary"
                className="max-w-[calc(100%-20px)] sm:max-w-[500px] lg:hidden"
                aria-label="Add Funds to Wallet">
                Add to Wallet
              </Button>
            </div>
          </div>

          <div className={baseStyle} role="region" aria-label="Paypal Section">
            <div className="max-w-[520px] w-full mx-auto flex flex-col justify-between h-full">
              <Heading
                variant="h2"
                className="mb-[40px] text-center"
                aria-label="Paypal Section">
                paypal
              </Heading>
              <Button
                variant="primary"
                className="max-w-[calc(100%-20px)] sm:max-w-[500px] hidden lg:block"
                aria-label="Add Paypal Account">
                Add paypal
              </Button>
              <Button
                variant="secondary"
                className="max-w-[calc(100%-20px)] sm:max-w-[500px] lg:hidden"
                aria-label="Add Paypal Account">
                Add paypal
              </Button>
            </div>
          </div>

          <div className={baseStyle} role="region" aria-label="Crypto Section">
            <div className="max-w-[520px] w-full mx-auto flex flex-col justify-between h-full">
              <Heading
                variant="h2"
                className="mb-[40px] text-center"
                aria-label="Crypto Section">
                Crypto
              </Heading>
              <Button
                variant="primary"
                className="max-w-[calc(100%-20px)] sm:max-w-[500px] hidden lg:block"
                aria-label="Add Crypto Wallet">
                Add crypto Wallet
              </Button>
              <Button
                variant="secondary"
                className="max-w-[calc(100%-20px)] sm:max-w-[500px] lg:hidden"
                aria-label="Add Crypto Wallet">
                Add crypto Wallet
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
});

PaymentMethodsPage.displayName = "PaymentMethodsPage";

export default PaymentMethodsPage;
