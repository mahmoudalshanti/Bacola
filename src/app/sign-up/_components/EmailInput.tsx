"use client";

import Input from "@/components/Input";
import { emailCheck } from "@/lib/utils";
import { useEffect, useState } from "react";

function EmailInput({
  email,
  setEmail,
  isValidEmail,
  setIsValidEmail,
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setIsValidEmail: React.Dispatch<React.SetStateAction<boolean>>;
  isValidEmail: boolean;
}) {
  const [focus, setFocus] = useState<boolean>(false);

  useEffect(() => {
    if (email.length) setFocus(false);
    if (focus && email.length) setFocus(true); // Keep focus state when input is focused
    const result = emailCheck(email);

    if (!result && email.length > 0) setIsValidEmail(false);
    if (result) setIsValidEmail(true);
  }, [email, focus, setIsValidEmail]);

  return (
    <div className="mb-7">
      <Input
        type="email"
        onFocus={() => setFocus(true)}
        onChange={(e) => setEmail(e.target.value)}
        className={`py-3 text-lg mb-2 w-full font-semibold ${
          focus && !isValidEmail
            ? "border-red-600 ring-red-500 placeholder-red-500"
            : "border-gray-700 ring-gray-500"
        }`} // Conditional class based on email validity
        placeholder="Email"
      />

      {focus && !isValidEmail && (
        <p className="text-base text-red-600">Required</p>
      )}
    </div>
  );
}

export default EmailInput;
