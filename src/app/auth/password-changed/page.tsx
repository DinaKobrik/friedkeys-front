"use client";

import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

const PasswordChanged = () => {
  return (
    <main className="mt-[40px]">
      <section className="min-h-screen flex flex-col justify-center items-center text-center">
        <Heading variant="h1" className="mb-[24px] sm:mb-[32px]">
          Password Changed Successfully
        </Heading>
        <Text className="mb-[24px] sm:mb-[72px]">
          Your new password has been saved. You can now log in to your account.
        </Text>
        <Button
          variant="primary"
          onClick={() => {
            window.location.href = "/auth/log-in";
          }}
          className="max-w-[calc(100%-20px)] sm:max-w-[502px] mx-auto">
          Go to Login
        </Button>
      </section>
    </main>
  );
};
export default PasswordChanged;
