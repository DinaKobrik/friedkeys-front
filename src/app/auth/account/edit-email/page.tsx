"use client";
import React, { useEffect, useState, Suspense, useCallback } from "react";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const AccountMenu = React.lazy(
  () => import("@/components/Sections/Account/AccountMenu")
);

const debounce = <T, R>(func: (arg: T) => R, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (arg: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(arg), delay);
  };
};

const ChangeEmail: React.FC = React.memo(() => {
  const [email, setEmail] = useState<string>("");
  const [isTouchedEmail, setIsTouchedEmail] = useState<boolean>(false);
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [fadeOut, setFadeOut] = useState<boolean>(false);

  const formatLastUpdated = (): string => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedData = localStorage.getItem("userProfile");
      const controller = new AbortController();
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData) as {
            email?: string;
            password?: string;
            firstName?: string;
            lastName?: string;
            birthday?: string;
            lastUpdated?: string;
          };
          setCurrentEmail(parsedData.email || "");
          setEmail(parsedData.email || "");
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Error parsing user profile:", error);
          }
        }
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
      return () => controller.abort();
    };
    fetchUserProfile();
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.trim().length > 0;
  };

  const debouncedValidateEmail = useCallback(
    (value: string) => {
      return debounce((val: string) => {
        setIsValidEmail(validateEmail(val));
      }, 300)(value);
    },
    [setIsValidEmail]
  );

  const handleSave = useCallback(() => {
    setIsTouchedEmail(true);
    const isValid = validateEmail(email);
    setIsValidEmail(isValid);

    if (isValid && email !== currentEmail) {
      const storedData = JSON.parse(
        localStorage.getItem("userProfile") || "{}"
      ) as {
        email?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        birthday?: string;
        lastUpdated?: string;
      };
      const updatedData = {
        ...storedData,
        email,
        lastUpdated: formatLastUpdated(),
      };
      localStorage.setItem("userProfile", JSON.stringify(updatedData));
      setCurrentEmail(email);
      setShowModal(true);
      setFadeOut(false);
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setShowModal(false);
        }, 300);
      }, 2000);
    }
  }, [email, currentEmail]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSave();
      }
    },
    [handleSave]
  );

  return (
    <main>
      <Suspense fallback={<div>Loading menu...</div>}>
        <AccountMenu activeLink="/auth/account/personal-info" />
      </Suspense>
      <section className="flex flex-col gap-[24px] sm:gap-[36px] mt-[40px] sm:mt-[60px]">
        <Suspense fallback={<div>Loading heading...</div>}>
          <Heading variant="h1" className="text-center sm:text-left">
            edit personal info
          </Heading>
        </Suspense>
        <div className="flex flex-col gap-[32px] sm:gap-[42px] w-full max-w-[520px] mx-auto">
          <Suspense fallback={<div>Loading input...</div>}>
            <Input
              label="email"
              type="text"
              name="email"
              primary
              customCaret={true}
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newEmail = e.target.value;
                setEmail(newEmail);
                if (isTouchedEmail) debouncedValidateEmail(newEmail);
              }}
              onKeyDown={handleKeyDown}
              required
              variant="straight"
              errorMessage={
                isValidEmail
                  ? ""
                  : !email.trim()
                  ? "Fill in the field"
                  : "Invalid email format"
              }
              autoComplete="off"
              isTouched={isTouchedEmail}
              isValid={isValidEmail}
            />
          </Suspense>
          <Suspense fallback={<div>Loading text...</div>}>
            <Text>
              To complete the email change, please check your new inbox and
              confirm your new email address via the link we sent
            </Text>
          </Suspense>
          <div className="flex flex-col-reverse sm:flex-row gap-[8px] sm:gap-[19px] max-w-[calc(100%-20px)] sm:max-w-[500px] w-full mx-auto">
            <Suspense fallback={<div>Loading button...</div>}>
              <Button
                variant="secondary"
                onClick={() => window.history.back()}
                aria-label="Go back to previous page">
                go back
              </Button>
            </Suspense>
            <Suspense fallback={<div>Loading button...</div>}>
              <Button
                variant="primary"
                onClick={handleSave}
                aria-label="Save email changes">
                save changes
              </Button>
            </Suspense>
          </div>
        </div>
      </section>
      {showModal && (
        <div
          className={`fixed z-50 top-0 left-0 w-full h-full flex justify-center items-center transition-opacity duration-500 ease-in-out ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
          aria-live="polite">
          <div
            className={`absolute w-full h-full bg-[#0000003A] backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
              fadeOut ? "opacity-0" : "opacity-100"
            }`}></div>
          <div
            className={`relative border-[1px] overflow-hidden border-primary-main bg-2 px-[20px] py-[40px] max-w-[320px] flex justify-center items-center text-center transition-all duration-300 ease-in-out ${
              fadeOut ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}>
            <Heading variant="h3">Email changed successfully</Heading>
            <div className="h-[7px] w-[75%] sm:w-[50%] absolute bottom-0 left-[50%] bg-primary-main translate-x-[-50%] blur-[30px] z-0"></div>
          </div>
        </div>
      )}
    </main>
  );
});

ChangeEmail.displayName = "ChangeEmail";
export default React.memo(ChangeEmail);
