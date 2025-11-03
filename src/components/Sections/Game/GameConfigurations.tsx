"use client";

import React, { useState, useEffect } from "react";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";

const GameConfigurations: React.FC = () => {
  const minimumSpecs = [
    { category: "OS", value: "Windows 10/11" },
    { category: "Processor", value: "Intel Core i7 8700k/AMD Ryzen 5 3600" },
    { category: "Memory", value: "16 GB RAM" },
    {
      category: "Graphics",
      value:
        "Nvidia GeForce GTX 1070 8GB/AMD Radeon RX 5700 8GB/Intel Arc A580 8GB (REBAR ON)",
    },
    { category: "DirectX", value: "Version 12" },
    { category: "Storage", value: "115 GB available space" },
  ];

  const recommendedSpecs = [
    { category: "OS", value: "Windows 10/11" },
    { category: "Processor", value: "Intel Core i5 11600k/AMD Ryzen 5 5600x" },
    { category: "Memory", value: "16 GB RAM" },
    {
      category: "Graphics",
      value:
        "Nvidia GeForce RTX 3060Ti 8GB/AMD Radeon RX 6700 XT 12GB/Intel Arc B580 12GB (REBAR ON)",
    },
    { category: "DirectX", value: "Version 12" },
    { category: "Storage", value: "115 GB available space" },
  ];

  const [isMinimum, setIsMinimum] = useState(true);

  const handleSpecToggle = (type: "minimum" | "recommended") => {
    setIsMinimum(type === "minimum");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992 && !isMinimum) {
        setIsMinimum(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMinimum]);

  return (
    <section aria-label="Game Configurations Section">
      <Heading
        variant="h1"
        className="mb-[24px] sm:mb-[30px]"
        aria-label="Game Configurations Title">
        Configurations
      </Heading>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-[18px]">
        <div
          className="bg-2 card-corner p-[24px] pb-[40px] sm:p-[40px] lg:p-[24px] xl:p-[30px] sm:pt-[24px] h-full"
          aria-label={
            isMinimum
              ? "Minimum System Requirements"
              : "Recommended System Requirements"
          }>
          <div className="w-full overflow-hidden mb-[32px] lg:hidden">
            <div className="grid grid-cols-2 skew-x-[-20deg] gap-[10px] w-[calc(100%+24px)] ml-[-12px] mx-auto pb-[2px]">
              <button
                className={`bg-DLS block border-primary-main py-[12px] px-[6px] font-usuzi-condensed text-[13px] xs:text-[17px] leading-[19px] sm:text-[26px] sm:leading-[28px] text-white ${
                  isMinimum ? "border-[1px] configurations__button" : ""
                }`}
                onClick={() => handleSpecToggle("minimum")}
                aria-label="Show minimum system requirements">
                <span className="block skew-x-[20deg]">Minimum</span>
              </button>
              <button
                className={`bg-DLS block border-primary-main py-[12px] px-[6px] font-usuzi-condensed text-[13px] xs:text-[17px] leading-[19px] sm:text-[26px] sm:leading-[28px] text-white ${
                  !isMinimum ? "border-[1px] configurations__button" : ""
                }`}
                onClick={() => handleSpecToggle("recommended")}
                aria-label="Show recommended system requirements">
                <span className="block skew-x-[20deg]">Recommended</span>
              </button>
            </div>
          </div>
          <Heading
            variant="h2"
            className="mb-[24px] text-center hidden lg:block"
            aria-label={isMinimum ? "Minimum Specs" : "Recommended Specs"}>
            {isMinimum ? "Minimum Specs" : "Recommended Specs"}
          </Heading>
          <div className="grid grid-cols-[auto_1fr] gap-x-[20px] gap-y-[24px]">
            {(isMinimum ? minimumSpecs : recommendedSpecs).map(
              (spec, index) => (
                <React.Fragment key={index}>
                  <Text
                    className="font-bold"
                    aria-label={`Category: ${spec.category}`}>
                    {spec.category}
                  </Text>
                  <Text aria-label={`${spec.category}: ${spec.value}`}>
                    {spec.value}
                  </Text>
                </React.Fragment>
              )
            )}
          </div>
        </div>
        <div
          className="bg-2 card-corner p-[24px] pb-[40px] sm:p-[40px] lg:p-[24px] xl:p-[30px] sm:pt-[24px] h-full hidden lg:block"
          aria-label="Recommended System Requirements">
          <Heading
            variant="h2"
            className="mb-[24px] text-center hidden lg:block"
            aria-label="Recommended Specs">
            Recommended Specs
          </Heading>
          <div className="grid grid-cols-[auto_1fr] gap-x-[20px] gap-y-[24px]">
            {recommendedSpecs.map((spec, index) => (
              <React.Fragment key={index}>
                <Text
                  className="font-bold"
                  aria-label={`Category: ${spec.category}`}>
                  {spec.category}
                </Text>
                <Text aria-label={`${spec.category}: ${spec.value}`}>
                  {spec.value}
                </Text>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameConfigurations;
