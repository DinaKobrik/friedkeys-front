"use client";

import React, { useState, useEffect, useMemo } from "react";
import Heading from "@/components/ui/Heading";
import Image from "next/image";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";

interface PaymentMethodProps {
  onMethodSelect?: (method: string) => void;
  isPayClicked?: boolean;
}

const PaymentMethod = ({
  onMethodSelect,
  isPayClicked = false,
}: PaymentMethodProps) => {
  const [checkboxStates, setCheckboxStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [securityNumber, setSecurityNumber] = useState("");
  const [touchedFields, setTouchedFields] = useState<{
    cardNumber: boolean;
    cardholderName: boolean;
    expiryDate: boolean;
    securityNumber: boolean;
  }>({
    cardNumber: false,
    cardholderName: false,
    expiryDate: false,
    securityNumber: false,
  });

  const paymentMethods = useMemo(
    () => [
      { name: "PayPal", fee: "(+0.00$)" },
      { name: "Card", fee: "" },
      { name: "Crypto", fee: "" },
      { name: "Wallet", fee: "" },
    ],
    []
  );

  useEffect(() => {
    const initialStates = paymentMethods.reduce((acc, method) => {
      acc[`save-${method.name}`] = false;
      return acc;
    }, {} as { [key: string]: boolean });
    setCheckboxStates(initialStates);
  }, [paymentMethods]);

  const handleMethodClick = (methodName: string) => {
    setSelectedMethod((prev) => (prev === methodName ? null : methodName));
    if (onMethodSelect && methodName !== selectedMethod) {
      onMethodSelect(methodName);
    }
  };

  const handleCheckboxToggle = (id: string) => {
    setCheckboxStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Валидация и обработка инпутов
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 16) {
      setCardNumber(value);
      setTouchedFields((prev) => ({ ...prev, cardNumber: true }));
    }
  };

  const handleCardholderNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setCardholderName(value);
    setTouchedFields((prev) => ({ ...prev, cardholderName: true }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + " / " + value.slice(2, 4);
    }
    setExpiryDate(value);
    setTouchedFields((prev) => ({ ...prev, expiryDate: true }));
  };

  const handleSecurityNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 3) {
      setSecurityNumber(value);
      setTouchedFields((prev) => ({ ...prev, securityNumber: true }));
    }
  };

  const isCardNumberValid = cardNumber.length === 16;
  const isCardholderNameValid =
    cardholderName.length > 0 && !/[^a-zA-Z\s]/.test(cardholderName);
  const isExpiryDateValid =
    expiryDate.length === 7 && /^\d{2}\s\/\s\d{2}$/.test(expiryDate);
  const isSecurityNumberValid = securityNumber.length === 3;

  const shouldShowCardErrors = isPayClicked && selectedMethod === "Card";

  return (
    <section>
      <div className="mb-[16px] sm:mb-[40px]">
        <Heading variant="h1" aria-label="Payment Method">
          Payment Method
        </Heading>
        {isPayClicked && selectedMethod === null && (
          <Text className="mt-[8px] flex items-center gap-[16px]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2.75C17.108 2.75 21.25 6.891 21.25 12C21.25 17.108 17.108 21.25 12 21.25C6.891 21.25 2.75 17.108 2.75 12C2.75 6.891 6.891 2.75 12 2.75Z"
                stroke="#D64431"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.9951 8.2041V12.6231"
                stroke="#D64431"
                strokeWidth="1.5"
                strokeLinecap="square"
                strokeLinejoin="round"
              />
              <path
                d="M11.995 15.7959H12.005"
                stroke="#D64431"
                strokeWidth="1.5"
                strokeLinecap="square"
                strokeLinejoin="round"
              />
            </svg>
            Please select a payment method
          </Text>
        )}
      </div>
      <div className="flex w-full flex-col gap-[16px] sm:gap-[32px]">
        {paymentMethods.map((method, index) => {
          const checkboxId = `save-${method.name}`;
          const isChecked = checkboxStates[checkboxId] || false;
          const isSelected = selectedMethod === method.name;

          return (
            <div key={index} className="flex flex-col w-full gap-[8px]">
              <div
                className={`w-full card-corner cursor-pointer h-[68px] sm:h-[128px] flex gap-[8px]`}
                onClick={() => handleMethodClick(method.name)}>
                <div className="flex-shrink-0 bg-2 px-[11px] py-[24px] sm:px-[20px] sm:py-[29px] w-[82px] sm:w-[180px] md:w-[248px] flex justify-center items-center">
                  <Image
                    src={`/images/payment/${method.name.toLowerCase()}.png`}
                    alt={`${method.name} payment method`}
                    width={200}
                    height={100}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="relative bg-3 p-[12px] sm:py-[30px] sm:px-[24px] w-full flex flex-col items-start justify-between">
                  {isSelected && (
                    <div className="h-[7px] w-[75%] absolute bottom-0 left-[50%] bg-primary-main translate-x-[-50%] blur-[30px] z-0"></div>
                  )}
                  <div className="flex items-center gap-[12px]">
                    <Heading variant="h3">{method.name}</Heading>
                    <span className="text-white text-[15px] leading-[16px] sm:text-[20px] sm:leading-[20px]">
                      {method.fee}
                    </span>
                  </div>
                  {index < 2 && (
                    <div className="flex items-center gap-[8px]">
                      <div
                        className="w-[18px] h-[18px] bg-transparent border-2 border-white rounded-sm flex items-center justify-center cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckboxToggle(checkboxId);
                        }}>
                        {isChecked && (
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
                      <input
                        type="checkbox"
                        id={checkboxId}
                        className="hidden"
                        checked={isChecked}
                        onChange={() => {}}
                      />
                      <label
                        htmlFor={checkboxId}
                        className="text-white text-[13px] leading-[13px] sm:text-[16px]"
                        onClick={() => handleMethodClick(method.name)}>
                        Save for your next purchase
                      </label>
                    </div>
                  )}
                </div>
              </div>
              {isSelected && (
                <div className="w-full bg-2 card-corner p-[12px] sm:p-[24px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 items-end w-full gap-y-[18px] md:gap-y-[32px] gap-x-[12px] md:gap-x-[40px]">
                    <Input
                      type="text"
                      value={cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ")}
                      name="cardNumber"
                      label="Card number"
                      placeholder="•••• •••• •••• ••••"
                      variant="straight"
                      onChange={handleCardNumberChange}
                      required
                      errorMessage={
                        shouldShowCardErrors && !isCardNumberValid
                          ? "Must be exactly 16 digits"
                          : undefined
                      }
                      className="mb-[0]"
                      autoComplete="off"
                      backgroundClass="bg-3"
                      isTouched={
                        touchedFields.cardNumber || shouldShowCardErrors
                      }
                      isValid={isCardNumberValid}
                    />
                    <Input
                      type="text"
                      value={cardholderName}
                      name="cardholderName"
                      label="Cardholder name"
                      placeholder="J. Smith"
                      variant="straight"
                      onChange={handleCardholderNameChange}
                      required
                      errorMessage={
                        shouldShowCardErrors && !isCardholderNameValid
                          ? "Only letters and spaces allowed"
                          : undefined
                      }
                      className="mb-[0]"
                      autoComplete="off"
                      backgroundClass="bg-3"
                      isTouched={
                        touchedFields.cardholderName || shouldShowCardErrors
                      }
                      isValid={isCardholderNameValid}
                    />
                    <Input
                      type="text"
                      value={expiryDate}
                      name="expiryDate"
                      label="Expiry date"
                      placeholder="MM / YY"
                      variant="straight"
                      onChange={handleExpiryDateChange}
                      required
                      errorMessage={
                        shouldShowCardErrors && !isExpiryDateValid
                          ? "Must be 4 digits"
                          : undefined
                      }
                      className="mb-[0]"
                      autoComplete="off"
                      backgroundClass="bg-3"
                      isTouched={
                        touchedFields.expiryDate || shouldShowCardErrors
                      }
                      isValid={isExpiryDateValid}
                    />
                    <Input
                      type="text"
                      value={securityNumber}
                      name="securityNumber"
                      label="Security number"
                      placeholder="CVC"
                      variant="straight"
                      onChange={handleSecurityNumberChange}
                      required
                      errorMessage={
                        shouldShowCardErrors && !isSecurityNumberValid
                          ? "Must be exactly 3 digits"
                          : undefined
                      }
                      className="mb-[0]"
                      autoComplete="off"
                      backgroundClass="bg-3"
                      isTouched={
                        touchedFields.securityNumber || shouldShowCardErrors
                      }
                      isValid={isSecurityNumberValid}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PaymentMethod;
