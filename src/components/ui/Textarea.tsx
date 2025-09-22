"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  ReactNode,
  KeyboardEvent,
} from "react";
import Text from "@/components/ui/Text";

interface TextareaProps {
  label?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
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
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  value,
  onChange,
  onKeyDown,
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
}) => {
  const [internalIsTouched, setInternalIsTouched] = useState(false);
  const [internalIsValid, setInternalIsValid] = useState(true);

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
    "relative w-full text-white bg-2 focus:outline-none input-status";
  const textareaBaseStyles =
    "custom-scrollbar w-full px-[20px] py-[16px] border-none bg-transparent placeholder-gray-68 caret-primary-main focus:outline-none resize-none";
  const textAlignStyles = textAlign === "right" ? "text-right" : "text-left";
  const skewedContainerStyles = "skew-x-[-20deg]";
  const skewedTextareaStyles = "skew-x-[20deg]";
  const straightContainerStyles = "";
  const straightTextareaStyles = "";
  const errorStyles = "border-[1px] border-red";

  const containerVariantStyles =
    variant === "skewed" ? skewedContainerStyles : straightContainerStyles;
  const textareaVariantStyles =
    variant === "skewed" ? skewedTextareaStyles : straightTextareaStyles;

  return (
    <div className={`${wrapperBaseStyles}`}>
      {label && (
        <label className="uppercase text-white m-0 font-usuzi-condensed text-[16px] leading-[16px] sm:text-[26px] sm:leading-[28px] mb-[8px] block">
          {label}
        </label>
      )}
      <div
        className={`${containerBaseStyles} ${containerVariantStyles} ${
          !effectiveIsValid && required ? errorStyles : ""
        }`}>
        <textarea
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          onBlur={handleBlur}
          autoComplete={autoComplete}
          readOnly={readOnly}
          name={name}
          className={`${textareaBaseStyles} ${textareaVariantStyles} ${textAlignStyles} ${
            className || ""
          }`}
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
};

export default Textarea;
