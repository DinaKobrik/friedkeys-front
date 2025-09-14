"use client";

import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Link from "next/link";

const EmailSent = () => {
  return (
    <main className="mt-[40px]">
      <section className="min-h-screen flex flex-col justify-center items-center max-w-[792px] mx-auto">
        <Heading variant="h1" className="mb-[24px] sm:mb-[32px] text-center">
          Email Sent
        </Heading>
        <Text className="mb-[32px] sm:mb-[56px]">
          We’ve sent a password reset link to your email{" "}
          <Link href="mailto:example@mail.com" className="font-bold text-white">
            example@mail.com
          </Link>
          .
          <br />
          Please check your inbox and follow the instructions in the message.
          <br />
          <br />
          Don’t forget to check your spam or promotions folder just in case.
        </Text>
        <Text className="mb-[24px] sm:mb-[32px]">
          If you didn’t receive the email, you can try again in a few minutes.
        </Text>
        <div className="flex flex-col sm:flex-row gap-[20px] w-full max-w-[calc(100%-20px)] mx-auto">
          <Button
            variant="secondary"
            onClick={() => {
              window.location.href = "/auth/log-in";
            }}
            className="max-w-[502px]">
            Back to Login
          </Button>
          <Button variant="primary" className="max-w-[502px]">
            Resend Email
          </Button>
        </div>
      </section>
    </main>
  );
};
export default EmailSent;
