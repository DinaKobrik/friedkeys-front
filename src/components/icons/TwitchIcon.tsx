import React, { useState, useEffect } from "react";

interface TwitchIconProps {
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  isHovered?: boolean;
  isActive?: boolean;
}

const TwitchIcon: React.FC<TwitchIconProps> = ({
  className,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
  isHovered = false,
  isActive = false,
}) => {
  const [color, setColor] = useState("#8D8D8D");

  useEffect(() => {
    if (isActive) setColor("#4EF432");
    else if (isHovered) setColor("#4EF432");
    else setColor("#8D8D8D");
  }, [isHovered, isActive]);

  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onMouseEnter={() => {
        if (onMouseEnter) onMouseEnter();
      }}
      onMouseLeave={() => {
        if (onMouseLeave) onMouseLeave();
      }}
      onMouseDown={() => {
        if (onMouseDown) onMouseDown();
      }}
      onMouseUp={() => {
        if (onMouseUp) onMouseUp();
      }}
      onTouchStart={() => {
        if (onTouchStart) onTouchStart();
      }}
      onTouchEnd={() => {
        if (onTouchEnd) onTouchEnd();
      }}>
      <path
        d="M8.00091 0L2.28662 5.71429V26.2857H9.14376V32L14.858 26.2857H19.4295L29.7152 16V0H8.00091ZM27.4295 14.8571L22.858 19.4286H18.2866L14.2866 23.4286V19.4286H9.14376V2.28571H27.4295V14.8571Z"
        fill={color}
      />
      <path
        d="M24.0009 6.28613H21.7152V13.1433H24.0009V6.28613Z"
        fill={color}
      />
      <path
        d="M17.7152 6.28613H15.4294V13.1433H17.7152V6.28613Z"
        fill={color}
      />
    </svg>
  );
};

export default TwitchIcon;
