import React, { useState, useEffect } from "react";

interface InstagramIconProps {
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  isHovered?: boolean; // Новый пропс для состояния наведения
  isActive?: boolean; // Новый пропс для состояния активности
}

const InstagramIcon: React.FC<InstagramIconProps> = ({
  className,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
  isHovered = false, // Значение по умолчанию
  isActive = false, // Значение по умолчанию
}) => {
  const [color, setColor] = useState("#8D8D8D");

  useEffect(() => {
    if (isActive) setColor("#4EF432");
    else if (isHovered) setColor("#4EF432");
    else setColor("#8D8D8D");
  }, [isHovered, isActive]); // Зависимости обновляются на основе пропсов

  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
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
      <g>
        <path
          d="M16 2.88125C20.275 2.88125 20.7813 2.9 22.4625 2.975C24.025 3.04375 24.8688 3.30625 25.4313 3.525C26.175 3.8125 26.7125 4.1625 27.2688 4.71875C27.8313 5.28125 28.175 5.8125 28.4625 6.55625C28.6813 7.11875 28.9438 7.96875 29.0125 9.525C29.0875 11.2125 29.1063 11.7188 29.1063 15.9875C29.1063 20.2625 29.0875 20.7688 29.0125 22.45C28.9438 24.0125 28.6813 24.8563 28.4625 25.4188C28.175 26.1625 27.825 26.7 27.2688 27.2563C26.7063 27.8188 26.175 28.1625 25.4313 28.45C24.8688 28.6688 24.0188 28.9313 22.4625 29C20.775 29.075 20.2688 29.0938 16 29.0938C11.725 29.0938 11.2188 29.075 9.5375 29C7.975 28.9313 7.13125 28.6688 6.56875 28.45C5.825 28.1625 5.2875 27.8125 4.73125 27.2563C4.16875 26.6938 3.825 26.1625 3.5375 25.4188C3.31875 24.8563 3.05625 24.0063 2.9875 22.45C2.9125 20.7625 2.89375 20.2563 2.89375 15.9875C2.89375 11.7125 2.9125 11.2063 2.9875 9.525C3.05625 7.9625 3.31875 7.11875 3.5375 6.55625C3.825 5.8125 4.175 5.275 4.73125 4.71875C5.29375 4.15625 5.825 3.8125 6.56875 3.525C7.13125 3.30625 7.98125 3.04375 9.5375 2.975C11.2188 2.9 11.725 2.88125 16 2.88125Z"
          fill="none"
          stroke={color}
          strokeWidth="3"
        />
        <path
          d="M16 7.78125C11.4625 7.78125 7.78125 11.4625 7.78125 16C7.78125 20.5375 11.4625 24.2188 16 24.2188C20.5375 24.2188 24.2188 20.5375 24.2188 16C24.2188 11.4625 20.5375 7.78125 16 7.78125ZM16 21.3312C13.0563 21.3312 10.6687 18.9438 10.6687 16C10.6687 13.0563 13.0563 10.6687 16 10.6687C18.9438 10.6687 21.3312 13.0563 21.3312 16C21.3312 18.9438 18.9438 21.3312 16 21.3312Z"
          fill={color}
        />
        <path
          d="M26.4625 7.45586C26.4625 8.51836 25.6 9.37461 24.5438 9.37461C23.4813 9.37461 22.625 8.51211 22.625 7.45586C22.625 6.39336 23.4875 5.53711 24.5438 5.53711C25.6 5.53711 26.4625 6.39961 26.4625 7.45586Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export default InstagramIcon;
