"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      className="w-[135px] h-[24px] sm:w-[260px] sm:h-[48px] sm:ml-0 cursor-pointer">
      <Image
        src="/images/logo.png"
        alt="FriedKeys logo"
        width={296}
        height={54}
        className="object-contain w-full h-full"
      />
    </Link>
  );
};

export default Logo;
