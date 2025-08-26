"use client";

import React, { useState, FormEvent, useEffect } from "react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const [previousPath, setPreviousPath] = useState(pathname);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(
        `/all-games?search=${encodeURIComponent(searchValue.trim())}`
      );
    } else {
      router.push("/all-games");
    }
  };

  const handleClearField = () => {
    setSearchValue("");
  };

  // Сброс поля при уходе со страницы /all-games
  useEffect(() => {
    if (previousPath === "/all-games" && pathname !== "/all-games") {
      setSearchValue("");
    }
    setPreviousPath(pathname);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Сброс поля из GameList
  useEffect(() => {
    const handleClearSearch = () => {
      setSearchValue("");
    };
    window.addEventListener("clearSearchField", handleClearSearch);
    return () =>
      window.removeEventListener("clearSearchField", handleClearSearch);
  }, []);

  return (
    <header className="py-[14px] flex justify-between items-center gap-[10px]">
      <Logo />
      <div className="w-full search hidden xl:flex max-w-[380px] 2xl:max-w-[636px] h-[48px] bg-2 border-[1px] border-primary-main skew-x-[-20deg] relative">
        <form onSubmit={handleSubmit} className="w-full">
          <input
            name="search"
            value={searchValue}
            onChange={handleChange}
            placeholder="Search"
            className="w-full px-[20px] py-[10px] pl-[82px] font-usuzi-condensed text-[16px] leading-[16px] sm:text-[24px] sm:leading-[28px] border-none bg-transparent focus:outline-none placeholder-gray-68 hover:placeholder-white caret-primary-main skew-x-[20deg]"
          />
          <button type="submit">
            <svg
              width="33"
              height="32"
              viewBox="0 0 33 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-1/2 left-[34px] transform -translate-y-1/2 skew-x-[20deg]">
              <circle
                cx="15.5012"
                cy="14.3847"
                r="10.718"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="square"
              />
              <path
                d="M22.8196 22.2773L28.8909 28.3329"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="square"
              />
            </svg>
          </button>

          {searchValue && (
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-1/2 right-[10px] transform -translate-y-1/2 cursor-pointer skew-x-[20deg]"
              onClick={handleClearField}>
              <path
                d="M23.5425 23.5429L8.45752 8.45795"
                stroke="white"
                strokeWidth="2"
              />
              <path
                d="M23.5425 8.45795L8.45753 23.5429"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          )}
        </form>
      </div>
      <div className="max-h-[48px] hidden xl:flex items-center gap-[18px]">
        <Button
          variant="secondary"
          className="h-[48px] flex justify-center items-center"
          aria-label="Support page">
          support
        </Button>
        <Button
          variant="secondary"
          className="h-[48px] flex justify-center items-center"
          aria-label="User profile">
          <svg
            width="33"
            height="32"
            viewBox="0 0 33 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20.0032 13.9053H23.5654"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="square"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.0484 25.9902C11.4351 25.9902 11.7473 26.3037 11.7473 26.6891C11.7473 27.0757 11.4351 27.3892 11.0484 27.3892C10.6618 27.3892 10.3496 27.0757 10.3496 26.6891C10.3496 26.3037 10.6618 25.9902 11.0484 25.9902Z"
              fill="white"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="square"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M25.5379 25.9902C25.9246 25.9902 26.2381 26.3037 26.2381 26.6891C26.2381 27.0757 25.9246 27.3892 25.5379 27.3892C25.1513 27.3892 24.8391 27.0757 24.8391 26.6891C24.8391 26.3037 25.1513 25.9902 25.5379 25.9902Z"
              fill="white"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="square"
            />
            <path
              d="M8.33672 8.69095H29.1698L27.4773 21.5371H9.49457L7.79187 4.61068H4.50317"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        </Button>
        <Button
          variant="secondary"
          className="h-[48px] flex justify-center items-center"
          aria-label="Settings">
          <svg
            width="33"
            height="32"
            viewBox="0 0 33 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M22.6842 9.55964C22.6842 12.815 20.0448 15.4526 16.7912 15.4526C13.5359 15.4526 10.8965 12.815 10.8965 9.55964C10.8965 6.30433 13.5359 3.66667 16.7912 3.66667C20.0448 3.66667 22.6842 6.30433 22.6842 9.55964Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
            <path
              d="M16.8364 19.7585C21.1782 19.7474 24.87 21.7409 26.227 26.0323C23.4918 27.6997 20.2723 28.3419 16.8364 28.3335C13.4006 28.3419 10.1811 27.6997 7.44592 26.0323C8.80446 21.7363 12.49 19.7474 16.8364 19.7585Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        </Button>
      </div>
      <Link
        href=""
        className="support-container flex justify-center items-center xl:hidden max-w-[200px] h-[40px] sm:h-[48px] no-underline relative w-auto"
        tabIndex={-1}
        aria-hidden="true"
        aria-label="Support mobile link">
        <span className="support font-usuzi-condensed flex justify-center items-center text-[15px] leading-[17px] sm:text-[26px] sm:leading-[28px] font-bold uppercase text-center text-white px-[10px] py-[10px] sm:px-[12px] sm:py-[12px] pl-[30px] sm:pl-[30px] relative w-[calc(100%-4px)] h-[calc(100%-4px)] bg-main overflow-hidden z-10">
          SUPPORT
        </span>
      </Link>
      <div
        className="flex xl:hidden fixed bottom-0 left-1/2 transform -translate-x-1/2 z-[1000] w-full justify-around bg-3"
        role="navigation"
        aria-label="Mobile navigation menu">
        <Link
          href="/"
          className="menu--mobile__link focus:outline-none cursor-pointer flex justify-center items-center px-[8px] py-[18px] w-full"
          aria-label="Home mobile link">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.45707 21.25V16.1711H14.5788V21.25H20.4443V8.74738L11.9014 2.75L3.55728 8.74738V21.25H9.45707Z"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Link>
        <Link
          href="/all-games"
          className="menu--mobile__link focus:outline-none cursor-pointer flex justify-center items-center px-[8px] py-[18px] w-full"
          aria-label="Categories mobile link">
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <rect
              x="2.85742"
              y="3.39258"
              width="7"
              height="7"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="square"
              fill="transparent"
            />
            <rect
              x="14.8818"
              y="2.60742"
              width="7"
              height="7"
              transform="rotate(15 14.8818 2.60742)"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="square"
              fill="transparent"
            />
            <rect
              x="2.85742"
              y="14.3926"
              width="7"
              height="7"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="square"
              fill="transparent"
            />
            <rect
              x="13.8574"
              y="14.3926"
              width="7"
              height="7"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="square"
              fill="transparent"
            />
          </svg>
        </Link>
        <Link
          href="/search"
          className="menu--mobile__link focus:outline-none cursor-pointer flex justify-center items-center px-[8px] py-[18px] w-full"
          aria-label="Search mobile link">
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="11.4985"
              cy="10.7885"
              r="8.03854"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="square"
              fill="transparent"
            />
            <path
              d="M16.9872 16.709L21.5407 21.2506"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        </Link>
        <Link
          href=""
          className="menu--mobile__link focus:outline-none cursor-pointer flex justify-center items-center px-[8px] py-[18px] w-full"
          aria-label="Cart mobile link">
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15.125 10.429H17.7967"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.40889 19.4922C8.69889 19.4922 8.93302 19.7273 8.93302 20.0163C8.93302 20.3063 8.69889 20.5414 8.40889 20.5414C8.11889 20.5414 7.88477 20.3063 7.88477 20.0163C7.88477 19.7273 8.11889 19.4922 8.40889 19.4922Z"
              fill="white"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M19.2761 19.4922C19.5661 19.4922 19.8012 19.7273 19.8012 20.0163C19.8012 20.3063 19.5661 20.5414 19.2761 20.5414C18.9861 20.5414 18.752 20.3063 18.752 20.0163C18.752 19.7273 18.9861 19.4922 19.2761 19.4922Z"
              fill="white"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
            <path
              d="M6.37516 6.51723H22L20.7306 16.1519H7.24355L5.96652 3.45703H3.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        </Link>
        <Link
          href="/auth/account/personal-info"
          className="menu--mobile__link focus:outline-none cursor-pointer flex justify-center items-center px-[8px] py-[18px] w-full"
          aria-label="Profile mobile link">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.3857 7.16973C16.3857 9.61122 14.4061 11.5895 11.966 11.5895C9.52447 11.5895 7.54492 9.61122 7.54492 7.16973C7.54492 4.72824 9.52447 2.75 11.966 2.75C14.4061 2.75 16.3857 4.72824 16.3857 7.16973Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
            <path
              d="M11.9999 14.8184C15.2563 14.8101 18.0251 16.3052 19.0428 19.5237C16.9914 20.7743 14.5768 21.2559 11.9999 21.2496C9.42304 21.2559 7.0084 20.7743 4.95703 19.5237C5.97593 16.3017 8.74006 14.8101 11.9999 14.8184Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
};

export default Header;
