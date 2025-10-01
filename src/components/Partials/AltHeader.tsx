"use client";

import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import Link from "next/link";

const Header = () => {
  return (
    <header className="py-[14px] flex justify-between items-center gap-[10px] sm:mt-[32px]">
      <Logo />
      <div className="max-h-[48px] hidden sm:flex items-center gap-[18px]">
        <Button
          variant="secondary"
          onClick={() => {
            window.location.href = "/auth/account/personal-info";
          }}
          className="h-[48px] flex justify-center items-center"
          aria-label="Settings">
          <svg
            width="33"
            height="32"
            viewBox="0 0 33 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M22.6842 9.55964C22.6842 12.815 20.0448 15.4526 16.7912 15.4526C13.5359 15.4526 10.8965 12.815 10.8965 9.55964C10.8965 6.30433 13.5359 3.66667 16.7912 3.66667C20.0448 3.66667 22.6842 6.30433 22.6842 9.55964Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
            <path
              d="M16.8364 19.7585C21.1782 19.7474 24.87 21.7409 26.227 26.0323C23.4918 27.6997 20.2723 28.3419 16.8364 28.3335C13.4006 28.3419 10.1811 27.6997 7.44592 26.0323C8.80446 21.7363 12.49 19.7474 16.8364 19.7585Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        </Button>
      </div>
      <Link
        href="/support"
        className="support-container flex justify-center items-center sm:hidden max-w-[200px] h-[40px] sm:h-[48px] no-underline relative w-auto"
        tabIndex={-1}
        aria-hidden="true"
        aria-label="Support mobile link">
        <span className="support font-usuzi-condensed flex justify-center items-center text-[15px] leading-[17px] sm:text-[26px] sm:leading-[28px] font-bold uppercase text-center text-white px-[10px] py-[10px] sm:px-[12px] sm:py-[12px] pl-[30px] sm:pl-[30px] relative w-[calc(100%-4px)] h-[calc(100%-4px)] bg-main overflow-hidden z-10">
          SUPPORT
        </span>
      </Link>
    </header>
  );
};

export default Header;
