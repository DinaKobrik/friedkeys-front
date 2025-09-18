"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Heading from "@/components/ui/Heading";
import Image from "next/image";

const FullScreenIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 21C7.44772 21 3 21 3 21V16"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M21 16C21 16.5523 21 21 21 21L16 21"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M16 3C16.5523 3 21 3 21 3L21 8"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M3 8C3 7.44772 3 3 3 3L8 3"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const GameSlider: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const mediaItems = useMemo(
    () => [
      "/images/game-slider/game-slide1.png",
      "/images/game-slider/game-slide2.png",
      "/images/game-slider/game-slide3.png",
      "/images/game-slider/game-slide4.png",
      "/images/game-slider/game-slide5.png",
      "/images/game-slider/game-slide6.png",
      "/images/game-slider/game-slide7.png",
      "/images/game-slider/game-slide8.png",
      "/images/game-slider/game-video1.mp4",
      "/images/game-slider/game-video2.mp4",
    ],
    []
  );
  const totalSlides = mediaItems.length;
  const [slideWidth, setSlideWidth] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0);
  const [slideOffset, setSlideOffset] = useState(0);
  const [gap, setGap] = useState(24);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const moveLeft = () => {
    if (!sliderRef.current || !containerRef.current) return;
    const newSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
    setCurrentSlide(newSlide);
    sliderRef.current.style.transition = "transform 0.2s ease-in-out";
    sliderRef.current.style.transform = `translateX(${slideOffset}px)`;
    setTimeout(() => {
      if (sliderRef.current) {
        sliderRef.current.style.transition = "none";
        sliderRef.current.style.transform = `translateX(-${
          slideOffset * newSlide
        }px)`;
      }
    }, 200);
  };

  const moveRight = () => {
    if (!sliderRef.current || !containerRef.current) return;
    const newSlide = currentSlide + 1;
    if (newSlide >= totalSlides) {
      setCurrentSlide(0);
      sliderRef.current.style.transition = "transform 0.2s ease-in-out";
      sliderRef.current.style.transform = `translateX(0px)`;
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.style.transition = "none";
          sliderRef.current.style.transform = `translateX(0px)`;
        }
      }, 200);
    } else {
      setCurrentSlide(newSlide);
      sliderRef.current.style.transition = "transform 0.2s ease-in-out";
      sliderRef.current.style.transform = `translateX(-${
        slideOffset * newSlide
      }px)`;
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.style.transition = "none";
          sliderRef.current.style.transform = `translateX(-${
            slideOffset * newSlide
          }px)`;
        }
      }, 200);
    }
  };

  const handleDragStart = (
    e: React.MouseEvent | React.TouchEvent,
    isMain: boolean
  ) => {
    setIsDragging(true);
    setStartX("touches" in e ? e.touches[0].clientX : e.clientX);
    if (isMain && mainImageRef.current) {
      mainImageRef.current.style.cursor = "grabbing";
    }
    if (sliderRef.current) {
      sliderRef.current.style.transition = "none";
    }
  };

  const handleDragEnd = (
    e: React.MouseEvent | React.TouchEvent,
    isMain: boolean
  ) => {
    if (!isDragging || !sliderRef.current || !containerRef.current) return;
    setIsDragging(false);
    const currentX = "touches" in e ? e.changedTouches[0].clientX : e.clientX;
    const diffX = startX - currentX;
    const threshold = 50;

    if (diffX > threshold) {
      moveRight();
    } else if (diffX < -threshold) {
      moveLeft();
    }

    if (isMain && mainImageRef.current) {
      mainImageRef.current.style.cursor = "grab";
    }
  };

  const handleSlideClick = (index: number) => {
    if (!sliderRef.current || !containerRef.current) return;
    setCurrentSlide(index);
    sliderRef.current.style.transition = "transform 0.2s ease-in-out";
    sliderRef.current.style.transform = `translateX(-${slideOffset * index}px)`;

    setTimeout(() => {
      if (sliderRef.current) {
        sliderRef.current.style.transition = "none";
        sliderRef.current.style.transform = `translateX(-${
          slideOffset * index
        }px)`;
      }
    }, 200);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration > 0) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const seekTime = (clickX / width) * duration;
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const updateSlideWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const isMobile = window.innerWidth < 1200;
        const baseWidth = isMobile
          ? 268
          : (containerWidth - 3 * (window.innerWidth >= 576 ? 24 : 12)) / 4;
        setSlideWidth(baseWidth);
        setGap(window.innerWidth >= 576 ? 24 : 12);
        setSlideOffset(
          isMobile
            ? window.innerWidth >= 576
              ? 292
              : 280
            : baseWidth + (window.innerWidth >= 576 ? 24 : 12)
        );
        setSlideHeight(isMobile ? 149 : baseWidth * (2 / 3));
      }
    };

    if (typeof window !== "undefined") {
      updateSlideWidth();
      window.addEventListener("resize", updateSlideWidth);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", updateSlideWidth);
      }
    };
  }, []);

  useEffect(() => {
    if (sliderRef.current && containerRef.current) {
      const adjustedIndex = Math.min(currentSlide, totalSlides - 1);
      sliderRef.current.style.transform = `translateX(-${
        slideOffset * adjustedIndex
      }px)`;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  }, [currentSlide, totalSlides, slideOffset]);

  useEffect(() => {
    const mainImageElement = mainImageRef.current;

    if (mainImageElement) {
      const handleMouseEnter = () => setShowControls(true);
      const handleMouseLeave = () => {
        const timer = setTimeout(() => setShowControls(false), 1000);
        return () => clearTimeout(timer);
      };

      mainImageElement.addEventListener("mouseenter", handleMouseEnter);
      mainImageElement.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        mainImageElement.removeEventListener("mouseenter", handleMouseEnter);
        mainImageElement.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  useEffect(() => {
    if (mediaItems[currentSlide].endsWith(".mp4") && videoRef.current) {
      const videoElement = videoRef.current;
      const updateTime = () => {
        setCurrentTime(videoElement.currentTime);
        if (!isNaN(videoElement.duration)) {
          setDuration(videoElement.duration);
        }
      };

      videoElement.addEventListener("timeupdate", updateTime);
      videoElement.addEventListener("loadedmetadata", () => {
        setDuration(videoElement.duration);
      });

      const handleEnded = () => {
        if (videoElement) {
          videoElement.pause();
          setIsPlaying(false);
          setShowControls(true);
        }
      };

      videoElement.addEventListener("ended", handleEnded);

      if (videoElement.readyState > 0) {
        setDuration(videoElement.duration);
      }

      return () => {
        if (videoElement) {
          videoElement.removeEventListener("timeupdate", updateTime);
          videoElement.removeEventListener("loadedmetadata", () => {
            setDuration(videoElement.duration);
          });
          videoElement.removeEventListener("ended", handleEnded);
        }
      };
    }
  }, [currentSlide, mediaItems]);

  return (
    <section className="relative">
      <Heading variant="h1" className="mb-[24px] sm:mb-[40px]">
        Video & Screenshots
      </Heading>
      <div
        ref={mainImageRef}
        className="relative w-full h-[196px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[700px] mainCustom:h-[880px] mb-[16px] sm:mb-[40px] cursor-grab"
        onMouseDown={(e) => handleDragStart(e, true)}
        onMouseUp={(e) => handleDragEnd(e, true)}
        onMouseLeave={(e) => handleDragEnd(e, true)}
        onTouchStart={(e) => handleDragStart(e, true)}
        onTouchEnd={(e) => handleDragEnd(e, true)}>
        {mediaItems[currentSlide].endsWith(".mp4") ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={mediaItems[currentSlide]}
              className="w-full h-full object-cover rounded-[2px]"
              muted
              onClick={togglePlay}
              preload="metadata"
            />
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-DLS rounded-full p-[11px] pl-[14px] pr-[10px] sm:p-[37px] sm:pl-[42px] sm:pr-[38px] flex items-center justify-center"
                aria-label="Play video">
                <svg
                  width="28"
                  height="32"
                  viewBox="0 0 28 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[24px] h-[24px]">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24.9511 14.5708C26.03 15.2182 26.03 16.7818 24.9511 17.4292L4.85717 29.4855C3.74629 30.152 2.33301 29.3518 2.33301 28.0564L2.33301 3.94365C2.33301 2.64816 3.74629 1.84797 4.85717 2.5145L24.9511 14.5708Z"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            {(showControls || !isPlaying) && (
              <div
                className="absolute bottom-[4px] left-[4px] right-[4px] flex gap-[12px] items-center transition-opacity duration-500"
                style={{ opacity: showControls ? 1 : 0 }}>
                <button onClick={togglePlay}>
                  {isPlaying ? (
                    <svg
                      width="28"
                      height="32"
                      viewBox="0 0 28 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <rect
                        x="8"
                        y="4"
                        width="6"
                        height="24"
                        rx="2"
                        fill="white"
                        stroke="black"
                        strokeWidth="3"
                      />
                      <rect
                        x="16"
                        y="4"
                        width="6"
                        height="24"
                        rx="2"
                        fill="white"
                        stroke="black"
                        strokeWidth="3"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="28"
                      height="32"
                      viewBox="0 0 28 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M24.9511 14.5708C26.03 15.2182 26.03 16.7818 24.9511 17.4292L4.85717 29.4855C3.74629 30.152 2.33301 29.3518 2.33301 28.0564L2.33301 3.94365C2.33301 2.64816 3.74629 1.84797 4.85717 2.5145L24.9511 14.5708Z"
                        fill="white"
                        stroke="black"
                        strokeWidth="3"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
                <div
                  className="flex-1 cursor-pointer py-4"
                  onClick={handleSeek}>
                  <div className="w-full h-[4px] bg-[#D9D9D95A] rounded">
                    <div
                      className="h-[4px] bg-[#D9D9D9] rounded"
                      style={{
                        width: `${(currentTime / duration) * 100 || 0}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-[13px] sm:text-[20px] leading-[13px] sm:leading-[20px]">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                {typeof window !== "undefined" &&
                  window.matchMedia("(pointer: coarse)").matches && (
                    <button
                      onClick={handleFullScreen}
                      aria-label="Toggle full screen">
                      <FullScreenIcon />
                    </button>
                  )}
              </div>
            )}
          </div>
        ) : (
          <Image
            src={mediaItems[currentSlide]}
            alt={`Slide ${currentSlide + 1}`}
            width={1064}
            height={880}
            className="w-full h-full object-cover rounded-[2px] no-drag"
            draggable="false"
          />
        )}
      </div>
      <div className="relative">
        <div ref={containerRef} className="overflow-hidden">
          <div
            ref={sliderRef}
            className="flex gap-[12px] sm:gap-[24px] transition-transform duration-300 ease-in-out"
            style={{ width: `${totalSlides * (slideWidth + gap)}px` }}>
            {mediaItems.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 overflow-hidden cursor-pointer"
                style={{ width: `${slideWidth}px`, height: `${slideHeight}px` }}
                onClick={() => handleSlideClick(index)}
                onMouseDown={(e) => handleDragStart(e, false)}
                onMouseUp={(e) => handleDragEnd(e, false)}
                onMouseLeave={(e) => handleDragEnd(e, false)}
                onTouchStart={(e) => handleDragStart(e, false)}
                onTouchEnd={(e) => handleDragEnd(e, false)}>
                {item.endsWith(".mp4") ? (
                  <video
                    src={item}
                    className="w-full h-full object-cover rounded-[2px]"
                    muted
                  />
                ) : (
                  <Image
                    src={item}
                    alt={`Thumbnail ${index + 1}`}
                    width={slideWidth}
                    height={slideHeight}
                    className="w-full h-full object-cover rounded-[2px] no-drag"
                    draggable="false"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={moveLeft}
          className="hidden lg:flex absolute left-[20px] bodyCustom:left-[-104px] top-[50%] transform -translate-y-1/2 w-[64px] h-[64px] justify-center items-center p-[16px] rounded-full bg-DLS backdrop-blur-[10px] z-20"
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
          onClick={moveRight}
          className="hidden lg:flex absolute right-[20px] bodyCustom:right-[-104px] top-[50%] transform -translate-y-1/2 w-[64px] h-[64px] justify-center items-center p-[16px] rounded-full bg-DLS backdrop-blur-[10px] z-20"
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
    </section>
  );
};

export default GameSlider;
