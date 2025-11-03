"use client";

import Text from "@/components/ui/Text";

const StatItem = ({ number, label }: { number: string; label: string }) => (
  <div className="flex flex-col gap-[16px] justify-center items-center">
    <div className="font-usuzi-halftone italic text-primary-main text-[24px] leading-[26px] sm:text-[50px] sm:leading-[54px] xl:text-[48px] xl:leading-[54px]">
      {number}
    </div>
    <Text>{label}</Text>
  </div>
);

const Stats = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 2xl:flex justify-around items-center py-[30px] gap-[24px]">
      <StatItem number="10 000+" label="games in our catalog" />
      <StatItem number="500 000+" label="happy customers" />
      <StatItem number="1M+" label="games in our catalog" />
      <StatItem number="4.9/5" label="average customer rating" />
    </section>
  );
};

export default Stats;
