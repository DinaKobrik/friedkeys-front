"use client";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import CartMenu from "@/components/Sections/Cart/CartMenu";
import { useState, useEffect } from "react";

export default function SuccessPage() {
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
        className={`relative py-[56px] max-w-[792px] mx-auto ${
          isDesktop ? "card-corner" : ""
        } ${
          isDesktop ? "pt-[56px] pb-[64px] px-[56px] bg-2" : ""
        } flex flex-col justify-center items-center`}>
        <div className="success mb-[32px] sm:mb-[40px] p-[11px] sm:p-[15px] rounded-full border-2 border-primary-main w-[56px] h-[56px] sm:w-[80px] sm:h-[80px] flex justify-center items-center">
          <svg
            width="38"
            height="28"
            viewBox="0 0 38 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2.33594 15.0833L12.7526 25.5L35.6693 2.58331"
              stroke="white"
              strokeWidth="3.15104"
              strokeLinecap="square"
            />
          </svg>
        </div>
        <Heading variant="h1" className="mb-[16px] sm:mb-[24px]">
          Done!
        </Heading>
        <Heading variant="h2" className="text-center mb-[24px] sm:mb-[80px]">
          Your payment was successful
        </Heading>
        <Button
          variant="primary"
          className="max-w-[calc(100%-20px)] sm:max-w-[254px]"
          onClick={() => (window.location.href = "/cart/game-activation")}>
          Game activation
        </Button>
        <div className="hidden lg:block h-[7px] w-[50%] absolute bottom-0 left-[50%] bg-primary-main translate-x-[-50%] blur-[30px] z-0"></div>
      </div>
    </main>
  );
}
