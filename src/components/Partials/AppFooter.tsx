"use client";
import React, { useState } from "react";
import Link from "next/link";
import InstagramIcon from "../icons/InstagramIcon";
import DiscordIcon from "../icons/DiscordIcon";
import TikTokIcon from "../icons/TikTokIcon";
import TwitchIcon from "../icons/TwitchIcon";
import YouTubeIcon from "../icons/YouTubeIcon";
import Logo from "@/components/ui/Logo";

function AppFooter() {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [activeIcon, setActiveIcon] = useState<string | null>(null);

  const icons = [
    { name: "instagram", component: InstagramIcon, label: "Instagram" },
    { name: "discord", component: DiscordIcon, label: "Discord" },
    { name: "tiktok", component: TikTokIcon, label: "TikTok" },
    { name: "twitch", component: TwitchIcon, label: "Twitch" },
    { name: "youtube", component: YouTubeIcon, label: "YouTube" },
  ];
  return (
    <div className="mt-[56px] mb-[56px] sm:mt-[120px] sm:mb-[160px] mx-auto flex flex-col sm:flex-row sm:flex-wrap sm:justify-between gap-[40px]">
      <Logo />
      <div className="flex gap-[16px] flex-col sm:flex-row sm:gap-[24px] sm:items-start pt-0 sm:pt-[35px]">
        <ul className="m-0 p-0 flex flex-col gap-[16px] sm:gap-[30px]">
          <li>
            <Link
              href=""
              aria-label="Terms of Use"
              className="text-white text-[16px] sm:text-[24px] no-underline hover:text-primary-main focus:outline-none focus:text-primary-main transition-colors duration-300 ease-in-out">
              Terms of Use
            </Link>
          </li>
          <li>
            <Link
              href=""
              aria-label="Privacy Policy"
              className="text-white text-[16px] sm:text-[24px] no-underline hover:text-primary-main focus:outline-none focus:text-primary-main transition-colors duration-300 ease-in-out">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link
              href=""
              aria-label="Support"
              className="text-white text-[16px] sm:text-[24px] no-underline hover:text-primary-main focus:outline-none focus:text-primary-main transition-colors duration-300 ease-in-out">
              Support
            </Link>
          </li>
        </ul>
        <ul className="m-0 p-0 flex flex-col gap-[16px] sm:gap-[30px]">
          <li>
            <Link
              href="/faq"
              aria-label="FAQs"
              className="text-white text-[16px] sm:text-[24px] no-underline hover:text-primary-main focus:outline-none focus:text-primary-main  transition-colors duration-300 ease-in-out">
              FAQs
            </Link>
          </li>
          <li>
            <Link
              href=""
              aria-label="User's feedbacks"
              className="text-white text-[16px] sm:text-[24px] no-underline hover:text-primary-main focus:outline-none focus:text-primary-main transition-colors duration-300 ease-in-out">
              {`User's feedbacks`}
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-wrap gap-[23px] sm:gap-[16px] items-start justify-center sm:pr-[80px] sm:justify-end sm:order-2">
        {icons.map(({ name, component: Icon, label }) => (
          <Link
            key={name}
            href=""
            className=" link-icon w-[44px] h-[44px] p-[12px] sm:w-[64px] sm:h-[64px] sm:p-[16px] rounded-full bg-2"
            aria-label={label}
            onMouseEnter={() => setHoveredIcon(name)}
            onMouseLeave={() => setHoveredIcon(null)}
            onMouseDown={() => setActiveIcon(name)}
            onMouseUp={() => setActiveIcon(null)}
            onTouchStart={() => setActiveIcon(name)}
            onTouchEnd={() => setActiveIcon(null)}>
            <Icon
              className="w-full h-full"
              isHovered={hoveredIcon === name}
              isActive={activeIcon === name}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              onMouseDown={() => {}}
              onMouseUp={() => {}}
              onTouchStart={() => {}}
              onTouchEnd={() => {}}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AppFooter;
