"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Heading from "@/components/ui/Heading";

const SearchPage = () => {
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

  // Сброс текста поиска при уходе со страницы
  useEffect(() => {
    if (previousPath === "/search" && pathname !== "/search" && searchValue) {
      setSearchValue("");
    }
    setPreviousPath(pathname);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="min-h-screen flex flex-col items-center justify-start mt-[24px]">
      <Heading variant="h1" className="mb-[20px]">
        Search
      </Heading>
      <section className="w-[calc(100%-20px)] search flex h-[48px] bg-2 border-[1px] border-primary-main skew-x-[-20deg] relative">
        <form onSubmit={handleSubmit} className="w-full">
          <input
            name="search"
            value={searchValue}
            onChange={handleChange}
            placeholder="Search"
            className="w-full h-full px-[20px] py-[10px] pl-[82px] font-usuzi-condensed text-[16px] leading-[16px] sm:text-[24px] sm:leading-[28px] border-none bg-transparent focus:outline-none placeholder-gray-68 hover:placeholder-white caret-primary-main skew-x-[20deg]"
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
      </section>
    </main>
  );
};

export default SearchPage;
