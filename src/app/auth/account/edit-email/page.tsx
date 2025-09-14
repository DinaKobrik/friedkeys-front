"use client";
import React, { useEffect, useState } from "react";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AccountMenu from "@/components/Sections/Account/AccountMenu";

const ChangeEmail: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isTouchedEmail, setIsTouchedEmail] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [currentEmail, setCurrentEmail] = useState("");

  // Форматирование даты в формате "DD.MM.YYYY"
  const formatLastUpdated = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
  };

  useEffect(() => {
    const storedData = localStorage.getItem("userProfile");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setCurrentEmail(parsedData.email || "");
      setEmail(parsedData.email || "");
    } else {
      const defaultData = {
        email: "user@example.com",
        password: "",
        firstName: "",
        lastName: "",
        birthday: "",
        lastUpdated: formatLastUpdated(),
      };
      localStorage.setItem("userProfile", JSON.stringify(defaultData));
      setCurrentEmail(defaultData.email);
      setEmail(defaultData.email);
    }
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.trim().length > 0;
  };

  const handleSave = () => {
    setIsTouchedEmail(true);
    const isValid = validateEmail(email);
    setIsValidEmail(isValid);

    if (isValid && email !== currentEmail) {
      const storedData = JSON.parse(
        localStorage.getItem("userProfile") || "{}"
      );
      const updatedData = {
        ...storedData,
        email: email,
        lastUpdated: formatLastUpdated(),
      };
      localStorage.setItem("userProfile", JSON.stringify(updatedData));
      setCurrentEmail(email);
      alert("Email change request sent to your inbox!");
    }
  };

  return (
    <main>
      <AccountMenu activeLink="/auth/account/personal-info" />
      <section className="flex flex-col gap-[24px] sm:gap-[48px] mt-[40px] sm:mt-[80px]">
        <Heading variant="h1" className="text-center sm:text-left">
          edit personal info
        </Heading>
        <div className="flex flex-col gap-[32px] sm:gap-[56px] w-full max-w-[520px] mx-auto">
          <Input
            label="New Email"
            type="text"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (isTouchedEmail)
                setIsValidEmail(validateEmail(e.target.value));
            }}
            required
            variant="straight"
            errorMessage={
              isValidEmail
                ? ""
                : !email.trim()
                ? "Fill in the field"
                : "Invalid email format"
            }
            className="mb-[24px]"
            autoComplete="off"
            isTouched={isTouchedEmail}
            isValid={isValidEmail}
          />
          <Text>
            To complete the email change, please check your new inbox and
            confirm your new email address via the link we sent
          </Text>
          <div className="flex flex-col-reverse sm:flex-row gap-[8px] sm:gap-[26px] max-w-[calc(100%-20px)] sm:max-w-[500px] w-full mx-auto">
            <Button variant="secondary" onClick={() => window.history.back()}>
              go back
            </Button>
            <Button variant="primary" onClick={handleSave}>
              save changes
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ChangeEmail;
