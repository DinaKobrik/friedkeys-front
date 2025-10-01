"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";

const Partners = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const checkInfiniteLoop = (wrapper: HTMLElement, position: number) => {
    const scrollWidth = wrapper.scrollWidth / 2;
    if (position <= -scrollWidth) {
      wrapper.style.transform = `translateX(0px)`;
    } else if (position >= 0) {
      wrapper.style.transform = `translateX(${-scrollWidth}px)`;
    }
  };

  const scrollLeft = () => {
    if (isScrolling.current) return;
    isScrolling.current = true;

    const slider = sliderRef.current;
    if (!slider) return;
    const wrapper = slider.querySelector(".slider-track") as HTMLElement;
    if (!wrapper) return;
    let currentPosition =
      parseInt(
        wrapper.style.transform.replace("translateX(", "").replace("px)", "")
      ) || 0;
    const stepWidth = 2924 / 6;

    if (currentPosition >= 0) {
      currentPosition = -2924 + stepWidth;
    } else {
      currentPosition += stepWidth;
    }

    wrapper.style.transform = `translateX(${currentPosition}px)`;
    checkInfiniteLoop(wrapper, currentPosition);

    requestAnimationFrame(() => {
      isScrolling.current = false;
    });
  };

  const scrollRight = () => {
    if (isScrolling.current) return;
    isScrolling.current = true;

    const slider = sliderRef.current;
    if (!slider) return;
    const wrapper = slider.querySelector(".slider-track") as HTMLElement;
    if (!wrapper) return;
    let currentPosition =
      parseInt(
        wrapper.style.transform.replace("translateX(", "").replace("px)", "")
      ) || 0;
    const stepWidth = 2924 / 6;

    if (currentPosition <= -2922) {
      currentPosition = -stepWidth;
    } else {
      currentPosition -= stepWidth;
    }

    wrapper.style.transform = `translateX(${currentPosition}px)`;
    checkInfiniteLoop(wrapper, currentPosition);

    requestAnimationFrame(() => {
      isScrolling.current = false;
    });
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const wrapper = slider.querySelector(".slider-track") as HTMLElement;
    if (!wrapper) return;

    wrapper.innerHTML += wrapper.innerHTML;

    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let animationId: number;
    let currentEvent: MouseEvent | TouchEvent | null = null;

    const startDragging = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      startPos = getPositionX(e);
      currentEvent = e;
      animationId = requestAnimationFrame(animation);
      slider.style.cursor = "grabbing";
    };

    const stopDragging = () => {
      isDragging = false;
      currentEvent = null;
      cancelAnimationFrame(animationId);
      slider.style.cursor = "grab";
    };

    const getPositionX = (e: MouseEvent | TouchEvent) => {
      return "touches" in e ? e.touches[0].clientX : e.clientX;
    };

    const animation = () => {
      if (isDragging && currentEvent) {
        const currentPosition = getPositionX(currentEvent);
        currentTranslate = currentPosition - startPos;
        setSliderPosition();
        animationId = requestAnimationFrame(animation);
      }
    };

    const setSliderPosition = () => {
      const currentPosition =
        parseInt(
          wrapper.style.transform.replace("translateX(", "").replace("px)", "")
        ) || 0;
      const sensitivity = 0.3;

      const adjustedPosition = currentPosition + currentTranslate * sensitivity;
      wrapper.style.transform = `translateX(${adjustedPosition}px)`;

      checkInfiniteLoop(wrapper, adjustedPosition);
    };

    slider.addEventListener("mousedown", startDragging);
    slider.addEventListener("touchstart", startDragging);
    slider.addEventListener("mouseup", stopDragging);
    slider.addEventListener("touchend", stopDragging);
    slider.addEventListener("mouseleave", stopDragging);
    slider.addEventListener("touchcancel", stopDragging);
    slider.addEventListener("mousemove", (e) => {
      if (isDragging) {
        currentEvent = e;
      }
    });
    slider.addEventListener("touchmove", (e) => {
      if (isDragging) {
        currentEvent = e;
      }
    });

    return () => {
      slider.removeEventListener("mousedown", startDragging);
      slider.removeEventListener("touchstart", startDragging);
      slider.removeEventListener("mouseup", stopDragging);
      slider.removeEventListener("touchend", stopDragging);
      slider.removeEventListener("mouseleave", stopDragging);
      slider.removeEventListener("touchcancel", stopDragging);
      slider.removeEventListener("mousemove", (e) => {
        if (isDragging) currentEvent = e;
      });
      slider.removeEventListener("touchmove", (e) => {
        if (isDragging) currentEvent = e;
      });
    };
  }, []);

  const logos = [
    "/images/partners/Steam.png",
    "/images/partners/Twitch.png",
    "/images/partners/XBOX.png",
    "/images/partners/PayPal.png",
    "/images/partners/PlayStation.png",
    "/images/partners/Discord.png",
  ];

  return (
    <section>
      <Heading variant="h2" className="mb-[8px] sm:mb-[24px]">
        Our Partners
      </Heading>
      <Text className="mb-[24px] sm:mb-[64px]">
        We work with trusted partners and publishers to ensure every key is
        legit, activated easily, and supported across regions
      </Text>
      <div
        ref={sliderRef}
        className="overflow-x-hidden slider-track__container mainCustom:w-[calc(100%+81px)] bodyCustom:w-[calc(100vw-15px)] mx-auto relative left-[-16px] sm:left-[-46px] bodyCustom:left-[-156px]">
        <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 left-1/2 w-[calc(100%-32px)] sm:w-[calc(100%-92px)] bodyCustom:w-full hidden md:flex justify-between max-w-[1608px] mx-auto z-20">
          <button
            onClick={scrollLeft}
            className="w-[64px] h-[64px] flex justify-center items-center p-[16px] rounded-full bg-DLS backdrop-blur-[10px] z-10"
            aria-label="Scroll left">
            <svg
              width="12"
              height="22"
              viewBox="0 0 12 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.6641 20.3334L1.33073 11.0001L10.6641 1.66675"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </button>
          <button
            onClick={scrollRight}
            className="w-[64px] h-[64px] flex justify-center items-center p-[16px] rounded-full bg-DLS backdrop-blur-[10px] z-10"
            aria-label="Scroll right">
            <svg
              width="12"
              height="22"
              viewBox="0 0 12 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.33588 1.66675L10.6693 11.0001L1.33588 20.3334"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </button>
        </div>
        <div className="slider-track flex items-center gap-[11px] sm:gap-[19px] xl:gap-[31px]">
          {logos.map((src, index) => {
            const altText =
              src.split("/").pop()?.replace(".png", "") ||
              `Partner ${index + 1}`;
            return (
              <div key={index} className="slide flex-shrink-0">
                <div className="skew-x-[20deg] bg-[#1010105A] px-[50px] sm:px-[72px] xl:px-[93px]">
                  <div className="skew-x-[-20deg] w-[94px] h-[80px] sm:w-[140px] sm:h-[126px] xl:w-[269px] xl:h-[260px] flex justify-center items-center py-[14px] sm:py-[32px] xl:py-[63px]">
                    <Image
                      src={src}
                      alt={altText}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-full h-full user-select-none object-contain"
                      draggable="false"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Partners;
