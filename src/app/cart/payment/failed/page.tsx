"use client";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import CartMenu from "@/components/Sections/Cart/CartMenu";
import { useState, useEffect } from "react";

export default function FailedPage() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 992);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main>
      <CartMenu activeItem="payment" />
      <div
        className={`relative max-w-[548px] lg:max-w-[792px] pt-[56px] pb-[24px] mx-auto ${
          isDesktop ? "card-corner" : ""
        } ${
          isDesktop ? "pt-[56px] pb-[64px] lg:px-[127px] bg-2" : ""
        } flex flex-col justify-center items-center`}>
        <div className="failed mb-[32px] sm:mb-[40px] p-[11px] sm:p-[15px] rounded-full border-2 border-red w-[56px] h-[56px] sm:w-[80px] sm:h-[80px] flex justify-center items-center">
          <svg
            width="50"
            height="50"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M36.7846 36.7851L13.2144 13.2149"
              stroke="white"
              strokeWidth="3.15104"
            />
            <path
              d="M36.7817 13.2149L13.2115 36.7851"
              stroke="white"
              strokeWidth="3.15104"
            />
          </svg>
        </div>

        <Heading variant="h2" className="mb-[16px] sm:mb-[40px]">
          Something went wrong
        </Heading>
        <Text className="mb-[16px] sm:mb-[40px]">
          We couldn’t complete the payment. Please check the details and try
          again.
        </Text>
        <div className="mb-[80px] w-full">
          <Text>Possible reasons:</Text>
          <ul className="pl-[20px] list-disc marker:text-current text-left">
            <li>
              <Text>Insufficient funds</Text>
            </li>
            <li>
              <Text>Connection error</Text>
            </li>
            <li>
              <Text>Incorrect payment details</Text>
            </li>
          </ul>
        </div>
        <div className="flex flex-col md:flex-row gap-[8px] w-full justify-center max-w-[calc(100%-20px)] lg:max-w-[100%]">
          <Button variant="secondary" className="md:max-w-[175px]">
            Try Again
          </Button>
          <Button
            variant="primary"
            onClick={() => (window.location.href = "/cart/payment")}>
            Change Payment Method
          </Button>
        </div>
        <div className="hidden lg:block h-[7px] w-[50%] absolute bottom-0 left-[50%] bg-primary-main translate-x-[-50%] blur-[30px] z-0"></div>
      </div>
    </main>
  );
}
