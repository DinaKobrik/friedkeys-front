"use client";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import CartMenu from "@/components/Sections/Cart/CartMenu";

export default function FailedPage() {
  return (
    <main>
      <CartMenu activeItem="payment" />
      <div className="card-corner relative max-w-[792px] mx-auto pt-[56px] pb-[64px] px-[127px] bg-2 flex flex-col justify-center items-center">
        <div className="failed mb-[40px] p-[15px] rounded-full border-2 border-red w-[80px] h-[80px] flex justify-center items-center">
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

        <Heading variant="h2" className="mb-[40px]">
          Something went wrong
        </Heading>
        <p className="text-[20px] leading-[28px] mb-[16px] text-center">
          We couldn’t complete the payment. Please check the details and try
          again.
        </p>
        <div className="text-[20px] leading-[28px] mb-[80px] w-full text-center">
          Possible reasons:
          <ul className="pl-[20px] list-disc marker:text-current text-left">
            <li>Insufficient funds</li>
            <li>Connection error</li>
            <li>Incorrect payment details</li>
          </ul>
        </div>
        <div className="flex gap-[8px] w-full justify-center">
          <Button variant="secondary" className="max-w-[175px]">
            Try Again
          </Button>
          <Button
            variant="primary"
            onClick={() => (window.location.href = "/cart/payment")}>
            Change Payment Method
          </Button>
        </div>
        <div className="h-[7px] w-[50%] absolute bottom-0 left-[50%] bg-primary-main translate-x-[-50%] blur-[30px] z-0"></div>
      </div>
    </main>
  );
}
