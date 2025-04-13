"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";
import GoogleIcon from "@/app/_components/GoogleIcon";
import SignIn from "./SignIn";

export default function SignInPage({ open }: { open?: boolean }) {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleGoogleSignInClick = async () => {
    try {
      setLoading(true);
      await signIn("google", {
        redirect: true,
      });
    } catch (err) {
      console.error("Unexpected Error:", err);
      setError(
        "Something went wrong. Please check your network and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <p className="text-red-600 text-center">{error}</p>}

      <p className="font-semibold text-sm mt-0 text-center mx-auto mb-1 text-blue-950 z-10">
        Satisfy your cravings and faster delivery.
      </p>

      <div className="border md:border-none p-3 mt-5 md:mt-0 rounded-md">
        <SignIn open={open} />

        <button
          onClick={handleGoogleSignInClick}
          disabled={loading}
          className={`flex items-center mx-auto p-2.5 border justify-center transition-all rounded-full w-full mt-2 max-w-sm ${
            loading ? "bg-gray-100" : "bg-slate-200 hover:bg-slate-300"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center w-full">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2"></div>
              <span className="text-sm font-medium text-gray-600">
                Signing in...
              </span>
            </div>
          ) : (
            <>
              <GoogleIcon size="20" />
              <span className="ml-1 text-sm font-medium">
                Continue with Google
              </span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
