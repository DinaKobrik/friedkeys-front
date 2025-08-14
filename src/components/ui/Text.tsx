import React, { ReactNode } from "react";

type TextProps = {
  children: ReactNode;
  className?: string;
};

const Text: React.FC<TextProps> = ({ children, className = "" }) => {
  return (
    <p
      className={`text-white text-[15px] leading-[18px] sm:text-[20px] sm:leading-[26px] ${className}`}>
      {children}
    </p>
  );
};

export default Text;
