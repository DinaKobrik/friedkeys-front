"use client";

import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

const PasswordChanged = () => {
  return (
    <main className="my-[40px] newMainCustom:mt-[180px]">
      <section className="min-h-[calc(100vh-170px)] flex flex-col justify-center items-center text-center">
        <Heading variant="h1" className="mb-[24px]">
          Password Changed Successfully
        </Heading>
        <Text className="mb-[24px] sm:mb-[54px]">
          Your new password has been saved. You can now log in to your account.
        </Text>
        <Button
          variant="primary"
          onClick={() => {
            window.location.href = "/auth/profile/log-in";
          }}
          className="max-w-[calc(100%-20px)] sm:max-w-[370px] mx-auto">
          Go to Login
        </Button>
      </section>
    </main>
  );
};
export default PasswordChanged;
