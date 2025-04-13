"use client";

import { Button } from "@/components/ui/button";
import React, { KeyboardEvent, useEffect, useState } from "react";
import { actionForgetPassword } from "../../_actions/actionSignIn";
import Input from "@/components/Input";
import { emailCheck } from "@/lib/utils";
import ErrorMessage from "../../_components/ErrorMessage";
import Loading from "@/components/Loading";

function VerifyEmail() {
  const [loading, setLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);

  const handelVerifyEmail = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await actionForgetPassword(email);
      setErrMsg("");
      setSuccess(true);
      if (data?.errMsg) {
        throw new Error(data?.errMsg);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong!";
      setErrMsg(message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // On user click enter hande verify email
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handelVerifyEmail();
  };

  useEffect(() => {
    const result = emailCheck(email);
    setIsValidEmail(result);
  }, [email]);

  return (
    <>
      {!success ? (
        <>
          {errMsg && <ErrorMessage errMsg={errMsg} />}

          <p className="font-bold text-sm mt-7 text-start mb-1">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <Input
            className=" mt-1 font-semibold text-base w-full"
            placeholder="Email"
            type="text"
            onKeyDown={handleKeyDown}
            onChange={(e) => setEmail(e.target.value)} // Update email state on change
          />

          <Button
            className="mt-5 rounded-full w-full mb-3"
            disabled={loading || !isValidEmail} // Disable button if loading or email is invalid
            onClick={handelVerifyEmail} // Trigger the password reset process
          >
            {loading ? <Loading /> : "Send"}{" "}
            {/* Show loading indicator or text */}
          </Button>
        </>
      ) : (
        <>
          {/* Success message */}
          <p className="text-gray-700 font-semibold mb-6">
            If an account exists for {email}, you will receive a password reset
            link shortly.
          </p>

          {/* Contact support message */}
          <p className="text-gray-800 font-semibold">
            if you find issues contact the{" "}
            <span className="underline text-sm hover:text-gray-600 cursor-pointer">
              Shopfaster team{" "}
            </span>
          </p>
        </>
      )}
    </>
  );
}

export default VerifyEmail;
