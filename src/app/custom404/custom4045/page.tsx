"use client";

import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";

export default function Custom404() {
  return (
    <div className="min-h-screen py-[80px] flex flex-col items-center justify-center">
      <div className="card-corner relative max-w-[792px] w-full mx-auto flex flex-col items-center justify-center bg-2 px-[16px] sm:px-[25px] py-[35px] sm:pt-[56px] sm:pb-[64px] md:px-[40px]">
        <div className="font-usuzi-halftone text-[98px] leading-[70px] sm:text-[128px] sm:leading-[128px] text-primary-main mb-[8px] sm:mb-[40px]">
          404
        </div>
        <Heading variant="h2" className="mb-[8px] text-center">
          Game over... Page not found!
        </Heading>
        <Heading
          variant="h3"
          className="mb-[32px] sm:mb-[64px] text-center max-w-[500px]">
          It may have been moved or deleted. Try the homepage instead
        </Heading>
        <Button
          variant="primary"
          className="max-w-[500px]"
          onClick={() => (window.location.href = "/")}>
          Home
        </Button>
        <span
          className={`absolute w-1/2 h-1/5 -bottom-1/4 left-1/2 -translate-x-1/2 bg-[#4ef432] blur-[50px] z-[0]`}
        />
      </div>
    </div>
  );
}
