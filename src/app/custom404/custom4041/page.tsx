"use client";

import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";

export default function Custom404() {
  return (
    <main>
      <section className="min-h-[calc(100vh-520px)] flex flex-col items-center justify-center py-[80px]">
        <div className="font-usuzi-grad text-[120px] leading-[100px] sm:text-[150px] sm:leading-[150px] text-primary-main mb-[32px] sm:mb-[30px]">
          404
        </div>
        <Heading
          variant="h1"
          className="mb-[16px] sm:mb-[18px] text-center sm:text-left">
          Game over... Page not found!
        </Heading>
        <Heading variant="h3" className="mb-[40px] sm:mb-[60px]">
          It may have been moved or deleted. Try the homepage instead
        </Heading>
        <Button
          variant="primary"
          className="max-w-[calc(100%-20px)] sm:max-w-[375px]"
          onClick={() => (window.location.href = "/")}>
          Home
        </Button>
      </section>
    </main>
  );
}
