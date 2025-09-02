"use client";
import React, { useEffect, useState } from "react";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import Link from "next/link";
import AccountMenu from "@/components/Sections/Account/AccountMenu";

const PersonalInfo: React.FC = () => {
  // SVG для редактирования
  const EditIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.9287 7.28601L16.7295 11.0868L6.56643 21.2499L2.7692 21.2463L2.76562 17.4491L12.9287 7.28601Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M12.9287 7.28613L16.7295 11.0869L6.56643 21.25L2.7692 21.2465L2.76562 17.4492L12.9287 7.28613Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M13.4922 13.493L10.506 10.5069"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M2.77317 11.4464V2.75H21.2344V21.25H12.6976"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );

  // SVG для даты
  const CalendarIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.75781 9.59898H20.245"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M16.1117 13.2115H16.1202"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M12.0023 13.2115H12.0109"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M7.89293 13.2115H7.9015"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M16.1117 16.8065H16.1202"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M12.0023 16.8065H12.0109"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M7.89293 16.8065H7.9015"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M15.741 2.75V5.79399"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M8.27221 2.75V5.79399"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.3219 4.21069H3.67188V21.25H20.3219V4.21069Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );

  const [userData, setUserData] = useState({
    email: "",
    password: "********",
    firstName: "",
    lastName: "",
    birthday: "",
    lastUpdated: "",
  });

  const formatBirthday = (dateStr: string) => {
    let [year, month, day] = dateStr.split("-"); // Для "YYYY-MM-DD"
    if (dateStr.includes("/")) {
      [month, day, year] = dateStr.split("/"); // Для "M/D/YYYY"
    } else if (dateStr.includes(".")) {
      [day, month, year] = dateStr.split("."); // Для "DD.MM.YYYY"
    }
    const parsedMonth = parseInt(month, 10);
    const parsedDay = parseInt(day, 10);
    const parsedYear = parseInt(year, 10);
    return isNaN(parsedMonth) || isNaN(parsedDay) || isNaN(parsedYear)
      ? "Invalid Date"
      : `${parsedMonth}/${parsedDay}/${parsedYear}`;
  };

  const maskPassword = (password: string) => {
    return password.length > 0 ? "•".repeat(password.length) : "********";
  };

  const formatLastUpdated = (dateStr: string) => {
    const [day, month, year] = dateStr.split(".");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const parsedMonth = parseInt(month, 10);
    const parsedDay = parseInt(day, 10);
    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedMonth) || isNaN(parsedDay) || isNaN(parsedYear)) {
      return "Invalid Date";
    }
    const monthName = months[parsedMonth - 1];
    return `${monthName} ${parsedDay}, ${parsedYear}`;
  };

  useEffect(() => {
    const storedData = localStorage.getItem("userProfile");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserData({
        ...parsedData,
        password: maskPassword(parsedData.password),
        birthday: formatBirthday(parsedData.birthday),
        lastUpdated: formatLastUpdated(parsedData.lastUpdated),
      });
    } else {
      const defaultData = {
        email: "user@example.com",
        password: "pipidastr",
        firstName: "John",
        lastName: "Doe",
        birthday: "2000-01-01",
        lastUpdated: "10.03.2025",
      };
      const formattedData = {
        ...defaultData,
        password: maskPassword(defaultData.password),
        birthday: formatBirthday(defaultData.birthday),
        lastUpdated: formatLastUpdated(defaultData.lastUpdated),
      };
      localStorage.setItem("userProfile", JSON.stringify(defaultData));
      setUserData(formattedData);
    }
  }, []);

  return (
    <div>
      <AccountMenu activeLink="/auth/account/personal-info" />
      <div className="flex flex-col gap-[24px] sm:gap-[48px] mt-[40px] sm:mt-[80px]">
        <Heading variant="h1" className="text-center sm:text-left">
          Personal Info
        </Heading>
        <div className="max-w-[520px] mx-auto w-full flex flex-col gap-[24px] sm:gap-[48px]">
          <div className="flex flex-col w-full gap-[16px]">
            <div>
              <Heading variant="h3" className="mb-[8px]">
                Email
              </Heading>
              <div className="w-full border-1 border-primary-main relative text-white bg-2 focus:outline-none h-[48px] sm:h-[56px] flex items-center px-4">
                {userData.email}
                <Link
                  href="/auth/account/edit-email"
                  className="absolute top-[12px] right-[12px] sm:top-[16px] sm:right-[16px]">
                  {EditIcon}
                </Link>
              </div>
            </div>
            <div>
              <Heading variant="h3" className="mb-[8px]">
                Password
              </Heading>
              <div className="w-full border-1 border-primary-main relative text-white bg-2 focus:outline-none h-[48px] sm:h-[56px] flex items-center px-4">
                {userData.password}
                <Link
                  href="/auth/account/edit-password"
                  className="absolute top-[12px] right-[12px] sm:top-[16px] sm:right-[16px]">
                  {EditIcon}
                </Link>
              </div>
            </div>
            <div>
              <Heading variant="h3" className="mb-[8px]">
                First Name
              </Heading>
              <div className="w-full border-1 border-primary-main relative text-white bg-2 focus:outline-none h-[48px] sm:h-[56px] flex items-center px-4">
                {userData.firstName}
                <Link
                  href="/auth/account/edit-name"
                  className="absolute top-[12px] right-[12px] sm:top-[16px] sm:right-[16px]">
                  {EditIcon}
                </Link>
              </div>
            </div>
            <div>
              <Heading variant="h3" className="mb-[8px]">
                Last Name
              </Heading>
              <div className="w-full border-1 border-primary-main relative text-white bg-2 focus:outline-none h-[48px] sm:h-[56px] flex items-center px-4">
                {userData.lastName}
                <Link
                  href="/auth/account/edit-name"
                  className="absolute top-[12px] right-[12px] sm:top-[16px] sm:right-[16px]">
                  {EditIcon}
                </Link>
              </div>
            </div>
            <div className="mb-[24px] sm:mb-[0px]">
              <Heading variant="h3" className="mb-[8px]">
                Birthday
              </Heading>
              <div className="w-full border-1 border-primary-main relative text-white bg-2 focus:outline-none h-[48px] sm:h-[56px] flex items-center px-4">
                {userData.birthday}
                <Link
                  href="/auth/account/edit-name"
                  className="absolute top-[12px] right-[12px] sm:top-[16px] sm:right-[16px]">
                  {CalendarIcon}
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 items-center w-full max-w-[calc(100%-20px)] mx-auto gap-[20px]">
            <Button variant="secondary">log out</Button>
            <Link href="" className="text-primary-main text-end">
              Delete my account
            </Link>
          </div>
          <Text className="text-center">
            Member since: {userData.lastUpdated}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
