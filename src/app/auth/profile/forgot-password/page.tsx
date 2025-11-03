"use client";

import { useState, useRef } from "react";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsTouched(true);
    setIsValid(true);

    // Проверка на пустое поле
    if (!email.trim()) {
      setIsValid(false);
      emailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollBy(0, -80);
      return;
    }

    // Базовая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsValid(false);
      emailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollBy(0, -80);
      return;
    }

    // Успешная валидация: сохранение email в localStorage и перенаправление
    localStorage.setItem("forgotEmail", email);
    router.push("/auth/profile/email-sent");

    // Сброс полей и состояний
    setEmail("");
    setIsTouched(false);
    setIsValid(true);
  };

  return (
    <main className="my-[40px] newMainCustom:mt-[136px]">
      <section className="min-h-[calc(100vh-170px)] relative max-w-[520px] bodyCustom:max-w-[100%] mx-auto flex flex-col justify-center items-center">
        <Button
          variant="secondary"
          onClick={() => router.push("/auth/profile/log-in")}
          className="bodyCustom:absolute bodyCustom:top-0 bodyCustom:left-0 mb-[32px] bodyCustom:mb-0 max-w-[117px] sm:max-w-[163px] h-[40px] sm:h-[45px] flex justify-center items-center ml-[10px]">
          <svg
            width="11"
            height="17"
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
        <Heading variant="h1" className="mb-[24px] text-center">
          Forgot Your Password?
        </Heading>
        <Text className="mb-[24px] text-left sm:text-center">
          No worries — it happens! <br />
          Enter your email below and we’ll send you a link to reset your
          password.
        </Text>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-[520px] mx-auto">
          <Input
            label="Email"
            type="text"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (isTouched) setIsValid(true);
            }}
            required
            variant="straight"
            errorMessage={
              isValid
                ? "Please enter a valid email"
                : !email.trim()
                ? "Fill in the field"
                : "Invalid email format"
            }
            className="mb-[30px]"
            isTouched={isTouched}
            isValid={isValid}
            ref={emailRef}
          />
          <Button
            variant="primary"
            type="submit"
            className="max-w-[calc(100%-20px)] sm:max-w-[502px] mx-auto">
            Send Reset Link
          </Button>
        </form>
      </section>
    </main>
  );
}
