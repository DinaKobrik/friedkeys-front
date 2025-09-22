"use client";

import { useState } from "react";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import Link from "next/link";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTouchedEmail, setIsTouchedEmail] = useState(false);
  const [isTouchedPassword, setIsTouchedPassword] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsTouchedEmail(true);
    setIsTouchedPassword(true);

    // Сброс ошибок
    setIsValidEmail(true);
    setIsValidPassword(true);

    // Проверка на пустые поля
    if (!email.trim()) {
      setIsValidEmail(false);
      return;
    }
    if (!password.trim()) {
      setIsValidPassword(false);
      return;
    }

    // Базовая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsValidEmail(false);
      return;
    }

    // Успешная отправка данных на сервер
    alert(`Email: ${email}, Password: ${password}`);

    // Сброс полей после успешной отправки
    setEmail("");
    setPassword("");
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

  // Шаблон данных для ссылок
  const socialLinks = [
    { href: "", src: "/images/icons/Apple.png", alt: "Apple" },
    { href: "", src: "/images/icons/Google.png", alt: "Google" },
    { href: "", src: "/images/icons/Facebook.png", alt: "Facebook" },
    { href: "", src: "/images/icons/Twitch.png", alt: "Twitch" },
  ];

  return (
    <main className="mt-[40px]">
      <section className="min-h-screen flex flex-col justify-center items-center max-w-[520px] mx-auto">
        <Heading variant="h1" className="mb-[24px] sm:mb-[32px] text-center">
          Log In
        </Heading>
        <form onSubmit={handleSubmit} className="w-full max-w-[520px]">
          <Input
            label="Email"
            type="text"
            name="email"
            value={email}
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
          />
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (isTouchedPassword) setIsValidPassword(true);
            }}
            required
            variant="straight"
            errorMessage={
              isValidPassword
                ? "Please enter the password"
                : "Fill in the field"
            }
            className="mb-[8px]"
            autoComplete="new-password"
            isTouched={isTouchedPassword}
            isValid={isValidPassword}>
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[50%] translate-y-[-50%] right-[16px]">
              {showPassword ? <EyeOpen /> : <EyeClosed />}
            </div>
          </Input>
          <Link
            href="../auth/forgot-password/"
            className="block text-primary-main text-[15px] leading-[15px] sm:text-[20px] sm:leading-[20px] mb-[24px]">
            Forgot password
          </Link>
          <Button variant="primary" type="submit" className="max-w-[502px]">
            Log In
          </Button>
        </form>
        <div className="relative w-full">
          <Heading variant="h3" className="my-[48px] w-full text-center">
            or
          </Heading>
          <div className="h-[7px] w-full absolute top-[50%] left-[50%] bg-primary-main translate-x-[-50%] translate-y-[-50%] blur-[12px] z-[-1]"></div>
        </div>
        <div className="max-w-[520px] w-full h-[80px] overflow-hidden relative mb-[40px]">
          <div className="flex items-center justify-center gap-[12px] sm:gap-[18px] w-[calc(100%+40px)] sm:w-[560px] mx-auto absolute left-[50%] translate-x-[-50%] top-0">
            {socialLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`h-full w-full sm:w-auto flex items-center justify-center bg-2 rounded-[2px] hover:bg-primary-10 active:bg-primary-20 py-[16px] px-[28px] sm:py-[20px] sm:px-[41px] skew-x-[-15deg]`}>
                <Image
                  src={link.src}
                  alt={link.alt}
                  className="object-cover skew-x-[15deg] sm:w-[40px] sm:h-[40px]"
                  width={24}
                  height={24}
                />
              </Link>
            ))}
          </div>
        </div>
        <Link
          href="/auth/registration"
          className="text-white text-[15px] leading-[15px] sm:text-[20px] sm:leading-[20px] text-center">
          No account yet?
        </Link>
      </section>
    </main>
  );
}
