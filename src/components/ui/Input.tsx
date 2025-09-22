"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  ReactNode,
  forwardRef,
} from "react";
import Text from "@/components/ui/Text";

interface InputProps {
  label?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  errorMessage?: string;
  children?: ReactNode;
  variant?: "straight" | "skewed";
  textAlign?: "left" | "right";
  autoComplete?: string;
  readOnly?: boolean;
  isTouched?: boolean;
  isValid?: boolean;
  name?: string;
  backgroundClass?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLInputElement>;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      value,
      onChange,
      type = "text",
      required = false,
      placeholder,
      className,
      errorMessage,
      children,
      variant = "straight",
      textAlign = "left",
      autoComplete = "off",
      readOnly = false,
      isTouched,
      isValid,
      name,
      backgroundClass,
      onKeyDown,
    },
    ref
  ) => {
    const [internalIsTouched, setInternalIsTouched] = useState(false);
    const [internalIsValid, setInternalIsValid] = useState(true);

    // Используем внешние пропсы, если они переданы, иначе внутренние состояния
    const effectiveIsTouched =
      isTouched !== undefined ? isTouched : internalIsTouched;
    const effectiveIsValid = isValid !== undefined ? isValid : internalIsValid;

    useEffect(() => {
      if (
        isValid === undefined &&
        required &&
        !value.trim() &&
        effectiveIsTouched
      ) {
        setInternalIsValid(false);
      } else if (isValid === undefined) {
        setInternalIsValid(true);
      }
    }, [value, required, effectiveIsTouched, isValid]);

    const handleBlur = () => {
      if (isTouched === undefined) {
        setInternalIsTouched(true);
      }
    };

    const wrapperBaseStyles = "relative w-full";
    const containerBaseStyles =
      "relative w-full text-white focus:outline-none h-[48px] sm:h-[56px]";
    const inputBaseStyles =
      "w-full h-full px-[20px] py-[16px] border-none bg-transparent placeholder-gray-68 caret-primary-main focus:outline-none";
    const textAlignStyles = textAlign === "right" ? "text-right" : "text-left";
    const skewedContainerStyles = "skew-x-[-20deg]";
    const skewedInputStyles = "skew-x-[20deg]";
    const straightContainerStyles = "";
    const straightInputStyles = "";
    const errorStyles = "border-[1px] border-red";

    const containerVariantStyles =
      variant === "skewed" ? skewedContainerStyles : straightContainerStyles;
    const inputVariantStyles =
      variant === "skewed" ? skewedInputStyles : straightInputStyles;

    return (
      <div className={`${wrapperBaseStyles} ${className}`}>
        {label && (
          <label className="uppercase text-white m-0 font-usuzi-condensed text-[16px] leading-[16px] sm:text-[26px] sm:leading-[28px] mb-[8px] block">
            {label}
          </label>
        )}
        <div
          className={`${containerBaseStyles} ${containerVariantStyles} ${
            backgroundClass || "bg-2"
          } ${!effectiveIsValid && required ? errorStyles : ""} input-status`}>
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={type === "number" ? "0" : undefined}
            onBlur={handleBlur}
            autoComplete={autoComplete}
            readOnly={readOnly}
            name={name}
            id={name}
            className={`${inputBaseStyles} ${inputVariantStyles} ${textAlignStyles}`}
            onKeyDown={onKeyDown}
            ref={ref}
          />
          {children}
        </div>
        {!effectiveIsValid && required && effectiveIsTouched && (
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
            {errorMessage}
          </Text>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
