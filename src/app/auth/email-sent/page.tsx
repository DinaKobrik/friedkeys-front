"use client";

import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Link from "next/link";

const EmailSent = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[100vh] max-w-[792px] mx-auto mt-[40px]">
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
      <div className="flex flex-col sm:flex-row gap-[20px] w-full">
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
    </div>
  );
};
export default EmailSent;
