"use client";

import { useState } from "react";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTouchedNew, setIsTouchedNew] = useState(false);
  const [isTouchedConfirm, setIsTouchedConfirm] = useState(false);
  const [isValidNew, setIsValidNew] = useState(true);
  const [isValidConfirm, setIsValidConfirm] = useState(true);

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsTouchedNew(true);
    setIsTouchedConfirm(true);

    // Сброс ошибок
    setIsValidNew(true);
    setIsValidConfirm(true);

    // Проверка на пустые поля
    if (!newPassword.trim() && !confirmPassword.trim()) {
      setIsValidNew(false);
      setIsValidConfirm(false);
      return;
    }

    // Проверка на несовпадение паролей
    if (newPassword !== confirmPassword) {
      setIsValidConfirm(false);
      return;
    }

    // Успешная смена пароля, переход на новую страницу
    router.push("/auth/password-changed");

    // Очистка полей
    setNewPassword("");
    setConfirmPassword("");
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

  return (
    <div className="flex flex-col justify-center items-center min-h-[100vh] mt-[40px]">
      <Heading variant="h1" className="mb-[24px] sm:mb-[32px] text-center">
        Reset Password
      </Heading>
      <Text className="mb-[24px] sm:mb-[72px] text-center">
        Enter a new password for your account.
      </Text>
      <form onSubmit={handleSubmit} className="w-full max-w-[520px]">
        <Input
          label="New Password"
          type={showPassword ? "text" : "password"}
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          variant="straight"
          errorMessage={
            isValidNew
              ? "Please enter the password."
              : "This field is required."
          }
          className="mb-[16px]"
          isTouched={isTouchedNew}
          isValid={isValidNew}>
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-[50%] translate-y-[-50%] right-[16px]">
            {showPassword ? <EyeOpen /> : <EyeClosed />}
          </div>
        </Input>
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          variant="straight"
          errorMessage={
            isValidConfirm
              ? "Please repeat the password."
              : "Passwords do not match."
          }
          className="mb-[40px]"
          isTouched={isTouchedConfirm}
          isValid={isValidConfirm}>
          <div
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-[50%] translate-y-[-50%] right-[16px]">
            {showConfirmPassword ? <EyeOpen /> : <EyeClosed />}
          </div>
        </Input>
        <Button variant="primary" type="submit" className="max-w-[502px]">
          Reset Password
        </Button>
      </form>
    </div>
  );
}
