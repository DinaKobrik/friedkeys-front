"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  Suspense,
} from "react";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import Link from "next/link";
import AccountMenu from "@/components/Sections/Account/AccountMenu";

// SVG для редактирования
const EditIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true">
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
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true">
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

const PersonalInfo: React.FC = React.memo(() => {
  const [userData, setUserData] = useState({
    email: "",
    password: "********",
    firstName: "",
    lastName: "",
    birthday: "",
    lastUpdated: "",
  });

  const formatBirthday = useCallback((dateStr: string) => {
    let [year, month, day] = dateStr.split("-");
    if (dateStr.includes("/")) {
      [month, day, year] = dateStr.split("/");
    } else if (dateStr.includes(".")) {
      [day, month, year] = dateStr.split(".");
    }
    const parsedMonth = parseInt(month, 10);
    const parsedDay = parseInt(day, 10);
    const parsedYear = parseInt(year, 10);
    return isNaN(parsedMonth) || isNaN(parsedDay) || isNaN(parsedYear)
      ? "Invalid Date"
      : `${parsedMonth}/${parsedDay}/${parsedYear}`;
  }, []);

  const maskPassword = useCallback((password: string) => {
    return password.length > 0 ? "•".repeat(password.length) : "********";
  }, []);

  const formatLastUpdated = useCallback((dateStr: string) => {
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
  }, []);

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
  }, [maskPassword, formatBirthday, formatLastUpdated]);

  const userDataDisplay = useMemo(() => {
    return {
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      birthday: userData.birthday,
      lastUpdated: userData.lastUpdated,
    };
  }, [userData]);

  return (
    <main aria-label="Personal Information Page">
      <Suspense fallback={<div>Loading menu...</div>}>
        <AccountMenu activeLink="/auth/account/personal-info" />
      </Suspense>
      <section
        className="flex flex-col gap-[24px] sm:gap-[36px] mt-[40px] sm:mt-[60px]"
        aria-label="Personal Information Section">
        <Heading
          variant="h1"
          className="text-center sm:text-left"
          aria-label="Personal Info Title">
          Personal Info
        </Heading>
        <div
          className="max-w-[520px] mx-auto w-full flex flex-col gap-[24px] sm:gap-[36px]"
          aria-label="User Details Container">
          <div
            className="flex flex-col w-full gap-[16px]"
            aria-label="User Information Fields">
            <div>
              <Heading
                variant="h3"
                className="mb-[8px]"
                aria-label="Email Field Label">
                Email
              </Heading>
              <div
                className="w-full px-[20px] line-clamp-1 text-clip text-overflow overflow-hidden py-[16px] border-[1px] border-primary-20 relative text-white bg-2 focus:outline-none h-[48px] flex items-center"
                aria-label={`Email: ${userDataDisplay.email}`}>
                {userDataDisplay.email}
                <Link
                  href="/auth/account/edit-email"
                  className="absolute top-[1px] bg-2 p-[11px] sm:p-[13px] border-r-primary-20 right-0"
                  aria-label="Edit Email">
                  {EditIcon}
                </Link>
              </div>
            </div>
            <div>
              <Heading
                variant="h3"
                className="mb-[8px]"
                aria-label="Password Field Label">
                Password
              </Heading>
              <div
                className="w-full px-[20px] line-clamp-1 text-clip text-overflow overflow-hidden py-[16px] border-[1px] border-primary-20 relative text-white bg-2 focus:outline-none h-[48px] flex items-center"
                aria-label={`Password: ${userDataDisplay.password}`}>
                {userDataDisplay.password}
                <Link
                  href="/auth/account/edit-password"
                  className="absolute top-[1px] bg-2 p-[11px] sm:p-[13px] border-r-primary-20 right-0"
                  aria-label="Edit Password">
                  {EditIcon}
                </Link>
              </div>
            </div>
            <div>
              <Heading
                variant="h3"
                className="mb-[8px]"
                aria-label="First Name Field Label">
                First Name
              </Heading>
              <div
                className="w-full px-[20px] line-clamp-1 text-clip text-overflow overflow-hidden py-[16px] border-[1px] border-primary-20 relative text-white bg-2 focus:outline-none h-[48px] flex items-center"
                aria-label={`First Name: ${userDataDisplay.firstName}`}>
                {userDataDisplay.firstName}
                <Link
                  href="/auth/account/edit-name"
                  className="absolute top-[1px] bg-2 p-[11px] sm:p-[13px] border-r-primary-20 right-0"
                  aria-label="Edit First Name">
                  {EditIcon}
                </Link>
              </div>
            </div>
            <div>
              <Heading
                variant="h3"
                className="mb-[8px]"
                aria-label="Last Name Field Label">
                Last Name
              </Heading>
              <div
                className="w-full px-[20px] line-clamp-1 text-clip text-overflow overflow-hidden py-[16px] border-[1px] border-primary-20 relative text-white bg-2 focus:outline-none h-[48px] flex items-center"
                aria-label={`Last Name: ${userDataDisplay.lastName}`}>
                {userDataDisplay.lastName}
                <Link
                  href="/auth/account/edit-name"
                  className="absolute top-[1px] bg-2 p-[11px] sm:p-[13px] border-r-primary-20 right-0"
                  aria-label="Edit Last Name">
                  {EditIcon}
                </Link>
              </div>
            </div>
            <div className="mb-[24px] sm:mb-[0px]">
              <Heading
                variant="h3"
                className="mb-[8px]"
                aria-label="Birthday Field Label">
                Birthday
              </Heading>
              <div
                className="w-full px-[20px] line-clamp-1 text-clip text-overflow overflow-hidden py-[16px] border-[1px] border-primary-20 relative text-white bg-2 focus:outline-none h-[48px] flex items-center"
                aria-label={`Birthday: ${userDataDisplay.birthday}`}>
                {userDataDisplay.birthday}
                <Link
                  href="/auth/account/edit-name"
                  className="absolute top-[1px] bg-2 p-[11px] sm:p-[13px] border-r-primary-20 right-0"
                  aria-label="Edit Birthday">
                  {CalendarIcon}
                </Link>
              </div>
            </div>
          </div>
          <div
            className="grid grid-cols-2 items-center w-full max-w-[calc(100%-20px)] mx-auto sm:gap-[20px]"
            aria-label="Account Actions">
            <Button variant="secondary" aria-label="Log Out">
              log out
            </Button>
            <Link
              href=""
              className="text-primary-main text-end"
              aria-label="Delete My Account">
              Delete my account
            </Link>
          </div>
          <Text
            className="text-center mb-[40px]"
            aria-label={`Member since: ${userDataDisplay.lastUpdated}`}>
            Member since: {userDataDisplay.lastUpdated}
          </Text>
        </div>
      </section>
    </main>
  );
});

PersonalInfo.displayName = "PersonalInfo";

export default PersonalInfo;
