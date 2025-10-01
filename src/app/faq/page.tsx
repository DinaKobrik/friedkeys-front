"use client";

import React, { useState } from "react";
import Heading from "@/components/ui/Heading";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    {
      section: "Purchasing & Orders",
      questions: [
        {
          question: "How do I buy a game on FriedKeys?",
          answer:
            "Buying a game is fast and easy. Simply browse our catalog or use the search bar to find the title you want.<br>Click “<span style='font-weight: bold;'>Buy Now</span>” or add it to your cart. Then proceed to checkout, choose your preferred payment method, and complete the purchase.<br>Once the payment is confirmed, your activation key will be sent to your email — usually within seconds. You can also find it in your account under “<span style='font-weight: bold;'>My Orders</span>.”",
        },
        {
          question: "Do I need an account to buy a game?",
          answer:
            "No, you can purchase as a guest.<br> However, we recommend creating an account — it allows you to track your orders, re-download keys at any time, get special offers, and receive loyalty rewards.",
        },
        {
          question: "Will I get a receipt or invoice?",
          answer:
            "Yes. After a successful purchase, we send a confirmation email with your receipt and order details.<br> You can also view and download your receipts anytime in your account dashboard.",
        },
        {
          question: "Can I refund a game?",
          answer:
            "Yes — if the key has not been used or activated, we offer refunds within 14 days of purchase.<br> Unfortunately, once a key has been redeemed on its platform, it cannot be returned or refunded.<br> For more information, see our Refund Policy.",
        },
        {
          question: "Do you offer pre-orders or early access?",
          answer:
            "Yes! For selected upcoming titles, we offer pre-orders at discounted prices.<br>  When available, you'll see a release date on the product page, and we’ll email you the key on or before launch day.<br> Still have questions?",
        },
      ],
    },
    {
      section: "Game Keys & Delivery",
      questions: [
        {
          question: "How long does delivery take?",
          answer:
            "Most of the time, you’ll receive your key instantly after your payment is confirmed.<br>  On rare occasions, an order may require manual verification for security reasons — especially for new users or high-value orders — but we’ll notify you and it’s usually resolved within minutes.",
        },
        {
          question: " I didn’t get my key. What should I do?",
          answer:
            "Don’t worry — most keys are sent instantly to your email.<br>  If it’s not in your inbox, please check your:<br> <ul style='padding-left: 20px; list-style-type: disc;'><li>Spam / Junk folder</li><li>Promotions tab (for Gmail users)</li></ul><br> Still nothing? Go to your FriedKeys account and check the “<span style='font-weight: bold;'>My Orders</span>” section. If the key isn’t there either, reach out to our support team.<br> We’ll respond quickly and help you get your key as soon as possible.",
        },
        {
          question: "Are your keys legit and safe to use?",
          answer:
            "Absolutely. At FriedKeys, we only work with official distributors and trusted partners.<br>  Every key you purchase from us is 100% genuine, legal, and safe to activate.<br>  No grey market, no surprises, no risk of your account being banned.",
        },
        {
          question: "Are your keys region-locked?",
          answer:
            "Some game keys are restricted to specific regions or countries.<br>  We always display the Activation Region clearly on the product page, so you can verify that the key will work in your area before purchasing.<br>  If your key is region-locked and doesn't match your location, it may not activate — so always double-check.",
        },
      ],
    },
    {
      section: "Platforms & Activation",
      questions: [
        {
          question: "What platforms do you support?",
          answer:
            "We sell game keys for the most popular platforms, including: <ul style='padding-left: 20px; list-style-type: disc;'><li>Steam</li><li>Epic Games Store</li><li>Ubisoft Connect (Uplay)</li><li>Origin</li><li>Battle.net</li><li>GOG<br>  Each product page clearly indicates the platform the key is for. Be sure to check this before purchasing.</li></ul>",
        },
        { question: "2", answer: "2" },
        { question: "3", answer: "3" },
      ],
    },
    {
      section: "Account & Support",
      questions: [
        { question: "1", answer: "1" },
        { question: "2", answer: "2" },
        { question: "3", answer: "3" },
      ],
    },
  ];

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="mt-[24px] sm:mt-[80px]">
      <section>
        <Heading variant="h3" className="mb-[24px] sm:mb-[40px]">
          Home / faqs
        </Heading>
        <Heading variant="h1" className="mb-[24px] sm:mb-[80px]">
          Frequently Asked Questions
        </Heading>
        <div className="max-w-[1064px] mx-auto">
          {faqData.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-[32px] sm:mb-[56px]">
              <Heading variant="h2" className="mb-[16px] sm:mb-[48px]">
                {section.section}
              </Heading>
              {section.questions.map((item, index) => {
                const globalIndex = sectionIndex * 10 + index;
                const isOpen = openIndex === globalIndex;

                return (
                  <div key={index} className="relative mb-[8px] sm:mb-[16px]">
                    <div
                      className={`card-corner cursor-pointer overflow-hidden relative z-[1]  flex justify-between gap-[20px] items-center w-full sm:px-[32px] sm:py-[34px] px-[16px] py-[28px] bg-2 border-none z-2 ${
                        isOpen ? "mb-[8px]" : ""
                      }`}
                      onClick={() => toggleAnswer(globalIndex)}>
                      <Heading variant="h3">{item.question}</Heading>
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-transform duration-500 w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] ${
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
                          ? "max-h-[1000px] opacity-100 p-[16px] pb-[24px] sm:p-[32px] sm:pb-[40px]"
                          : "max-h-0 opacity-0 p-0"
                      } transition-all duration-500 overflow-hidden`}
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default FAQPage;
