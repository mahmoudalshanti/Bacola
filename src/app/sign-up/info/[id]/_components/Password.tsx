"use client";

import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { useEffect, useState } from "react";
import { passwordCheck } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import IconInputLarge from "@/components/IconInputLarge";

function Password({
  isValidPassword,
  setIsValidPassword,
  setPassword,
  password,
}: {
  isValidPassword: boolean;
  setIsValidPassword: React.Dispatch<React.SetStateAction<boolean>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  password: string;
}) {
  const [touched, setTouched] = useState<boolean>(false);

  const [hide, setHide] = useState<boolean>(true);

  useEffect(() => {
    setIsValidPassword(passwordCheck(password).every((c) => c.met));
  }, [password, touched, setIsValidPassword]);

  return (
    <>
      <IconInputLarge
        type={hide ? "password" : "text"}
        iconDef={Eye}
        hide={hide}
        setHide={setHide}
        iconSec={EyeOff}
        placeholder="Password"
        onFocus={() => setTouched(true)}
        onChange={(e) => setPassword(e.target.value)}
        aria-invalid={!isValidPassword && touched}
        className={`mt-7 py-3 w-full border ${
          !isValidPassword && touched
            ? "border-red-600 ring-red-500 placeholder-red-500"
            : "border-gray-700 ring-gray-500"
        }`}
      />

      {/* Password strength meter to provide feedback to the user */}
      <PasswordStrengthMeter
        focus={touched}
        criteria={passwordCheck(password)}
      />
    </>
  );
}

export default Password;
