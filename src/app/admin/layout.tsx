import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign in Dashboard | Bacola - Secure Sign in",
  description: "Secure administrative sign in",

  icons: { icon: "/cart-logo-bacola.png" },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="p-5 mx-auto max-w-md  mt-9 h-[82vh]">
        <div className="text-xl font-medium">
          <p className="mb-1">Welcome back to Bacola </p>
          <span className="font-semibold text-2xl text-gray-800">
            Admin Panel <span className="text-xl text-black">Sign in</span>
          </span>
        </div>
        {children}
      </div>
    </>
  );
}
