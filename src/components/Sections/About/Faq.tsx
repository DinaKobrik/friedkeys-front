"use client";

import React, { useState } from "react";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";

const FAQItem = ({
  question,
  answer,
  index,
  openIndex,
  onToggle,
}: {
  question: string;
  answer: string;
  index: number;
  openIndex: number | null;
  onToggle: (index: number) => void;
}) => {
  const isOpen = openIndex === index;

  return (
    <div className="relative max-w-[798px] mx-auto mb-[8px] sm:mb-[12px]">
      <div
        className={`card-corner cursor-pointer overflow-hidden relative z-[1] flex justify-between gap-[20px] items-center w-full px-[16px] py-[28px] sm:px-[24px] bg-2 border-none z-2 ${
          isOpen ? "mb-[8px]" : ""
        }`}
        onClick={() => onToggle(index)}>
        <Heading variant="h3">{question}</Heading>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-500 w-[24px] h-[24px] ${
            isOpen ? "" : "rotate-180"
          }`}>
          <path
            d="M25.3307 20.6666L15.9974 11.3333L6.66406 20.6666"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
        </svg>
        <span
          className={`absolute opacity-${
            isOpen ? "1" : "0"
          } w-1/2 h-1/5 -bottom-1/4 left-1/2 -translate-x-1/2 bg-[#4ef432] blur-[50px] z-[-1] transition-opacity duration-500`}
        />
      </div>
      <p
        className={`card-corner relative bg-2 ${
          isOpen
            ? "max-h-[1000px] opacity-100 p-[16px] pb-[24px] sm:p-[24px] sm:pb-[30px] text-[15px] leading-[20px]"
            : "max-h-0 opacity-0 p-0"
        } transition-all duration-500 overflow-hidden`}
        dangerouslySetInnerHTML={{ __html: answer }}
      />
    </div>
  );
};

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: "How do I buy a game on FriedKeys?",
      answer:
        "Buying a game is fast and easy. Simply browse our catalog or use the search bar to find the title you want.<br>Click “<span style='font-weight: bold;'>Buy Now</span>” or add it to your cart. Then proceed to checkout, choose your preferred payment method, and complete the purchase.<br>Once the payment is confirmed, your activation key will be sent to your email — usually within seconds. You can also find it in your account under “<span style='font-weight: bold;'>My Orders</span>.”",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Most of the time, you’ll receive your key instantly after your payment is confirmed.<br>  On rare occasions, an order may require manual verification for security reasons — especially for new users or high-value orders — but we’ll notify you and it’s usually resolved within minutes.",
    },
  ];

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section>
      <Heading variant="h2" className="mb-[8px] sm:mb-[18px]">
        FAQs
      </Heading>
      <Text className="mb-[16px] sm:mb-[30px]">
        {`Whether it’s about game keys, platforms, or regions — we’ve got the
        answers. Browse the FAQs or hit us up if you're stuck`}
      </Text>
      {faqData.map((item, index) => (
        <FAQItem
          key={index}
          question={item.question}
          answer={item.answer}
          index={index}
          openIndex={openIndex}
          onToggle={toggleAnswer}
        />
      ))}
      <Button
        onClick={() => {
          window.location.href = "/faq";
        }}
        variant="secondary"
        className="max-w-[164px] mt-[16px] sm:mt-[30px]">
        see all faqs
      </Button>
    </section>
  );
};

export default Faq;
