"use client";

import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

const PasswordChanged = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[100vh] text-center mt-[40px]">
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
        className="max-w-[502px]">
        Go to Login
      </Button>
    </div>
  );
};
export default PasswordChanged;
