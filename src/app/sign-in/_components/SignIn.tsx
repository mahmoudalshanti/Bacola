"use client";

import Input from "@/components/Input";
import Link from "next/link";
import { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { emailCheck } from "@/lib/utils";
import IconInput from "@/components/IconInput";
import { Eye, EyeOff } from "lucide-react";
import ErrorMessage from "./ErrorMessage";
import { actionSignin } from "../_actions/actionSignIn";
import getUser from "@/app/_components/getUser";
import { useUser } from "@/app/_context/UserProvider";

function SignIn({ open = true }: { open?: boolean }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const router = useRouter();
  const [hide, setHide] = useState<boolean>(true);
  const { setUser } = useUser();

  const handelSignIn = async (): Promise<void> => {
    try {
      setLoading(true);

      const data = await actionSignin(email, password);
      setErrMsg("");
      setLoading(false);

      if (data?.redirect) {
        const user = await getUser();
        if (user?.email) setUser(user);
        window.location.href = "/";
      }

      if (data.errMsg) {
        throw new Error(data.errMsg);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? setErrMsg(err.message)
          : setErrMsg("Something went wrong!");
      setLoading(false);
      console.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`w-full p-0 md:p-5 mx-auto ${
          open ? "mt-0" : " mt-7 "
        } border-none  rounded-lg `}
      >
        <p className="font-bold text-xl text-blue-900 mt-3 mb-2">Sign in</p>
        {errMsg && <ErrorMessage errMsg={errMsg} />}{" "}
        <p className="font-bold text-sm mt-3 text-blue-950">
          Email and password are required
        </p>
        <Input
          className=" mt-1 font-semibold w-full"
          placeholder="Email"
          type="text"
          onChange={(e) => setEmail(e.target.value)}
        />
        <IconInput
          type={hide ? "password" : "text"}
          iconDef={Eye}
          hide={hide}
          setHide={setHide}
          iconSec={EyeOff}
          placeholder="Password"
          className="mt-3 w-full font-semibold"
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Sign-in button */}
        <Button
          className="mt-1 rounded-full w-full mb-3 bg-blue-950 hover:bg-blue-950 hover:bg-opacity-90"
          onClick={handelSignIn}
          disabled={
            loading || !email.length || !password.length || !emailCheck(email)
          }
        >
          {loading ? <Loading /> : "Sign in"}{" "}
        </Button>
        <Link
          href={"/sign-in/rest-password/verify-email"}
          className="underline font-medium text-sm  hover:text-blue-950"
        >
          Forget password
        </Link>
      </div>

      <div className="max-w-sm mt-5 mx-auto flex items-center gap-2">
        <div className="h-0.5 bg-blue-950 flex-grow min-w-[20%]"></div>
        <p className="p-1 text-sm text-nowrap">New to Bacola?</p>
        <div className="h-0.5 bg-blue-950 flex-grow min-w-[20%]"></div>
      </div>

      <Link
        href={"/sign-up"}
        className="max-w-sm flex mx-auto p-2 text-sm text-center justify-center  mt-4 w-full rounded-full bg-transparent text-black border border-gray-500 hover:bg-gray-200 "
      >
        Create your Bacola account
      </Link>
    </>
  );
}

export default SignIn;
