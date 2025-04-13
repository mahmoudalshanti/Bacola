import FloatingShape from "@/components/FloatingShape";
import type { Metadata } from "next";
import Link from "next/link";
import Logo from "../_components/Logo";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Sign In to Bacola | Order Fresh Groceries Online Store",
  description:
    "Log in to your Bacola account to easily order your favorite fresh vegetables, fruits, meats, and more..",
  keywords: [
    "sign in",
    "log in",
    "login",
    "Bacola",
    "online store",
    "food delivery Gaza",
  ],

  icons: { icon: "/cart-logo-bacola.png" },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="overflow-hidden relative ">
        <FloatingShape
          color="bg-lime-500"
          size="w-64 h-64"
          top="-5%"
          left="10%"
          delay={0}
          className="hidden md:flex"
        />
        <FloatingShape
          color="bg-red-600"
          size="w-48 h-48"
          top="60%"
          left="70%"
          delay={5}
          className="hidden md:flex"
        />
        <FloatingShape
          color="bg-red-700"
          size="w-32 h-32"
          top="40%"
          left="10%"
          delay={2}
          className=""
        />
        <div className="p-5 mt-0 h-[82vh]">
          <div className="max-w-md  mx-auto text-center font-bold text-2xl  ">
            <Logo wieght={"bold"} horizontal={"center"} />
          </div>
          <div className="max-w-md mx-auto shadow-none md:shadow-xl rounded-md pb-5">
            {children}
          </div>
        </div>

        <div className="h-0.5 w-full bg-gray-300 mt-64"></div>

        <div className="max-w-sm mt-0 mx-auto flex justify-center p-4 pb-0 ">
          <Link
            href={"/sign-in"}
            className="text-blue-900 text-sm hover:text-gray-800 cursor-pointer "
          >
            Conditions of Use
          </Link>
          <Link
            href={"/sign-in"}
            className="text-blue-900 text-sm hover:text-gray-800  cursor-pointer mx-5"
          >
            Privacy Notice
          </Link>

          <Link
            href={"/sign-in"}
            className="text-blue-900 text-sm hover:text-gray-800  cursor-pointer "
          >
            Help
          </Link>
          <Link
            href={"/admin"}
            className="text-blue-900 text-sm hover:text-gray-800  cursor-pointer  ml-5"
          >
            Admin
          </Link>
        </div>
        <p className=" max-w-sm mt-2 text-center mx-auto text-sm text-gray-600 pt-0 p-4">
          © 1996-2025, Bacola.com, Inc. or its affiliates
        </p>
      </div>
    </SessionProvider>
  );
}
