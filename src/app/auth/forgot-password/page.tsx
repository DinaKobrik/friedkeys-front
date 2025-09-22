"use client";

import { useState } from "react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsTouched(true);

    // Проверка на пустое поле
    if (!email.trim()) {
      setIsValid(false);
      return;
    }

    // Базовая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsValid(false);
      return;
    }

    // Успешная отправка, переход на новую страницу
    router.push("/auth/email-sent");
  };

  return (
    <main className="mt-[40px]">
      <section className="min-h-screen relative pt-[88px] flex flex-col justify-center items-center">
        <Button
          variant="secondary"
          onClick={() => window.history.back()}
          className="absolute top-0 left-0  max-w-[117px] sm:max-w-[163px] h-[40px] sm:h-[50px] flex justify-center items-center ml-[10px]">
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
          Forgot Your Password?
        </Heading>
        <Text className="mb-[24px] sm:mb-[32px] text-left sm:text-center">
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
            className="mb-[40px]"
            isTouched={isTouched}
            isValid={isValid}
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
