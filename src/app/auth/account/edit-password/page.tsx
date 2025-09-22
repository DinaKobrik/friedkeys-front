"use client";
import React, {
  useEffect,
  useState,
  Suspense,
  useCallback,
  useRef,
} from "react";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
const AccountMenu = React.lazy(
  () => import("@/components/Sections/Account/AccountMenu")
);

// SVG
const EyeClosed = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer">
      <path
        d="M21.25 7.40678C19.289 11.5349 15.806 14.0114 11.998 14.0114H12.002C8.194 14.0114 4.711 11.5349 2.75 7.40678"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M18.5898 11.2754L20.701 13.3865"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M5.33203 11.2754L3.22092 13.3865"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M15.1765 16.5929L14.332 13.6833"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M8.74142 16.5931L9.58594 13.6836"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
};
EyeClosed.displayName = "EyeClosed";

const EyeOpen = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer fixed-icon">
      <path
        d="M12 5C7.523 5 3.733 7.942 2 12C3.733 16.058 7.523 19 12 19C16.477 19 20.267 16.058 22 12C20.267 7.942 16.477 5 12 5ZM12 16C9.791 16 8 14.209 8 12C8 9.791 9.791 8 12 8C14.209 8 16 9.791 16 12C16 14.209 14.209 16 12 16Z"
        fill="white"
      />
      <circle cx="12" cy="12" r="3" fill="white" />
    </svg>
  );
};
EyeOpen.displayName = "EyeOpen";

const ChangePassword: React.FC = React.memo(() => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTouchedOld, setIsTouchedOld] = useState(false);
  const [isTouchedNew, setIsTouchedNew] = useState(false);
  const [isTouchedConfirm, setIsTouchedConfirm] = useState(false);
  const [isValidOld, setIsValidOld] = useState(true);
  const [isValidNew, setIsValidNew] = useState(true);
  const [isValidConfirm, setIsValidConfirm] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");

  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const formatLastUpdated = useCallback(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedData = localStorage.getItem("userProfile");
      const controller = new AbortController();
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData) as {
            email?: string;
            password?: string;
            firstName?: string;
            lastName?: string;
            birthday?: string;
            lastUpdated?: string;
          };
          setCurrentPassword(parsedData.password || "");
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Error parsing user profile:", error);
          }
        }
      } else {
        const defaultData = {
          email: "",
          password: "pipidastr",
          firstName: "",
          lastName: "",
          birthday: "",
          lastUpdated: formatLastUpdated(),
        };
        localStorage.setItem("userProfile", JSON.stringify(defaultData));
        setCurrentPassword(defaultData.password);
      }
      return () => controller.abort();
    };
    fetchUserProfile();
  }, [formatLastUpdated]);

  const validatePasswords = useCallback(() => {
    let isOldValid = true;
    let isNewValid = true;
    let isConfirmValid = true;

    if (!oldPassword.trim()) {
      isOldValid = false;
    } else if (oldPassword !== currentPassword) {
      isOldValid = false;
    }

    if (!newPassword.trim()) {
      isNewValid = false;
    } else if (newPassword.length < 6) {
      isNewValid = false;
    } else if (newPassword === oldPassword) {
      isNewValid = false;
    }

    if (!confirmPassword.trim()) {
      isConfirmValid = false;
    } else if (confirmPassword !== newPassword) {
      isConfirmValid = false;
    }

    setIsValidOld(isOldValid);
    setIsValidNew(isNewValid);
    setIsValidConfirm(isConfirmValid);

    return isOldValid && isNewValid && isConfirmValid;
  }, [oldPassword, newPassword, confirmPassword, currentPassword]);

  const handleSave = useCallback(() => {
    setIsTouchedOld(true);
    setIsTouchedNew(true);
    setIsTouchedConfirm(true);

    const isValid = validatePasswords();
    if (isValid) {
      const storedData = JSON.parse(
        localStorage.getItem("userProfile") || "{}"
      ) as {
        email?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        birthday?: string;
        lastUpdated?: string;
      };
      const updatedData = {
        ...storedData,
        password: newPassword,
        lastUpdated: formatLastUpdated(),
      };
      localStorage.setItem("userProfile", JSON.stringify(updatedData));
      alert("Password change request sent to your inbox!");
    }
  }, [validatePasswords, newPassword, formatLastUpdated]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, field: string) => {
      if (e.key !== "Enter") return;

      e.preventDefault();

      if (field === "oldPassword" && newPasswordRef.current) {
        newPasswordRef.current.focus();
      } else if (field === "newPassword" && confirmPasswordRef.current) {
        confirmPasswordRef.current.focus();
      } else if (field === "confirmNewPassword") {
        handleSave();
      }
    },
    [handleSave]
  );

  return (
    <main>
      <Suspense fallback={<div aria-live="polite">Loading menu...</div>}>
        <AccountMenu activeLink="/auth/account/personal-info" />
      </Suspense>
      <section className="flex flex-col gap-[24px] sm:gap-[48px] mt-[40px] sm:mt-[80px]">
        <Suspense fallback={<div aria-live="polite">Loading heading...</div>}>
          <Heading variant="h1" className="text-center sm:text-left">
            edit personal info
          </Heading>
        </Suspense>
        <div className="flex flex-col gap-[40px] sm:gap-[56px] w-full max-w-[520px] mx-auto min-h-[300px]">
          <Suspense fallback={<div aria-live="polite">Loading input...</div>}>
            <Input
              label="Old Password"
              type="password"
              name="oldPassword"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                if (isTouchedOld) setIsValidOld(validatePasswords());
              }}
              required
              variant="straight"
              errorMessage={
                isValidOld
                  ? ""
                  : !oldPassword.trim()
                  ? "Fill in the field"
                  : "Old password is incorrect"
              }
              autoComplete="off"
              isTouched={isTouchedOld}
              isValid={isValidOld}
              ref={oldPasswordRef}
              onKeyDown={(e) => handleKeyDown(e, "oldPassword")}
            />
          </Suspense>
          <div className="flex flex-col gap-[16px]">
            <Suspense fallback={<div aria-live="polite">Loading input...</div>}>
              <Input
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (isTouchedNew) setIsValidNew(validatePasswords());
                }}
                required
                variant="straight"
                errorMessage={
                  isValidNew
                    ? ""
                    : !newPassword.trim()
                    ? "Fill in the field"
                    : newPassword.length < 6
                    ? "Password must be at least 6 characters"
                    : "New password cannot be the same as old password"
                }
                autoComplete="new-password"
                isTouched={isTouchedNew}
                isValid={isValidNew}
                ref={newPasswordRef}
                onKeyDown={(e) => handleKeyDown(e, "newPassword")}>
                <Suspense fallback={null}>
                  <div
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute top-[50%] translate-y-[-50%] right-[16px]">
                    {showNewPassword ? <EyeOpen /> : <EyeClosed />}
                  </div>
                </Suspense>
              </Input>
            </Suspense>
            <Suspense fallback={<div aria-live="polite">Loading input...</div>}>
              <Input
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmNewPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (isTouchedConfirm) setIsValidConfirm(validatePasswords());
                }}
                required
                variant="straight"
                errorMessage={
                  isValidConfirm
                    ? ""
                    : !confirmPassword.trim()
                    ? "Fill in the field"
                    : "Passwords do not match"
                }
                autoComplete="new-password"
                isTouched={isTouchedConfirm}
                isValid={isValidConfirm}
                ref={confirmPasswordRef}
                onKeyDown={(e) => handleKeyDown(e, "confirmNewPassword")}>
                <Suspense fallback={null}>
                  <div
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-[50%] translate-y-[-50%] right-[16px]">
                    {showConfirmPassword ? <EyeOpen /> : <EyeClosed />}
                  </div>
                </Suspense>
              </Input>
            </Suspense>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-[8px] sm:gap-[26px] max-w-[calc(100%-20px)] sm:max-w-[500px] w-full mx-auto">
            <Suspense
              fallback={<div aria-live="polite">Loading button...</div>}>
              <Button
                variant="secondary"
                onClick={() => window.history.back()}
                aria-label="Go back to previous page">
                go back
              </Button>
            </Suspense>
            <Suspense
              fallback={<div aria-live="polite">Loading button...</div>}>
              <Button
                variant="primary"
                onClick={handleSave}
                aria-label="Save password changes">
                save changes
              </Button>
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
});

ChangePassword.displayName = "ChangePassword";
export default React.memo(ChangePassword);
