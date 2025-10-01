"use client";

import React, { useState, useEffect } from "react";

const Advantages: React.FC = () => {
  const BASE_STYLES = {
    advantages: `w-[calc(100%+150px)] relative left-[-75px] overflow-hidden px-0 sm:py-[88px] mx-auto grid gap-[8px] sm:gap-[25px] z-10`,
    bgAdvantages: `bg-advantages w-full`,
    advantage: `w-full flex flex-col gap-[16px] items-center justify-center relative py-[25px] sm:py-[45px] sm:pt-[45px] sm:pb-[16px] z-5`,
    text: `text-center text-white text-[14px] leading-[18px] sm:text-[24px] sm:leading-[30px]`,
    svg: `text-primary-main w-[24px] h-[24px] sm:w-[64px] sm:h-[64px]`,
  };

  const CONTENT_ITEMS = [
    {
      originalIndex: 0,
      svg: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M23.0455 32.6184V42.3457"
            stroke="#4EF432"
            strokeWidth={4}
            strokeLinecap="square"
          />
          <path
            d="M28.0058 37.4828H18.0808"
            stroke="#4EF432"
            strokeWidth={4}
            strokeLinecap="square"
          />
          <path
            d="M39.9735 32.9144H39.6955"
            stroke="#4EF432"
            strokeWidth={4}
            strokeLinecap="square"
          />
          <path
            d="M44.6824 42.1991H44.4044"
            stroke="#4EF432"
            strokeWidth={4}
            strokeLinecap="square"
          />
          <path
            d="M20.2083 8C20.2083 9.92333 21.7992 11.4825 23.7616 11.4825H26.5058C29.5333 11.4933 31.9857 13.8968 31.9995 16.8641V18.75"
            stroke="#4EF432"
            strokeWidth={4}
            strokeLinecap="square"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M42.0316 56C52.2171 56 60.474 47.7431 60.474 37.5576V37.5576C60.474 27.3722 52.217 19.1152 42.0316 19.1152L21.9658 19.1152C11.7804 19.1152 3.52344 27.3722 3.52344 37.5576V37.5576C3.52344 47.7431 11.7804 56 21.9658 56L42.0316 56Z"
            stroke="#4EF432"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </svg>
      ),
      text: "A huge selection of games for PC and consoles",
    },
    {
      originalIndex: 1,
      svg: (
        <svg
          width="65"
          height="64"
          viewBox="0 0 65 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M57.2957 7.205L42.6563 56.7946H42.5897L28.616 35.8844L7.70575 21.9107V21.8333L57.2084 7.1145L57.2957 7.205Z"
            stroke="#4EF432"
            strokeWidth={4}
            strokeLinecap="square"
          />
          <path
            d="M29.2722 35.3827L41.1185 23.5364"
            stroke="#4EF432"
            strokeWidth={4}
            strokeLinecap="square"
          />
        </svg>
      ),
      text: "Instant key delivery 24/7",
    },
    {
      originalIndex: 2,
      svg: (
        <svg
          width="64"
          height="65"
          viewBox="0 0 64 65"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M25.7552 38.1909L37.6875 26.2585"
            stroke="#4EF432"
            strokeWidth={4}
            strokeLinecap="square"
            strokeLinejoin="round"
          />
          <path
            d="M37.5097 38.024H37.5306"
            stroke="#4EF432"
            strokeWidth={4}
            strokeLinecap="square"
            strokeLinejoin="round"
          />
          <path
            d="M25.9055 26.4173H25.9264"
            stroke="#4EF432"
            strokeWidth={4}
            strokeLinecap="square"
            strokeLinejoin="round"
          />
          <path
            d="M32 7.83325C36.0815 13.2161 42.7496 15.9781 49.4419 15.058C48.5218 21.7503 51.2838 28.4184 56.6666 32.4999C51.2838 36.5815 48.5218 43.2496 49.4419 49.9419C42.7496 49.0217 36.0815 51.7838 32 57.1666C27.9184 51.7838 21.2503 49.0217 14.558 49.9419C15.4782 43.2496 12.7161 36.5815 7.33331 32.4999C12.7161 28.4184 15.4782 21.7503 14.558 15.058C21.2503 15.9781 27.9184 13.2161 32 7.83325Z"
            stroke="#4EF432"
            strokeWidth={4}
            strokeLinecap="square"
          />
        </svg>
      ),
      text: "Great prices and regular discounts",
    },
    {
      originalIndex: 3,
      svg: (
        <svg
          width="65"
          height="64"
          viewBox="0 0 65 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M25.5312 28.5224L30.5766 33.5758L40.9712 23.1758"
            stroke="#4EF432"
            strokeWidth={4}
            strokeLinecap="square"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M32.5017 56C32.5017 56 53.4826 49.6472 53.4826 32.134V8H11.5209V32.134C11.5209 49.6472 32.5017 56 32.5017 56Z"
            stroke="#4EF432"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </svg>
      ),
      text: "Only official and licensed games",
    },
    {
      originalIndex: 4,
      svg: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M49.4615 49.3934C44.5148 54.3408 38.0034 56.7364 31.5326 56.5965C22.7454 56.4066 7.33337 56.5445 7.33337 56.5445C7.33337 56.5445 7.46852 40.9519 7.46188 32.0119C7.4572 25.7119 9.85592 19.4131 14.671 14.5991C24.2693 4.99733 39.8633 4.99733 49.4615 14.5966C59.0771 24.2132 59.0598 39.7942 49.4615 49.3934Z"
            stroke="#4EF432"
            strokeWidth={4}
            strokeLinecap="round"
          />
          <path
            d="M22.1725 33.0156H21.9092"
            stroke="#4EF432"
            strokeWidth={4}
            strokeLinecap="square"
          />
          <path
            d="M32.1305 33.0158H31.8672"
            stroke="#4EF432"
            strokeWidth={4}
            strokeLinecap="square"
          />
          <path
            d="M42.0887 33.0156H41.8254"
            stroke="#4EF432"
            strokeWidth={4}
            strokeLinecap="square"
          />
        </svg>
      ),
      text: "Support that's always ready to help",
    },
  ];

  const [isBelowLg, setIsBelowLg] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1199px)");
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsBelowLg(e.matches);
    };

    handleMediaChange(mediaQuery);
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const orderedItems = isBelowLg
    ? [
        CONTENT_ITEMS[0],
        CONTENT_ITEMS[1],
        CONTENT_ITEMS[3],
        CONTENT_ITEMS[4],
        CONTENT_ITEMS[2],
      ]
    : CONTENT_ITEMS;

  return (
    <section className="advantages__wrapper">
      <div className="w-full overflow-hidden">
        <div className={`${BASE_STYLES.advantages} advantages`}>
          {orderedItems.map((item) => (
            <div
              key={item.originalIndex}
              className={`${BASE_STYLES.bgAdvantages} ${
                item.originalIndex === 0 ||
                item.originalIndex === 1 ||
                item.originalIndex === 2
                  ? "skew-x-[20deg]"
                  : item.originalIndex === 4 || item.originalIndex === 3
                  ? "skew-x-[-20deg] xl:skew-x-[20deg]"
                  : ""
              } ${item.originalIndex === 2 ? "col-span-2 xl:col-span-1" : ""}`}>
              <div
                className={`${BASE_STYLES.advantage} ${
                  item.originalIndex === 0
                    ? "skew-x-[-20deg] px-[40px] pl-[90px] 2xl:px-[30px] 2xl:pl-[90px]"
                    : item.originalIndex === 1
                    ? "skew-x-[-20deg] px-[25px] pr-[85px] sm:pl-[40px] 2xl:px-[50px] xl:pr-[40px]"
                    : item.originalIndex === 2
                    ? "skew-x-[-20deg] xl:skew-x-[-20deg] px-[50px] pr-[75px] xl:px-[50px] mainCustom:px-[65px]"
                    : item.originalIndex === 3
                    ? "skew-x-[20deg] xl:skew-x-[-20deg] px-[25px] pl-[85px] sm:pr-[40px] xl:px-[50px] mainCustom:px-[65px]"
                    : item.originalIndex === 4
                    ? "skew-x-[20deg] xl:skew-x-[-20deg] px-[25px] pr-[85px] sm:pl-[40px] 2xl:px-[30px] 2xl:pr-[90px] mainCustom:px-[65px] mainCustom:pr-[105px]"
                    : ""
                }`}>
                {React.cloneElement(item.svg, { className: BASE_STYLES.svg })}
                <span className={BASE_STYLES.text}>{item.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;
