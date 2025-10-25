import React from "react";

const baseStyles = "text-white m-0";

const headingStyles = {
  h1: `${baseStyles} font-usuzi text-[24px] leading-[26px] sm:text-[36px] sm:leading-[42px]`,
  h2: `${baseStyles} font-usuzi-condensed text-[20px] leading-[24px] sm:text-[28px] sm:leading-[33px] `,
  h3: `${baseStyles} font-usuzi-condensed text-[16px] leading-[16px] sm:text-[19px] sm:leading-[21px]`,
};

interface HeadingProps {
  variant: keyof typeof headingStyles;
  children: React.ReactNode;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({
  variant,
  children,
  className = "",
}) => {
  const classes = `${headingStyles[variant]} ${className}`;

  const Tag = variant as keyof JSX.IntrinsicElements; // Динамический тег (h1, h2, h3)

  return <Tag className={classes}>{children}</Tag>;
};

export default Heading;
