"use client";
import React, {
  useEffect,
  useState,
  Suspense,
  useCallback,
  useRef,
} from "react";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
const AccountMenu = React.lazy(
  () => import("@/components/Sections/Account/AccountMenu")
);

const ChangeName: React.FC = React.memo(() => {
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    birthday: string;
  }>({
    firstName: "",
    lastName: "",
    birthday: "",
  });

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const birthdayRef = useRef<HTMLInputElement>(null);

  const CalendarIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-default absolute top-[12px] right-[12px] sm:top-[16px] sm:right-[16px] pointer-events-none">
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

  const formatBirthdayForInput = (dateStr: string): string => {
    let [year, month, day] = dateStr.split("-");
    if (dateStr.includes("/")) {
      [month, day, year] = dateStr.split("/");
    } else if (dateStr.includes(".")) {
      [day, month, year] = dateStr.split(".");
    }
    const parsedMonth = String(parseInt(month, 10)).padStart(2, "0");
    const parsedDay = String(parseInt(day, 10)).padStart(2, "0");
    const parsedYear = parseInt(year, 10);
    return isNaN(parsedYear) ? "" : `${parsedYear}-${parsedMonth}-${parsedDay}`;
  };

  const formatBirthdayForDisplay = (dateStr: string): string => {
    const [year, month, day] = dateStr.split("-");
    return `${parseInt(month, 10)}/${parseInt(day, 10)}/${year}`;
  };

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
            firstName?: string;
            lastName?: string;
            birthday?: string;
            email?: string;
            password?: string;
            lastUpdated?: string;
          };
          const formattedData = {
            firstName: parsedData.firstName || "",
            lastName: parsedData.lastName || "",
            birthday: formatBirthdayForInput(parsedData.birthday || ""),
          };
          setFormData(formattedData);
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Error parsing user profile:", error);
          }
        }
      } else {
        const defaultData = {
          firstName: "John",
          lastName: "Doe",
          birthday: "2000-01-01",
        };
        const formattedData = {
          ...defaultData,
          birthday: formatBirthdayForInput(defaultData.birthday),
        };
        localStorage.setItem(
          "userProfile",
          JSON.stringify({
            ...formattedData,
            email: "",
            password: "",
            lastUpdated: formatLastUpdated(),
          })
        );
        setFormData(formattedData);
      }
      return () => controller.abort();
    };
    fetchUserProfile();
  }, []);

  const validateForm = useCallback(() => {
    const isFirstNameValid = !!formData.firstName.trim();
    const isLastNameValid = !!formData.lastName.trim();
    const isBirthdayValid = !!formData.birthday.trim();
    return isFirstNameValid && isLastNameValid && isBirthdayValid;
  }, [formData]);

  const handleSave = useCallback(() => {
    const isValid = validateForm();
    if (isValid) {
      const storedData = JSON.parse(
        localStorage.getItem("userProfile") || "{}"
      ) as {
        firstName?: string;
        lastName?: string;
        birthday?: string;
        email?: string;
        password?: string;
        lastUpdated?: string;
      };
      const updatedData = {
        ...storedData,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthday: formatBirthdayForDisplay(formData.birthday),
        lastUpdated: formatLastUpdated(),
      };
      localStorage.setItem("userProfile", JSON.stringify(updatedData));
      alert("Changes saved successfully!");
    }
  }, [formData, validateForm]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, field: string) => {
      if (e.key !== "Enter") return;

      e.preventDefault();

      if (field === "firstName" && lastNameRef.current) {
        lastNameRef.current.focus();
      } else if (field === "lastName" && birthdayRef.current) {
        birthdayRef.current.focus();
      } else if (field === "birthday") {
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
      <section className="flex flex-col gap-[24px] sm:gap-[48px] mt-[40px] sm:mt-[80px]">
        <Suspense fallback={<div>Loading heading...</div>}>
          <Heading variant="h1" className="text-center sm:text-left">
            edit personal info
          </Heading>
        </Suspense>
        <div className="flex flex-col w-full max-w-[520px] mx-auto gap-[16px]">
          <Suspense fallback={<div>Loading input...</div>}>
            <Input
              label="First Name"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, "firstName")}
              required
              variant="straight"
              errorMessage={validateForm() ? "" : "Fill in the field"}
              autoComplete="off"
              ref={firstNameRef}
            />
          </Suspense>
          <Suspense fallback={<div>Loading input...</div>}>
            <Input
              label="Last Name"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, "lastName")}
              required
              variant="straight"
              errorMessage={validateForm() ? "" : "Fill in the field"}
              autoComplete="off"
              ref={lastNameRef}
            />
          </Suspense>
          <Suspense fallback={<div>Loading input...</div>}>
            <Input
              label="Birthday"
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, birthday: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, "birthday")}
              required
              variant="straight"
              errorMessage={validateForm() ? "" : "Fill in the field"}
              className="mb-[24px] sm:mb-[40px]"
              autoComplete="off"
              ref={birthdayRef}>
              {CalendarIcon}
            </Input>
          </Suspense>
          <div className="flex flex-col-reverse sm:flex-row gap-[8px] sm:gap-[26px] max-w-[calc(100%-20px)] sm:max-w-[500px] w-full mx-auto">
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
                aria-label="Save name and birthday changes">
                save changes
              </Button>
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
});

ChangeName.displayName = "ChangeName";
export default React.memo(ChangeName);
