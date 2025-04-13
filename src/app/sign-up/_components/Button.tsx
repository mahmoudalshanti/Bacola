"use client";

import { Button } from "@/components/ui/button";
import { actionContinueAuth } from "../_actions/actionSignup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

function ContinueButton({
  email,
  country,
  isValidEmail,
  setErrMsg,
}: {
  email: string;
  country: { name: string; flag: string };
  isValidEmail: boolean;
  errMsg: string;
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleContinue = async () => {
    try {
      setLoading(true);
      const data = await actionContinueAuth(email, country);
      setErrMsg("");
      setLoading(false);

      // Redirect to the next page if `data.redirect` is returned from the API
      if (data?.redirect) {
        router.push(data.redirect);
      }

      console.log(data.errMsg);
      if (data.errMsg) {
        throw new Error(data.errMsg);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong!";
      console.error("Something went Error!", message);

      setErrMsg(message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end mt-2">
        <Button
          disabled={!isValidEmail || !email.length || loading}
          className="w-36 rounded-full text-base p-6 font-bold"
          onClick={handleContinue}
        >
          {loading ? <Loading /> : "Continue"}{" "}
        </Button>
      </div>
    </>
  );
}

export default ContinueButton;
