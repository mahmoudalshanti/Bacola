"use client";

import Input from "@/components/Input";
import { Button } from "@/components/ui/button";
import { emailCheck } from "@/lib/utils";
import React, { KeyboardEvent, useEffect, useState } from "react";
import { actionVerifySupervisorEmail } from "../_actions/actionAdmin";
import ErrorMessage from "./ErrorMessage";
import Loading from "@/components/Loading";

function VerifyAdminEmail({
  setSuccess,
}: {
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [focus, setFocus] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(() => {
    if (email.length) setFocus(false);
    if (focus && email.length) setFocus(true);
    const result = emailCheck(email);

    if (!result && email.length > 0) setIsValidEmail(false);

    if (result) setIsValidEmail(true);
  }, [email]);

  const handleContinue = async () => {
    try {
      setLoading(true);
      const data = await actionVerifySupervisorEmail(email);
      setSuccess(true);
      setErrMsg("");
      setLoading(false);
      if (data?.errMsg) {
        throw new Error(data.errMsg);
      }
    } catch (err) {
      console.error("Something went Error!", err);
      err instanceof Error
        ? setErrMsg(err.message)
        : setErrMsg("Something went wrong!");
      setSuccess(false);
      setLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleContinue();
  };

  return (
    <div className="border border-gray-400 p-5 rounded-lg">
      {errMsg && <ErrorMessage errMsg={errMsg} />}

      <p className="mb-1 font-bold text-sm ">
        Enter email to verify credentials.
      </p>
      <Input
        type="email"
        onFocus={() => setFocus(true)}
        onKeyDown={handleKeyDown}
        onChange={(e) => setEmail(e.target.value)}
        className={`py-3 text-md mb-2 w-full font-semibold ${
          focus && !isValidEmail
            ? "border-red-600 ring-red-500 placeholder-red-500"
            : "border-gray-700 ring-gray-500"
        }`}
        placeholder="Email"
      />

      {focus && !isValidEmail && (
        <p className="text-base  text-red-600">Required</p>
      )}

      <Button
        disabled={loading || !isValidEmail || !email.length}
        onClick={handleContinue}
        className="w-full rounded-full mt-3"
      >
        {loading ? <Loading /> : "Continue"}
      </Button>
    </div>
  );
}

export default VerifyAdminEmail;
