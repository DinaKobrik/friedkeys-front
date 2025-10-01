"use client";

import Heading from "@/components/ui/Heading";
import AboutUs from "@/components/Sections/About/AboutUs";
import Stats from "@/components/Sections/About/Stats";
import Platforms from "@/components/Sections/About/Platforms";
import Partners from "@/components/Sections/About/Partners";
import Advantages2 from "@/components/Sections/About/Advantages2";
import Faq from "@/components/Sections/About/Faq";
import UsersFeedbacks from "@/components/Sections/Feedback/UsersFeedbacks";
import Button from "@/components/ui/Button";

export default function About() {
  return (
    <main className="flex flex-col justify-around gap-[48px] sm:gap-[80px] mt-[24px] sm:mt-[80px]">
      <section>
        <Heading variant="h3" className="mb-[24px] sm:mb-[40px]">
          Home / About FriedKeys
        </Heading>
        <Heading variant="h1">About FriedKeys</Heading>
      </section>
      <AboutUs />
      <Stats />
      <Platforms />
      <section className="flex flex-col gap-[16px] sm:gap-[40px]">
        <Heading variant="h2">Players Love FriedKeys — Here’s Why</Heading>
        <UsersFeedbacks
          initialReviews={3}
          containerClassName="flex overflow-scroll hide-scrollbar gap-[4px] sm:gap-[12px] lg:gap-[24px] w-full"
        />
        <Button
          variant="secondary"
          onClick={() => {
            window.location.href = "/feedback";
          }}
          className="max-w-[270px] sm:max-w-[376px]">{`see all User's feedbacks`}</Button>
      </section>
      <Advantages2 />
      <Partners />
      <Faq />
    </main>
  );
}
