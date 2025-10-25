"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Link from "next/link";

const Genres = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const genres = [
    { name: "Action", href: "/genres/action" },
    { name: "Adventure", href: "/genres/adventure" },
    { name: "Platformer", href: "/genres/platformer" },
    { name: "Racing", href: "/genres/racing" },
    { name: "Sports", href: "/genres/sports" },
    { name: "Simulation", href: "/genres/simulation" },
    { name: "Stealth", href: "/genres/stealth" },
    { name: "Survival", href: "/genres/survival" },
    { name: "Horror", href: "/genres/horror" },
    { name: "Sandbox", href: "/genres/sandbox" },
    { name: "Platformer", href: "/genres/platformer-2" },
    { name: "Wargame", href: "/genres/wargame" },
  ];

  if (loading) {
    return (
      <section aria-label="Genres Section">
        <p className="text-center text-gray-68" aria-live="polite">
          Loading genres...
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Genres Section">
      <Heading
        variant="h1"
        className="mb-[24px] sm:mb-[30px]"
        aria-label="Genres Title">
        Genres
      </Heading>
      <div className="ganres__wrapper relative mb-[30px]">
        <div className="ganres__container overflow-hidden max-w-[calc(100%+2px)]">
          <div className="ganres relative grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 xl:gap-[20px] gap-[8px] w-[calc(100%+100px)]">
            {genres.map((genre, index) => (
              <Link
                href={`/all-games?genre=${encodeURIComponent(genre.name)}`}
                key={index}
                className="ganer cursor-pointer relative flex justify-center items-center overflow-hidden w-[calc(100%-2px)]">
                <div className="ganer-text font-usuzi-halftone flex justify-center items-center relative overflow-hidden w-[calc(100%-3px)] h-[calc(100%-2px)] py-[27px] px-[25px] sm:px-[35px] lg:py-[81px] lg:px-[51px] bg-2 text-[16px] xs:text-[20px] leading-[26px] lg:text-[28px] lg:leading-[33px] uppercase text-white z-10">
                  <span className="relative transition-all duration-500 ease-in-out">
                    {genre.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Button
        variant="primary"
        className="max-w-[calc(100%-20px)] sm:max-w-[261px]"
        aria-label="View all genres"
        onClick={() => {
          window.location.href = "/all-games";
        }}>
        view all genres
      </Button>
    </section>
  );
};

export default Genres;
