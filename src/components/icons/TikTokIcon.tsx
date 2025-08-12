import React, { useState, useEffect } from "react";

interface TikTokIconProps {
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

const TikTokIcon: React.FC<TikTokIconProps> = ({
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
        d="M22.7633 0H17.3704V21.7971C17.3704 24.3942 15.2962 26.5276 12.715 26.5276C10.1337 26.5276 8.05955 24.3942 8.05955 21.7971C8.05955 19.2464 10.0877 17.1594 12.5767 17.0667V11.5942C7.09158 11.6869 2.66663 16.1855 2.66663 21.7971C2.66663 27.4551 7.18377 32 12.7611 32C18.3383 32 22.8555 27.4087 22.8555 21.7971V10.6203C24.8836 12.1044 27.3726 12.9855 30 13.0319V7.55942C25.9438 7.42029 22.7633 4.08116 22.7633 0Z"
        fill={color}
      />
    </svg>
  );
};

export default TikTokIcon;
