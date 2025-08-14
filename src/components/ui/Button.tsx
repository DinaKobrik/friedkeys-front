import React from "react";
import classNames from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  disabled = false,
  children,
  className,
  ...props
}) => {
  const baseStyles =
    "font-usuzi-condensed block my-0 mx-auto rounded-[2px] cursor-pointer text-[17px] leading-[19px] sm:text-[26px] sm:leading-[28px] font-bold uppercase text-center px-[12px] py-[12px] w-full focus:outline-none skew-x-[-20deg]";

  const variantStyles = {
    primary: "btn-primary text-main z-5 bg-primary-main",
    secondary:
      "btn-secondary text-white border-2 bg-transparent border-primary-main z-10",
  };

  const buttonClasses = classNames(
    baseStyles,
    variantStyles[variant],
    { "cursor-not-allowed": disabled },
    className
  );

  return (
    <button className={buttonClasses} disabled={disabled} {...props}>
      <span className="flex justify-center items-center skew-x-[20deg]">
        {children}
      </span>
    </button>
  );
};

export default Button;
