import React from "react";

interface GameWrapperProps {
  children: React.ReactNode;
}

const GameWrapper: React.FC<GameWrapperProps> = ({ children }) => {
  return (
    <div className="flex overflow-scroll xl:overflow-visible scroll-none w-full gap-[8px] sm:gap-[24px] mt-[24px] sm:mt-[40px]">
      {children}
    </div>
  );
};

export default GameWrapper;
