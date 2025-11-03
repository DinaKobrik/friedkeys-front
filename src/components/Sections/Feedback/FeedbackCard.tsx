"use client";
import React from "react";
import Text from "@/components/ui/Text";

const ReviewCard: React.FC = () => {
  return (
    <div className="card-corner flex flex-col p-[16px] bg-2 min-w-[135px] xs:min-w-[175px]">
      <div className="flex flex-col 2xl:flex-row items-center justify-between gap-[12px] mb-[16px]">
        <div className="flex items-center justify-start w-full gap-[8px] sm:gap-[12px]">
          <div className="w-[44px] h-[44px] sm:w-[48px] sm:h-[48px] bg-3 rounded-full flex justify-center items-center flex-shrink-0">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[28px] h-[28px] sm:w-[40px] sm:h-[40px] ">
              <circle
                cx="20.0026"
                cy="19.9999"
                r="15.4167"
                stroke="#4EF432"
                strokeWidth="2.5"
              />
              <path
                d="M19.0601 13.7957L15.8672 24.6177L16.1693 25.1209H22.1571"
                stroke="#4EF432"
                strokeWidth="2.5"
                strokeLinecap="square"
              />
              <path
                d="M27.3125 18.623H27.3292"
                stroke="#4EF432"
                strokeWidth="2.5"
                strokeLinecap="square"
              />
              <path
                d="M11.5547 18.623H11.5714"
                stroke="#4EF432"
                strokeWidth="2.5"
                strokeLinecap="square"
              />
            </svg>
          </div>
          <div className="text-white font-bold text-[15px] leading-[15px] overflow-hidden text-ellipsis whitespace-nowrap">
            Long long Username
          </div>
        </div>
        <div className="flex gap-0">
          {Array.from({ length: 5 }, (_, i) => (
            <svg
              key={i}
              className="w-[24px] h-[24px] fill-primary-10"
              viewBox="0 0 26 25"
              fill="currentColor">
              <path d="M12.0515 1.5103C12.3509 0.588992 13.6543 0.588992 13.9537 1.5103L16.2393 8.54492C16.3732 8.95695 16.7572 9.23591 17.1904 9.23591H24.587C25.5558 9.23591 25.9585 10.4755 25.1748 11.0449L19.1908 15.3926C18.8403 15.6472 18.6937 16.0986 18.8276 16.5106L21.1132 23.5452C21.4126 24.4665 20.3581 25.2326 19.5744 24.6632L13.5904 20.3156C13.2399 20.061 12.7653 20.061 12.4148 20.3156L6.43081 24.6632C5.6471 25.2326 4.59262 24.4665 4.89197 23.5452L7.17766 16.5106C7.31153 16.0986 7.16487 15.6472 6.81439 15.3926L0.830381 11.0449C0.0466671 10.4755 0.449442 9.23591 1.41817 9.23591H8.81481C9.24803 9.23591 9.63199 8.95695 9.76586 8.54492L12.0515 1.5103Z" />
            </svg>
          ))}
        </div>
      </div>
      <Text className=" mb-[16px]">
        Bought 3 games during a sale — all keys arrived instantly and worked
        without issues. Love how smooth everything was
      </Text>

      <p className="text-gray-68 text-[12px] leading-[16px] sm:text-[13px] sm:leading-[15px]">
        less than a minute ago
      </p>
    </div>
  );
};

export default ReviewCard;
