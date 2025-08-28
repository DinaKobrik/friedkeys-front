"use client";
import React, { useEffect, useState } from "react";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AccountMenu from "@/components/Sections/Account/AccountMenu";

const ChangeName: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
  });

  const CalendarIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-default absolute top-[16px] right-[16px] pointer-events-none">
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

  const formatBirthdayForInput = (dateStr: string) => {
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

  const formatBirthdayForDisplay = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${parseInt(month, 10)}/${parseInt(day, 10)}/${year}`;
  };

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
      const formattedData = {
        firstName: parsedData.firstName || "",
        lastName: parsedData.lastName || "",
        birthday: formatBirthdayForInput(parsedData.birthday) || "",
      };
      setFormData(formattedData);
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
  }, []);

  const handleSave = () => {
    const isValid = validateForm();
    if (isValid) {
      const storedData = JSON.parse(
        localStorage.getItem("userProfile") || "{}"
      );
      const updatedData = {
        ...storedData,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthday: formatBirthdayForDisplay(formData.birthday),
        lastUpdated: formatLastUpdated(),
      };
      localStorage.setItem("userProfile", JSON.stringify(updatedData));
    }
  };

  const validateForm = () => {
    const isFirstNameValid = !!formData.firstName.trim();
    const isLastNameValid = !!formData.lastName.trim();
    const isBirthdayValid = !!formData.birthday.trim();

    return isFirstNameValid && isLastNameValid && isBirthdayValid;
  };

  return (
    <div>
      <AccountMenu activeLink="/auth/account/personal-info" />
      <div className="flex flex-col gap-[24px] sm:gap-[48px] mt-[40px] sm:mt-[80px]">
        <Heading variant="h1" className="text-center sm:text-left">
          edit personal info
        </Heading>
        <div className="flex flex-col w-full max-w-[520px] mx-auto gap-[16px]">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            required
            variant="straight"
            errorMessage={validateForm() ? "" : "Fill in the field"}
            autoComplete="off"
          />
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            required
            variant="straight"
            errorMessage={validateForm() ? "" : "Fill in the field"}
            autoComplete="off"
          />
          <Input
            label="Birthday"
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={(e) =>
              setFormData({ ...formData, birthday: e.target.value })
            }
            required
            variant="straight"
            errorMessage={validateForm() ? "" : "Fill in the field"}
            className="mb-[24px] sm:mb-[40px]"
            autoComplete="off">
            {CalendarIcon}
          </Input>
          <div className="flex flex-col-reverse sm:flex-row gap-[8px] sm:gap-[26px] max-w-[500px] w-full mx-auto">
            <Button variant="secondary" onClick={() => window.history.back()}>
              go back
            </Button>
            <Button variant="primary" onClick={handleSave}>
              save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeName;
