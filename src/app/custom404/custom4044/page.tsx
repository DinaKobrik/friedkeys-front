"use client";

import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Image from "next/image";

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-[80px]">
      <div className="relative">
        <div className="font-usuzi-grad  text-[150px] leading-[100px] sm:text-[240px] sm:leading-[150px] lg:text-[430px] lg:leading-[270px] xl:text-[520px] xl:leading-[330px] mainCustom:text-[700px] mainCustom:leading-[430px] text-2">
          404
        </div>
        <Image
          src="/images/404.png"
          alt="404"
          width={512}
          height={332}
          className="absolute top-1/2 left-1/2 translate-x-[-50%] w-[150px] sm:w-[240px] lg:w-[320px] xl:w-[420px] mainCustom:w-[512px] translate-y-[-55%] md:translate-y-[-56%] lg:translate-y-[-63%] xl:translate-y-[-59%] mainCustom:translate-y-[-65%]"
        />
      </div>
      <Heading variant="h1" className="mb-[16px] text-center">
        Game over... Page not found!
      </Heading>
      <Heading variant="h3" className="mb-[32px] sm:mb-[56px] text-center">
        It may have been moved or deleted. Try the homepage instead
      </Heading>
      <Button
        variant="primary"
        className="max-w-[500px]"
        onClick={() => (window.location.href = "/")}>
        Home
      </Button>
    </div>
  );
}
