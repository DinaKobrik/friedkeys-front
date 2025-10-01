"use client";

import React, { useState, useEffect } from "react";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EmailVerify: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("example@mail.com");

  useEffect(() => {
    const storedEmail = localStorage.getItem("logInEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <main className="my-[40px]">
      <section className="min-h-[calc(100vh-170px)] flex flex-col justify-center items-center max-w-[792px] mx-auto">
        <Heading variant="h1" className="mb-[24px] sm:mb-[32px]">
          Verify Your Email
        </Heading>
        <Text className="mb-[32px] sm:mb-[56px] max-w-[624px] w-full mx-auto">
          We’ve sent a password reset link to your email{" "}
          <Link href={`mailto:${email}`} className="font-bold text-white">
            {email}
          </Link>
          .
          <br />
          Please check your inbox and click the link to verify your account.
          <br />
          <br />
          Don’t forget to check your spam or promotions folder just in case.
        </Text>
        <Text className="mb-[24px] sm:mb-[32px] max-w-[624px] w-full mx-auto">
          If you didn’t receive the email, you can try again in a few minutes.
        </Text>
        <div className="flex flex-col sm:flex-row gap-[20px] w-full max-w-[calc(100%-20px)] mx-auto">
          <Button
            variant="secondary"
            onClick={() => router.push("/auth/profile/log-in")}
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

export default EmailVerify;
