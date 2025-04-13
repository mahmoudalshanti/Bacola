"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { actionVerifySupervisorCode } from "../_actions/actionAdmin";

function VerifyAdminCode() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");

  const router = useRouter();
  const handleChange = (index: number, value: string) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const verificationCode = code.join("");
    try {
      const data = await actionVerifySupervisorCode(verificationCode);
      setErrMsg("");
      setLoading(false);
      router.push("/dashboard");

      if (data.errMsg) {
        throw new Error(data.errMsg);
      }
    } catch (err) {
      console.error("Something went Error!", err);
      err instanceof Error
        ? setErrMsg(err.message)
        : setErrMsg("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit") as unknown as React.FormEvent);
    }
  }, [code]);

  return (
    <div className="max-w-md w-full rounded-2xl border border-gray-400 overflow-hidden">
      <div className=" p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-700 bg-clip-text">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold  text-gray-700 border-2 border-gray-600 rounded-lg focus:border-gray-400 focus:outline-none"
              />
            ))}
          </div>
          {errMsg && (
            <p className="text-red-500 font-semibold mt-2">{errMsg}</p>
          )}
          <Button
            className="mt-5 w-full py-3 px-4  text-white font-bold rounded-lg shadow-lg  focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            disabled={loading || false || code.some((digit) => !digit)}
            type="submit"
          >
            {false ? "Verifying..." : "Verify Email"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default VerifyAdminCode;
