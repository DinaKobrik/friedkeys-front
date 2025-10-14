"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  ChangeEvent,
  ReactNode,
  forwardRef,
  FocusEvent,
  KeyboardEvent,
  useCallback,
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
  primary?: boolean;
  customCaret?: boolean;
  textAlign?: "left" | "right";
  autoComplete?: string;
  readOnly?: boolean;
  isTouched?: boolean;
  isValid?: boolean;
  name?: string;
  backgroundClass?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
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
      primary = false,
      customCaret = false,
      textAlign = "left",
      autoComplete = "off",
      readOnly = false,
      isTouched,
      isValid,
      name,
      backgroundClass,
      onKeyDown,
      onFocus,
      onBlur,
    },
    ref
  ) => {
    const [internalIsTouched, setInternalIsTouched] = useState(false);
    const [internalIsValid, setInternalIsValid] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const [caretPosition, setCaretPosition] = useState(0);
    const [showCaret, setShowCaret] = useState(false);
    const [focusMethod, setFocusMethod] = useState<"keyboard" | "mouse" | null>(
      null
    );
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!, []);

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

    // Функция для вычисления позиции каретки
    const updateCaretPosition = useCallback(() => {
      if (!inputRef.current) return;

      const input = inputRef.current;
      const selectionStart = input.selectionStart || 0;
      const paddingLeft = parseFloat(getComputedStyle(input).paddingLeft) || 20;
      const paddingRight =
        parseFloat(getComputedStyle(input).paddingRight) || 20;
      const maxCaretPosition = input.offsetWidth - paddingRight;

      let textWidth: number;

      if (type === "password") {
        const span = document.createElement("span");
        span.style.font = getComputedStyle(input).font || "16px sans-serif";
        span.style.visibility = "hidden";
        span.style.position = "absolute";
        span.style.whiteSpace = "pre";
        span.textContent = "•".repeat(selectionStart);
        document.body.appendChild(span);
        textWidth = span.offsetWidth;
        document.body.removeChild(span);
      } else {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
          textWidth = selectionStart * 10;
        } else {
          const text = input.value.substring(0, selectionStart);
          context.font = getComputedStyle(input).font || "16px sans-serif";
          textWidth = context.measureText(text).width;
        }
      }
      const newCaretPosition = Math.min(
        textWidth + paddingLeft,
        maxCaretPosition
      );
      setCaretPosition(newCaretPosition);
    }, [type]);

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      updateCaretPosition();
      setIsFocused(true);
      setTimeout(() => setShowCaret(true), 350);

      const isKeyboardFocus =
        e.relatedTarget === null ||
        (e.relatedTarget instanceof HTMLElement &&
          ["INPUT", "BUTTON", "A"].includes(e.relatedTarget.tagName));
      if (isKeyboardFocus) {
        setFocusMethod("keyboard");
      } else if (document.activeElement === inputRef.current) {
        setFocusMethod("mouse");
      }
      onFocus?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setShowCaret(false);
      setCaretPosition(0);
      setFocusMethod(null);
      if (isTouched === undefined) {
        setInternalIsTouched(true);
      }
      onBlur?.(e);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e);
      updateCaretPosition();
      setShowCaret(true);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      setTimeout(updateCaretPosition, 0);
      setShowCaret(true);
      if (e.key === "Tab" || e.key === "ArrowUp" || e.key === "ArrowDown") {
        setFocusMethod("keyboard");
      }
    };

    const handleClick = () => {
      updateCaretPosition();
      setTimeout(() => setShowCaret(true), 350);
      setFocusMethod("mouse");
    };

    useEffect(() => {
      if (isFocused) {
        updateCaretPosition();
      } else {
        setShowCaret(false);
      }
    }, [value, isFocused, updateCaretPosition]);

    const wrapperBaseStyles = "relative w-full";
    const containerBaseStyles =
      "relative w-full text-white focus:outline-none h-[48px] sm:h-[56px]";
    const inputBaseStyles =
      "no-arrows rounded-[2px] w-full h-full px-[20px] py-[16px] border-none bg-transparent placeholder-gray-68 caret-primary-main focus:outline-none";
    const textAlignStyles = textAlign === "right" ? "text-right" : "text-left";
    const skewedContainerStyles = "skew-x-[-20deg]";
    const skewedInputStyles = "skew-x-[20deg]";
    const straightContainerStyles = "";
    const straightInputStyles = "";
    const primaryContainerStyles = primary
      ? "border-[1px] border-primary-20"
      : "";
    const errorStyles = "border-[1px] border-red";

    const containerVariantStyles =
      variant === "skewed" ? skewedContainerStyles : straightContainerStyles;
    const inputVariantStyles =
      variant === "skewed" ? skewedInputStyles : straightInputStyles;

    const inputPaddingStyles =
      type === "date" ? "pr-0" : children ? "pr-[35px]" : "";
    const caretStyles = customCaret ? "caret-transparent" : "";

    return (
      <div className={`${wrapperBaseStyles} ${className}`}>
        {label && (
          <label className="uppercase text-white m-0 font-usuzi-condensed text-[16px] leading-[16px] sm:text-[26px] sm:leading-[28px] mb-[8px] block">
            {label}
          </label>
        )}
        <div
          className={`${containerBaseStyles} ${containerVariantStyles} ${primaryContainerStyles} ${
            backgroundClass || "bg-2"
          } ${!effectiveIsValid && required ? errorStyles : ""} input-status`}
          onFocus={handleFocus}
          onBlur={handleBlur}>
          <input
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            min={type === "number" ? "0" : undefined}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            autoComplete={autoComplete}
            readOnly={readOnly}
            name={name}
            id={name}
            className={`${inputBaseStyles} ${inputVariantStyles} ${textAlignStyles} ${inputPaddingStyles} ${caretStyles}`}
            ref={inputRef}
          />
          {customCaret && isFocused && showCaret && (
            <span
              className="custom-caret"
              style={{ left: `${caretPosition}px` }}
            />
          )}
          {children}
          <div
            className={`focus-border ${
              focusMethod === "keyboard" ? "keyboard" : ""
            } ${focusMethod === "mouse" ? "mouse" : ""}`}
          />
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
