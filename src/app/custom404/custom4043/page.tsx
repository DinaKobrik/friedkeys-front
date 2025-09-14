"use client";

import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Image from "next/image";

export default function Custom404() {
  return (
    <main>
      <section className="min-h-screen flex flex-col items-center justify-center py-[80px]">
        <Image src="/images/404.png" alt="404" width={512} height={332} />
        <div className="font-usuzi-bold text-[70px] leading-[45px] sm:text-[96px] sm:leading-[60px] text-primary-main mb-[32px] sm:mb-[40px]">
          404
        </div>
        <Heading variant="h1" className="mb-[16px] text-center">
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
