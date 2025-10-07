"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dynamicMargin, setDynamicMargin] = useState<string>("0px");
  const [dynamicPadding, setDynamicPadding] = useState<string>("0px");
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    const detectTouchDevice = () => {
      const isTouch =
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;
      setIsTouchDevice(isTouch);
    };

    const updateDynamicStyles = () => {
      if (typeof window === "undefined") return;
      const windowWidth = window.innerWidth;
      const scrollbarWidthValue =
        window.innerWidth - document.documentElement.clientWidth;
      let calculatedOffset: number;

      if (windowWidth < 576) {
        calculatedOffset = 16;
        setDynamicMargin(`-${calculatedOffset}px`);
        setDynamicPadding(`${calculatedOffset}px`);
      } else if (windowWidth >= 576 && windowWidth < 1700) {
        calculatedOffset = 46;
        setDynamicMargin(`-${calculatedOffset}px`);
        setDynamicPadding(`${calculatedOffset}px`);
      } else if (windowWidth >= 1607 && windowWidth <= 1609) {
        calculatedOffset = 146;
        setDynamicMargin(`-${calculatedOffset}px`);
        setDynamicPadding(`${calculatedOffset}px`);
      } else if (windowWidth > 1608 && windowWidth <= 1920) {
        calculatedOffset = isTouchDevice
          ? (windowWidth - 1608) / 2
          : (windowWidth - scrollbarWidthValue - 1608) / 2;
        setDynamicMargin(`-${calculatedOffset}px`);
        setDynamicPadding(`${calculatedOffset}px`);
      } else {
        calculatedOffset = 146;
        setDynamicMargin(`-${calculatedOffset}px`);
        setDynamicPadding(`${calculatedOffset}px`);
      }
    };

    detectTouchDevice();
    updateDynamicStyles();
    window.addEventListener("resize", updateDynamicStyles);
    return () => window.removeEventListener("resize", updateDynamicStyles);
  }, [isTouchDevice]);

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isTouchDevice) return;
    const startX = e.clientX;
    const scrollLeft = containerRef.current.scrollLeft;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX;
      const walk = (currentX - startX) * 2;
      if (containerRef.current) {
        containerRef.current.scrollLeft = scrollLeft - walk;
      }
    };

    const handleDragEndDocument = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleDragEndDocument);
      if (containerRef.current) {
        containerRef.current.style.cursor = "grab";
        containerRef.current.style.userSelect = "auto";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleDragEndDocument);
    containerRef.current.style.cursor = "grabbing";
    containerRef.current.style.userSelect = "none";
  };

  const handleDragEnd = () => {
    if (!containerRef.current || isTouchDevice) return;
    containerRef.current.style.cursor = "grab";
    containerRef.current.style.userSelect = "auto";
  };

  return (
    <main className="flex flex-col justify-around gap-[48px] sm:gap-[80px] mt-[24px] sm:mt-[80px]">
      <section aria-label="About FriedKeys Header">
        <Heading
          variant="h3"
          className="mb-[24px] sm:mb-[40px]"
          aria-label="Navigation breadcrumb">
          Home / About FriedKeys
        </Heading>
        <Heading variant="h1" aria-label="About FriedKeys Title">
          About FriedKeys
        </Heading>
      </section>
      <AboutUs />
      <Stats />
      <Platforms />
      <section
        aria-label="User Feedbacks Section"
        className="flex flex-col gap-[16px] sm:gap-[40px]">
        <Heading variant="h2" aria-label="Players Love FriedKeys Title">
          Players Love FriedKeys — Here’s Why
        </Heading>
        <div
          className="mx-auto relative max-w-[1920px] overflow-hidden"
          style={{ marginLeft: dynamicMargin, marginRight: dynamicMargin }}>
          <UsersFeedbacks
            initialReviews={3}
            containerClassName="flex overflow-scroll hide-scrollbar gap-[4px] sm:gap-[12px] lg:gap-[24px] w-full"
            containerRef={containerRef}
            dynamicPadding={dynamicPadding}
            containerStyle={{
              cursor: isTouchDevice ? "auto" : "grab",
              userSelect: isTouchDevice ? "auto" : "none",
            }}
            {...(!isTouchDevice
              ? {
                  onMouseDown: handleDragStart,
                  onMouseUp: handleDragEnd,
                  onMouseLeave: handleDragEnd,
                }
              : {})}
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            window.location.href = "/feedback";
          }}
          className="max-w-[270px] sm:max-w-[376px]"
          aria-label="View all user feedbacks">
          see all User&apos;s feedbacks
        </Button>
      </section>
      <Advantages2 />
      <Partners />
      <Faq />
    </main>
  );
}
