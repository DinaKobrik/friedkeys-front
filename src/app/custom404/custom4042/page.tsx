"use client";

import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";

export default function Custom404() {
  return (
    <main>
      <section className="min-h-screen flex flex-col items-center justify-center py-[80px]">
        <div className="font-usuzi-bold text-[120px] leading-[100px] sm:text-[240px] sm:leading-[240px] text-primary-main mb-[32px] sm:mb-[40px] flex justify-center items-center gap-[20px]">
          4
          <svg
            width="142"
            height="142"
            viewBox="0 0 142 142"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[70px] h-[70px] sm:w-[142px] sm:h-[142px]">
            <g clipPath="url(#clip0_2441_32553)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M81.2 60.8H101.6V50.6H81.2V60.8ZM96.5 101.6H86.3C86.3 81.2 55.7 81.2 55.7 101.6H45.5C45.5 65.9 96.5 65.9 96.5 101.6ZM40.4 60.8H60.8V50.6H40.4V60.8ZM30.2 111.8H111.8V30.2H30.2V111.8ZM20 122H122V20H20V122Z"
                fill="#4EF432"
              />
            </g>
            <rect
              x="10"
              y="10"
              width="122"
              height="122"
              stroke="#4EF432"
              strokeWidth="20"
            />
            <defs>
              <clipPath id="clip0_2441_32553">
                <rect x="20" y="20" width="102" height="102" fill="white" />
              </clipPath>
            </defs>
          </svg>
          4
        </div>
        <Heading variant="h2" className="mb-[8px] text-center">
          Game over... Page not found!
        </Heading>
        <Heading variant="h3" className="mb-[32px] sm:mb-[56px] text-center">
          It may have been moved or deleted. Try the homepage instead
        </Heading>
        <Button
          variant="primary"
          className="max-w-[calc(100%-20px)] sm:max-w-[500px]"
          onClick={() => (window.location.href = "/")}>
          Home
        </Button>
      </section>
    </main>
  );
}
