"use client";

import Heading from "@/components/ui/Heading";
import AboutUs from "@/components/Sections/About/AboutUs";
import Stats from "@/components/Sections/About/Stats";
import Platforms from "@/components/Sections/About/Platforms";
import Partners from "@/components/Sections/About/Partners";
import Advantages2 from "@/components/Sections/About/Advantages2";
import Faq from "@/components/Sections/About/Faq";

export default function About() {
  return (
    <div className="flex flex-col justify-around gap-[48px] sm:gap-[80px] mt-[24px] sm:mt-[80px]">
      <div>
        <Heading variant="h3" className="mb-[24px] sm:mb-[40px]">
          Home / About FriedKeys
        </Heading>
        <Heading variant="h1">About FriedKeys</Heading>
      </div>
      <AboutUs />
      <Stats />
      <Platforms />
      <Advantages2 />
      <Partners />
      <Faq />
    </div>
  );
}
