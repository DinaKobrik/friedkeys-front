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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [windowSize, setWindowSize] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // === dynamic offset до 1920px ===
  const updateDynamicStyles = () => {
    if (typeof window === "undefined") return;
    const windowWidth = window.innerWidth;
    const scrollbarWidthValue =
      window.innerWidth - document.documentElement.clientWidth;
    const isTouchDevice = navigator.maxTouchPoints > 0;
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

    setWindowSize(windowWidth);
  };

  useEffect(() => {
    updateDynamicStyles();
    window.addEventListener("resize", updateDynamicStyles);
    return () => window.removeEventListener("resize", updateDynamicStyles);
  }, []);

  const handleDragStart = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!containerRef.current) return;
    let startX: number;
    if ("touches" in e) {
      startX = e.touches[0].clientX;
    } else {
      startX = (e as React.MouseEvent).clientX;
    }
    const scrollLeft = containerRef.current.scrollLeft;
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX;
      const walk = (currentX - startX) * 2;
      if (containerRef.current) {
        containerRef.current.scrollLeft = scrollLeft - walk;
      }
    };
    const handleTouchMove = (moveEvent: TouchEvent) => {
      const currentX = moveEvent.touches[0].clientX;
      const walk = (currentX - startX) * 2;
      if (containerRef.current) {
        containerRef.current.scrollLeft = scrollLeft - walk;
      }
    };
    const handleDragEndDocument = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleDragEndDocument);
      document.removeEventListener("touchend", handleDragEndDocument);
      if (containerRef.current) {
        containerRef.current.style.cursor = "grab";
        containerRef.current.style.userSelect = "auto";
      }
    };
    if ("touches" in e) {
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleDragEndDocument);
    } else {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleDragEndDocument);
    }
    containerRef.current.style.cursor = "grabbing";
    containerRef.current.style.userSelect = "none";
  };

  const handleDragEnd = () => {
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
      containerRef.current.style.userSelect = "auto";
    }
  };

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
      <section
        role="region"
        aria-label="User Feedbacks Section"
        className="flex flex-col gap-[16px] sm:gap-[40px]">
        <Heading variant="h2">Players Love FriedKeys — Here’s Why</Heading>
        <div
          className="mx-auto relative max-w-[1920px] overflow-hidden"
          style={{ marginLeft: dynamicMargin, marginRight: dynamicMargin }}>
          <UsersFeedbacks
            initialReviews={3}
            containerClassName="flex overflow-scroll hide-scrollbar gap-[4px] sm:gap-[12px] lg:gap-[24px] w-full"
            containerRef={containerRef}
            dynamicPadding={dynamicPadding}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            window.location.href = "/feedback";
          }}
          className="max-w-[270px] sm:max-w-[376px]">
          see all User&apos;s feedbacks
        </Button>
      </section>
      <Advantages2 />
      <Partners />
      <Faq />
    </main>
  );
}
