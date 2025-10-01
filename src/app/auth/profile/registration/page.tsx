"use client";

import React, { useState, useEffect, useRef } from "react";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Registration: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [country, setCountry] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isTouchedEmail, setIsTouchedEmail] = useState(false);
  const [isTouchedPassword, setIsTouchedPassword] = useState(false);
  const [isTouchedFirstName, setIsTouchedFirstName] = useState(false);
  const [isTouchedLastName, setIsTouchedLastName] = useState(false);
  const [isTouchedBirthday, setIsTouchedBirthday] = useState(false);
  const [isTouchedCountry, setIsTouchedCountry] = useState(false);
  const [isTouchedAgreed, setIsTouchedAgreed] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidFirstName, setIsValidFirstName] = useState(true);
  const [isValidLastName, setIsValidLastName] = useState(true);
  const [isValidBirthday, setIsValidBirthday] = useState(true);
  const [isValidCountry, setIsValidCountry] = useState(true);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const birthdayRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const agreedRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsTouchedEmail(true);
    setIsTouchedPassword(true);
    setIsTouchedFirstName(true);
    setIsTouchedLastName(true);
    setIsTouchedBirthday(true);
    setIsTouchedCountry(true);
    setIsTouchedAgreed(true);

    setIsValidEmail(true);
    setIsValidPassword(true);
    setIsValidFirstName(true);
    setIsValidLastName(true);
    setIsValidBirthday(true);
    setIsValidCountry(true);

    // Проверка полей в порядке их появления в форме
    if (!email.trim()) {
      setIsValidEmail(false);
      emailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollBy(0, -80); // Отступ для фиксированного хедера
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsValidEmail(false);
      emailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollBy(0, -80);
      return;
    }
    if (!password.trim()) {
      setIsValidPassword(false);
      passwordRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.scrollBy(0, -80);
      return;
    }
    if (!firstName.trim()) {
      setIsValidFirstName(false);
      firstNameRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.scrollBy(0, -80);
      return;
    }
    if (!lastName.trim()) {
      setIsValidLastName(false);
      lastNameRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.scrollBy(0, -80);
      return;
    }
    if (!birthday.trim()) {
      setIsValidBirthday(false);
      birthdayRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.scrollBy(0, -80);
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    const selectedDate = new Date(birthday);
    const todayDate = new Date(today);
    if (selectedDate > todayDate) {
      setIsValidBirthday(false);
      birthdayRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.scrollBy(0, -80);
      return;
    }
    if (!country.trim()) {
      setIsValidCountry(false);
      countryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.scrollBy(0, -80);
      return;
    }
    if (!isAgreed) {
      agreedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollBy(0, -80);
      return;
    }

    // Перенаправление на страницу логина
    router.push("/auth/profile/log-in");

    // Сброс всех полей и состояний после успешной отправки
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setBirthday("");
    setCountry("");
    setIsAgreed(false);
    setIsTouchedEmail(false);
    setIsTouchedPassword(false);
    setIsTouchedFirstName(false);
    setIsTouchedLastName(false);
    setIsTouchedBirthday(false);
    setIsTouchedCountry(false);
    setIsTouchedAgreed(false);
  };

  // SVG для закрытого глаза
  const EyeClosed = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer">
      <path
        d="M21.25 7.40678C19.289 11.5349 15.806 14.0114 11.998 14.0114H12.002C8.194 14.0114 4.711 11.5349 2.75 7.40678"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M18.5898 11.2754L20.701 13.3865"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M5.33203 11.2754L3.22092 13.3865"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M15.1765 16.5929L14.332 13.6833"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M8.74142 16.5931L9.58594 13.6836"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );

  // SVG для открытого глаза
  const EyeOpen = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer">
      <path
        d="M12 5C7.523 5 3.733 7.942 2 12C3.733 16.058 7.523 19 12 19C16.477 19 20.267 16.058 22 12C20.267 7.942 16.477 5 12 5ZM12 16C9.791 16 8 14.209 8 12C8 9.791 9.791 8 12 8C14.209 8 16 9.791 16 12C16 14.209 14.209 16 12 16Z"
        fill="white"
      />
      <circle cx="12" cy="12" r="3" fill="white" />
    </svg>
  );

  // SVG для календаря
  const CalendarIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.76172 9.59898H20.2489"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M16.1078 13.2115H16.1163"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M12.0062 13.2115H12.0148"
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
        d="M16.1078 16.8065H16.1163"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M12.0062 16.8065H12.0148"
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
        d="M8.26831 2.75V5.79399"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.3258 4.21069H3.67578V21.25H20.3258V4.21069Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );

  // SVG для стрелочки
  const ArrowIcon = () => (
    <svg
      width="10"
      height="18"
      viewBox="0 0 10 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.5 2L8.5 9L1.5 16"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );

  // Статичный список стран
  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Japan",
    "Brazil",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className="my-[24px] sm:my-[40px]">
      <section className="relative flex flex-col justify-center items-center pt-[72px] sm:pt-[80px] mainCustom:pt-0">
        <Button
          variant="secondary"
          onClick={() => window.history.back()}
          className="absolute top-0 left-0 max-w-[117px] sm:max-w-[163px] h-[40px] sm:h-[50px] flex justify-center items-center ml-[10px]">
          <svg
            width="14"
            height="22"
            viewBox="0 0 14 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-[12px]">
            <path
              d="M11.668 20.3334L2.33463 11L11.668 1.66669"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
          back
        </Button>
        <Heading variant="h1" className="mb-[24px] sm:mb-[32px] text-center">
          Create new account
        </Heading>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[520px] space-y-4">
          <Input
            label="Email"
            type="text"
            value={email}
            name="email"
            onChange={(e) => {
              setEmail(e.target.value);
              if (isTouchedEmail) setIsValidEmail(true);
            }}
            required
            variant="straight"
            errorMessage={
              isValidEmail
                ? "Please enter a valid email"
                : !email.trim()
                ? "Fill in the field"
                : "Invalid email format"
            }
            className="mb-[24px]"
            autoComplete="off"
            isTouched={isTouchedEmail}
            isValid={isValidEmail}
            ref={emailRef}
          />
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            name="password"
            onChange={(e) => {
              setPassword(e.target.value);
              if (isTouchedPassword) setIsValidPassword(true);
            }}
            required
            variant="straight"
            errorMessage={
              isValidPassword ? "Please enter a password" : "Fill in the field"
            }
            className="mb-[24px]"
            autoComplete="new-password"
            isTouched={isTouchedPassword}
            isValid={isValidPassword}
            ref={passwordRef}>
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[50%] translate-y-[-50%] right-[16px]">
              {showPassword ? <EyeOpen /> : <EyeClosed />}
            </div>
          </Input>
          <Input
            label="First Name"
            type="text"
            value={firstName}
            name="firstName"
            onChange={(e) => {
              setFirstName(e.target.value);
              if (isTouchedFirstName) setIsValidFirstName(true);
            }}
            required
            variant="straight"
            errorMessage={
              isValidFirstName
                ? "Please enter your first name"
                : "Fill in the field"
            }
            className="mb-[24px]"
            autoComplete="off"
            isTouched={isTouchedFirstName}
            isValid={isValidFirstName}
            ref={firstNameRef}
          />
          <Input
            label="Last Name"
            type="text"
            value={lastName}
            name="lastName"
            onChange={(e) => {
              setLastName(e.target.value);
              if (isTouchedLastName) setIsValidLastName(true);
            }}
            required
            variant="straight"
            errorMessage={
              isValidLastName
                ? "Please enter your last name"
                : "Fill in the field"
            }
            className="mb-[24px]"
            autoComplete="off"
            isTouched={isTouchedLastName}
            isValid={isValidLastName}
            ref={lastNameRef}
          />
          <div className="relative mb-[24px]">
            <Input
              label="Birthday"
              type="date"
              value={birthday}
              name="birthday"
              onChange={(e) => {
                setBirthday(e.target.value);
                if (isTouchedBirthday) setIsValidBirthday(true);
              }}
              required
              variant="straight"
              errorMessage={
                isValidBirthday
                  ? "Please select your birthday"
                  : !birthday.trim()
                  ? "Fill in the field"
                  : "Date must be on or before today"
              }
              className="mb-[0]"
              autoComplete="off"
              isTouched={isTouchedBirthday}
              isValid={isValidBirthday}
              ref={birthdayRef}>
              <div className="absolute top-[50%] translate-y-[-50%] right-[16px] cursor-pointer pointer-events-none">
                <CalendarIcon />
              </div>
            </Input>
          </div>
          <div
            ref={countryDropdownRef}
            onClick={() => setIsCountryOpen(!isCountryOpen)}
            className="relative mb-[24px] cursor-pointer">
            <Input
              label="Country"
              type="text"
              value={country}
              name="country"
              onChange={(e) => {
                setCountry(e.target.value);
                if (isTouchedCountry) setIsValidCountry(true);
              }}
              required
              variant="straight"
              errorMessage={
                !isValidCountry && isTouchedCountry && !country.trim()
                  ? "Fill in the field"
                  : ""
              }
              className="mb-[0] cursor-pointer"
              autoComplete="off"
              readOnly
              isTouched={isTouchedCountry}
              isValid={isValidCountry}
              ref={countryRef}>
              <div className="absolute top-[50%] translate-y-[-50%] right-[16px] cursor-pointer">
                <ArrowIcon />
              </div>
            </Input>
            {isCountryOpen && (
              <div className="absolute top-[64px] sm:top-[84px] z-10 w-full bg-2 mt-[8px] max-h-[200px] overflow-y-auto custom-scrollbar">
                {countries.map((countryName, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setCountry(countryName);
                      setIsValidCountry(true);
                      setIsCountryOpen(false);
                    }}
                    className="px-[20px] py-[12px] cursor-pointer hover:bg-primary-10">
                    {countryName}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            className={`flex items-center mb-[24px] ${
              !isAgreed && isTouchedAgreed ? "border-red" : ""
            }`}
            ref={agreedRef}>
            <div
              className={`w-[24px] h-[24px] bg-transparent border-2 rounded-sm flex items-center justify-center mr-[16px] cursor-pointer ${
                !isAgreed && isTouchedAgreed ? "border-red" : "border-white"
              }`}
              onClick={() => setIsAgreed(!isAgreed)}>
              {isAgreed && (
                <svg
                  width="12"
                  height="9"
                  viewBox="0 0 12 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1 4L4.5 8L11 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                </svg>
              )}
            </div>
            <Text>
              I agree with the{" "}
              <Link href="/terms-conditions" className="underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="underline">
                Privacy Policy
              </Link>
            </Text>
          </div>
          <Button
            variant="primary"
            type="submit"
            className="max-w-[calc(100%-20px)] sm:max-w-[502px] mx-auto">
            Create Account
          </Button>
        </form>
      </section>
    </main>
  );
};

export default Registration;
