"use client";
import React from "react";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import UsersFeedbacks from "@/components/Sections/Feedback/UsersFeedbacks";

const ReviewsPage: React.FC = () => {
  return (
    <main className="mt-[24px] sm:mt-[80px] flex flex-col gap-[24px] sm:gap-[80px]">
      <section>
        <Heading
          variant="h3"
          className="mb-[24px] sm:mb-[40px]">{`Home / User's feedbacks`}</Heading>
        <Heading variant="h1">{` User's feedbacks`}</Heading>
      </section>
      <section
        className={`card-corner cursor-pointer overflow-hidden relative z-[1] flex flex-col lg:flex-row justify-between gap-[24px] items-center w-full sm:px-[32px] sm:pb-[40px] sm:py-[34px] px-[16px] py-[28px] bg-2 border-none z-2 `}>
        <Heading variant="h3">
          Tell us what you think about FriedKeys — your feedback helps us
          improve and grow.
        </Heading>
        <Button
          variant="secondary"
          className="max-w-[calc(100%-18px)] lg:max-w-[400px]"
          onClick={() => {
            window.location.href = "/feedback/feedback-website";
          }}>
          Write a Review
        </Button>
        <span
          className={`absolute w-1/2 h-1/5 -bottom-1/4 left-1/2 -translate-x-1/2 bg-[#4ef432] blur-[50px] z-[-1] transition-opacity duration-500`}
        />
      </section>
      <UsersFeedbacks
        initialReviews={294}
        containerClassName="grid grid-cols-2 lg:grid-cols-3 gap-[11px] sm:gap-[24px] mb-[24px] sm:mb-[56px]"
      />
      <section className="join-review">
        <div className="p-[16px] sm:p-[54px] max-w-[876px] text-center mx-auto ">
          <Heading variant="h2" className="mb-[16px]">
            Join the Squad — Share Your Thoughts!
          </Heading>
          <Text className="mb-[16px] sm:mb-[48px]">
            Loved your deal? Got something to say? Let other gamers know what
            FriedKeys is all about.Drop a quick review and help shape the
            community.
          </Text>
          <Button
            onClick={() => {
              window.location.href = "/feedback/feedback-website";
            }}
            variant="primary"
            className="max-w-[calc(100%-18px)] sm:max-w-[500px]">
            Write a Review
          </Button>
        </div>
      </section>
    </main>
  );
};

export default ReviewsPage;
