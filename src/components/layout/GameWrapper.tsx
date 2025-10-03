import React from "react";

interface GameWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
}

const GameWrapper = React.forwardRef<HTMLDivElement, GameWrapperProps>(
  (
    {
      children,
      className = "",
      style,
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      onTouchStart,
      onTouchEnd,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`flex overflow-scroll hide-scrollbar w-full gap-[8px] sm:gap-[14px] lg:gap-[24px] mt-[24px] sm:mt-[40px] ${className}`}
        style={style}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}>
        {children}
      </div>
    );
  }
);

GameWrapper.displayName = "GameWrapper";

export default GameWrapper;
