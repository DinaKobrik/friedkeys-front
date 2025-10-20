"use client";

import Heading from "@/components/ui/Heading";
import React, { useState, useEffect, useRef } from "react";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  categories: string[];
}

const QuickMenuSection: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const menus: Record<string, MenuItem> = {
    PC: {
      icon: (
        <svg
          width="34"
          height="32"
          viewBox="0 0 34 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[20px] h-[20px] lg:w-[40px] lg:h-[40px]">
          <path
            d="M3.66668 21.6667H30.3334V3.33333H3.66668V21.6667ZM18.6667 25V28.3333H25.3334V31.6667H8.66668V28.3333H15.3334V25H1.98668C1.76783 24.9987 1.55138 24.9542 1.34975 24.8691C1.14811 24.784 0.965262 24.6599 0.811669 24.504C0.658077 24.3481 0.536764 24.1634 0.454685 23.9605C0.372605 23.7576 0.331373 23.5405 0.33335 23.3217V1.67833C0.33335 0.751667 1.09168 0 1.98668 0H32.0133C32.9267 0 33.6667 0.748333 33.6667 1.67833V23.3217C33.6667 24.2483 32.9083 25 32.0133 25H18.6667Z"
            fill="white"
          />
        </svg>
      ),
      label: "PC",
      categories: ["PC Games", "PC topup cards", "PC Plus", "PC Now"],
    },
    PlayStation: {
      icon: (
        <svg
          width="37"
          height="29"
          viewBox="0 0 37 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[20px] h-[20px] lg:w-[40px] lg:h-[40px]">
          <path
            d="M36.64 22.3516C35.9234 23.2566 34.17 23.9016 34.17 23.9016L21.115 28.5966V25.1333L30.7217 21.705C31.8134 21.315 31.98 20.7616 31.0934 20.4716C30.21 20.18 28.6084 20.2633 27.5167 20.6566L21.1167 22.9133V19.3216L21.4833 19.1966C21.4833 19.1966 23.3333 18.54 25.935 18.2516C28.535 17.965 31.7217 18.2916 34.2217 19.24C37.0383 20.1316 37.355 21.4466 36.64 22.3516ZM22.3567 16.4566V7.60329C22.3567 6.56329 22.1667 5.60663 21.1917 5.33663C20.4467 5.09663 19.9834 5.78996 19.9834 6.82829V29L14.01 27.1016V0.666626C16.55 1.13829 20.25 2.25496 22.2383 2.92496C27.2967 4.66329 29.0117 6.82829 29.0117 11.7033C29.0117 16.455 26.0817 18.2566 22.3584 16.4566H22.3567ZM3.05168 24.7733C0.160018 23.9566 -0.321649 22.2566 0.996684 21.2783C2.21502 20.375 4.28668 19.695 4.28668 19.695L12.85 16.645V20.1216L6.68835 22.33C5.60002 22.72 5.43168 23.2733 6.31668 23.5633C7.20168 23.855 8.80502 23.7716 9.89502 23.38L12.85 22.3066V25.415L12.2617 25.515C9.30502 25.9983 6.15502 25.7966 3.05168 24.7733Z"
            fill="white"
          />
        </svg>
      ),
      label: "PlayStation",
      categories: [
        "PSN Games",
        "PSN topup cards",
        "PlayStation Plus",
        "PlayStation Now",
        "Addons & Season Passes",
      ],
    },
    Xbox: {
      icon: (
        <svg
          width="41"
          height="40"
          viewBox="0 0 41 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[20px] h-[20px] lg:w-[40px] lg:h-[40px]">
          <path
            d="M18.5056 39.9397C15.4244 39.6446 12.3049 38.5381 9.62517 36.7897C7.37961 35.3246 6.87251 34.7223 6.87251 33.5204C6.87251 31.1061 9.52708 26.8775 14.0689 22.0569C16.6483 19.3191 20.2413 16.1101 20.6299 16.197C21.3851 16.3659 27.4243 22.2566 29.685 25.0297C33.2601 29.4147 34.9036 33.0051 34.0687 34.6059C33.4339 35.8227 29.4955 38.2009 26.6021 39.1146C24.2174 39.8676 21.0855 40.1868 18.5056 39.9397ZM3.83963 31.0102C1.97363 28.1475 1.03086 25.3292 0.575685 21.253C0.425386 19.907 0.479245 19.1371 0.916977 16.3745C1.46255 12.9312 3.42342 8.94779 5.7796 6.49632C6.78311 5.45222 6.87273 5.42678 8.09595 5.83885C9.5814 6.33926 11.1677 7.43485 13.6279 9.65944L15.0633 10.9574L14.2795 11.9203C10.6409 16.3904 6.79985 22.7265 5.35227 26.6465C4.56531 28.7776 4.2479 30.9168 4.5865 31.8074C4.81511 32.4087 4.60513 32.1846 3.83963 31.0102ZM36.5938 31.4971C36.7782 30.5972 36.545 28.9445 35.9986 27.2776C34.8152 23.6676 30.8596 16.9519 27.2274 12.3858L26.084 10.9484L27.321 9.81257C28.9362 8.32946 30.0576 7.44139 31.2677 6.68722C32.2225 6.0921 33.587 5.56526 34.1735 5.56526C34.5351 5.56526 35.8081 6.8864 36.8358 8.32819C38.4275 10.5612 39.5985 13.2681 40.1917 16.0861C40.575 17.9068 40.607 21.8042 40.2535 23.6205C39.9633 25.111 39.3508 27.0445 38.7532 28.3558C38.3055 29.3383 37.1918 31.2465 36.7038 31.8674C36.4529 32.1867 36.4527 32.186 36.5938 31.4971ZM18.8355 4.88358C17.1595 4.03253 14.5741 3.11897 13.1459 2.87318C12.6452 2.78702 11.7912 2.73897 11.2479 2.7664C10.0696 2.8259 10.1222 2.76428 12.0125 1.87119C13.5841 1.12869 14.895 0.692067 16.6746 0.318402C18.6765 -0.101944 22.4394 -0.106877 24.4095 0.308262C26.5373 0.756647 29.0428 1.68905 30.4547 2.5579L30.8743 2.81614L29.9116 2.76752C27.9984 2.67091 25.2102 3.44383 22.2167 4.90062C21.3138 5.34002 20.5283 5.69097 20.4711 5.68049C20.414 5.67001 19.6779 5.3114 18.8355 4.88358Z"
            fill="white"
          />
        </svg>
      ),
      label: "Xbox",
      categories: ["Xbox Games", "Xbox topup cards", "Xbox Plus", "Xbox Now"],
    },
    Nintendo: {
      icon: (
        <svg
          width="41"
          height="40"
          viewBox="0 0 41 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[20px] h-[20px] lg:w-[40px] lg:h-[40px]">
          <path
            d="M24.1262 40H30.2525C35.8775 40 40.5 35.3775 40.5 29.7525V10.2475C40.5 4.6225 35.8775 0 30.2525 0H24.0025C23.8787 0 23.7488 0.12375 23.7488 0.2475V39.7525C23.7488 39.8763 23.8725 40 24.1262 40ZM31.75 18.0012C34.0025 18.0012 35.7475 19.8763 35.7475 21.9988C35.7475 24.2513 33.8725 25.9963 31.75 25.9963C29.4975 25.9963 27.7525 24.2513 27.7525 21.9988C27.6225 19.7525 29.4975 18.0012 31.75 18.0012ZM19.4975 0H10.7475C5.1225 0 0.5 4.6225 0.5 10.2475V29.7525C0.5 35.3775 5.1225 40 10.7475 40H19.4975C19.6213 40 19.7512 39.8763 19.7512 39.7525V0.2475C19.7512 0.12375 19.6275 0 19.4975 0ZM16.6262 36.7512H10.7475C6.87375 36.7512 3.74875 33.6263 3.74875 29.7525V10.2475C3.74875 6.37375 6.87375 3.24875 10.7475 3.24875H16.5025L16.6262 36.7512ZM6.75 11.9987C6.75 14.1213 8.3775 15.7487 10.5 15.7487C12.6225 15.7487 14.25 14.1213 14.25 11.9987C14.25 9.87625 12.6225 8.24875 10.5 8.24875C8.3775 8.24875 6.75 9.87625 6.75 11.9987Z"
            fill="white"
          />
        </svg>
      ),
      label: "Nintendo",
      categories: [
        "Nintendo Games",
        "Nintendo topup cards",
        "Nintendo Plus",
        "Nintendo Now",
      ],
    },
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sectionRef.current &&
      !sectionRef.current.contains(event.target as Node)
    ) {
      setActiveMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (menuKey: string) => {
    setActiveMenu((prev) => (prev === menuKey ? null : menuKey));
  };

  if (loading) {
    return (
      <section className="hide-scrollbar h-[44px] sm:h-[66px] mt-[-48px] lg:mt-0">
        <p className="text-center text-gray-68" aria-live="polite">
          Loading menu...
        </p>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="hide-scrollbar h-[44px] sm:h-[66px] mt-[-48px] lg:mt-[-90px]">
      <div className="grid grid-cols-2 xs:flex xs:justify-between lg:grid lg:grid-cols-4 relative quick-menu w-full sm:w-[calc(100%+46px)] lg:w-[calc(100%+24px)] sm:ml-[-23px] lg:ml-[-12px] gap-x-[12px] sm:gap-0 lg:gap-[8px] xl:gap-[18px] h-full">
        {Object.entries(menus).map(([key, { icon, label, categories }]) => (
          <div key={key} className="lg:relative lg:w-full quick-menu__button">
            <button
              onClick={() => toggleMenu(key)}
              aria-expanded={activeMenu === key}
              aria-label={`Toggle ${label} categories`}
              className="xs:w-full lg:skew-x-[-20deg] h-[44px] sm:h-[64px] flex items-center justify-center lg:bg-primary-10 sm:py-[12px] sm:px-[8px] lg:px-[30px] lg:border-[1px] border-primary-main transition-all duration-200 lg:hover:bg-primary-20">
              <div className="lg:skew-x-[20deg] flex gap-[4px] lg:gap-[16px] items-center justify-center uppercase text-white m-0 font-usuzi-condensed text-[16px] leading-[16px] sm:text-[26px] sm:leading-[28px]">
                {icon}
                {label}
              </div>
            </button>
            {activeMenu === key && (
              <div
                className={`quick-menu__menu w-full flex flex-col bg-2 p-[12px] sm:p-[24px] lg:p-[32px] min-w-[300px] lg:max-w-[400px] absolute top-[92px] xs:top-[60px] lg:top-[84px] ${
                  key === "Nintendo"
                    ? "min-w-[240px] left-0 lg:-left-[70px] xl:-left-[40px] 2xl:left-0"
                    : "left-0"
                } z-[900]`}>
                {categories.map((category) => (
                  <Heading variant="h3" key={category}>
                    <a
                      href=""
                      aria-label={`Go to ${category} category`}
                      className="quick-menu__link--active relative w-full block py-[10px] focus:outline-none">
                      {category}
                    </a>
                  </Heading>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuickMenuSection;
